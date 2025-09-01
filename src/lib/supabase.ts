import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let cachedClient: SupabaseClient | null = null

export const isSupabaseEnabled = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export const getSupabase = (): SupabaseClient => {
  if (!isSupabaseEnabled()) {
    throw new Error('Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  }
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false
      }
    })
  }
  return cachedClient
}


