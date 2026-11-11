import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader, Prose } from "@/components/site/SiteChrome";
import { useSettings } from "@/lib/public-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/curriculum")({
  head: () => seo("หลักสูตร", "หลักสูตรการศึกษาปฐมวัยและพัฒนาการ 4 ด้านของโรงเรียนอนุบาล อบต.วาเล่ย์"),
  component: Curriculum,
});

const DOMAINS = [
  ["ด้านร่างกาย", "การเคลื่อนไหว สุขภาพ และสุขนิสัยที่ดี"],
  ["ด้านอารมณ์และจิตใจ", "ความร่าเริง แจ่มใส และการรู้จักควบคุมอารมณ์"],
  ["ด้านสังคม", "การช่วยเหลือตนเอง การอยู่ร่วมกับผู้อื่น"],
  ["ด้านสติปัญญา", "การคิด การใช้ภาษา และการแก้ปัญหา"],
];

function Curriculum() {
  const { data: s } = useSettings();
  return (
    <>
      <PageHeader title="หลักสูตร" subtitle="การจัดประสบการณ์การเรียนรู้สำหรับเด็กปฐมวัย" />
      <Container className="space-y-8">
        <section>
          <h2 className="text-xl text-primary">พัฒนาการเด็กปฐมวัย 4 ด้าน</h2>
          <p className="mt-1 text-sm text-muted-foreground">กรอบทั่วไปตามแนวทางหลักสูตรการศึกษาปฐมวัย</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DOMAINS.map(([t, d], i) => (
              <div key={t} className={`rounded-2xl p-5 ${i % 2 ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
                <h3 className="text-lg">{t}</h3>
                <p className="mt-1 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="text-xl text-primary">หลักสูตรสถานศึกษา</h2>
          <div className="mt-3"><Prose text={s?.curriculum} /></div>
        </section>
      </Container>
    </>
  );
}