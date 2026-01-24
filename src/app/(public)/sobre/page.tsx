import { Metadata } from 'next'
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
    title: 'Sobre a Perfil Agro',
    description: 'Conheça a história e missão da Perfil Agro, conectando talentos ao agronegócio.',
}

export default function SobrePage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            {/* Page Header - Consistent with Vagas and Anunciar Vaga */}
            <PageHeader
                title="Sobre a Perfil Agro"
                description="Conectando empresas do agronegócio a profissionais preparados e alinhados com a cultura do campo."
                badge="Quem Somos"
                imageSrc="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
            />

            <div className="container mx-auto py-16 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 ring-1 ring-black/5">
                    <div className="prose prose-lg prose-green mx-auto text-gray-600">
                        <p className="lead text-xl font-medium text-gray-900 mb-8 leading-relaxed">
                            A Perfil Agro nasceu com o propósito de atender uma necessidade real do mercado: conectar empresas do agronegócio a profissionais preparados, comprometidos e alinhados com a cultura do campo e do administrativo.
                        </p>

                        <p>
                            Atuamos exclusivamente com empresas do agro, oferecendo soluções completas em recrutamento, seleção e terceirização.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
                            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                                    <span className="h-2 w-8 bg-secondary rounded-full block"></span>
                                    Missão
                                </h3>
                                <p className="text-muted-foreground">
                                    Conectar pessoas certas às oportunidades certas no agronegócio, fortalecendo empresas e impulsionando carreiras.
                                </p>
                            </div>
                            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                                    <span className="h-2 w-8 bg-primary rounded-full block"></span>
                                    Visão
                                </h3>
                                <p className="text-muted-foreground">
                                    Ser referência nacional em recrutamento e gestão de talentos para o agronegócio.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6 flex items-center gap-3">
                            Valores
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0 not-prose">
                            {[
                                "Ética e transparência",
                                "Compromisso com resultados",
                                "Respeito às pessoas",
                                "Conhecimento do agro",
                                "Agilidade e responsabilidade"
                            ].map((val, i) => (
                                <li key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-secondary shrink-0" />
                                    <span className="font-medium text-gray-700">{val}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-16 pt-8 border-t border-gray-100 text-center not-prose">
                            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                                Quer um parceiro que entende o agro?
                            </h3>
                            <Link href="/servicos">
                                <Button size="lg" className="px-8">
                                    Conheça nossas soluções
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
