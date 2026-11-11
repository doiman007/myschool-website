export const PLACEHOLDER = "รอข้อมูลจากโรงเรียน";

export function thaiDate(d?: string | null, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("th-TH", opts);
}

export const CATEGORY_LABEL: Record<string, string> = {
  news: "ข่าวประชาสัมพันธ์",
  announcement: "ประกาศ",
  activity: "ข่าวกิจกรรม",
};

export const ADMISSION_STATUS_LABEL: Record<string, string> = {
  submitted: "ส่งใบสมัครแล้ว",
  reviewing: "กำลังตรวจสอบ",
  need_documents: "ขอเอกสารเพิ่มเติม",
  approved: "ผ่านการพิจารณา",
  rejected: "ไม่ผ่านการพิจารณา",
};

export const ROLE_LABEL: Record<string, string> = {
  admin: "ผู้ดูแลระบบ",
  editor: "บรรณาธิการ",
  teacher: "ครู",
};

export const LEVELS = ["เตรียมอนุบาล", "อนุบาล 1", "อนุบาล 2", "อนุบาล 3"] as const;

/** Rules on what each role may manage in the back office (mirrors database policies). */
export type Role = "admin" | "editor" | "teacher";
export type Section =
  | "posts" | "events" | "albums" | "staff" | "documents" | "faqs"
  | "admissions" | "admissions_edit" | "settings" | "users";

const ACCESS: Record<Section, Role[]> = {
  posts: ["admin", "editor", "teacher"],
  events: ["admin", "editor", "teacher"],
  albums: ["admin", "editor", "teacher"],
  staff: ["admin", "editor"],
  documents: ["admin", "editor"],
  faqs: ["admin", "editor"],
  settings: ["admin", "editor"],
  admissions: ["admin", "teacher"],
  admissions_edit: ["admin"],
  users: ["admin"],
};

export function canAccess(roles: Role[], section: Section) {
  return roles.some((r) => ACCESS[section].includes(r));
}