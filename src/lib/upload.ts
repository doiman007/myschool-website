import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads a file to the media storage and returns a long-lived URL for public display. */
export async function uploadMedia(file: File, folder: string) {
  if (file.size > 20 * 1024 * 1024) throw new Error("ไฟล์ใหญ่เกิน 20MB");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (e2 || !data) throw e2 ?? new Error("upload failed");
  return { url: data.signedUrl, name: file.name };
}