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
        <div className="min-h-screen bg-muted/20 py-16 px-4 pt-32">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-black/5">
                    {/* Dark Background Area - Now flexible height */}
                    <div className="bg-primary relative pt-20 pb-32 px-6 md:px-12 lg:px-16">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed74a62?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

                        <div className="relative z-10 space-y-6 max-w-4xl">
                            <div className="flex flex-wrap gap-2">
                                {isNew && (
                                    <Badge className="bg-secondary text-primary font-black uppercase text-[10px] tracking-widest px-3 py-1 animate-pulse border-none shadow-lg shadow-secondary/20">
                                        Recente
                                    </Badge>
                                )}
                                <Badge className="bg-white/10 text-white backdrop-blur-md border border-white/20 font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                    {job.type}
                                </Badge>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/30">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Vaga Ativa
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-xl">{job.title}</h1>

                            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold text-white/70">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-secondary drop-shadow" />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-secondary drop-shadow" />
                                    {job.type}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-secondary drop-shadow" />
                                    Publicado em {new Date(job.created_at).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overlapping Content Area */}
                    <div className="px-6 md:px-12 lg:px-16 pb-12 -mt-24 relative z-20">
                        <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
                            {/* Job Image or Logo */}
                            <div className="w-44 h-44 md:w-52 md:h-52 rounded-[2.5rem] bg-white shadow-2xl border-8 border-white flex items-center justify-center overflow-hidden shrink-0 group transition-transform hover:scale-[1.02]">
                                {job.image_url ? (
                                    <Image
                                        src={job.image_url}
                                        alt={job.title}
                                        width={240}
                                        height={240}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <Briefcase className="w-20 h-20 text-primary/40" />
                                )}
                            </div>

                            <div className="pb-4 w-full md:w-auto">
                                <JobApplicationForm jobId={job.id} jobTitle={job.title} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-12 lg:p-16 ring-1 ring-black/5">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Descrição da Oportunidade</h2>
                    </div>

                    <div className="prose prose-slate max-w-none 
                        prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight 
                        prose-h3:text-lg prose-h3:uppercase prose-h3:tracking-widest prose-h3:text-primary prose-h3:mt-8 prose-h3:mb-4
                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg
                        prose-li:text-gray-600 prose-li:text-lg prose-li:leading-relaxed
                        prose-strong:text-gray-900 prose-strong:font-black">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {job.description}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="bg-primary rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Gostou da vaga?</h3>
                            <p className="text-primary-foreground/90">Não perca tempo e envie seu currículo agora mesmo.</p>
                        </div>
                        <JobApplicationForm jobId={job.id} jobTitle={job.title} />
                    </div>
                </div>

            </div>
        </div>

    )
}
