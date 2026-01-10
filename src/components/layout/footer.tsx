import Link from "next/link";
import { Sprout, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto px-4 py-10 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <Sprout className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                                Perfil Agro
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Conectando talentos às melhores oportunidades do agronegócio brasileiro desde 2012.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-heading font-semibold text-foreground mb-4">Candidatos</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/vagas" className="hover:text-primary transition-colors">
                                    Buscar Vagas
                                </Link>
                            </li>
                            <li>
                                <Link href="/candidato/cadastro" className="hover:text-primary transition-colors">
                                    Cadastrar Currículo
                                </Link>
                            </li>
                            <li>
                                <Link href="/dicas" className="hover:text-primary transition-colors">
                                    Dicas de Carreira
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading font-semibold text-foreground mb-4">Empresas</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/anunciar-vaga" className="hover:text-primary transition-colors">
                                    Anunciar Vaga
                                </Link>
                            </li>
                            <li>
                                <Link href="/empresa/servicos" className="hover:text-primary transition-colors">
                                    Nossos Serviços
                                </Link>
                            </li>
                            <li>
                                <Link href="/contato" className="hover:text-primary transition-colors">
                                    Fale Conosco
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading font-semibold text-foreground mb-4">Redes Sociais</h3>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Perfil Agro. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
