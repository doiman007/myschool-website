import { createFileRoute, Link } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { Container, Empty, PageHeader, SampleBadge } from "@/components/site/SiteChrome";
import { usePublished } from "@/lib/public-data";
import { thaiDate } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/gallery/")({
  head: () => seo("อัลบั้มภาพ", "ภาพกิจกรรมของนักเรียนและโรงเรียนอนุบาล อบต.วาเล่ย์"),
  component: Gallery,
});

function Gallery() {
  const { data, isLoading } = usePublished("albums", { col: "event_date" });
  return (
    <>
      <PageHeader title="อัลบั้มภาพ" subtitle="ภาพบรรยากาศกิจกรรมของโรงเรียน" />
      <Container>
        {data?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((a: any) => (
              <Link key={a.id} to="/gallery/$id" params={{ id: a.id }} className="group overflow-hidden rounded-2xl border bg-card shadow-soft">
                <div className="aspect-[4/3] bg-primary-soft">
                  {a.cover_url ? <img src={a.cover_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : <div className="grid h-full place-items-center text-primary/40"><ImageIcon className="h-10 w-10" aria-hidden /></div>}
                </div>
                <div className="p-4">
                  <h2 className="text-lg">{a.title}</h2>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">{thaiDate(a.event_date)} {a.is_sample && <SampleBadge />}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Empty text={isLoading ? "กำลังโหลด…" : "ยังไม่มีอัลบั้มภาพ"} />
        )}
      </Container>
    </>
  );
}