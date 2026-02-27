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
          shirt_length: string | null
          shirt_shoulder: string | null
          shirt_astin: string | null
          shirt_cuff: string | null
          shirt_chest: string | null
          shirt_waist: string | null
          shirt_seat: string | null
          shirt_collar: string | null
          pant_length: string | null
          pant_knee: string | null
          pant_fork: string | null
          pant_waist: string | null
          pant_hip: string | null
          pant_thigh: string | null
          pant_bottom: string | null
          coat_length: string | null
          coat_shoulder: string | null
          coat_astin: string | null
          coat_cuff: string | null
          coat_chest: string | null
          coat_waist: string | null
          coat_seat: string | null
          coat_collar: string | null
          kurta_length: string | null
          kurta_shoulder: string | null
          kurta_astin: string | null
          kurta_cuff: string | null
          kurta_chest: string | null
          kurta_waist: string | null
          kurta_seat: string | null
          kurta_collar: string | null
          pyjama_length: string | null
          pyjama_knee: string | null
          pyjama_fork: string | null
          pyjama_waist: string | null
          pyjama_hip: string | null
          pyjama_thigh: string | null
          pyjama_bottom: string | null
          modi_length: string | null
          modi_shoulder: string | null
          modi_astin: string | null
          modi_cuff: string | null
          modi_chest: string | null
          modi_waist: string | null
          modi_seat: string | null
          modi_collar: string | null
          safari_length: string | null
          safari_shoulder: string | null
          safari_astin: string | null
          safari_cuff: string | null
          safari_chest: string | null
          safari_waist: string | null
          safari_seat: string | null
          safari_collar: string | null
          jodhpuri_length: string | null
          jodhpuri_shoulder: string | null
          jodhpuri_astin: string | null
          jodhpuri_cuff: string | null
          jodhpuri_chest: string | null
          jodhpuri_waist: string | null
          jodhpuri_seat: string | null
          jodhpuri_collar: string | null
          recorded_by: string | null
          is_delivered: boolean | null
          is_trialed: boolean | null
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
          shirt_length?: string | null
          shirt_shoulder?: string | null
          shirt_astin?: string | null
          shirt_cuff?: string | null
          shirt_chest?: string | null
          shirt_waist?: string | null
          shirt_seat?: string | null
          shirt_collar?: string | null
          pant_length?: string | null
          pant_knee?: string | null
          pant_fork?: string | null
          pant_waist?: string | null
          pant_hip?: string | null
          pant_thigh?: string | null
          pant_bottom?: string | null
          coat_length?: string | null
          coat_shoulder?: string | null
          coat_astin?: string | null
          coat_cuff?: string | null
          coat_chest?: string | null
          coat_waist?: string | null
          coat_seat?: string | null
          coat_collar?: string | null
          kurta_length?: string | null
          kurta_shoulder?: string | null
          kurta_astin?: string | null
          kurta_cuff?: string | null
          kurta_chest?: string | null
          kurta_waist?: string | null
          kurta_seat?: string | null
          kurta_collar?: string | null
          pyjama_length?: string | null
          pyjama_knee?: string | null
          pyjama_fork?: string | null
          pyjama_waist?: string | null
          pyjama_hip?: string | null
          pyjama_thigh?: string | null
          pyjama_bottom?: string | null
          modi_length?: string | null
          modi_shoulder?: string | null
          modi_astin?: string | null
          modi_cuff?: string | null
          modi_chest?: string | null
          modi_waist?: string | null
          modi_seat?: string | null
          modi_collar?: string | null
          safari_length?: string | null
          safari_shoulder?: string | null
          safari_astin?: string | null
          safari_cuff?: string | null
          safari_chest?: string | null
          safari_waist?: string | null
          safari_seat?: string | null
          safari_collar?: string | null
          jodhpuri_length?: string | null
          jodhpuri_shoulder?: string | null
          jodhpuri_astin?: string | null
          jodhpuri_cuff?: string | null
          jodhpuri_chest?: string | null
          jodhpuri_waist?: string | null
          jodhpuri_seat?: string | null
          jodhpuri_collar?: string | null
          recorded_by?: string | null
          is_delivered?: boolean | null
          is_trialed?: boolean | null
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
          shirt_length?: string | null
          shirt_shoulder?: string | null
          shirt_astin?: string | null
          shirt_cuff?: string | null
          shirt_chest?: string | null
          shirt_waist?: string | null
          shirt_seat?: string | null
          shirt_collar?: string | null
          pant_length?: string | null
          pant_knee?: string | null
          pant_fork?: string | null
          pant_waist?: string | null
          pant_hip?: string | null
          pant_thigh?: string | null
          pant_bottom?: string | null
          coat_length?: string | null
          coat_shoulder?: string | null
          coat_astin?: string | null
          coat_cuff?: string | null
          coat_chest?: string | null
          coat_waist?: string | null
          coat_seat?: string | null
          coat_collar?: string | null
          kurta_length?: string | null
          kurta_shoulder?: string | null
          kurta_astin?: string | null
          kurta_cuff?: string | null
          kurta_chest?: string | null
          kurta_waist?: string | null
          kurta_seat?: string | null
          kurta_collar?: string | null
          pyjama_length?: string | null
          pyjama_knee?: string | null
          pyjama_fork?: string | null
          pyjama_waist?: string | null
          pyjama_hip?: string | null
          pyjama_thigh?: string | null
          pyjama_bottom?: string | null
          modi_length?: string | null
          modi_shoulder?: string | null
          modi_astin?: string | null
          modi_cuff?: string | null
          modi_chest?: string | null
          modi_waist?: string | null
          modi_seat?: string | null
          modi_collar?: string | null
          safari_length?: string | null
          safari_shoulder?: string | null
          safari_astin?: string | null
          safari_cuff?: string | null
          safari_chest?: string | null
          safari_waist?: string | null
          safari_seat?: string | null
          safari_collar?: string | null
          jodhpuri_length?: string | null
          jodhpuri_shoulder?: string | null
          jodhpuri_astin?: string | null
          jodhpuri_cuff?: string | null
          jodhpuri_chest?: string | null
          jodhpuri_waist?: string | null
          jodhpuri_seat?: string | null
          jodhpuri_collar?: string | null
          recorded_by?: string | null
          is_delivered?: boolean | null
          is_trialed?: boolean | null
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