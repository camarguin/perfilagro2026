
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, Building2, Tractor, Wheat, Factory, Briefcase } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

import { PageHeader } from "@/components/ui/page-header";

export default function CompaniesPage() {
    const sectors = [
        { icon: Tractor, label: "Fazendas e produtores rurais" },
        { icon: Users, label: "Cooperativas" }, // Using Users from lucide-react (need to import)
        { icon: Factory, label: "Agroindústrias" },
        { icon: Wheat, label: "Empresas de insumos agrícolas" },
        { icon: Briefcase, label: "Empresas de serviços do agro" }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <PageHeader
                title="Soluções sob medida para empresas do Agronegócio"
                description="Entendemos a realidade do seu negócio para entregar profissionais alinhados e resultados consistentes."
                badge="Parceiro Estratégico"
                imageSrc="https://images.unsplash.com/photo-1605000797499-95a053545e21?q=80&w=2070&auto=format&fit=crop"
            />

            {/* Main Content */}
            <section className="py-20 md:py-28 relative -mt-20">
                <div className="container mx-auto px-4">
                    <div className="bg-background rounded-[2rem] shadow-2xl p-8 md:p-12 max-w-5xl mx-auto border border-border/50">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                                        Quem Atendemos
                                    </h2>
                                    <p className="text-muted-foreground text-lg">
                                        Nossa expertise cobre toda a cadeia produtiva do agro, oferecendo suporte especializado para:
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    {sectors.map((sector, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/40 hover:bg-muted/50 transition-colors">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <sector.icon className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-foreground">{sector.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-4 bg-secondary/20 rounded-3xl rotate-2 blur-xl"></div>
                                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] md:aspect-auto md:h-full min-h-[400px]">
                                    {/* Placeholder image */}
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-white">
                                                <p className="font-medium text-lg mb-2">"Trabalhamos de forma próxima, como uma extensão do seu RH."</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits/Philosophy Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12">Por que escolher a Perfil Agro?</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "Especialização", description: "Foco 100% no agronegócio e suas particularidades." },
                            { title: "Assertividade", description: "Metodologia validada para encontrar o perfil ideal." },
                            { title: "Parceria", description: "Atuação consultiva e próxima do cliente." }
                        ].map((item, i) => (
                            <Card key={i} className="bg-background border-none shadow-lg">
                                <CardContent className="pt-6">
                                    <h3 className="font-bold text-xl mb-3 text-primary">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595837248368-7c8704259b3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>

                        <div className="relative z-10 max-w-3xl">
                            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Vamos montar o time ideal para sua empresa crescer?
                            </h2>
                            <p className="text-primary-foreground/90 text-xl mb-10">
                                Solicite uma proposta personalizada e descubra como podemos ajudar.
                            </p>
                            <Link href="/contato">
                                <Button size="xl" variant="secondary" className="px-12 h-16 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                                    Solicitar Proposta
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

// Helper component for Icon (since Users wasn't imported in top scope in my previous thought process, but I can add it now)
import { Users } from "lucide-react";
