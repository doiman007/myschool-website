import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarDays, FileDown, Heart, Images, Search, Users } from "lucide-react";
import hero from "@/assets/hero-school.svg";
import { Button } from "@/components/ui/button";
import { Container, Empty, Placeholder } from "@/components/site/SiteChrome";
import { EventRow, PostCard } from "@/components/site/Cards";
import { usePublished, useSettings } from "@/lib/public-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("หน้าแรก", "เว็บไซต์ทางการ โรงเรียนอนุบาลองค์การบริหารส่วนตำบลวาเล่ย์ อำเภอพบพระ จังหวัดตาก ข่าวสาร กิจกรรม และรับสมัครนักเรียนออนไลน์"),
  component: Index,
});

const QUICK = [
  { to: "/admission", label: "สมัครเรียนออนไลน์", icon: Heart },
  { to: "/admission/status", label: "ตรวจสอบสถานะ", icon: Search },
  { to: "/calendar", label: "ปฏิทินกิจกรรม", icon: CalendarDays },
  { to: "/gallery", label: "อัลบั้มภาพ", icon: Images },
  { to: "/curriculum", label: "หลักสูตร", icon: BookOpen },
  { to: "/documents", label: "ดาวน์โหลดเอกสาร", icon: FileDown },
] as const;

function Index() {
  const { data: s } = useSettings();
  const posts = usePublished("posts", { col: "published_at" }, 3);
  const today = new Date().toISOString().slice(0, 10);
  const events = usePublished("events", { col: "start_date", asc: true });
  const upcoming = (events.data ?? []).filter((e: any) => (e.end_date ?? e.start_date) >= today).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="ภาพวาดอาคารเรียนและเด็กอนุบาลเล่นในสวน" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="bg-hero-fade absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <p className="inline-block rounded-full bg-sun px-3 py-1 text-sm font-semibold text-sun-foreground">
            {s?.affiliation ?? "สังกัดองค์การบริหารส่วนตำบลวาเล่ย์"}
          </p>
          <h1 className="mt-4 max-w-xl text-4xl text-primary sm:text-5xl">{s?.hero_title ?? "เรียนรู้อย่างมีความสุข เติบโตอย่างมั่นใจ"}</h1>
          <p className="mt-4 max-w-lg text-lg text-foreground/80">{s?.hero_subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="sun" size="lg"><Link to="/admission">สมัครเรียนออนไลน์</Link></Button>
            <Button asChild variant="hero" size="lg"><Link to="/about">รู้จักโรงเรียน</Link></Button>
          </div>
        </div>
      </section>

      <Container>
        <nav aria-label="ทางลัด" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center text-sm shadow-soft transition-colors hover:bg-secondary">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary"><Icon className="h-6 w-6" aria-hidden /></span>
              {label}
            </Link>
          ))}
        </nav>
      </Container>

      <section className="bg-cream">
        <Container className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl text-primary">วิสัยทัศน์</h2>
            <div className="mt-3 text-lg">{s?.vision ? <p className="whitespace-pre-line">{s.vision}</p> : <Placeholder />}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["ปรัชญา", s?.philosophy], ["คติพจน์", s?.motto]].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-card p-5">
                <h3 className="text-base text-primary">{k}</h3>
                <div className="mt-2 text-sm">{v || <Placeholder />}</div>
              </div>
            ))}
            <Link to="/staff" className="col-span-2 flex items-center justify-between rounded-2xl bg-primary p-5 text-primary-foreground">
              <span className="flex items-center gap-2"><Users className="h-5 w-5" aria-hidden /> คณะครูและบุคลากร</span>
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl text-primary">ข่าวประกาศล่าสุด</h2>
            <Link to="/news" className="text-sm text-primary underline-offset-4 hover:underline">ดูทั้งหมด</Link>
          </div>
          {posts.data?.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{posts.data.map((p: any) => <PostCard key={p.id} p={p} />)}</div>
          ) : (
            <Empty text={posts.isLoading ? "กำลังโหลด…" : "ยังไม่มีข่าว"} />
          )}
        </section>
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl text-primary">กิจกรรมที่จะมาถึง</h2>
            <Link to="/calendar" className="text-sm text-primary underline-offset-4 hover:underline">ปฏิทิน</Link>
          </div>
          {upcoming.length ? <ul className="space-y-3">{upcoming.map((e: any) => <EventRow key={e.id} e={e} />)}</ul> : <Empty text="ยังไม่มีกิจกรรม" />}
        </section>
      </Container>
    </>
  );
}