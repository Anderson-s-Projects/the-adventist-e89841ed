export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      churches: {
        Row: {
          address: string
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          division: string
          id: string
          image_url: string | null
          location_coordinates: unknown | null
          name: string
          region: string
          service_times: Json | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address: string
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          division: string
          id?: string
          image_url?: string | null
          location_coordinates?: unknown | null
          name: string
          region: string
          service_times?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          division?: string
          id?: string
          image_url?: string | null
          location_coordinates?: unknown | null
          name?: string
          region?: string
          service_times?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      community_news: {
        Row: {
          author: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      divisions: {
        Row: {
          church_count: number | null
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          region_count: number | null
          school_count: number | null
          updated_at: string
        }
        Insert: {
          church_count?: number | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          region_count?: number | null
          school_count?: number | null
          updated_at?: string
        }
        Update: {
          church_count?: number | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          region_count?: number | null
          school_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          image_url: string | null
          location: string | null
          start_time: string
          streaming_url: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          image_url?: string | null
          location?: string | null
          start_time: string
          streaming_url?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          image_url?: string | null
          location?: string | null
          start_time?: string
          streaming_url?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          members_count: number | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          members_count?: number | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          members_count?: number | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          draft: boolean | null
          id: string
          is_sabbath_appropriate: boolean | null
          metadata: Json | null
          title: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          draft?: boolean | null
          id?: string
          is_sabbath_appropriate?: boolean | null
          metadata?: Json | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          draft?: boolean | null
          id?: string
          is_sabbath_appropriate?: boolean | null
          metadata?: Json | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_posts_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          created_at: string
          description: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about: string | null
          avatar_url: string | null
          bio: string | null
          church_affiliation: string | null
          cover_photo_url: string | null
          created_at: string
          element_privacy: Json | null
          favorite_bible_verse: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          last_reminder_sent: string | null
          location: string | null
          ministry_interests: string[] | null
          prayer_requests: string[] | null
          privacy_settings: Json | null
          professional_accomplishments: Json | null
          profile_completion_percentage: number | null
          skills: string[] | null
          updated_at: string
          username: string | null
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          bio?: string | null
          church_affiliation?: string | null
          cover_photo_url?: string | null
          created_at?: string
          element_privacy?: Json | null
          favorite_bible_verse?: string | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          last_reminder_sent?: string | null
          location?: string | null
          ministry_interests?: string[] | null
          prayer_requests?: string[] | null
          privacy_settings?: Json | null
          professional_accomplishments?: Json | null
          profile_completion_percentage?: number | null
          skills?: string[] | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          bio?: string | null
          church_affiliation?: string | null
          cover_photo_url?: string | null
          created_at?: string
          element_privacy?: Json | null
          favorite_bible_verse?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          last_reminder_sent?: string | null
          location?: string | null
          ministry_interests?: string[] | null
          prayer_requests?: string[] | null
          privacy_settings?: Json | null
          professional_accomplishments?: Json | null
          profile_completion_percentage?: number | null
          skills?: string[] | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          format: string
          id: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          format: string
          id?: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          format?: string
          id?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          division: string
          education_level: string
          id: string
          image_url: string | null
          location_coordinates: unknown | null
          name: string
          region: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address: string
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          division: string
          education_level: string
          id?: string
          image_url?: string | null
          location_coordinates?: unknown | null
          name: string
          region: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          division?: string
          education_level?: string
          id?: string
          image_url?: string | null
          location_coordinates?: unknown | null
          name?: string
          region?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          latitude: number | null
          longitude: number | null
          sabbath_mode_enabled: boolean | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          latitude?: number | null
          longitude?: number | null
          sabbath_mode_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          latitude?: number | null
          longitude?: number | null
          sabbath_mode_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
