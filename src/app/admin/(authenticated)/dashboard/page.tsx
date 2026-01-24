'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileText, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any[]>([]);
    const [recentJobs, setRecentJobs] = useState<any[]>([]);
    const [recentCandidates, setRecentCandidates] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    { count: activeJobsCount },
                    { count: totalCandidatesCount },
                    { count: totalResumesCount },
                    { count: recentApplicationsCount },
                    { data: jobsData },
                    { data: candidatesData }
                ] = await Promise.all([
                    supabase.from('jobs').select('*', { count: 'exact' }).eq('status', 'active').limit(0),
                    supabase.from('candidates').select('*', { count: 'exact' }).eq('is_archived', false).limit(0),
                    supabase.from('candidates').select('*', { count: 'exact' }).eq('is_archived', false).limit(0),
                    supabase.from('candidates').select('*', { count: 'exact' }).eq('is_archived', false).gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).limit(0),
                    supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(5),
                    supabase.from('candidates').select('*').eq('is_archived', false).order('created_at', { ascending: false }).limit(5)
                ]);

                setStats([
                    { title: "Vagas Ativas", value: activeJobsCount || 0, growth: "Em tempo real", icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
                    { title: "Candidatos", value: totalCandidatesCount || 0, growth: "Banco total", icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
                    { title: "Currículos", value: totalResumesCount || 0, growth: "Arquivos PDF", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
                    { title: "Aplicações", value: recentApplicationsCount || 0, growth: "Últimas 24h", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
                ]);
                setRecentJobs(jobsData || []);
                setRecentCandidates(candidatesData || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">Dashboard Geral</h1>
                <p className="text-muted-foreground font-medium">Bem-vindo ao centro de comando do Perfil Agro.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl rounded-[2rem] ring-1 ring-black/5 bg-white group hover:scale-105 transition-transform duration-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-gray-900 leading-none">{stat.value}</div>
                            <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-tighter">
                                {stat.growth}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <Card className="col-span-4 border-none shadow-xl rounded-[2.5rem] ring-1 ring-black/5 bg-white overflow-hidden">
                    <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="h-6 w-1 bg-primary rounded-full" />
                            Últimas Vagas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-4">
                            {!recentJobs || recentJobs.length === 0 ? (
                                <p className="text-muted-foreground text-sm py-4">Nenhuma vaga cadastrada.</p>
                            ) : recentJobs.map((job) => (
                                <div key={job.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors group">
                                    <div>
                                        <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</div>
                                        <div className="text-xs text-muted-foreground font-medium">{job.location}</div>
                                    </div>
                                    <div className="text-[10px] font-black uppercase text-gray-300">
                                        {new Date(job.created_at).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-xl rounded-[2.5rem] ring-1 ring-black/5 bg-white overflow-hidden">
                    <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="h-6 w-1 bg-secondary rounded-full" />
                            Aplicações Recentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {!recentCandidates || recentCandidates.length === 0 ? (
                                <p className="text-muted-foreground text-sm py-4">Nenhuma aplicação recente.</p>
                            ) : recentCandidates.map((candidate) => (
                                <div key={candidate.id} className="flex gap-4 items-start border-l-2 border-secondary/20 pl-4 py-1">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 leading-tight">{candidate.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">
                                            {new Date(candidate.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
