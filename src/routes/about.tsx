import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader, Placeholder, Prose } from "@/components/site/SiteChrome";
import { useSettings } from "@/lib/public-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo("เกี่ยวกับโรงเรียน", "ประวัติ วิสัยทัศน์ พันธกิจ และข้อมูลพื้นฐานของโรงเรียนอนุบาลองค์การบริหารส่วนตำบลวาเล่ย์"),
  component: About,
});

function About() {
  const { data: s } = useSettings();
  const sections: [string, string | null | undefined][] = [
    ["เกี่ยวกับเรา", s?.about],
    ["ประวัติโรงเรียน", s?.history],
    ["วิสัยทัศน์", s?.vision],
    ["พันธกิจ", s?.mission],
    ["ปรัชญา", s?.philosophy],
    ["คติพจน์", s?.motto],
  ];
  return (
    <>
      <PageHeader title="เกี่ยวกับโรงเรียน" subtitle="ข้อมูลพื้นฐาน วิสัยทัศน์ และพันธกิจของสถานศึกษา" />
      <Container className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {sections.map(([title, text]) => (
            <section key={title} className="rounded-2xl border bg-card p-6">
              <h2 className="text-xl text-primary">{title}</h2>
              <div className="mt-3"><Prose text={text} /></div>
            </section>
          ))}
        </div>
        <aside className="h-fit rounded-2xl bg-secondary p-6 text-secondary-foreground">
          <h2 className="text-xl">ข้อมูลโรงเรียน</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["ชื่อสถานศึกษา", s?.school_name],
              ["สังกัด", s?.affiliation],
              ["ที่ตั้ง", s?.address],
              ["ปีการศึกษาปัจจุบัน", s?.academic_year],
              ["เวลาทำการ", s?.office_hours],
              ["โทรศัพท์", s?.phone],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-semibold">{k}</dt>
                <dd>{v || <Placeholder />}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </Container>
    </>
  );
}