# 🏫 เว็บไซต์โรงเรียนอนุบาลองค์การบริหารส่วนตำบลวาเล่ย์

เว็บไซต์โรงเรียนในสังกัดองค์การบริหารส่วนตำบลวาเล่ย์ อำเภอพบพระ จังหวัดตาก

## 🌐 เปิดดูเว็บไซต์โรงเรียน

**[คลิกเพื่อเปิดตัวอย่างเว็บไซต์โรงเรียน (Lovable Preview)](https://id-preview--e6106ab5-b5a1-4898-9d53-07f8c47eafc2.lovable.app)**

**[เปิดหน้าจัดการเว็บไซต์ใน Lovable](https://lovable.dev/projects/e6106ab5-b5a1-4898-9d53-07f8c47eafc2)**

> หมายเหตุ: ลิงก์ข้างต้นเป็นการเปิดตัวอย่างเว็บไซต์จาก Lovable ไม่ใช่เว็บไซต์ที่โฮสต์ด้วย GitHub Pages และยังไม่ใช่เว็บไซต์โรงเรียนที่เผยแพร่เป็นทางการ อาจจำเป็นต้องมีสิทธิ์เข้าดูตัวอย่างจาก Lovable

## 📂 Source Code

Branch นี้เป็นสำเนาโค้ดสำหรับเตรียมย้ายไป Cloudflare Workers โดยใช้ Supabase เดิม ข้อมูลนักเรียนและรหัสลับไม่ได้อยู่ใน GitHub

- [การตั้งค่า Cloudflare Workers](wrangler.jsonc)
- [คู่มือการ Deploy](CLOUDFLARE_DEPLOY.md)
- [รายละเอียดการส่งออกไฟล์](EXPORT_NOTES.md)
- [GitHub Actions](.github/workflows/deploy-wale-cloudflare.yml)

**สถานะ:** ยังไม่ได้ Deploy บน Cloudflare และยังไม่ได้ยืนยันการทำงานของระบบหลังบ้าน/รับสมัครบนเซิร์ฟเวอร์ใหม่

## เทคโนโลยี

TanStack Start, React, TypeScript, Tailwind CSS, Supabase

## ข้อควรระวัง

GitHub เป็นที่เก็บ Source Code โดยตรง ไม่สามารถเปิดใช้งานแอป TanStack Start ที่มี server-side functions และระบบหลังบ้านได้เพียงแค่เปิดไฟล์บน GitHub; ต้อง Build และ Deploy บนแพลตฟอร์มที่รองรับ เช่น Cloudflare Workers ก่อน
