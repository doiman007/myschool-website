import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Container, Empty, PageHeader } from "@/components/site/SiteChrome";
import { PostCard } from "@/components/site/Cards";
import { usePublished } from "@/lib/public-data";
import { CATEGORY_LABEL } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/news/")({
  head: () => seo("ข่าวประกาศ", "ข่าวประชาสัมพันธ์ ประกาศ และข่าวกิจกรรมของโรงเรียนอนุบาล อบต.วาเล่ย์"),
  component: News,
});

function News() {
  const { data, isLoading } = usePublished("posts", { col: "published_at" });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const list = useMemo(
    () => (data ?? []).filter((p: any) => (cat === "all" || p.category === cat) && (p.title + (p.excerpt ?? "")).toLowerCase().includes(q.toLowerCase())),
    [data, q, cat],
  );
  return (
    <>
      <PageHeader title="ข่าวประกาศ" subtitle="ติดตามข่าวสารและประกาศจากโรงเรียน" />
      <Container>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="q">ค้นหาข่าว</label>
          <Input id="q" placeholder="ค้นหาข่าว…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
          <div role="group" aria-label="กรองหมวดหมู่" className="flex flex-wrap gap-2">
            {[["all", "ทั้งหมด"], ...Object.entries(CATEGORY_LABEL)].map(([k, v]) => (
              <button key={k} onClick={() => setCat(k ?? "")} aria-pressed={cat === k}
                className={`rounded-full border px-3 py-1 text-sm ${cat === k ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p: any) => <PostCard key={p.id} p={p} />)}</div>
        ) : (
          <Empty text={isLoading ? "กำลังโหลด…" : "ไม่พบข่าว"} />
        )}
      </Container>
    </>
  );
}