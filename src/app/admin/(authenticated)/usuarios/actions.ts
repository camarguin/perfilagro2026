'use server'

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function inviteAdmin(email: string) {
    if (!email) {
        return { error: "Email é obrigatório" }
    }

    try {
        // 1. Invite the user via Supabase Auth Admin API
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/definir-senha`,
        })

        if (inviteError) {
            // If user already exists in Auth, we might still want to add them to user_roles
            if (inviteError.message.includes("already has an account")) {
                console.log("User already exists in Auth, proceeding to role assignment")
            } else {
                throw inviteError
            }
        }

        // 2. Add to user_roles table
        // We look for the user ID if they already exist, otherwise it will be updated later when they log in
        const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .upsert({
                email: email,
                role: 'admin',
                user_id: inviteData?.user?.id || null
            }, { onConflict: 'email' })

        if (roleError) throw roleError

        revalidatePath('/admin/usuarios')
        return { success: true }
    } catch (error: any) {
        console.error("Error in inviteAdmin:", error)
        return { error: error.message || "Erro ao convidar administrador" }
    }
}
