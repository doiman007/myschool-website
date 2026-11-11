import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { Container, Empty, PageHeader } from "@/components/site/SiteChrome";
import { usePublished } from "@/lib/public-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/staff")({
  head: () => seo("บุคลากร", "ทำเนียบคณะครูและบุคลากรของโรงเรียนอนุบาล อบต.วาเล่ย์"),
  component: Staff,
});

function Staff() {
  const { data, isLoading } = usePublished("staff_members", { col: "sort_order", asc: true });
  return (
    <>
      <PageHeader title="บุคลากร" subtitle="คณะผู้บริหาร ครู และบุคลากรทางการศึกษา" />
      <Container>
        {data?.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.map((m: any) => (
              <li key={m.id} className="rounded-2xl border bg-card p-5 text-center shadow-soft">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full bg-primary-soft">
                  {m.photo_url ? <img src={m.photo_url} alt={`ภาพ ${m.full_name}`} loading="lazy" className="h-full w-full object-cover" /> : <UserRound className="m-auto mt-8 h-16 w-16 text-primary/40" aria-hidden />}
                </div>
                <h2 className="mt-4 text-lg">{m.full_name}</h2>
                <p className="text-sm text-primary">{m.position}</p>
                {m.department && <p className="text-xs text-muted-foreground">{m.department}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <Empty text={isLoading ? "กำลังโหลด…" : "รอข้อมูลจากโรงเรียน"} />
        )}
      </Container>
    </>
  );
}