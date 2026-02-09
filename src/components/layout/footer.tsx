import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto px-4 py-10 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative h-12 w-48">
                                <Image
                                    src="/PerfilagroLogo.svg"
                                    alt="Perfil Agro"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
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
                            <Link href="https://www.instagram.com/perfilagrovagas/" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="https://www.facebook.com/perfilagro" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground text-center md:text-left">
                    <p>© {new Date().getFullYear()} Perfil Agro. Todos os direitos reservados.</p>
                    <div className="flex items-center gap-3">
                        <span className="text-xs tracking-widest opacity-50">Desenvolvido por</span>
                        <Link href="https://www.lgctech.net" target="_blank" className="hover:opacity-80 transition-opacity">
                            <Image
                                src="/LGCTechLogo.png"
                                alt="LGCTech"
                                width={80}
                                height={24}
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
