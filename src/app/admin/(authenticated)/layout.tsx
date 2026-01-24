'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/admin/login");
            } else {
                // Verify if user is in user_roles
                const { data: roleData, error: roleError } = await supabase
                    .from('user_roles')
                    .select('id')
                    .eq('email', session.user.email)
                    .single();

                if (roleError || !roleData) {
                    console.error("Access denied: User not in user_roles");
                    await supabase.auth.signOut();
                    router.push("/admin/login?error=unauthorized");
                    return;
                }
                setIsLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/admin/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium text-gray-500">Verificando sessão...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-muted/10">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="container mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
