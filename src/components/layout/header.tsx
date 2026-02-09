import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Sprout } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <div className="relative h-12 w-48 overflow-hidden">
                            <Image
                                src="/PerfilagroLogo.svg"
                                alt="Perfil Agro"
                                fill
                                className="object-contain object-left transition-transform duration-300"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/vagas"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Vagas
                    </Link>
                    <Link
                        href="/servicos"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Serviços
                    </Link>
                    <Link
                        href="/empresas"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Para Empresas
                    </Link>
                    <Link
                        href="/sobre"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Sobre
                    </Link>
                    <Link
                        href="/contato"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Contato
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">

                    <Link href="/anunciar-vaga">
                        <Button variant="outline" size="sm">Divulgar vaga</Button>
                    </Link>
                    <Link href="/candidato/cadastro">
                        <Button size="sm">Cadastre seu Currículo</Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                        <nav className="flex flex-col gap-4 mt-8">
                            <Link
                                href="/vagas"
                                className="text-lg font-medium hover:text-primary"
                            >
                                Vagas
                            </Link>
                            <Link
                                href="/anunciar-vaga"
                                className="text-lg font-medium hover:text-primary"
                            >
                                Divulgar vaga
                            </Link>
                            <Link
                                href="/servicos"
                                className="text-lg font-medium hover:text-primary"
                            >
                                Serviços
                            </Link>
                            <Link
                                href="/empresas"
                                className="text-lg font-medium hover:text-primary"
                            >
                                Para Empresas
                            </Link>
                            <Link
                                href="/contato"
                                className="text-lg font-medium hover:text-primary"
                            >
                                Contato
                            </Link>
                            <Link
                                href="/sobre"
                                className="text-lg font-medium hover:text-primary"
                            >
                                Sobre
                            </Link>
                            <hr className="my-2 border-muted" />

                            <Link href="/candidato/cadastro">
                                <Button className="w-full">Cadastre seu Currículo</Button>
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
