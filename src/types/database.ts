
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  "public": {
          Tables: {
            "application_status_history": {
                  Row: {
                    "actor_role": Database["public"]['Enums']["user_role"] | null,"application_id": string,"created_at": string,"from_status": Database["public"]['Enums']["application_status"] | null,"id": number,"note": string | null,"to_status": Database["public"]['Enums']["application_status"]
                  }
                  ComputedFields: never
                  Insert: {
                    "actor_role"?: Database["public"]['Enums']["user_role"] | null,"application_id": string,"created_at"?: string,"from_status"?: Database["public"]['Enums']["application_status"] | null,"id"?: never,"note"?: string | null,"to_status": Database["public"]['Enums']["application_status"]
                  }
                  Update: {
                    "actor_role"?: Database["public"]['Enums']["user_role"] | null,"application_id"?: string,"created_at"?: string,"from_status"?: Database["public"]['Enums']["application_status"] | null,"id"?: never,"note"?: string | null,"to_status"?: Database["public"]['Enums']["application_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "application_status_history_application_id_fkey"
      columns: ["application_id"]
isOneToOne: false
      referencedRelation: "stand_applications"
      referencedColumns: ["id"]
    }
                  ]
                },"audit_logs": {
                  Row: {
                    "action": string,"actor_user_id": string | null,"created_at": string,"entity_id": string | null,"entity_type": string,"id": number,"new_values": Json | null,"note": string | null,"old_values": Json | null
                  }
                  ComputedFields: never
                  Insert: {
                    "action": string,"actor_user_id"?: string | null,"created_at"?: string,"entity_id"?: string | null,"entity_type": string,"id"?: never,"new_values"?: Json | null,"note"?: string | null,"old_values"?: Json | null
                  }
                  Update: {
                    "action"?: string,"actor_user_id"?: string | null,"created_at"?: string,"entity_id"?: string | null,"entity_type"?: string,"id"?: never,"new_values"?: Json | null,"note"?: string | null,"old_values"?: Json | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "audit_logs_actor_user_id_fkey"
      columns: ["actor_user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"business_profiles": {
                  Row: {
                    "address": string,"business_license_path": string | null,"business_name": string,"category": string,"cover_path": string | null,"created_at": string,"description": string | null,"district": string,"gallery_paths": NonNullable<Json>,"id": string,"instagram": string | null,"is_public": boolean,"logo_path": string | null,"nib": string | null,"products": NonNullable<Json>,"regency": string,"show_whatsapp": boolean,"slug": string,"updated_at": string,"user_id": string,"verification_note": string | null,"verification_status": Database["public"]['Enums']["verification_status"],"verified_at": string | null,"village": string | null,"whatsapp": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string,"business_license_path"?: string | null,"business_name": string,"category"?: string,"cover_path"?: string | null,"created_at"?: string,"description"?: string | null,"district"?: string,"gallery_paths"?: NonNullable<Json>,"id"?: string,"instagram"?: string | null,"is_public"?: boolean,"logo_path"?: string | null,"nib"?: string | null,"products"?: NonNullable<Json>,"regency"?: string,"show_whatsapp"?: boolean,"slug": string,"updated_at"?: string,"user_id": string,"verification_note"?: string | null,"verification_status"?: Database["public"]['Enums']["verification_status"],"verified_at"?: string | null,"village"?: string | null,"whatsapp"?: string
                  }
                  Update: {
                    "address"?: string,"business_license_path"?: string | null,"business_name"?: string,"category"?: string,"cover_path"?: string | null,"created_at"?: string,"description"?: string | null,"district"?: string,"gallery_paths"?: NonNullable<Json>,"id"?: string,"instagram"?: string | null,"is_public"?: boolean,"logo_path"?: string | null,"nib"?: string | null,"products"?: NonNullable<Json>,"regency"?: string,"show_whatsapp"?: boolean,"slug"?: string,"updated_at"?: string,"user_id"?: string,"verification_note"?: string | null,"verification_status"?: Database["public"]['Enums']["verification_status"],"verified_at"?: string | null,"village"?: string | null,"whatsapp"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "business_profiles_user_id_fkey"
      columns: ["user_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"event_categories": {
                  Row: {
                    "created_at": string,"id": string,"is_active": boolean,"kind": Database["public"]['Enums']["category_kind"],"name": string,"slug": string,"sort_order": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"is_active"?: boolean,"kind"?: Database["public"]['Enums']["category_kind"],"name": string,"slug": string,"sort_order"?: number
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"is_active"?: boolean,"kind"?: Database["public"]['Enums']["category_kind"],"name"?: string,"slug"?: string,"sort_order"?: number
                  }
                  Relationships: [
                    
                  ]
                },"events": {
                  Row: {
                    "address": string,"category": string,"contact_name": string | null,"contact_phone": string | null,"cover_path": string | null,"created_at": string,"criteria": NonNullable<Json>,"description": string,"district": string | null,"ends_at": string,"gallery_paths": NonNullable<Json>,"id": string,"organizer_id": string,"proposal_path": string | null,"published_at": string | null,"registration_closes_at": string,"registration_opens_at": string,"review_note": string | null,"reviewed_at": string | null,"reviewed_by": string | null,"slug": string,"stand_capacity": number,"stand_fee": number,"starts_at": string,"status": Database["public"]['Enums']["event_status"],"summary": string,"title": string,"updated_at": string,"venue_name": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address": string,"category": string,"contact_name"?: string | null,"contact_phone"?: string | null,"cover_path"?: string | null,"created_at"?: string,"criteria"?: NonNullable<Json>,"description": string,"district"?: string | null,"ends_at": string,"gallery_paths"?: NonNullable<Json>,"id"?: string,"organizer_id": string,"proposal_path"?: string | null,"published_at"?: string | null,"registration_closes_at": string,"registration_opens_at": string,"review_note"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"slug": string,"stand_capacity": number,"stand_fee"?: number,"starts_at": string,"status"?: Database["public"]['Enums']["event_status"],"summary": string,"title": string,"updated_at"?: string,"venue_name": string
                  }
                  Update: {
                    "address"?: string,"category"?: string,"contact_name"?: string | null,"contact_phone"?: string | null,"cover_path"?: string | null,"created_at"?: string,"criteria"?: NonNullable<Json>,"description"?: string,"district"?: string | null,"ends_at"?: string,"gallery_paths"?: NonNullable<Json>,"id"?: string,"organizer_id"?: string,"proposal_path"?: string | null,"published_at"?: string | null,"registration_closes_at"?: string,"registration_opens_at"?: string,"review_note"?: string | null,"reviewed_at"?: string | null,"reviewed_by"?: string | null,"slug"?: string,"stand_capacity"?: number,"stand_fee"?: number,"starts_at"?: string,"status"?: Database["public"]['Enums']["event_status"],"summary"?: string,"title"?: string,"updated_at"?: string,"venue_name"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "events_organizer_id_fkey"
      columns: ["organizer_id"]
isOneToOne: false
      referencedRelation: "organizer_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "events_reviewed_by_fkey"
      columns: ["reviewed_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "created_at": string,"href": string | null,"id": string,"message": string,"read_at": string | null,"title": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"href"?: string | null,"id"?: string,"message": string,"read_at"?: string | null,"title": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"href"?: string | null,"id"?: string,"message"?: string,"read_at"?: string | null,"title"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"organizer_profiles": {
                  Row: {
                    "address": string,"bank_account_holder": string | null,"bank_account_number": string | null,"bank_name": string | null,"contact_phone": string,"created_at": string,"description": string | null,"district": string | null,"id": string,"legal_document_path": string | null,"organization_name": string,"organization_type": Database["public"]['Enums']["organization_type"],"updated_at": string,"user_id": string,"verification_note": string | null,"verification_status": Database["public"]['Enums']["verification_status"],"verified_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "address"?: string,"bank_account_holder"?: string | null,"bank_account_number"?: string | null,"bank_name"?: string | null,"contact_phone"?: string,"created_at"?: string,"description"?: string | null,"district"?: string | null,"id"?: string,"legal_document_path"?: string | null,"organization_name": string,"organization_type"?: Database["public"]['Enums']["organization_type"],"updated_at"?: string,"user_id": string,"verification_note"?: string | null,"verification_status"?: Database["public"]['Enums']["verification_status"],"verified_at"?: string | null
                  }
                  Update: {
                    "address"?: string,"bank_account_holder"?: string | null,"bank_account_number"?: string | null,"bank_name"?: string | null,"contact_phone"?: string,"created_at"?: string,"description"?: string | null,"district"?: string | null,"id"?: string,"legal_document_path"?: string | null,"organization_name"?: string,"organization_type"?: Database["public"]['Enums']["organization_type"],"updated_at"?: string,"user_id"?: string,"verification_note"?: string | null,"verification_status"?: Database["public"]['Enums']["verification_status"],"verified_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "organizer_profiles_user_id_fkey"
      columns: ["user_id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"platform_settings": {
                  Row: {
                    "is_public": boolean,"key": string,"updated_at": string,"updated_by": string | null,"value": NonNullable<Json>
                  }
                  ComputedFields: never
                  Insert: {
                    "is_public"?: boolean,"key": string,"updated_at"?: string,"updated_by"?: string | null,"value": NonNullable<Json>
                  }
                  Update: {
                    "is_public"?: boolean,"key"?: string,"updated_at"?: string,"updated_by"?: string | null,"value"?: NonNullable<Json>
                  }
                  Relationships: [
                    {
      foreignKeyName: "platform_settings_updated_by_fkey"
      columns: ["updated_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "account_status": Database["public"]['Enums']["account_status"],"created_at": string,"email": string | null,"full_name": string,"id": string,"phone": string | null,"role": Database["public"]['Enums']["user_role"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "account_status"?: Database["public"]['Enums']["account_status"],"created_at"?: string,"email"?: string | null,"full_name"?: string,"id": string,"phone"?: string | null,"role"?: Database["public"]['Enums']["user_role"],"updated_at"?: string
                  }
                  Update: {
                    "account_status"?: Database["public"]['Enums']["account_status"],"created_at"?: string,"email"?: string | null,"full_name"?: string,"id"?: string,"phone"?: string | null,"role"?: Database["public"]['Enums']["user_role"],"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"stand_applications": {
                  Row: {
                    "additional_document_path": string | null,"admin_note": string | null,"application_code": string,"application_note": string | null,"business_profile_id": string,"business_snapshot": NonNullable<Json>,"confirmed_at": string | null,"confirmed_by": string | null,"created_at": string,"event_id": string,"id": string,"organizer_decided_at": string | null,"organizer_decided_by": string | null,"organizer_note": string | null,"payment_amount": number | null,"payment_note": string | null,"payment_proof_path": string | null,"payment_status": Database["public"]['Enums']["payment_status"],"payment_submitted_at": string | null,"payment_verified_at": string | null,"payment_verified_by": string | null,"products_offered": string,"stand_number": string | null,"status": Database["public"]['Enums']["application_status"],"submitted_at": string,"submitted_by": string,"updated_at": string,"verified_at": string | null,"verified_by": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "additional_document_path"?: string | null,"admin_note"?: string | null,"application_code": string,"application_note"?: string | null,"business_profile_id": string,"business_snapshot"?: NonNullable<Json>,"confirmed_at"?: string | null,"confirmed_by"?: string | null,"created_at"?: string,"event_id": string,"id"?: string,"organizer_decided_at"?: string | null,"organizer_decided_by"?: string | null,"organizer_note"?: string | null,"payment_amount"?: number | null,"payment_note"?: string | null,"payment_proof_path"?: string | null,"payment_status"?: Database["public"]['Enums']["payment_status"],"payment_submitted_at"?: string | null,"payment_verified_at"?: string | null,"payment_verified_by"?: string | null,"products_offered": string,"stand_number"?: string | null,"status"?: Database["public"]['Enums']["application_status"],"submitted_at"?: string,"submitted_by": string,"updated_at"?: string,"verified_at"?: string | null,"verified_by"?: string | null
                  }
                  Update: {
                    "additional_document_path"?: string | null,"admin_note"?: string | null,"application_code"?: string,"application_note"?: string | null,"business_profile_id"?: string,"business_snapshot"?: NonNullable<Json>,"confirmed_at"?: string | null,"confirmed_by"?: string | null,"created_at"?: string,"event_id"?: string,"id"?: string,"organizer_decided_at"?: string | null,"organizer_decided_by"?: string | null,"organizer_note"?: string | null,"payment_amount"?: number | null,"payment_note"?: string | null,"payment_proof_path"?: string | null,"payment_status"?: Database["public"]['Enums']["payment_status"],"payment_submitted_at"?: string | null,"payment_verified_at"?: string | null,"payment_verified_by"?: string | null,"products_offered"?: string,"stand_number"?: string | null,"status"?: Database["public"]['Enums']["application_status"],"submitted_at"?: string,"submitted_by"?: string,"updated_at"?: string,"verified_at"?: string | null,"verified_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "stand_applications_business_profile_id_fkey"
      columns: ["business_profile_id"]
isOneToOne: false
      referencedRelation: "business_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stand_applications_business_profile_id_fkey"
      columns: ["business_profile_id"]
isOneToOne: false
      referencedRelation: "public_business_profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stand_applications_confirmed_by_fkey"
      columns: ["confirmed_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stand_applications_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stand_applications_event_id_fkey"
      columns: ["event_id"]
isOneToOne: false
      referencedRelation: "public_events"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stand_applications_organizer_decided_by_fkey"
      columns: ["organizer_decided_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stand_applications_payment_verified_by_fkey"
      columns: ["payment_verified_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stand_applications_submitted_by_fkey"
      columns: ["submitted_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "stand_applications_verified_by_fkey"
      columns: ["verified_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            "public_business_profiles": {
                  Row: {
                    "business_name": string,"category": string,"cover_path": string | null,"created_at": string,"description": string | null,"district": string,"gallery_paths": NonNullable<Json>,"id": string,"instagram": string | null,"logo_path": string | null,"products": NonNullable<Json>,"regency": string,"slug": string,"verified_at": string | null,"village": string | null,"whatsapp": string | null
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                },"public_events": {
                  Row: {
                    "address": string,"category": string,"confirmed_count": number | null,"contact_name": string | null,"contact_phone": string | null,"cover_path": string | null,"criteria": NonNullable<Json>,"description": string,"district": string | null,"ends_at": string,"gallery_paths": NonNullable<Json>,"id": string,"organization_name": string,"organization_type": Database["public"]['Enums']["organization_type"],"published_at": string | null,"registration_closes_at": string,"registration_opens_at": string,"slug": string,"stand_capacity": number,"stand_fee": number,"starts_at": string,"status": Database["public"]['Enums']["event_status"],"summary": string,"title": string,"venue_name": string
                  }
                  ComputedFields: never
                  Relationships: [
                    
                  ]
                }
          }
          Functions: {
            "_app_history":
{ Args: { "p_app": string,"p_from": Database["public"]['Enums']["application_status"],"p_note": string,"p_to": Database["public"]['Enums']["application_status"] }; Returns: undefined
                           },
"_audit":
{ Args: { "p_action": string,"p_entity_id": string,"p_entity_type": string,"p_new": Json,"p_note": string,"p_old": Json }; Returns: undefined
                           },
"_notify":
{ Args: { "p_href": string,"p_message": string,"p_title": string,"p_user": string }; Returns: undefined
                           },
"_notify_admins":
{ Args: { "p_href": string,"p_message": string,"p_title": string }; Returns: undefined
                           },
"_require_active":
{ Args: { "p_role": Database["public"]['Enums']["user_role"] }; Returns: string
                           },
"_require_note":
{ Args: { "p_label": string,"p_note": string }; Returns: string
                           },
"admin_dashboard_stats":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"admin_finalize_application":
{ Args: { "p_action": string,"p_application_id": string,"p_note"?: string,"p_stand_number"?: string }; Returns: undefined
                           },
"admin_review_event":
{ Args: { "p_action": string,"p_event_id": string,"p_note"?: string }; Returns: undefined
                           },
"admin_review_profile":
{ Args: { "p_action": string,"p_kind": string,"p_note"?: string,"p_profile_id": string }; Returns: undefined
                           },
"admin_set_account_status":
{ Args: { "p_note"?: string,"p_status": Database["public"]['Enums']["account_status"],"p_user_id": string }; Returns: undefined
                           },
"admin_verify_application":
{ Args: { "p_action": string,"p_application_id": string,"p_note"?: string }; Returns: undefined
                           },
"can_read_payment_proof":
{ Args: { "p_name": string }; Returns: boolean
                           },
"current_user_role":
{ Args: Record<PropertyKey, never>; Returns: Database["public"]['Enums']["user_role"]
                           },
"get_event_application_counts":
{ Args: { "p_event_id": string }; Returns: {
              "status": Database["public"]['Enums']["application_status"],"total": number
            }[]
                           },
"get_payment_instructions":
{ Args: { "p_application_id": string }; Returns: {
              "amount": number,"bank_account_holder": string,"bank_account_number": string,"bank_name": string,"event_title": string,"organization_name": string
            }[]
                           },
"get_public_stats":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"has_application_for_event":
{ Args: { "p_event_id": string }; Returns: boolean
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"is_api_caller":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"my_organizer_id":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"organizer_decide_application":
{ Args: { "p_application_id": string,"p_decision": string,"p_note"?: string }; Returns: undefined
                           },
"organizer_verify_payment":
{ Args: { "p_action": string,"p_application_id": string,"p_note"?: string }; Returns: undefined
                           },
"owns_event":
{ Args: { "p_event_id": string }; Returns: boolean
                           },
"resubmit_application":
{ Args: { "p_application_id": string,"p_document_path"?: string,"p_note"?: string,"p_products_offered": string }; Returns: undefined
                           },
"slugify":
{ Args: { "v": string }; Returns: string
                           },
"storage_role_can_write":
{ Args: { "p_bucket": string }; Returns: boolean
                           },
"submit_application":
{ Args: { "p_document_path"?: string,"p_event_id": string,"p_note"?: string,"p_products_offered": string }; Returns: string
                           },
"submit_event":
{ Args: { "p_event_id": string }; Returns: undefined
                           },
"submit_payment_proof":
{ Args: { "p_application_id": string,"p_proof_path": string }; Returns: undefined
                           },
"unique_business_slug":
{ Args: { "p_base": string,"p_exclude"?: string }; Returns: string
                           },
"unique_event_slug":
{ Args: { "p_base": string,"p_exclude"?: string }; Returns: string
                           },
"withdraw_application":
{ Args: { "p_application_id": string }; Returns: undefined
                           }
          }
          Enums: {
            "account_status": "pending"|"active"|"suspended","application_status": "submitted"|"under_verification"|"revision_required"|"verified"|"selected_by_organizer"|"waitlisted"|"rejected"|"confirmed"|"withdrawn","category_kind": "event"|"umkm","event_status": "draft"|"pending_review"|"revision_required"|"published"|"rejected"|"cancelled"|"completed","organization_type": "community"|"eo"|"village"|"agency"|"other","payment_status": "not_required"|"unpaid"|"submitted"|"verified"|"rejected","user_role": "umkm"|"organizer"|"admin","verification_status": "pending"|"verified"|"revision_required"|"rejected"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "account_status": ["pending", "active", "suspended"],"application_status": ["submitted", "under_verification", "revision_required", "verified", "selected_by_organizer", "waitlisted", "rejected", "confirmed", "withdrawn"],"category_kind": ["event", "umkm"],"event_status": ["draft", "pending_review", "revision_required", "published", "rejected", "cancelled", "completed"],"organization_type": ["community", "eo", "village", "agency", "other"],"payment_status": ["not_required", "unpaid", "submitted", "verified", "rejected"],"user_role": ["umkm", "organizer", "admin"],"verification_status": ["pending", "verified", "revision_required", "rejected"]
          }
        }
} as const
