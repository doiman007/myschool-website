import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Container, Empty } from "@/components/site/SiteChrome";
import { thaiDate } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/gallery/$id")({
  head: () => seo("อัลบั้มภาพกิจกรรม", "ภาพกิจกรรมของโรงเรียนอนุบาลองค์การบริหารส่วนตำบลวาเล่ย์"),
  component: AlbumPage,
});

function AlbumPage() {
  const { id } = Route.useParams();
  const [open, setOpen] = useState<any>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["album", id],
    queryFn: async () => {
      const { data: album } = await supabase.from("albums").select("*").eq("id", id).eq("status", "published").maybeSingle();
      const { data: photos } = await supabase.from("album_photos").select("*").eq("album_id", id).order("sort_order");
      return { album, photos: photos ?? [] };
    },
  });
  return (
    <Container>
      <Link to="/gallery" className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden /> อัลบั้มทั้งหมด</Link>
      {!data?.album ? (
        <div className="mt-6"><Empty text={isLoading ? "กำลังโหลด…" : "ไม่พบอัลบั้ม"} /></div>
      ) : (
        <>
          <h1 className="mt-4 text-3xl text-primary">{data.album.title}</h1>
          <p className="text-muted-foreground">{thaiDate(data.album.event_date)}</p>
          {data.album.description && <p className="mt-3 max-w-3xl">{data.album.description}</p>}
          {data.photos.length ? (
            <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {data.photos.map((p: any) => (
                <li key={p.id}>
                  <button onClick={() => setOpen(p)} className="block aspect-square w-full overflow-hidden rounded-xl" aria-label={`ดูภาพ ${p.caption ?? ""}`}>
                    <img src={p.url} alt={p.caption ?? ""} loading="lazy" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          ) : <div className="mt-6"><Empty text="ยังไม่มีภาพในอัลบั้มนี้" /></div>}
        </>
      )}
      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle>{open?.caption || "ภาพกิจกรรม"}</DialogTitle>
          {open && <img src={open.url} alt={open.caption ?? ""} className="max-h-[75vh] w-full rounded-lg object-contain" />}
        </DialogContent>
      </Dialog>
    </Container>
  );
}