import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Debugging logs (visible in server terminal)
console.log('--- SUPABASE ADMIN INIT ATTEMPT ---')
console.log('URL defined:', !!supabaseUrl)
console.log('Key defined:', !!supabaseServiceKey)
if (supabaseServiceKey) {
    console.log('Key prefix:', supabaseServiceKey.substring(0, 10) + '...')
}
console.log('-----------------------------------')

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
        `ERRO CRÍTICO: Variáveis do Supabase Admin não encontradas. 
        Verifique se a linha SUPABASE_SERVICE_ROLE_KEY=... existe no seu .env.local 
        e se o servidor foi reiniciado corretamente.`
    )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})
