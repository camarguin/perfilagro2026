import { createClient } from '@/lib/supabase/client'

// Use the SSR-compatible browser client creator
// This exported instance should only be used in Client Components.
// For Server Components/Actions, use createClient from @/lib/supabase/server
export const supabase = createClient()
