export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          date: string
          trial_date: string
          delivery_date: string
          dob: string | null
          notes: string | null
          selected_garments: string[] | null
          shirt_length: number | null
          shirt_shoulder: number | null
          shirt_astin: number | null
          shirt_cuff: number | null
          shirt_chest: number | null
          shirt_waist: number | null
          shirt_seat: number | null
          shirt_collar: number | null
          pant_length: number | null
          pant_knee: number | null
          pant_fork: number | null
          pant_waist: number | null
          pant_hip: number | null
          pant_thigh: number | null
          pant_bottom: number | null
          coat_length: number | null
          coat_shoulder: number | null
          coat_astin: number | null
          coat_cuff: number | null
          coat_chest: number | null
          coat_waist: number | null
          coat_seat: number | null
          coat_collar: number | null
          kurta_length: number | null
          kurta_shoulder: number | null
          kurta_astin: number | null
          kurta_cuff: number | null
          kurta_chest: number | null
          kurta_waist: number | null
          kurta_seat: number | null
          kurta_collar: number | null
          pyjama_length: number | null
          pyjama_knee: number | null
          pyjama_fork: number | null
          pyjama_waist: number | null
          pyjama_hip: number | null
          pyjama_thigh: number | null
          pyjama_bottom: number | null
          modi_length: number | null
          modi_shoulder: number | null
          modi_astin: number | null
          modi_cuff: number | null
          modi_chest: number | null
          modi_waist: number | null
          modi_seat: number | null
          modi_collar: number | null
          safari_length: number | null
          safari_shoulder: number | null
          safari_astin: number | null
          safari_cuff: number | null
          safari_chest: number | null
          safari_waist: number | null
          safari_seat: number | null
          safari_collar: number | null
          jodhpuri_length: number | null
          jodhpuri_shoulder: number | null
          jodhpuri_astin: number | null
          jodhpuri_cuff: number | null
          jodhpuri_chest: number | null
          jodhpuri_waist: number | null
          jodhpuri_seat: number | null
          jodhpuri_collar: number | null
          recorded_by: string | null
          is_delivered: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          date: string
          trial_date: string
          delivery_date: string
          dob?: string | null
          notes?: string | null
          selected_garments?: string[] | null
          shirt_length?: number | null
          shirt_shoulder?: number | null
          shirt_astin?: number | null
          shirt_cuff?: number | null
          shirt_chest?: number | null
          shirt_waist?: number | null
          shirt_seat?: number | null
          shirt_collar?: number | null
          pant_length?: number | null
          pant_knee?: number | null
          pant_fork?: number | null
          pant_waist?: number | null
          pant_hip?: number | null
          pant_thigh?: number | null
          pant_bottom?: number | null
          coat_length?: number | null
          coat_shoulder?: number | null
          coat_astin?: number | null
          coat_cuff?: number | null
          coat_chest?: number | null
          coat_waist?: number | null
          coat_seat?: number | null
          coat_collar?: number | null
          kurta_length?: number | null
          kurta_shoulder?: number | null
          kurta_astin?: number | null
          kurta_cuff?: number | null
          kurta_chest?: number | null
          kurta_waist?: number | null
          kurta_seat?: number | null
          kurta_collar?: number | null
          pyjama_length?: number | null
          pyjama_knee?: number | null
          pyjama_fork?: number | null
          pyjama_waist?: number | null
          pyjama_hip?: number | null
          pyjama_thigh?: number | null
          pyjama_bottom?: number | null
          modi_length?: number | null
          modi_shoulder?: number | null
          modi_astin?: number | null
          modi_cuff?: number | null
          modi_chest?: number | null
          modi_waist?: number | null
          modi_seat?: number | null
          modi_collar?: number | null
          safari_length?: number | null
          safari_shoulder?: number | null
          safari_astin?: number | null
          safari_cuff?: number | null
          safari_chest?: number | null
          safari_waist?: number | null
          safari_seat?: number | null
          safari_collar?: number | null
          jodhpuri_length?: number | null
          jodhpuri_shoulder?: number | null
          jodhpuri_astin?: number | null
          jodhpuri_cuff?: number | null
          jodhpuri_chest?: number | null
          jodhpuri_waist?: number | null
          jodhpuri_seat?: number | null
          jodhpuri_collar?: number | null
          recorded_by?: string | null
          is_delivered?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          date?: string
          trial_date?: string
          delivery_date?: string
          dob?: string | null
          notes?: string | null
          selected_garments?: string[] | null
          shirt_length?: number | null
          shirt_shoulder?: number | null
          shirt_astin?: number | null
          shirt_cuff?: number | null
          shirt_chest?: number | null
          shirt_waist?: number | null
          shirt_seat?: number | null
          shirt_collar?: number | null
          pant_length?: number | null
          pant_knee?: number | null
          pant_fork?: number | null
          pant_waist?: number | null
          pant_hip?: number | null
          pant_thigh?: number | null
          pant_bottom?: number | null
          coat_length?: number | null
          coat_shoulder?: number | null
          coat_astin?: number | null
          coat_cuff?: number | null
          coat_chest?: number | null
          coat_waist?: number | null
          coat_seat?: number | null
          coat_collar?: number | null
          kurta_length?: number | null
          kurta_shoulder?: number | null
          kurta_astin?: number | null
          kurta_cuff?: number | null
          kurta_chest?: number | null
          kurta_waist?: number | null
          kurta_seat?: number | null
          kurta_collar?: number | null
          pyjama_length?: number | null
          pyjama_knee?: number | null
          pyjama_fork?: number | null
          pyjama_waist?: number | null
          pyjama_hip?: number | null
          pyjama_thigh?: number | null
          pyjama_bottom?: number | null
          modi_length?: number | null
          modi_shoulder?: number | null
          modi_astin?: number | null
          modi_cuff?: number | null
          modi_chest?: number | null
          modi_waist?: number | null
          modi_seat?: number | null
          modi_collar?: number | null
          safari_length?: number | null
          safari_shoulder?: number | null
          safari_astin?: number | null
          safari_cuff?: number | null
          safari_chest?: number | null
          safari_waist?: number | null
          safari_seat?: number | null
          safari_collar?: number | null
          jodhpuri_length?: number | null
          jodhpuri_shoulder?: number | null
          jodhpuri_astin?: number | null
          jodhpuri_cuff?: number | null
          jodhpuri_chest?: number | null
          jodhpuri_waist?: number | null
          jodhpuri_seat?: number | null
          jodhpuri_collar?: number | null
          recorded_by?: string | null
          is_delivered?: boolean | null
          created_at?: string
          updated_at?: string
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