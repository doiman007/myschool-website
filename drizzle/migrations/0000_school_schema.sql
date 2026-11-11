create type public.app_role as enum ('admin','editor','teacher');
create type public.publish_status as enum ('draft','published');
create type public.admission_status as enum ('submitted','reviewing','need_documents','approved','rejected');

-- staff accounts (mirror of auth users, staff-only visibility)
create table public.staff_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select, insert, update, delete on public.staff_accounts to authenticated;
grant all on public.staff_accounts to service_role;
grant select, insert, update, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.staff_accounts enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id)
$$;
create or replace function public.can_edit_content(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','editor'))
$$;

create policy "staff view own or admin all" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admin manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "view own or admin all accounts" on public.staff_accounts for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admin update accounts" on public.staff_accounts for update to authenticated
  using (public.has_role(auth.uid(),'admin') or user_id = auth.uid());

-- new auth user -> staff account; very first user becomes admin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.staff_accounts (user_id, email) values (new.id, new.email) on conflict do nothing;
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- school settings (single row)
create table public.school_settings (
  id int primary key default 1 check (id = 1),
  school_name text not null default 'โรงเรียนอนุบาลองค์การบริหารส่วนตำบลวาเล่ย์',
  affiliation text default 'สังกัดองค์การบริหารส่วนตำบลวาเล่ย์',
  address text, phone text, email text, facebook_url text, line_id text,
  office_hours text, map_embed_url text,
  vision text, mission text, philosophy text, motto text, history text, about text,
  curriculum text, admission_info text, admission_open boolean not null default false,
  academic_year text,
  hero_title text, hero_subtitle text,
  updated_at timestamptz not null default now()
);
grant select on public.school_settings to anon, authenticated;
grant update, insert on public.school_settings to authenticated;
grant all on public.school_settings to service_role;
alter table public.school_settings enable row level security;
create policy "public read settings" on public.school_settings for select to anon, authenticated using (true);
create policy "admin update settings" on public.school_settings for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "editor update settings content" on public.school_settings for update to authenticated
  using (public.has_role(auth.uid(),'editor')) with check (public.has_role(auth.uid(),'editor'));
create trigger t_settings_upd before update on public.school_settings for each row execute function public.touch_updated_at();

-- generic content tables
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null, excerpt text, content text,
  category text not null default 'news' check (category in ('news','announcement','activity')),
  cover_url text, status public.publish_status not null default 'draft',
  published_at timestamptz, is_sample boolean not null default false,
  created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text, location text,
  start_date date not null, end_date date,
  status public.publish_status not null default 'draft', is_sample boolean not null default false,
  created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text, cover_url text, event_date date,
  status public.publish_status not null default 'draft', is_sample boolean not null default false,
  created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.album_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  url text not null, caption text, sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table public.staff_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null, position text, department text, photo_url text, bio text,
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text, category text not null default 'ทั่วไป',
  file_url text, file_name text,
  status public.publish_status not null default 'draft', is_sample boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null, sort_order int not null default 0,
  status public.publish_status not null default 'draft', is_sample boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

grant select on public.posts, public.events, public.albums, public.album_photos, public.staff_members, public.documents, public.faqs to anon;
grant select, insert, update, delete on public.posts, public.events, public.albums, public.album_photos, public.staff_members, public.documents, public.faqs to authenticated;
grant all on public.posts, public.events, public.albums, public.album_photos, public.staff_members, public.documents, public.faqs to service_role;

alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.albums enable row level security;
alter table public.album_photos enable row level security;
alter table public.staff_members enable row level security;
alter table public.documents enable row level security;
alter table public.faqs enable row level security;

-- public reads only published; staff read all
create policy "read published posts" on public.posts for select to anon, authenticated using (status = 'published' or public.is_staff(auth.uid()));
create policy "read published events" on public.events for select to anon, authenticated using (status = 'published' or public.is_staff(auth.uid()));
create policy "read published albums" on public.albums for select to anon, authenticated using (status = 'published' or public.is_staff(auth.uid()));
create policy "read photos of published albums" on public.album_photos for select to anon, authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.albums a where a.id = album_id and a.status = 'published'));
create policy "read published staff" on public.staff_members for select to anon, authenticated using (status = 'published' or public.is_staff(auth.uid()));
create policy "read published docs" on public.documents for select to anon, authenticated using (status = 'published' or public.is_staff(auth.uid()));
create policy "read published faqs" on public.faqs for select to anon, authenticated using (status = 'published' or public.is_staff(auth.uid()));

