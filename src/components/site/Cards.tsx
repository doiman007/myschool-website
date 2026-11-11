import { Link } from "@tanstack/react-router";
import { CalendarDays, ImageIcon } from "lucide-react";
import { CATEGORY_LABEL, thaiDate } from "@/lib/format";
import { SampleBadge } from "./SiteChrome";

export function PostCard({ p }: { p: any }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="aspect-[16/10] bg-primary-soft">
        {p.cover_url ? (
          <img src={p.cover_url} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-primary/40"><ImageIcon className="h-10 w-10" aria-hidden /></div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{CATEGORY_LABEL[p.category] ?? p.category}</span>
          {p.is_sample && <SampleBadge />}
        </div>
        <h3 className="text-lg">
          <Link to="/news/$id" params={{ id: p.id }} className="after:absolute hover:text-primary hover:underline">{p.title}</Link>
        </h3>
        {p.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>}
        <p className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
          <time dateTime={p.published_at ?? p.created_at}>{thaiDate(p.published_at ?? p.created_at)}</time>
        </p>
      </div>
    </article>
  );
}

export function EventRow({ e }: { e: any }) {
  const d = new Date(e.start_date);
  return (
    <li className="flex gap-4 rounded-2xl border bg-card p-4">
      <div className="grid w-16 shrink-0 place-items-center rounded-xl bg-sun text-sun-foreground">
        <span className="text-2xl font-bold leading-none">{d.getDate()}</span>
        <span className="text-xs">{d.toLocaleDateString("th-TH", { month: "short" })}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base">{e.title}</h3>
          {e.is_sample && <SampleBadge />}
        </div>
        <p className="text-sm text-muted-foreground">
          {thaiDate(e.start_date)}{e.end_date && e.end_date !== e.start_date ? ` – ${thaiDate(e.end_date)}` : ""}
          {e.location ? ` · ${e.location}` : ""}
        </p>
        {e.description && <p className="mt-1 text-sm">{e.description}</p>}
      </div>
    </li>
  );
}