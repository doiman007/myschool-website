import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Container, Empty, SampleBadge } from "@/components/site/SiteChrome";
import { CATEGORY_LABEL, thaiDate } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/news/$id")({
  head: () => seo("รายละเอียดข่าว", "ข่าวสารจากโรงเรียนอนุบาลองค์การบริหารส่วนตำบลวาเล่ย์"),
  component: NewsDetail,
});

function NewsDetail() {
  const { id } = Route.useParams();
  const { data: p, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => (await supabase.from("posts").select("*").eq("id", id).eq("status", "published").maybeSingle()).data,
  });
  return (
    <Container className="max-w-3xl">
      <Link to="/news" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden /> กลับไปหน้าข่าว</Link>
      {!p ? (
        <div className="mt-6"><Empty text={isLoading ? "กำลังโหลด…" : "ไม่พบข่าวนี้"} /></div>
      ) : (
        <article className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-secondary px-2 py-0.5">{CATEGORY_LABEL[p.category]}</span>
            {p.is_sample && <SampleBadge />}
            <time className="text-muted-foreground">{thaiDate(p.published_at ?? p.created_at)}</time>
          </div>
          <h1 className="mt-3 text-3xl text-primary">{p.title}</h1>
          {p.cover_url && <img src={p.cover_url} alt="" className="mt-6 w-full rounded-2xl" />}
          <div className="mt-6 whitespace-pre-line text-lg">{p.content}</div>
        </article>
      )}
    </Container>
  );
}