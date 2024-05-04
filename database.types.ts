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
      invoice_items: {
        Row: {
          invoice_id: number
          item_id: number
          quantity: number
          supply_id: number
        }
        Insert: {
          invoice_id: number
          item_id?: number
          quantity?: number
          supply_id: number
        }
        Update: {
          invoice_id?: number
          item_id?: number
          quantity?: number
          supply_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'invoice_items_invoice_id_fkey'
            columns: ['invoice_id']
            isOneToOne: false
            referencedRelation: 'invoices'
            referencedColumns: ['invoice_id']
          },
          {
            foreignKeyName: 'invoice_items_supply_id_fkey'
            columns: ['supply_id']
            isOneToOne: false
            referencedRelation: 'supply_items'
            referencedColumns: ['supply_id']
          },
        ]
      }
      invoices: {
        Row: {
          invoice_id: number
          invoice_month: string
          last_modified: string
          management_fee: number
          property_id: number
          total: number
        }
        Insert: {
          invoice_id?: number
          invoice_month: string
          last_modified?: string
          management_fee: number
          property_id: number
          total?: number
        }
        Update: {
          invoice_id?: number
          invoice_month?: string
          last_modified?: string
          management_fee?: number
          property_id?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_property_id_fkey'
            columns: ['property_id']
            isOneToOne: false
            referencedRelation: 'properties'
            referencedColumns: ['property_id']
          },
        ]
      }
      owners: {
        Row: {
          email: string
          name: string
          owner_id: number
          phone_number: string | null
        }
        Insert: {
          email?: string
          name?: string
          owner_id?: number
          phone_number?: string | null
        }
        Update: {
          email?: string
          name?: string
          owner_id?: number
          phone_number?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          name: string
          owner_id: number | null
          property_id: number
        }
        Insert: {
          address?: string
          name?: string
          owner_id?: number | null
          property_id?: number
        }
        Update: {
          address?: string
          name?: string
          owner_id?: number | null
          property_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'properties_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'owners'
            referencedColumns: ['owner_id']
          },
        ]
      }
      supply_items: {
        Row: {
          link: string | null
          multiplier: number
          name: string
          price: number
          qty_per_package: number
          supply_id: number
        }
        Insert: {
          link?: string | null
          multiplier?: number
          name: string
          price: number
          qty_per_package: number
          supply_id?: number
        }
        Update: {
          link?: string | null
          multiplier?: number
          name?: string
          price?: number
          qty_per_package?: number
          supply_id?: number
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
