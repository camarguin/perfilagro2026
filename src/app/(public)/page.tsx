import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: featuredJobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-20 px-4 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container relative z-10 mx-auto text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1.5 text-sm backdrop-blur-md">
            #1 em Recrutamento no Agro
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white md:text-7xl lg:leading-[1.1] max-w-5xl mx-auto mb-8">
            Pessoas certas, no lugar certo, para o <span className="text-secondary italic">agro</span> crescer
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            A Perfil Agro é especializada em recrutamento e gestão de pessoas para o agronegócio, conectando empresas a profissionais qualificados para vagas de campo e administrativas, com processos ágeis e personalizados.
          </p>

          <div className="mx-auto max-w-3xl flex flex-col md:flex-row gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/20 animate-in zoom-in-95 duration-700 delay-300 fill-mode-both">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
              <Input
                className="pl-12 h-14 bg-white/10 border-none text-white placeholder:text-white/60 focus-visible:ring-0 text-lg"
                placeholder="Cargo ou palavra-chave..."
              />
            </div>
            <div className="relative flex-1 group">
              <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
              <Input
                className="pl-12 h-14 bg-white/10 border-none text-white placeholder:text-white/60 focus-visible:ring-0 text-lg"
                placeholder="Cidade ou Estado..."
              />
            </div>
            <Button variant="cta" size="lg" className="h-14 md:px-10">
              Buscar Vagas
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70">
            <span>Soluções completas:</span>
            <span className="flex items-center gap-1"><span className="text-secondary">•</span> Recrutamento e Seleção</span>
            <span className="flex items-center gap-1"><span className="text-secondary">•</span> Divulgação de Vagas</span>
            <span className="flex items-center gap-1"><span className="text-secondary">•</span> Banco de Currículos</span>
            <span className="flex items-center gap-1"><span className="text-secondary">•</span> Gestão de Terceirização</span>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="font-heading text-4xl font-bold text-foreground">Últimas Vagas</h2>
              <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                Espaço dinâmico com oportunidades para Técnico Agrícola, Supervisor, Administrativo, RTV e muito mais.
              </p>
            </div>
            <Link href="/vagas">
              <Button variant="outline" size="lg" className="group border-2">
                Ver todas as vagas
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {!featuredJobs || featuredJobs.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground bg-white rounded-3xl border-2 border-dashed">
                Nenhuma vaga em destaque no momento.
              </div>
            ) : (
              featuredJobs.map((job, index) => (
                <Card key={job.id} className="group hover:scale-[1.02] transition-all duration-500 border-none bg-white shadow-xl hover:shadow-2xl overflow-hidden rounded-[2rem] animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="font-bold text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wider">{job.type}</Badge>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
                      {job.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="px-8 py-2 space-y-4">
                    <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      <MapPin className="h-4 w-4 mr-3 text-primary" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-3 text-primary/60" />
                      {new Date(job.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-6">
                    <Link href={`/vagas/${job.id}`} className="w-full">
                      <Button variant="outline" className="w-full h-12 py-6 border-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-center mt-12">
            <Link href="/vagas">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Veja as oportunidades disponíveis no agro <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
              Mais de <span className="text-secondary">5 mil</span> profissionais selecionados
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A Perfil Agro já selecionou mais de 5.000 profissionais para o setor do agronegócio,
              atendendo empresas de pequeno, médio e grande porte, incluindo multinacionais líderes do mercado.
            </p>
          </div>

          <div className="bg-muted/30 rounded-[2rem] p-8 md:p-12 border border-border/50">
            <p className="text-center font-bold text-lg text-muted-foreground mb-8 uppercase tracking-widest">
              Empresas Atendidas
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {['BASF', 'Syngenta', 'Bayer', 'Corteva', 'FMC', 'LongPing', 'Timac Agro', 'Adama', 'Oro Agri', 'Xarvio', 'Stoller', 'Yara', 'Arable'].map((company) => (
                <span key={company} className="text-xl md:text-2xl font-bold text-foreground/80 hover:text-primary transition-colors cursor-default">
                  {company}
                </span>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/contato">
                <Button variant="outline" className="border-2 rounded-full px-8 hover:bg-primary hover:text-white hover:border-primary transition-all">
                  Contrate com quem já entregou resultados
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl shadow-primary/30 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply transition-transform duration-[10s] hover:scale-110"></div>

            <div className="relative z-10 max-w-2xl text-center md:text-left">
              <Badge className="mb-6 bg-white/20 text-white border-none px-4 py-1 text-sm backdrop-blur-md uppercase tracking-widest font-bold">
                Soluções para Empresas
              </Badge>
              <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Encontre os profissionais ideais para sua empresa do agro.
              </h2>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/contato" className="w-full sm:w-auto">
                  <Button variant="cta" size="xl" className="w-full sm:px-12">
                    Fale com a Perfil Agro
                  </Button>
                </Link>
                <Link href="/sobre" className="w-full sm:w-auto">
                  <Button size="xl" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white hover:text-primary hover:border-white transition-all w-full md:px-12">
                    Conheça nossas soluções
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10 hidden lg:block w-full max-w-md animate-in fade-in zoom-in slide-in-from-right-12 duration-1000">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">Agro</div>
                  <div>
                    <div className="text-white font-bold">Especialistas</div>
                    <div className="text-white/60 text-sm">Foco total no setor</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-white/10 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${90 - i * 10}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
