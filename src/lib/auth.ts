import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "./format";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return { user: null, roles: [] as Role[] };
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
      return { user: u.user, roles: (data ?? []).map((r) => r.role as Role) };
    },
  });
}