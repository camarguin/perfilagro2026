"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    FileText,
    Settings,
    LogOut,
    Sprout
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="hidden h-screen w-64 flex-col border-r bg-sidebar md:flex">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                        <Sprout className="h-5 w-5 text-sidebar-primary-foreground" />
                    </div>
                    <span className="font-heading text-lg font-bold text-sidebar-foreground">Admin</span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-6 px-4">
                <nav className="space-y-2">
                    <Link href="/admin/dashboard" className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/vagas" className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Briefcase className="h-4 w-4" />
                            Vagas
                        </Button>
                    </Link>
                    <Link href="/admin/candidatos" className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Users className="h-4 w-4" />
                            Candidatos
                        </Button>
                    </Link>
                    <Link href="/admin/usuarios" className="block">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Users className="h-4 w-4" />
                            Usuários
                        </Button>
                    </Link>
                </nav>

                <div className="mt-8">
                    <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Configurações</h4>
                    <div className="space-y-2">
                        <Link href="/admin/settings" className="block">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Settings className="h-4 w-4" />
                                Ajustes
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t p-4">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={async () => {
                        await supabase.auth.signOut();
                        router.push("/admin/login");
                    }}
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </Button>
            </div>
        </div>
    );
}
