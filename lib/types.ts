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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          password_hash: string | null
          email_verified: boolean | null
          reset_token: string | null
          reset_token_expires: string | null
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: UserRole
          password_hash?: string | null
          email_verified?: boolean | null
          reset_token?: string | null
          reset_token_expires?: string | null
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: UserRole
          password_hash?: string | null
          email_verified?: boolean | null
          reset_token?: string | null
          reset_token_expires?: string | null
          last_login?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          amount: number
          description: string
          transaction_type: "income" | "expense"
          status: "pending" | "completed" | "failed"
          date: string
          category: string | null
          created_at: string
          updated_at: string
          currency_id: string | null
          loft_id: string | null
          payment_method_id: string | null
          ratio_at_transaction: number | null
          equivalent_amount_default_currency: number | null
        }
        Insert: {
          id?: string
          amount: number
          description: string
          transaction_type: "income" | "expense"
          status?: "pending" | "completed" | "failed"
          date?: string
          category?: string | null
          currency_id?: string | null
          loft_id?: string | null
          payment_method_id?: string | null
          ratio_at_transaction?: number | null
          equivalent_amount_default_currency?: number | null
        }
        Update: {
          id?: string
          amount?: number
          description?: string
          transaction_type?: "income" | "expense"
          status?: "pending" | "completed" | "failed"
          date?: string
          category?: string | null
          currency_id?: string | null
          loft_id?: string | null
          payment_method_id?: string | null
          ratio_at_transaction?: number | null
          equivalent_amount_default_currency?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_currency_id_fkey"
            columns: ["currency_id"]
            referencedRelation: "currencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_loft_id_fkey"
            columns: ["loft_id"]
            referencedRelation: "lofts"
            referencedColumns: ["id"]
          }
        ]
      }
      lofts: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          price_per_month: number
          status: "available" | "occupied" | "maintenance"
          owner_id: string | null
          company_percentage: number
          owner_percentage: number
          created_at: string
          updated_at: string
          zone_area_id: string | null
          airbnb_listing_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          price_per_month: number
          status?: "available" | "occupied" | "maintenance"
          owner_id?: string | null
          company_percentage?: number
          owner_percentage?: number
          zone_area_id?: string | null
          airbnb_listing_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          price_per_month?: number
          status?: "available" | "occupied" | "maintenance"
          owner_id?: string | null
          company_percentage?: number
          owner_percentage?: number
          zone_area_id?: string | null
          airbnb_listing_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lofts_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "loft_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lofts_zone_area_id_fkey"
            columns: ["zone_area_id"]
            referencedRelation: "zone_areas"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          type: "income" | "expense"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: "income" | "expense"
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: "income" | "expense"
        }
        Relationships: []
      }
      currencies: {
        Row: {
          id: string
          code: string
          name: string
          symbol: string
          is_default: boolean
          created_at: string
          updated_at: string
          ratio: number
        }
        Insert: {
          id?: string
          code: string
          name: string
          symbol: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
          ratio?: number
        }
        Update: {
          id?: string
          code?: string
          name?: string
          symbol?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
          ratio?: number
        }
        Relationships: []
      }
      zone_areas: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          team_id: string | null
          user_id: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          team_id?: string | null
          user_id?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string | null
          user_id?: string | null
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      loft_owners: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          ownership_type: "company" | "third_party"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          ownership_type?: "company" | "third_party"
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          ownership_type?: "company" | "third_party"
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: "todo" | "in_progress" | "completed"
          due_date: string | null
          assigned_to: string | null
          team_id: string | null
          loft_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: "todo" | "in_progress" | "completed"
          due_date?: string | null
          assigned_to?: string | null
          team_id?: string | null
          loft_id?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: "todo" | "in_progress" | "completed"
          due_date?: string | null
          assigned_to?: string | null
          team_id?: string | null
          loft_id?: string | null
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_loft_id_fkey"
            columns: ["loft_id"]
            referencedRelation: "lofts"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_methods: {
        Row: {
          id: string
          name: string
          type: string | null
          details: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string | null
          details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string | null
          details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id?: string
          created_at?: string
        }
        Update: {
          id?: string
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          sender_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          participant_id: string
        }
        Insert: {
          conversation_id?: string
          participant_id?: string
        }
        Update: {
          conversation_id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_participant_id_fkey"
            columns: ["participant_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_loft_revenue: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          revenue: number
          expenses: number
          net_profit: number
        }[]
      }
      calculate_monthly_revenue: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          revenue: number
          expenses: number
        }[]
      }
      user_role: {
        Args: Record<PropertyKey, never>
        Returns: UserRole
      }
    }
    Enums: {
      user_role: "admin" | "manager" | "member"
      loft_status: "available" | "occupied" | "maintenance"
      loft_ownership: "company" | "third_party"
      task_status: "todo" | "in_progress" | "completed"
      transaction_type: "income" | "expense"
      transaction_status: "pending" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type User = Database["public"]["Tables"]["profiles"]["Row"]
export type UserRole = Database["public"]["Enums"]["user_role"]
export type AuthSession = {
  user: {
    id: string
    email: string | null
    full_name: string | null
    avatar_url?: string | null
    role: string
    created_at: string
    updated_at: string | null
  }
  token: string
}
export type Loft = Database["public"]["Tables"]["lofts"]["Row"]
export type LoftStatus = Database["public"]["Enums"]["loft_status"]
export type LoftOwner = Database["public"]["Tables"]["loft_owners"]["Row"]
export type LoftOwnership = Database["public"]["Enums"]["loft_ownership"]
export type TaskStatus = Database["public"]["Enums"]["task_status"]
export type TransactionType = Database["public"]["Enums"]["transaction_type"]
export type TransactionStatus = Database["public"]["Enums"]["transaction_status"]
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
export type Currency = Database["public"]["Tables"]["currencies"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"]
export type Conversation = {
  id: string;
  name: string;
  latestMessage: string;
};

export type Message = {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
};
