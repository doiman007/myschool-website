import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Empty, PageHeader } from "@/components/site/SiteChrome";
import { EventRow } from "@/components/site/Cards";
import { usePublished } from "@/lib/public-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/calendar")({
  head: () => seo("ปฏิทินกิจกรรม", "ปฏิทินกิจกรรมและกำหนดการของโรงเรียนอนุบาล อบต.วาเล่ย์"),
  component: CalendarPage,
});

const pad = (n: number) => String(n).padStart(2, "0");

function CalendarPage() {
  const { data, isLoading } = usePublished("events", { col: "start_date", asc: true });
  const [cur, setCur] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const ym = `${cur.getFullYear()}-${pad(cur.getMonth() + 1)}`;
  const monthEvents = useMemo(() => (data ?? []).filter((e: any) => e.start_date.startsWith(ym) || (e.end_date ?? "").startsWith(ym)), [data, ym]);
  const days = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate();
  const offset = cur.getDay();
  const hasEvent = (day: number) => {
    const d = `${ym}-${pad(day)}`;
    return monthEvents.some((e: any) => e.start_date <= d && (e.end_date ?? e.start_date) >= d);
  };
  const move = (n: number) => setCur(new Date(cur.getFullYear(), cur.getMonth() + n, 1));

  return (
    <>
      <PageHeader title="ปฏิทินกิจกรรม" subtitle="กำหนดการกิจกรรมของโรงเรียนในแต่ละเดือน" />
      <Container className="grid gap-8 lg:grid-cols-5">
        <section className="rounded-2xl border bg-card p-5 lg:col-span-2" aria-label="ปฏิทินรายเดือน">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => move(-1)} aria-label="เดือนก่อนหน้า"><ChevronLeft /></Button>
            <h2 className="text-lg" aria-live="polite">{cur.toLocaleDateString("th-TH", { month: "long", year: "numeric" })}</h2>
            <Button variant="outline" size="icon" onClick={() => move(1)} aria-label="เดือนถัดไป"><ChevronRight /></Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => <div key={d} className="py-1 font-semibold text-muted-foreground">{d}</div>)}
            {Array.from({ length: offset }).map((_, i) => <div key={`x${i}`} />)}
            {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
              <div key={d} className={`rounded-lg py-2 ${hasEvent(d) ? "bg-sun font-bold text-sun-foreground" : ""}`}>{d}</div>
            ))}
          </div>
        </section>
        <section className="lg:col-span-3">
          <h2 className="mb-4 text-xl text-primary">กิจกรรมเดือนนี้</h2>
          {monthEvents.length ? <ul className="space-y-3">{monthEvents.map((e: any) => <EventRow key={e.id} e={e} />)}</ul> : <Empty text={isLoading ? "กำลังโหลด…" : "ไม่มีกิจกรรมในเดือนนี้"} />}
        </section>
      </Container>
    </>
  );
}