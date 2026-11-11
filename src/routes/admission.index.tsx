import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container, PageHeader, Prose } from "@/components/site/SiteChrome";
import { useSettings } from "@/lib/public-data";
import { LEVELS } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admission/")({
  head: () => seo("สมัครเรียนออนไลน์", "สมัครเรียนออนไลน์ โรงเรียนอนุบาลองค์การบริหารส่วนตำบลวาเล่ย์"),
  component: Admission,
});

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">{label}{rest.required && <span className="text-destructive"> *</span>}</label>
      <Input id={id} name={id} {...rest} />
    </div>
  );
}

function Admission() {
  const { data: s } = useSettings();
  const [code, setCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true);
    const { data, error } = await supabase.rpc("submit_admission", {
      p_level: g("level"), p_child_name: g("child_name"), p_child_nickname: g("child_nickname"),
      p_child_birthdate: g("child_birthdate"), p_child_gender: g("child_gender"),
      p_parent_name: g("parent_name"), p_relationship: g("relationship"), p_parent_phone: g("parent_phone").replace(/\D/g, ""),
      p_parent_email: g("parent_email"), p_address: g("address"), p_notes: g("notes"), p_consent: f.get("consent") === "on",
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setCode(data as string);
  }

  return (
    <>
      <PageHeader title="สมัครเรียนออนไลน์" subtitle="กรอกข้อมูลให้ครบถ้วน ข้อมูลของท่านจะไม่ถูกเปิดเผยต่อสาธารณะ" />
      <Container className="max-w-3xl">
        <div className="mb-6 rounded-2xl bg-cream p-5"><Prose text={s?.admission_info} /></div>
        {code ? (
          <div role="status" className="rounded-2xl border bg-secondary p-6 text-center">
            <h2 className="text-2xl text-primary">ส่งใบสมัครเรียบร้อย</h2>
            <p className="mt-2">รหัสติดตามของท่าน (กรุณาจดเก็บไว้)</p>
            <p className="mt-2 font-display text-3xl tracking-widest">{code}</p>
            <Button asChild variant="hero" className="mt-4"><Link to="/admission/status">ตรวจสอบสถานะ</Link></Button>
          </div>
        ) : s && !s.admission_open ? (
          <p className="rounded-2xl border p-6 text-center">ขณะนี้ยังไม่เปิดรับสมัคร</p>
        ) : (
          <form onSubmit={submit} className="grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-2">
            <div>
              <label htmlFor="level" className="mb-1 block text-sm font-semibold">ระดับชั้นที่สมัคร *</label>
              <select id="level" name="level" required className="h-9 w-full rounded-md border bg-card px-3">{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
            </div>
            <Field id="child_name" label="ชื่อ-นามสกุลเด็ก" required maxLength={150} />
            <Field id="child_nickname" label="ชื่อเล่น" maxLength={50} />
            <Field id="child_birthdate" label="วันเกิด" type="date" required />
            <div>
              <label htmlFor="child_gender" className="mb-1 block text-sm font-semibold">เพศ</label>
              <select id="child_gender" name="child_gender" className="h-9 w-full rounded-md border bg-card px-3"><option>ชาย</option><option>หญิง</option></select>
            </div>
            <Field id="parent_name" label="ชื่อ-นามสกุลผู้ปกครอง" required maxLength={150} />
            <Field id="relationship" label="ความเกี่ยวข้อง" maxLength={50} />
            <Field id="parent_phone" label="เบอร์โทรศัพท์" required inputMode="tel" pattern="[0-9\-\s]{9,12}" />
            <Field id="parent_email" label="อีเมล" type="email" maxLength={255} />
            <div className="sm:col-span-2"><Field id="address" label="ที่อยู่" required maxLength={500} /></div>
            <div className="sm:col-span-2"><Field id="notes" label="หมายเหตุ" maxLength={1000} /></div>
            <label className="flex gap-2 text-sm sm:col-span-2"><input type="checkbox" name="consent" required /> ยินยอมให้โรงเรียนเก็บข้อมูลเพื่อใช้ในการรับสมัครเท่านั้น</label>
            <Button type="submit" variant="sun" size="lg" disabled={busy} className="sm:col-span-2">{busy ? "กำลังส่ง…" : "ส่งใบสมัคร"}</Button>
          </form>
        )}
      </Container>
    </>
  );
}