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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bus_students: {
        Row: {
          bus_id: string
          created_at: string
          current_status: string
          dropoff_location: Json | null
          id: string
          is_active: boolean
          pickup_location: Json
          pickup_time: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          bus_id: string
          created_at?: string
          current_status?: string
          dropoff_location?: Json | null
          id?: string
          is_active?: boolean
          pickup_location: Json
          pickup_time?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          bus_id?: string
          created_at?: string
          current_status?: string
          dropoff_location?: Json | null
          id?: string
          is_active?: boolean
          pickup_location?: Json
          pickup_time?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_students_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bus_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_trips: {
        Row: {
          bus_id: string
          created_at: string
          end_time: string | null
          id: string
          route_data: Json | null
          start_time: string | null
          status: string
          trip_date: string
          trip_type: string
          updated_at: string
        }
        Insert: {
          bus_id: string
          created_at?: string
          end_time?: string | null
          id?: string
          route_data?: Json | null
          start_time?: string | null
          status?: string
          trip_date?: string
          trip_type: string
          updated_at?: string
        }
        Update: {
          bus_id?: string
          created_at?: string
          end_time?: string | null
          id?: string
          route_data?: Json | null
          start_time?: string | null
          status?: string
          trip_date?: string
          trip_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_trips_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["id"]
          },
        ]
      }
      buses: {
        Row: {
          bus_number: string
          capacity: number
          captain_id: string
          created_at: string
          current_location: Json | null
          id: string
          license_plate: string | null
          status: string
          updated_at: string
        }
        Insert: {
          bus_number: string
          capacity?: number
          captain_id: string
          created_at?: string
          current_location?: Json | null
          id?: string
          license_plate?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          bus_number?: string
          capacity?: number
          captain_id?: string
          created_at?: string
          current_location?: Json | null
          id?: string
          license_plate?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buses_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      grades: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: number
          name?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          attachment_url: string | null
          content: string | null
          created_at: string | null
          description: string | null
          grade_id: string | null
          id: string
          is_published: boolean | null
          teacher_id: string
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          attachment_url?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          grade_id?: string | null
          id?: string
          is_published?: boolean | null
          teacher_id: string
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          attachment_url?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          grade_id?: string | null
          id?: string
          is_published?: boolean | null
          teacher_id?: string
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string | null
          created_at: string | null
          id: string
          marks: number | null
          options: Json | null
          order_number: number | null
          question: string
          quiz_id: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          marks?: number | null
          options?: Json | null
          order_number?: number | null
          question: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string | null
          id?: string
          marks?: number | null
          options?: Json | null
          order_number?: number | null
          question?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          grade_id: string | null
          id: string
          is_published: boolean | null
          teacher_id: string
          title: string
          total_marks: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          grade_id?: string | null
          id?: string
          is_published?: boolean | null
          teacher_id: string
          title: string
          total_marks?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          grade_id?: string | null
          id?: string
          is_published?: boolean | null
          teacher_id?: string
          title?: string
          total_marks?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      student_attendance: {
        Row: {
          created_at: string
          dropoff_location: Json | null
          dropoff_time: string | null
          id: string
          notes: string | null
          pickup_location: Json | null
          pickup_time: string | null
          status: string
          student_id: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dropoff_location?: Json | null
          dropoff_time?: string | null
          id?: string
          notes?: string | null
          pickup_location?: Json | null
          pickup_time?: string | null
          status: string
          student_id: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dropoff_location?: Json | null
          dropoff_time?: string | null
          id?: string
          notes?: string | null
          pickup_location?: Json | null
          pickup_time?: string | null
          status?: string
          student_id?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "bus_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          enrollment_date: string | null
          grade_id: string | null
          id: string
          is_active: boolean | null
          parent_phone: string | null
          student_id: string
          teacher_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enrollment_date?: string | null
          grade_id?: string | null
          id?: string
          is_active?: boolean | null
          parent_phone?: string | null
          student_id: string
          teacher_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enrollment_date?: string | null
          grade_id?: string | null
          id?: string
          is_active?: boolean | null
          parent_phone?: string | null
          student_id?: string
          teacher_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "grades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          payment_status: string | null
          start_date: string | null
          stripe_subscription_id: string | null
          student_id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          payment_status?: string | null
          start_date?: string | null
          stripe_subscription_id?: string | null
          student_id: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          payment_status?: string | null
          start_date?: string | null
          stripe_subscription_id?: string | null
          student_id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          bio: string | null
          created_at: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_approved: boolean | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_approved?: boolean | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_approved?: boolean | null
          subject?: string
          updated_at?: string | null
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
      user_role:
        | "teacher"
        | "student"
        | "captain"
        | "parent"
        | "school_admin"
        | "admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      user_role: [
        "teacher",
        "student",
        "captain",
        "parent",
        "school_admin",
        "admin",
      ],
    },
  },
} as const
