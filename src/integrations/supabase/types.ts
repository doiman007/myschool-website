export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admissions: {
        Row: {
          academic_year: string | null
          address: string
          child_birthdate: string
          child_gender: string | null
          child_name: string
          child_nickname: string | null
          consent: boolean
          created_at: string
          id: string
          level: string
          notes: string | null
          parent_email: string | null
          parent_name: string
          parent_phone: string
          public_note: string | null
          relationship: string | null
          staff_note: string | null
          status: Database["public"]["Enums"]["admission_status"]
          tracking_code: string
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          address: string
          child_birthdate: string
          child_gender?: string | null
          child_name: string
          child_nickname?: string | null
          consent?: boolean
          created_at?: string
          id?: string
          level: string
          notes?: string | null
          parent_email?: string | null
          parent_name: string
          parent_phone: string
          public_note?: string | null
          relationship?: string | null
          staff_note?: string | null
          status?: Database["public"]["Enums"]["admission_status"]
          tracking_code: string
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          address?: string
          child_birthdate?: string
          child_gender?: string | null
          child_name?: string
          child_nickname?: string | null
          consent?: boolean
          created_at?: string
          id?: string
          level?: string
          notes?: string | null
          parent_email?: string | null
          parent_name?: string
          parent_phone?: string
          public_note?: string | null
          relationship?: string | null
          staff_note?: string | null
          status?: Database["public"]["Enums"]["admission_status"]
          tracking_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      album_photos: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string
          id: string
          sort_order: number
          url: string
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          url: string
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          cover_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string | null
          id: string
          is_sample: boolean
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          is_sample?: boolean
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          is_sample?: boolean
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_name: string | null
          file_url: string | null
          id: string
          is_sample: boolean
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_sample?: boolean
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          is_sample?: boolean
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          is_sample: boolean
          location: string | null
          start_date: string
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_sample?: boolean
          location?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_sample?: boolean
          location?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_sample: boolean
          question: string
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_sample?: boolean
          question: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_sample?: boolean
          question?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string
          content: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          is_sample: boolean
          published_at: string | null
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          is_sample?: boolean
          published_at?: string | null
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          is_sample?: boolean
          published_at?: string | null
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_settings: {
        Row: {
          about: string | null
          academic_year: string | null
          address: string | null
          admission_info: string | null
          admission_open: boolean
          affiliation: string | null
          curriculum: string | null
          email: string | null
          facebook_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          history: string | null
          id: number
          line_id: string | null
          map_embed_url: string | null
          mission: string | null
          motto: string | null
          office_hours: string | null
          philosophy: string | null
          phone: string | null
          school_name: string
          updated_at: string
          vision: string | null
        }
        Insert: {
          about?: string | null
          academic_year?: string | null
          address?: string | null
          admission_info?: string | null
          admission_open?: boolean
          affiliation?: string | null
          curriculum?: string | null
          email?: string | null
          facebook_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          history?: string | null
          id?: number
          line_id?: string | null
          map_embed_url?: string | null
          mission?: string | null
          motto?: string | null
          office_hours?: string | null
          philosophy?: string | null
          phone?: string | null
          school_name?: string
          updated_at?: string
          vision?: string | null
        }
        Update: {
          about?: string | null
          academic_year?: string | null
          address?: string | null
          admission_info?: string | null
          admission_open?: boolean
          affiliation?: string | null
          curriculum?: string | null
          email?: string | null
          facebook_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          history?: string | null
          id?: number
          line_id?: string | null
          map_embed_url?: string | null
          mission?: string | null
          motto?: string | null
          office_hours?: string | null
          philosophy?: string | null
          phone?: string | null
          school_name?: string
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      staff_accounts: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          bio: string | null
          created_at: string
          department: string | null
          full_name: string
          id: string
          photo_url: string | null
          position: string | null
          sort_order: number
          status: Database["public"]["Enums"]["publish_status"]
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name: string
          id?: string
          photo_url?: string | null
          position?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          department?: string | null
          full_name?: string
          id?: string
          photo_url?: string | null
          position?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["publish_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_content: { Args: { _user_id: string }; Returns: boolean }
      check_admission_status: {
        Args: { p_code: string; p_phone: string }
        Returns: {
          level: string
          public_note: string
          status: Database["public"]["Enums"]["admission_status"]
          submitted_at: string
          tracking_code: string
          updated_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      submit_admission: {
        Args: {
          p_address: string
          p_child_birthdate: string
          p_child_gender: string
          p_child_name: string
          p_child_nickname: string
          p_consent: boolean
          p_level: string
          p_notes: string
          p_parent_email: string
          p_parent_name: string
          p_parent_phone: string
          p_relationship: string
        }
        Returns: string
      }
    }
    Enums: {
      admission_status:
        | "submitted"
        | "reviewing"
        | "need_documents"
        | "approved"
        | "rejected"
      app_role: "admin" | "editor" | "teacher"
      publish_status: "draft" | "published"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admission_status: [
        "submitted",
        "reviewing",
        "need_documents",
        "approved",
        "rejected",
      ],
      app_role: ["admin", "editor", "teacher"],
      publish_status: ["draft", "published"],
    },
  },
} as const