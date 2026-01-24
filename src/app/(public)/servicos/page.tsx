
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, Target, Search, FileText, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/ui/page-header";

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <PageHeader
                title="Soluções completas para o Agro"
                description="Da contratação à gestão, oferecemos o suporte que sua empresa precisa."
                badge="Nossos Serviços"
                imageSrc="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2070&auto=format&fit=crop"
            />
            {/* Recruitment & Selection */}
            <section className="py-20 md:py-28 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute -inset-4 bg-secondary/20 rounded-3xl -rotate-2 blur-xl"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                                {/* Placeholder for Recruitment Image - could be a local asset or external */}
                                <div className="aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-8">
                            <div>
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    Recrutamento e Seleção para o Agronegócio
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Processo estratégico e personalizado para vagas operacionais de campo, técnicos, especialistas, administrativos, comerciais e lideranças.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                                    <Target className="h-5 w-5 text-primary" />
                                    Etapas:
                                </h3>
                                <ul className="space-y-2">
                                    {[
                                        'Alinhamento de perfil',
                                        'Divulgação estratégica',
                                        'Triagem/entrevistas',
                                        'Avaliações',
                                        'Apresentação de finalistas',
                                        'Apoio na contratação'
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/40">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4">
                                <Link href="/contato">
                                    <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                                        Solicitar recrutamento
                                    </Button>
                                </Link>
                                <p className="mt-3 text-sm text-muted-foreground italic">
                                    Precisa contratar com segurança e agilidade?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Outras Soluções
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Divulgação de Vagas */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Search className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Divulgação de Vagas do Agro</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-grow">
                                <p className="text-muted-foreground">
                                    Divulgação direcionada via canais estratégicos (Instagram especializado, etc.).
                                </p>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-4 mt-auto">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CTA</p>
                                <p className="text-sm italic text-foreground mb-2">Divulgue sua vaga para quem realmente é do agro.</p>
                                <Link href="/anunciar-vaga" className="w-full">
                                    <Button variant="outline" className="w-full border-2 group-hover:border-primary group-hover:text-primary">
                                        Divulgar uma vaga
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Banco de Currículos */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Banco de Currículos do Agro</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-grow">
                                <p className="text-muted-foreground">
                                    Banco ativo e segmentado para agilizar processos seletivos.
                                </p>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-4 mt-auto">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CTA</p>
                                <p className="text-sm italic text-foreground mb-2">Ganhe tempo na sua contratação.</p>
                                <Link href="/admin/login" className="w-full">
                                    <Button variant="outline" className="w-full border-2 group-hover:border-primary group-hover:text-primary">
                                        Acessar banco de talentos
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Gestão de Terceirização */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">Gestão de Terceirização</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-grow">
                                <p className="text-muted-foreground">
                                    Gestão completa assumindo responsabilidades administrativas, legais e trabalhistas. Gestão de temporários e safristas.
                                </p>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start gap-4 mt-auto">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">CTA</p>
                                <p className="text-sm italic text-foreground mb-2">Deixe a gestão de pessoas com especialistas.</p>
                                <Link href="/contato" className="w-full">
                                    <Button variant="outline" className="w-full border-2 group-hover:border-primary group-hover:text-primary">
                                        Falar sobre terceirização
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
