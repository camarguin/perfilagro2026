import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, Calendar, Filter } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function VagasPage() {
    const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            {/* Page Header */}
            <div className="bg-primary pt-24 pb-16 px-4 shadow-md overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
                <div className="container mx-auto relative z-10">
                    <Badge className="mb-4 bg-white/20 text-white border-none px-4 py-1 backdrop-blur-sm">Oportunidades</Badge>
                    <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">Vagas Disponíveis</h1>
                    <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl leading-relaxed">
                        Conecte-se com as empresas que estão moldando o futuro do agronegócio.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12">

                {/* Sidebar Filters */}
                <div className="w-full lg:w-80 space-y-8">
                    <Card className="p-8 border-none shadow-xl bg-white rounded-[2rem] ring-1 ring-black/5">
                        <h3 className="font-heading text-2xl font-bold mb-8 flex items-center gap-3 text-foreground">
                            <span className="h-6 w-1.5 bg-primary rounded-full"></span>
                            Filtros
                        </h3>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Localização</label>
                                <Select>
                                    <SelectTrigger className="bg-muted/50 border-none h-12 text-base font-medium">
                                        <SelectValue placeholder="Todos os estados" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mt">Mato Grosso</SelectItem>
                                        <SelectItem value="go">Goiás</SelectItem>
                                        <SelectItem value="pr">Paraná</SelectItem>
                                        <SelectItem value="mg">Minas Gerais</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tipo de Contrato</label>
                                <Select>
                                    <SelectTrigger className="bg-muted/50 border-none h-12 text-base font-medium">
                                        <SelectValue placeholder="Todos os tipos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CLT">CLT</SelectItem>
                                        <SelectItem value="PJ">PJ</SelectItem>
                                        <SelectItem value="Estágio">Estágio</SelectItem>
                                        <SelectItem value="Temporário">Temporário</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button variant="cta-primary" className="w-full h-14 text-lg">
                                Aplicar Filtros
                            </Button>
                        </div>
                    </Card>

                    <div className="bg-secondary/10 p-8 rounded-[2rem] border border-secondary/20">
                        <h4 className="font-bold text-secondary-foreground mb-4">Dica de Carreira</h4>
                        <p className="text-sm text-secondary-foreground/80 leading-relaxed">
                            Mantenha seu currículo sempre atualizado. Empresas do agro valorizam experiências práticas e certificações técnicas.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-10">
                    {/* Search Bar */}
                    <div className="flex gap-4 bg-white p-4 rounded-[1.5rem] border-none shadow-xl ring-1 ring-black/5 group focus-within:ring-primary/20 transition-all">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-4 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                className="pl-14 h-14 border-none shadow-none focus-visible:ring-0 text-xl placeholder:text-muted-foreground/50 transition-all"
                                placeholder="Cargo, palavra-chave ou empresa..."
                            />
                        </div>
                        <Button variant="cta" className="h-14 px-10 text-lg">
                            Buscar
                        </Button>
                    </div>

                    {!jobs || jobs.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center shadow-xl border-2 border-dashed border-muted/50">
                            <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="h-10 w-10 text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">Nenhuma vaga encontrada</h3>
                            <p className="text-muted-foreground mt-3 text-lg max-w-sm mx-auto leading-relaxed">Não encontramos vagas com os critérios selecionados no momento. Tente expandir sua busca.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {jobs.map((job, index) => (
                                <Card key={job.id} className="group hover:scale-[1.02] transition-all duration-500 border-none shadow-xl hover:shadow-2xl bg-white overflow-hidden ring-1 ring-black/5 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                                    <CardHeader className="p-8 pb-4">
                                        <div className="flex justify-between items-start mb-6">
                                            <Badge className="bg-primary/5 text-primary border-none font-bold px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                                                {job.type}
                                            </Badge>
                                            <span className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(job.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <h3 className="font-heading font-black text-2xl text-foreground group-hover:text-primary transition-colors mb-4 leading-tight">
                                            {job.title}
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="px-8 py-2 space-y-6">
                                        <div className="flex items-center text-foreground font-bold text-sm bg-muted/30 w-fit px-4 py-2 rounded-xl">
                                            <MapPin className="h-4 w-4 mr-3 text-primary" />
                                            {job.location}
                                        </div>

                                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                            {job.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-8 pt-6">
                                        <Link href={`/vagas/${job.id}`} className="w-full">
                                            <Button variant="outline" className="w-full h-14 py-4 text-base tracking-bold border-2 rounded-2xl group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                                                Ver Detalhes da Vaga
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
