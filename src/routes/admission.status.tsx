import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container, PageHeader } from "@/components/site/SiteChrome";
import { ADMISSION_STATUS_LABEL, thaiDate } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admission/status")({
  head: () => seo("ตรวจสอบสถานะการสมัคร", "ตรวจสอบสถานะใบสมัครเรียนด้วยรหัสติดตามและเบอร์โทรศัพท์"),
  component: Status,
});

function Status() {
  const [res, setRes] = useState<any>(undefined);
  async function check(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { data } = await supabase.rpc("check_admission_status", {
      p_code: String(f.get("code")), p_phone: String(f.get("phone")).replace(/\D/g, ""),
    });
    setRes(data?.[0] ?? null);
  }
  return (
    <>
      <PageHeader title="ตรวจสอบสถานะการสมัคร" />
      <Container className="max-w-xl">
        <form onSubmit={check} className="space-y-4 rounded-2xl border bg-card p-6">
          <div><label htmlFor="code" className="mb-1 block text-sm font-semibold">รหัสติดตาม</label><Input id="code" name="code" required placeholder="WL-XXXXXXXX" /></div>
          <div><label htmlFor="phone" className="mb-1 block text-sm font-semibold">เบอร์โทรศัพท์ผู้ปกครอง</label><Input id="phone" name="phone" required inputMode="tel" /></div>
          <Button type="submit" variant="hero" className="w-full">ตรวจสอบ</Button>
        </form>
        <div aria-live="polite" className="mt-6">
          {res === null && <p className="rounded-2xl border p-4 text-center">ไม่พบข้อมูล กรุณาตรวจสอบรหัสและเบอร์โทรศัพท์</p>}
          {res && (
            <div className="rounded-2xl bg-secondary p-6">
              <p className="text-sm">รหัส {res.tracking_code} · {res.level}</p>
              <p className="mt-2 font-display text-2xl text-primary">{ADMISSION_STATUS_LABEL[res.status]}</p>
              <p className="text-sm text-muted-foreground">ยื่นเมื่อ {thaiDate(res.submitted_at)}</p>
              {res.public_note && <p className="mt-3">{res.public_note}</p>}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}