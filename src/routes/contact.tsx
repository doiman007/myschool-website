import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container, PageHeader, Placeholder } from "@/components/site/SiteChrome";
import { useSettings } from "@/lib/public-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("ติดต่อและแผนที่", "ที่อยู่ เบอร์โทร และแผนที่การเดินทางไปโรงเรียนอนุบาล อบต.วาเล่ย์ อำเภอพบพระ จังหวัดตาก"),
  component: Contact,
});

function Contact() {
  const { data: s } = useSettings();
  const mapSrc = s?.map_embed_url?.startsWith("https://www.google.com/maps/embed")
    ? s.map_embed_url
    : `https://www.google.com/maps?q=${encodeURIComponent("ตำบลวาเล่ย์ อำเภอพบพระ จังหวัดตาก")}&output=embed`;
  const rows = [
    [MapPin, "ที่อยู่", s?.address],
    [Phone, "โทรศัพท์", s?.phone],
    [Mail, "อีเมล", s?.email],
    [MessageCircle, "LINE", s?.line_id],
    [Facebook, "Facebook", s?.facebook_url],
    [Clock, "เวลาทำการ", s?.office_hours],
  ] as const;
  return (
    <>
      <PageHeader title="ติดต่อและแผนที่" subtitle="ช่องทางติดต่อโรงเรียน" />
      <Container className="grid gap-8 lg:grid-cols-2">
        <ul className="space-y-4">
          {rows.map(([Icon, label, value]) => (
            <li key={label} className="flex gap-4 rounded-2xl border bg-card p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Icon className="h-5 w-5" aria-hidden /></span>
              <div>
                <p className="font-semibold">{label}</p>
                {value ? (label === "Facebook" ? <a href={value} target="_blank" rel="noopener noreferrer" className="break-all text-primary underline">{value}</a> : <p>{value}</p>) : <Placeholder />}
              </div>
            </li>
          ))}
        </ul>
        <div>
          <iframe title="แผนที่โรงเรียน" src={mapSrc} className="h-96 w-full rounded-2xl border" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          {!s?.map_embed_url && <p className="mt-2 text-sm text-muted-foreground">แผนที่แสดงพื้นที่ตำบลวาเล่ย์โดยประมาณ — ตำแหน่งโรงเรียนที่แน่นอน: รอข้อมูลจากโรงเรียน</p>}
        </div>
      </Container>
    </>
  );
}