import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/site/SiteChrome";
import { useMe } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/format";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth")({
  head: () => seo("เข้าสู่ระบบเจ้าหน้าที่", "เข้าสู่ระบบสำหรับเจ้าหน้าที่โรงเรียน"),
  component: AuthPage,
});

function AuthPage() {
  const me = useMe();
  const [busy, setBusy] = useState(false);
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    setBusy(false);
    if (error) toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    else me.refetch();
  }
  return (
    <Container className="max-w-md">
      <h1 className="text-2xl text-primary">เข้าสู่ระบบเจ้าหน้าที่</h1>
      {me.data?.user ? (
        <div className="mt-6 space-y-3 rounded-2xl border bg-card p-6">
          <p>เข้าสู่ระบบเป็น {me.data.user.email}</p>
          <p className="text-sm">สิทธิ์: {me.data.roles.map((r) => ROLE_LABEL[r]).join(", ") || "ยังไม่ได้รับสิทธิ์"}</p>
          <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => me.refetch())}>ออกจากระบบ</Button>
        </div>
      ) : (
        <form onSubmit={login} className="mt-6 space-y-4 rounded-2xl border bg-card p-6">
          <div><label htmlFor="email" className="mb-1 block text-sm font-semibold">อีเมล</label><Input id="email" name="email" type="email" required autoComplete="username" /></div>
          <div><label htmlFor="password" className="mb-1 block text-sm font-semibold">รหัสผ่าน</label><Input id="password" name="password" type="password" required autoComplete="current-password" /></div>
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>เข้าสู่ระบบ</Button>
          <p className="text-xs text-muted-foreground">ไม่เปิดให้สมัครสมาชิกเอง บัญชีเจ้าหน้าที่สร้างโดยผู้ดูแลระบบเท่านั้น</p>
        </form>
      )}
    </Container>
  );
}