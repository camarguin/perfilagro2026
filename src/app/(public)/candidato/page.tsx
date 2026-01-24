
import { Metadata } from 'next'
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ChevronRight, Briefcase, TrendingUp, ShieldCheck, Building2 } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
    title: 'Área do Candidato - Perfil Agro',
    description: 'Cadastre seu currículo e conecte-se às melhores oportunidades do agronegócio.',
}

export default function CandidatoPage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            {/* Page Header */}
            <PageHeader
                title="Sua carreira no Agronegócio começa aqui"
                description="Conectamos profissionais qualificados às melhores oportunidades do setor que move o Brasil."
                badge="Para Candidatos"
                imageSrc="https://images.unsplash.com/photo-1595837248368-7c8704259b3f?q=80&w=2070&auto=format&fit=crop"
            />

            {/* Intro & Value Prop */}
            <section className="py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Se você busca uma oportunidade no agro, cadastre seu currículo!
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Se você é profissional do agronegócio e está em busca de uma nova oportunidade, a Perfil Agro conecta você às melhores vagas do setor, tanto para campo quanto para áreas administrativas.
                        </p>
                        <p className="text-lg text-muted-foreground mt-4">
                            Ao cadastrar seu currículo em nosso banco de dados, você passa a fazer parte de processos seletivos conduzidos por especialistas que entendem a realidade do agro.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Briefcase,
                                title: "Vagas Exclusivas",
                                text: "Acesso a oportunidades únicas no setor do agronegócio."
                            },
                            {
                                icon: TrendingUp,
                                title: "Banco Ativo",
                                text: "Seu currículo visível em um banco de talentos atualizado."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Processos Justos",
                                text: "Seleções transparentes e feedback humanizado."
                            },
                            {
                                icon: Building2,
                                title: "Grandes Empresas",
                                text: "Conexão direta com marcas reconhecidas no mercado."
                            }
                        ].map((item, i) => (
                            <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                        <item.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-3 text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-background border-t border-border/50">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>

                        <div className="relative z-10 max-w-3xl">
                            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Dê o próximo passo na sua carreira no agro.
                            </h2>
                            <p className="text-primary-foreground/90 text-xl font-medium mb-10">
                                Cadastre-se gratuitamente e fique visível para as melhores empresas.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <Link href="/candidato/cadastro">
                                    <Button size="xl" variant="secondary" className="px-12 h-16 text-lg font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 w-full sm:w-auto">
                                        Cadastrar Currículo Agora
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/vagas">
                                    <Button size="xl" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white hover:text-primary hover:border-white transition-all w-full sm:w-auto h-16 px-10">
                                        Ver Vagas Abertas
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
