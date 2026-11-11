import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("school_settings").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function usePublished<T = any>(table: string, order: { col: string; asc?: boolean }, limit?: number) {
  return useQuery({
    queryKey: ["pub", table, order.col, limit],
    queryFn: async () => {
      let q = (supabase.from(table as any) as any).select("*").eq("status", "published").order(order.col, { ascending: !!order.asc });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}