-- writes: admin/editor everything; teachers manage posts/events/albums/photos
create policy "write posts" on public.posts for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "write events" on public.events for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "write albums" on public.albums for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "write photos" on public.album_photos for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "write staff_members" on public.staff_members for all to authenticated using (public.can_edit_content(auth.uid())) with check (public.can_edit_content(auth.uid()));
create policy "write documents" on public.documents for all to authenticated using (public.can_edit_content(auth.uid())) with check (public.can_edit_content(auth.uid()));
create policy "write faqs" on public.faqs for all to authenticated using (public.can_edit_content(auth.uid())) with check (public.can_edit_content(auth.uid()));

create trigger t_posts_upd before update on public.posts for each row execute function public.touch_updated_at();
create trigger t_events_upd before update on public.events for each row execute function public.touch_updated_at();
create trigger t_albums_upd before update on public.albums for each row execute function public.touch_updated_at();
create trigger t_staff_upd before update on public.staff_members for each row execute function public.touch_updated_at();
create trigger t_docs_upd before update on public.documents for each row execute function public.touch_updated_at();
create trigger t_faqs_upd before update on public.faqs for each row execute function public.touch_updated_at();

-- admissions: no public table access at all
create table public.admissions (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  academic_year text, level text not null,
  child_name text not null, child_nickname text, child_birthdate date not null, child_gender text,
  parent_name text not null, relationship text, parent_phone text not null, parent_email text,
  address text not null, notes text,
  status public.admission_status not null default 'submitted',
  public_note text, staff_note text,
  consent boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, update, delete on public.admissions to authenticated;
grant all on public.admissions to service_role;
alter table public.admissions enable row level security;
create policy "admin teacher read admissions" on public.admissions for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'teacher'));
create policy "admin update admissions" on public.admissions for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin delete admissions" on public.admissions for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));
create trigger t_adm_upd before update on public.admissions for each row execute function public.touch_updated_at();

create or replace function public.submit_admission(
  p_level text, p_child_name text, p_child_nickname text, p_child_birthdate date, p_child_gender text,
  p_parent_name text, p_relationship text, p_parent_phone text, p_parent_email text,
  p_address text, p_notes text, p_consent boolean
) returns text language plpgsql security definer set search_path = public as $$
declare v_code text; v_year text;
begin
  if not coalesce(p_consent,false) then raise exception 'ต้องยินยอมให้เก็บข้อมูล'; end if;
  if length(trim(coalesce(p_child_name,''))) < 2 or length(p_child_name) > 150 then raise exception 'ชื่อเด็กไม่ถูกต้อง'; end if;
  if length(trim(coalesce(p_parent_name,''))) < 2 or length(p_parent_name) > 150 then raise exception 'ชื่อผู้ปกครองไม่ถูกต้อง'; end if;
  if coalesce(p_parent_phone,'') !~ '^[0-9]{9,10}$' then raise exception 'เบอร์โทรศัพท์ไม่ถูกต้อง'; end if;
  if length(trim(coalesce(p_address,''))) < 5 or length(p_address) > 500 then raise exception 'ที่อยู่ไม่ถูกต้อง'; end if;
  if length(coalesce(p_notes,'')) > 1000 or length(coalesce(p_parent_email,'')) > 255 then raise exception 'ข้อมูลยาวเกินไป'; end if;
  if p_level not in ('อนุบาล 1','อนุบาล 2','อนุบาล 3','เตรียมอนุบาล') then raise exception 'ระดับชั้นไม่ถูกต้อง'; end if;
  if not exists (select 1 from public.school_settings where admission_open) then raise exception 'ขณะนี้ยังไม่เปิดรับสมัคร'; end if;
  select academic_year into v_year from public.school_settings where id = 1;
  v_code := 'WL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  insert into public.admissions (tracking_code, academic_year, level, child_name, child_nickname, child_birthdate, child_gender,
    parent_name, relationship, parent_phone, parent_email, address, notes, consent)
  values (v_code, v_year, p_level, trim(p_child_name), nullif(trim(p_child_nickname),''), p_child_birthdate, p_child_gender,
    trim(p_parent_name), p_relationship, p_parent_phone, nullif(trim(p_parent_email),''), trim(p_address), nullif(trim(p_notes),''), true);
  return v_code;
