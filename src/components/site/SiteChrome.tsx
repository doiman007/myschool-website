import { Link } from "@tanstack/react-router";
import { Menu, Phone, Mail, MapPin, GraduationCap } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/public-data";
import { PLACEHOLDER } from "@/lib/format";

export const NAV = [
  { to: "/", label: "หน้าแรก" },
  { to: "/about", label: "เกี่ยวกับโรงเรียน" },
  { to: "/news", label: "ข่าวประกาศ" },
  { to: "/calendar", label: "ปฏิทินกิจกรรม" },
  { to: "/gallery", label: "อัลบั้มภาพ" },
  { to: "/curriculum", label: "หลักสูตร" },
  { to: "/staff", label: "บุคลากร" },
  { to: "/documents", label: "ดาวน์โหลด" },
  { to: "/faq", label: "คำถามที่พบบ่อย" },
  { to: "/contact", label: "ติดต่อ" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <GraduationCap className="h-6 w-6" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base text-primary sm:text-lg">โรงเรียนอนุบาล อบต.วาเล่ย์</span>
        <span className="block text-xs text-muted-foreground">อำเภอพบพระ จังหวัดตาก</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav aria-label="เมนูหลัก" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="rounded-full px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-secondary-foreground"
                  activeProps={{ className: "bg-secondary font-semibold text-secondary-foreground" }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="sun" className="hidden sm:inline-flex">
            <Link to="/admission">สมัครเรียนออนไลน์</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="เปิดเมนู">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display">เมนู</SheetTitle>
              <nav aria-label="เมนูมือถือ" className="mt-4 flex flex-col gap-1">
                {[...NAV, { to: "/admission", label: "สมัครเรียนออนไลน์" }, { to: "/admission/status", label: "ตรวจสอบสถานะการสมัคร" }].map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: true }}
                    className="rounded-lg px-3 py-2 hover:bg-secondary"
                    activeProps={{ className: "bg-secondary font-semibold" }}
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { data: s } = useSettings();
  return (
    <footer className="mt-16 border-t bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h2 className="text-lg">{s?.school_name ?? "โรงเรียนอนุบาลองค์การบริหารส่วนตำบลวาเล่ย์"}</h2>
          <p className="mt-1 text-sm">{s?.affiliation}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="flex gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden />{s?.address || PLACEHOLDER}</p>
          <p className="flex gap-2"><Phone className="mt-1 h-4 w-4 shrink-0" aria-hidden />{s?.phone || PLACEHOLDER}</p>
          <p className="flex gap-2"><Mail className="mt-1 h-4 w-4 shrink-0" aria-hidden />{s?.email || PLACEHOLDER}</p>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <Link to="/admission/status" className="underline-offset-4 hover:underline">ตรวจสอบสถานะการสมัคร</Link>
          <Link to="/documents" className="underline-offset-4 hover:underline">ดาวน์โหลดเอกสาร</Link>
          <Link to="/contact" className="underline-offset-4 hover:underline">ติดต่อโรงเรียน</Link>
          <Link to="/auth" className="underline-offset-4 hover:underline">สำหรับเจ้าหน้าที่</Link>
        </div>
      </div>
      <p className="border-t border-primary/15 py-4 text-center text-xs">
        © {new Date().getFullYear() + 543} สังกัดองค์การบริหารส่วนตำบลวาเล่ย์ จังหวัดตาก
      </p>
    </footer>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="bg-dots border-b bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl text-primary sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 py-10 ${className}`}>{children}</div>;
}

export function Placeholder({ text = PLACEHOLDER }: { text?: string }) {
  return <span className="inline-block rounded-md border border-dashed border-warning/60 bg-accent/40 px-2 py-0.5 text-sm text-accent-foreground">{text}</span>;
}

export function SampleBadge() {
  return <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">ข้อมูลตัวอย่าง</span>;
}

export function Empty({ text = "ยังไม่มีข้อมูล" }: { text?: string }) {
  return <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">{text}</div>;
}

export function Prose({ text }: { text?: string | null | undefined }) {
  if (!text) return <Placeholder />;
  return <div className="whitespace-pre-line">{text}</div>;
}