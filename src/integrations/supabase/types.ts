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
      club_events: {
        Row: {
          club_name: string
          created_at: string
          description: string
          event_date: string
          id: string
          title: string
          venue: string
        }
        Insert: {
          club_name: string
          created_at?: string
          description?: string
          event_date: string
          id?: string
          title: string
          venue?: string
        }
        Update: {
          club_name?: string
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          title?: string
          venue?: string
        }
        Relationships: []
      }
      clubs: {
        Row: {
          category: string
          contact: string
          created_at: string
          description: string
          id: string
          leader: string
          name: string
        }
        Insert: {
          category?: string
          contact?: string
          created_at?: string
          description?: string
          id?: string
          leader?: string
          name: string
        }
        Update: {
          category?: string
          contact?: string
          created_at?: string
          description?: string
          id?: string
          leader?: string
          name?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          category: string
          created_at: string
          details: string
          id: string
          kind: string
          posted_by: string
          subject: string
        }
        Insert: {
          category?: string
          created_at?: string
          details: string
          id?: string
          kind: string
          posted_by?: string
          subject: string
        }
        Update: {
          category?: string
          created_at?: string
          details?: string
          id?: string
          kind?: string
          posted_by?: string
          subject?: string
        }
        Relationships: []
      }
      lost_found: {
        Row: {
          contact: string
          created_at: string
          description: string
          id: string
          item: string
          kind: string
          location: string
          posted_by: string
        }
        Insert: {
          contact: string
          created_at?: string
          description?: string
          id?: string
          item: string
          kind: string
          location?: string
          posted_by?: string
        }
        Update: {
          contact?: string
          created_at?: string
          description?: string
          id?: string
          item?: string
          kind?: string
          location?: string
          posted_by?: string
        }
        Relationships: []
      }
      mess_menu: {
        Row: {
          created_at: string
          day: string
          id: string
          items: string
          meal: string
          posted_by: string
          timing: string
        }
        Insert: {
          created_at?: string
          day: string
          id?: string
          items: string
          meal: string
          posted_by?: string
          timing?: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          items?: string
          meal?: string
          posted_by?: string
          timing?: string
        }
        Relationships: []
      }
      newcomer_tips: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          link: string
          posted_by: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind: string
          link?: string
          posted_by?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          link?: string
          posted_by?: string
          title?: string
        }
        Relationships: []
      }
      pyqs: {
        Row: {
          created_at: string
          exam: string
          file_url: string
          id: string
          posted_by: string
          style_notes: string
          subject: string
          teacher: string
          year: string
        }
        Insert: {
          created_at?: string
          exam?: string
          file_url?: string
          id?: string
          posted_by?: string
          style_notes?: string
          subject: string
          teacher: string
          year?: string
        }
        Update: {
          created_at?: string
          exam?: string
          file_url?: string
          id?: string
          posted_by?: string
          style_notes?: string
          subject?: string
          teacher?: string
          year?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
