import { Metadata } from 'next'
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
    title: 'Sobre a Perfil Agro',
    description: 'Conheça a história e missão da Perfil Agro, conectando talentos ao agronegócio.',
}

export default function SobrePage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            {/* Page Header - Consistent with Vagas and Anunciar Vaga */}
            <div className="bg-primary pt-24 pb-12 px-4 shadow-md">
                <div className="container mx-auto flex flex-col items-center md:items-start text-center md:text-left">
                    <Badge className="mb-4 bg-white/20 text-white border-none px-4 py-1 backdrop-blur-sm">Nossa História</Badge>
                    <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">Sobre a Perfil Agro</h1>
                    <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl">
                        Conectando profissionais qualificados às melhores oportunidades do agronegócio brasileiro desde 2012.
                    </p>
                </div>
            </div>

            <div className="container mx-auto py-16 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 ring-1 ring-black/5">
                    <div className="prose prose-lg prose-green mx-auto text-gray-600">
                        <p className="lead text-xl font-medium text-gray-900 mb-8 leading-relaxed">
                            Somos especialistas em conectar talentos que movem o campo com empresas que alimentam o mundo. Nossa missão é fortalecer o agronegócio através de um recrutamento assertivo e humanizado.
                        </p>

                        <div className="my-10 border-l-4 border-secondary pl-6 italic text-gray-700 bg-gray-50 py-4 pr-4 rounded-r-lg">
                            "Entendemos que o campo exige profissionais com competências específicas e paixão pelo que fazem. Por isso, nosso banco de currículos e nossas vagas são gerenciados com o cuidado de quem entende a dinâmica do setor."
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-secondary rounded-full"></span>
                            Nossa Missão
                        </h3>
                        <p>
                            Facilitar o encontro entre a demanda por mão de obra especializada no campo e profissionais que buscam excelência, impulsionando a produtividade e o desenvolvimento do agronegócio nacional.
                        </p>

                        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4 flex items-center gap-3">
                            <span className="w-8 h-1 bg-secondary rounded-full"></span>
                            Nossos Valores
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                            <li className="bg-muted/30 p-4 rounded-xl border border-gray-100">
                                <strong className="text-primary block mb-1">Comprometimento</strong>
                                Com a qualidade das contratações e satisfação de empresas e candidatos.
                            </li>
                            <li className="bg-muted/30 p-4 rounded-xl border border-gray-100">
                                <strong className="text-primary block mb-1">Transparência</strong>
                                Em todos os processos de seleção e divulgação de vagas.
                            </li>
                            <li className="bg-muted/30 p-4 rounded-xl border border-gray-100">
                                <strong className="text-primary block mb-1">Inovação</strong>
                                Buscando sempre as melhores ferramentas para otimizar o recrutamento.
                            </li>
                            <li className="bg-muted/30 p-4 rounded-xl border border-gray-100">
                                <strong className="text-primary block mb-1">Agro em Primeiro Lugar</strong>
                                Foco total nas necessidades específicas do setor rural.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
