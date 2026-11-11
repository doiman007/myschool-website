import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Container, Empty, PageHeader, SampleBadge } from "@/components/site/SiteChrome";
import { usePublished } from "@/lib/public-data";
import { thaiDate } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/documents")({
  head: () => seo("ดาวน์โหลดเอกสาร", "แบบฟอร์มและเอกสารสำหรับผู้ปกครองของโรงเรียนอนุบาล อบต.วาเล่ย์"),
  component: Docs,
});

function Docs() {
  const { data, isLoading } = usePublished("documents", { col: "created_at" });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const cats = useMemo(() => Array.from(new Set((data ?? []).map((d: any) => d.category))), [data]);
  const list = (data ?? []).filter((d: any) => (cat === "all" || d.category === cat) && d.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="ดาวน์โหลดเอกสาร" subtitle="แบบฟอร์มและเอกสารเผยแพร่" />
      <Container>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="dq" className="sr-only">ค้นหาเอกสาร</label>
          <Input id="dq" placeholder="ค้นหาเอกสาร…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
          <label htmlFor="dc" className="sr-only">หมวดหมู่</label>
          <select id="dc" value={cat} onChange={(e) => setCat(e.target.value)} className="h-9 rounded-md border bg-card px-3 text-sm">
            <option value="all">ทุกหมวดหมู่</option>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        {list.length ? (
          <ul className="divide-y rounded-2xl border bg-card">
            {list.map((d: any) => (
              <li key={d.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <FileText className="h-8 w-8 shrink-0 text-primary" aria-hidden />
                <div className="flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">{d.title} {d.is_sample && <SampleBadge />}</p>
                  <p className="text-sm text-muted-foreground">{d.category} · {thaiDate(d.created_at)}{d.description ? ` · ${d.description}` : ""}</p>
                </div>
                {d.file_url ? (
                  <Button asChild variant="outline"><a href={d.file_url} target="_blank" rel="noopener noreferrer"><Download /> ดาวน์โหลด</a></Button>
                ) : <span className="text-sm text-muted-foreground">ยังไม่มีไฟล์</span>}
              </li>
            ))}
          </ul>
        ) : <Empty text={isLoading ? "กำลังโหลด…" : "ไม่พบเอกสาร"} />}
      </Container>
    </>
  );
}