import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Empty, PageHeader, SampleBadge } from "@/components/site/SiteChrome";
import { usePublished } from "@/lib/public-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => seo("คำถามที่พบบ่อย", "คำถามที่ผู้ปกครองถามบ่อยเกี่ยวกับการสมัครเรียนและการเรียนที่โรงเรียนอนุบาล อบต.วาเล่ย์"),
  component: Faq,
});

function Faq() {
  const { data, isLoading } = usePublished("faqs", { col: "sort_order", asc: true });
  return (
    <>
      <PageHeader title="คำถามที่พบบ่อย" />
      <Container className="max-w-3xl">
        {data?.length ? (
          <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5">
            {data.map((f: any) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-line text-base">
                  {f.is_sample && <div className="mb-2"><SampleBadge /></div>}
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : <Empty text={isLoading ? "กำลังโหลด…" : "ยังไม่มีคำถาม"} />}
      </Container>
    </>
  );
}