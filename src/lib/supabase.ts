import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Provide helpful warning if variables are missing
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase credentials missing. Checklist: .env.local file exists and is populated.')
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
