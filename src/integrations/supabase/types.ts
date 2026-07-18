export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// IntellectFlow PRO - Founder Kaushik Savaliya - Market Value ₹55k+ at ₹299 - Database Types - Aap Dukaan Chalao Google Hum Sambhalenge

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          address: string | null
          business_name: string | null
          contact_number: string | null
          created_at: string
          description: string | null
          google_review_link: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          logo_url: string | null
          place_id: string | null
          rating: number | null
          slug: string | null
          user_id: string
          user_ratings_total: number | null
          website: string | null
          // PRO: Market Value ₹55k+ Features - Founder Kaushik Savaliya - Lifetime Free
          is_lifetime_free: boolean | null // Value ₹55k+ FREE - Founder Approved - Never enforce limits
          coupon_enabled: boolean | null // Thank You + Coupon 10% OFF - Value ₹1.5k/mo
          coupon_code: string | null // Coupon code - Value ₹1.5k/mo
          coupon_discount: string | null // 10% OFF etc - Value ₹1.5k/mo
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          contact_number?: string | null
          created_at?: string
          description?: string | null
          google_review_link?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          logo_url?: string | null
          place_id?: string | null
          rating?: number | null
          slug?: string | null
          user_id: string
          user_ratings_total?: number | null
          website?: string | null
          is_lifetime_free?: boolean | null
          coupon_enabled?: boolean | null
          coupon_code?: string | null
          coupon_discount?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          contact_number?: string | null
          created_at?: string
          description?: string | null
          google_review_link?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          logo_url?: string | null
          place_id?: string | null
          rating?: number | null
          slug?: string | null
          user_id?: string
          user_ratings_total?: number | null
          website?: string | null
          is_lifetime_free?: boolean | null
          coupon_enabled?: boolean | null
          coupon_code?: string | null
          coupon_discount?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      review_events: {
        Row: {
          business_id: string
          created_at: string
          id: string
          suggestion_shown: string | null
          // PRO: Market Value ₹5k/mo - Reviews Driven Counter + Coupon tracking
          coupon_used: boolean | null // Coupon 10% OFF used - Value ₹1.5k/mo
          rating_selected: number | null // 1-5 star - Negative Filter ₹7k/mo tracking
          is_negative: boolean | null // 1-2★ Private - Value ₹7k/mo - Not posted to Google
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          suggestion_shown?: string | null
          coupon_used?: boolean | null
          rating_selected?: number | null
          is_negative?: boolean | null
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          suggestion_shown?: string | null
          coupon_used?: boolean | null
          rating_selected?: number | null
          is_negative?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "review_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          business_id: string
          current_period_end: string | null
          id: string
          plan: string | null
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          status: string
          updated_at: string
          // PRO: Market Value ₹5k/mo + ₹8k/mo - Usage tracking - Growth 50/mo Pro Unlimited + GMB 5/15
          ai_reply_used: number | null // AI Reply 3 Variants - Value ₹5k/mo - Growth 50/mo Pro Unlimited
          gmb_post_used: number | null // GMB Post Generator - Value ₹8k/mo - Growth 5/mo Pro 15/mo
        }
        Insert: {
          business_id: string
          current_period_end?: string | null
          id?: string
          plan?: string | null
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          status?: string
          updated_at?: string
          ai_reply_used?: number | null
          gmb_post_used?: number | null
        }
        Update: {
          business_id?: string
          current_period_end?: string | null
          id?: string
          plan?: string | null
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          status?: string
          updated_at?: string
          ai_reply_used?: number | null
          gmb_post_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      // PRO: NEW Tables - Market Value ₹7k/mo + ₹3k/mo - Founder Kaushik Savaliya
      feedbacks: {
        Row: {
          id: string
          business_id: string
          rating: number | null // 1-2★ Private - Value ₹7k/mo - Not posted to Google
          text: string | null // Private feedback - Value ₹7k/mo
          phone: string | null
          created_at: string
          // Market Value ₹7k/mo - Negative Filter - Private feedback for owner only
        }
        Insert: {
          id?: string
          business_id: string
          rating?: number | null
          text?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          rating?: number | null
          text?: string | null
          phone?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_logs: {
        Row: {
          id: string
          business_id: string
          phone: string | null
          message: string | null // WhatsApp reminder message - Value ₹3k/mo
          sent_at: string
          status: string | null // sent, pending, failed - Value ₹3k/mo - 24hr after QR scan
        }
        Insert: {
          id?: string
          business_id: string
          phone?: string | null
          message?: string | null
          sent_at?: string
          status?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          phone?: string | null
          message?: string | null
          sent_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_replies: {
        Row: {
          id: string
          business_id: string
          review_text: string | null // Customer review - Value ₹5k/mo
          reply_text: string | null // AI reply 3 variants - Value ₹5k/mo
          variant: number | null // 1,2,3 - Professional, Hinglish, Gujarati - Value ₹5k/mo
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          review_text?: string | null
          reply_text?: string | null
          variant?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          review_text?: string | null
          reply_text?: string | null
          variant?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_replies_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      gmb_posts: {
        Row: {
          id: string
          business_id: string
          post_text: string | null // GMB Post AI generated - Value ₹8k/mo - Growth 5/mo Pro 15/mo
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          post_text?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          post_text?: string | null
          image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gmb_posts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "owner"
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
      app_role: ["admin", "owner"],
    },
  },
} as const

// PRO: Market Value Helpers - Founder Kaushik Savaliya - Aap Dukaan Chalao Google Hum Sambhalenge
export const MARKET_VALUES = {
  qr_short_link: 1000, // QR + /r/slug - ₹1,000
  ai_writer: 3000, // AI Review Writer 4 Suggestions Gujarati/Hinglish - ₹3,000/mo
  coupon: 1500, // Thank You + Coupon 10% OFF - ₹1,500/mo
  negative_filter: 7000, // Negative Filter 1-2★ Private - ₹7,000/mo
  reviews_counter: 5000, // Reviews Driven Counter - ₹5,000/mo
  ai_reply: 5000, // AI Reply 3 Variants - ₹5,000/mo - Growth 50/mo Pro Unlimited
  whatsapp: 3000, // WhatsApp Reminder 24hr - ₹3,000/mo
  gmb_post: 8000, // GMB Post Generator 5 Growth 15 Pro - ₹8,000/mo
  sentiment: 5000, // Sentiment Analysis - ₹5,000/mo
  competitor: 12000, // Competitor Tracking 2 Every 6hr - ₹12,000/mo
  stickers: 2000, // Premium Stickers 20+ - ₹2,000/mo
  website: 10000, // Website FREE with Pro - ₹10,000/mo
  poster: 500, // Poster Design 1080x1080 - ₹500
  total_starter: 8000, // Starter Market Value - ₹8,000/mo
  total_growth: 25000, // Growth Market Value - ₹25,000/mo - 80% Popular
  total_pro: 55000, // Business Pro Market Value - ₹55,000+/mo - Aap Dukaan Chalao Google Hum Sambhalenge
} as const

export const PLANS = {
  starter: { price: 299, market: MARKET_VALUES.total_starter, label: "Starter - Market ₹8k/mo at ₹299" },
  growth: { price: 599, market: MARKET_VALUES.total_growth, label: "Growth - Market ₹25k/mo at ₹599 - 80% Popular" },
  business: { price: 1299, market: MARKET_VALUES.total_pro, label: "Business Pro - Market ₹55k+/mo at ₹1299 - Aap Dukaan Chalao Google Hum Sambhalenge" },
} as const

// Founder: Kaushik Savaliya - Visavadar Gujarat 362130 - intellectflowteam@gmail.com - Market Value ₹55k+ at ₹299 - Aap Dukaan Chalao Google Hum Sambhalenge - 500+ Businesses - IntellectFlow.in PRO - Lifetime Free Value ₹55k+ FREE