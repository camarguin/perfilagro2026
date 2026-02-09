import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen pb-20">
            <PageHeader
                title="Política de Privacidade"
                description="Última atualização: 7 de fevereiro de 2026"
                badge="Privacidade"
            />

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 md:p-12 prose prose-slate max-w-none">
                        <section className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    A Perfil Agro está comprometida com a proteção de sua privacidade. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais ao utilizar nossos serviços e nosso site.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Coleta de Dados</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Coletamos informações que você nos fornece diretamente, como ao se candidatar a uma vaga, incluindo seu nome, e-mail, telefone, localização e currículo. Também podemos coletar dados técnicos automaticamente, como endereço IP e tipo de navegador.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uso das Informações</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Utilizamos seus dados para:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                    <li>Processar candidaturas a vagas de emprego;</li>
                                    <li>Comunicar-nos com você sobre oportunidades relevantes;</li>
                                    <li>Melhorar nossos serviços e a experiência do usuário;</li>
                                    <li>Cumprir obrigações legais.</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartilhamento de Dados</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Seus dados de candidatura (nome, contato e currículo) serão compartilhados com as empresas contratantes responsáveis pelas vagas às quais você se candidatar. Não vendemos seus dados para terceiros.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Para exercer esses direitos, entre em contato conosco através de nossos canais oficiais.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Segurança</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração.
                                </p>
                            </div>

                            <div className="pt-8 border-t">
                                <p className="text-gray-500 text-sm italic">
                                    Em caso de dúvidas sobre nossa Política de Privacidade, entre em contato pelo e-mail: contato@perfilagro.com.br
                                </p>
                            </div>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
