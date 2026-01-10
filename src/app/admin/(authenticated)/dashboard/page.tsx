import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileText, CheckCircle } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">Dashboard Geral</h1>
                <p className="text-muted-foreground font-medium">Bem-vindo ao centro de comando do Perfil Agro.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Vagas Ativas", value: "12", growth: "+2 novas", icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
                    { title: "Candidatos", value: "2,350", growth: "+180 mês", icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
                    { title: "Currículos", value: "5,200", growth: "Banco total", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
                    { title: "Aplicações", value: "45", growth: "+12% hoje", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
                ].map((stat, i) => (
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
                            {[
                                { title: "Gerente de Fazenda", loc: "Sorriso/MT", date: "Há 2 horas" },
                                { title: "Agrônomo de Vendas", loc: "Primavera/MT", date: "Há 5 horas" },
                                { title: "Operador de Máquinas", loc: "Rio Verde/GO", date: "Ontem" },
                            ].map((job, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/30 transition-colors group">
                                    <div>
                                        <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</div>
                                        <div className="text-xs text-muted-foreground font-medium">{job.loc}</div>
                                    </div>
                                    <div className="text-[10px] font-black uppercase text-gray-300">{job.date}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-xl rounded-[2.5rem] ring-1 ring-black/5 bg-white overflow-hidden">
                    <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                            <div className="h-6 w-1 bg-secondary rounded-full" />
                            Logs Recentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-6">
                            {[
                                "Novo candidato cadastrado há 5 min.",
                                "Vaga #123 atualizada por Admin.",
                                "Exportação de dados concluída.",
                                "Backup do banco realizado."
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                                    <p className="text-sm font-medium text-gray-500 leading-tight">{log}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}
