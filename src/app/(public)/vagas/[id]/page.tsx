import { supabase } from '@/lib/supabase'
import { JobApplicationForm } from '@/components/job-application-form'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Calendar, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Metadata } from 'next'

// Next.js 15 Params are async
type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const params = await props.params
    const { data: job } = await supabase
        .from('jobs')
        .select('title')
        .eq('id', params.id)
        .single()

    return {
        title: job?.title ? `${job.title} | Perfil Agro` : 'Vaga não encontrada',
    }
}

export default async function JobDetailsPage(props: { params: Params }) {
    const params = await props.params
    const { id } = params

    const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !job) {
        console.error('Error fetching job:', error)
        notFound()
    }

    const isNew = (new Date().getTime() - new Date(job.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;

    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            {/* Header Section */}
            <div className="bg-primary relative pt-32 pb-48 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed74a62?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/90 to-primary" />

                <div className="relative z-10 container mx-auto space-y-8">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-3">
                        {isNew && (
                            <Badge className="bg-secondary text-primary font-black uppercase text-[11px] tracking-widest px-4 py-1.5 animate-pulse border-none shadow-lg shadow-secondary/20 rounded-full">
                                ✨ Recente
                            </Badge>
                        )}
                        <Badge className="bg-white/10 text-white backdrop-blur-md border border-white/10 font-bold text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full hover:bg-white/20 transition-colors">
                            {job.type}
                        </Badge>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 text-green-300 text-[11px] font-black uppercase tracking-widest border border-green-500/30">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse box-shadow-green" />
                            Vaga Ativa
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-xl max-w-4xl">
                        {job.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm md:text-base font-bold text-white/80">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-full bg-white/10 text-secondary">
                                <MapPin className="w-4 h-4" />
                            </div>
                            {job.location}
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-full bg-white/10 text-secondary">
                                <Briefcase className="w-4 h-4" />
                            </div>
                            {job.type}
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-full bg-white/10 text-secondary">
                                <Calendar className="w-4 h-4" />
                            </div>
                            Publicado em {new Date(job.created_at).toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section (Overlapping) */}
            <div className="container mx-auto px-4 -mt-32 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Main Content: Job Image */}
                    <div className="w-full lg:flex-1 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 p-2">
                        {job.image_url ? (
                            <div className="relative w-full rounded-[2rem] overflow-hidden bg-muted/50">
                                <Image
                                    src={job.image_url}
                                    alt={`Vaga para ${job.title}`}
                                    width={1200}
                                    height={1600}
                                    className="w-full h-auto object-cover"
                                    priority
                                    quality={100}
                                />
                            </div>
                        ) : (
                            <div className="p-12 md:p-16 space-y-10 min-h-[400px] flex flex-col justify-center">
                                <div className="text-center space-y-4">
                                    <div className="inline-flex p-4 rounded-3xl bg-primary/5 text-primary mb-2">
                                        <Briefcase className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Descrição em Texto</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">Esta vaga não possui um flyer oficial. Abaixo estão os detalhes completos.</p>
                                </div>
                                <div className="prose prose-lg prose-slate max-w-none 
                                    prose-headings:font-black prose-headings:text-gray-900
                                    prose-p:text-gray-600 prose-li:text-gray-600">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {job.description}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Application Form */}
                    <div className="w-full lg:w-[400px] space-y-6 sticky top-8">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl ring-1 ring-black/5">
                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                                    Interessado nesta vaga?
                                </h3>
                                <p className="text-gray-500 font-medium">
                                    Preencha o formulário abaixo e envie seu currículo diretamente para nós.
                                </p>
                            </div>

                            <JobApplicationForm jobId={job.id} jobTitle={job.title} />
                        </div>

                        <div className="bg-[#1A3C34] rounded-[2.5rem] p-8 shadow-xl text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                            <div className="relative z-10 space-y-4">
                                <h4 className="text-white font-bold text-lg">Compartilhe!</h4>
                                <p className="text-white/70 text-sm">Ajude seus amigos a encontrarem a oportunidade perfeita no agronegócio.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

}