end; $$;

-- status lookup requires code + phone, returns no personal data
create or replace function public.check_admission_status(p_code text, p_phone text)
returns table (tracking_code text, level text, status public.admission_status, public_note text, submitted_at timestamptz, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select a.tracking_code, a.level, a.status, a.public_note, a.created_at, a.updated_at
  from public.admissions a
  where a.tracking_code = upper(trim(p_code)) and a.parent_phone = trim(p_phone)
  limit 1
$$;
revoke all on function public.submit_admission(text,text,text,date,text,text,text,text,text,text,text,boolean) from public;
grant execute on function public.submit_admission(text,text,text,date,text,text,text,text,text,text,text,boolean) to anon, authenticated;
grant execute on function public.check_admission_status(text,text) to anon, authenticated;

-- storage policies for 'media' bucket (created separately)
create policy "public read media" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "staff upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "staff update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "staff delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff(auth.uid()));

-- seed
insert into public.school_settings (id, address, admission_open, hero_title, hero_subtitle, admission_info)
values (1, 'ตำบลวาเล่ย์ อำเภอพบพระ จังหวัดตาก', true,
 'เรียนรู้อย่างมีความสุข เติบโตอย่างมั่นใจ',
 'สถานศึกษาปฐมวัยในสังกัดองค์การบริหารส่วนตำบลวาเล่ย์ ดูแลลูกหลานด้วยความใส่ใจ',
 '[ตัวอย่าง] รายละเอียดการรับสมัคร คุณสมบัติ และเอกสารประกอบ รอข้อมูลจากโรงเรียน');

insert into public.posts (title, excerpt, content, category, status, published_at, is_sample) values
('[ตัวอย่าง] ประกาศรับสมัครนักเรียนใหม่ ปีการศึกษาถัดไป', 'ข่าวตัวอย่างสำหรับแสดงรูปแบบการประกาศ', 'นี่คือเนื้อหาตัวอย่าง ใช้สำหรับแสดงรูปแบบหน้าข่าวเท่านั้น รายละเอียดจริงรอข้อมูลจากโรงเรียน', 'announcement', 'published', now(), true),
('[ตัวอย่าง] กิจกรรมวันเด็กแห่งชาติ', 'ข่าวกิจกรรมตัวอย่าง', 'นี่คือเนื้อหาตัวอย่างของข่าวกิจกรรม รอข้อมูลจากโรงเรียน', 'activity', 'published', now() - interval '3 days', true),
('[ตัวอย่าง] แจ้งกำหนดการประชุมผู้ปกครอง', 'ข่าวประชาสัมพันธ์ตัวอย่าง', 'นี่คือเนื้อหาตัวอย่าง รอข้อมูลจากโรงเรียน', 'news', 'published', now() - interval '7 days', true);

insert into public.events (title, description, start_date, status, is_sample) values
('[ตัวอย่าง] ประชุมผู้ปกครองประจำภาคเรียน', 'กิจกรรมตัวอย่าง', current_date + 10, 'published', true),
('[ตัวอย่าง] กิจกรรมทัศนศึกษา', 'กิจกรรมตัวอย่าง', current_date + 25, 'published', true);

insert into public.faqs (question, answer, sort_order, status, is_sample) values
('[ตัวอย่าง] รับเด็กอายุเท่าไร?', 'รอข้อมูลจากโรงเรียน', 1, 'published', true),
('[ตัวอย่าง] ตรวจสอบสถานะการสมัครได้อย่างไร?', 'ใช้รหัสติดตามที่ได้รับหลังส่งใบสมัคร พร้อมเบอร์โทรศัพท์ผู้ปกครอง ที่หน้า "ตรวจสอบสถานะ"', 2, 'published', true),
('[ตัวอย่าง] มีค่าใช้จ่ายหรือไม่?', 'รอข้อมูลจากโรงเรียน', 3, 'published', true);

insert into public.documents (title, description, category, status, is_sample) values
('[ตัวอย่าง] ใบสมัครเรียน (แบบฟอร์มกระดาษ)', 'ไฟล์ตัวอย่าง รอไฟล์จริงจากโรงเรียน', 'รับสมัคร', 'published', true);