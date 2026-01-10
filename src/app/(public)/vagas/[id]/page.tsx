import { supabase } from '@/lib/supabase'
import { JobApplicationForm } from '@/components/job-application-form'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Calendar } from 'lucide-react'
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

    return (
        <div className="min-h-screen bg-muted/20 py-16 px-4">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden ring-1 ring-black/5">
                    <div className="h-64 bg-primary relative">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
                    </div>

                    <div className="px-10 pb-10 -mt-20 relative z-10">
                        <div className="flex flex-col md:flex-row gap-8 items-end">
                            {/* Job Image or Logo */}
                            <div className="w-40 h-40 rounded-3xl bg-white shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden shrink-0">
                                {job.image_url ? (
                                    <Image
                                        src={job.image_url}
                                        alt={job.title}
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Briefcase className="w-16 h-16 text-primary/40" />
                                )}
                            </div>

                            <div className="flex-1 space-y-4 mb-2">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">{job.title}</h1>
                                    <div className="flex flex-wrap gap-6 mt-4 text-base font-medium text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-primary" />
                                            {job.type}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            Publicado em {new Date(job.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Badge className="bg-primary/10 text-primary border-none text-sm px-4 py-1">
                                        {job.type}
                                    </Badge>
                                    {job.status === 'active' ? (
                                        <Badge className="bg-green-500 text-white border-none text-sm px-4 py-1">Vaga Ativa</Badge>
                                    ) : (
                                        <Badge variant="destructive" className="text-sm px-4 py-1">Processo Encerrado</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="shrink-0 w-full md:w-auto">
                                <JobApplicationForm jobId={job.id} jobTitle={job.title} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-3xl shadow-xl p-10 ring-1 ring-black/5">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-full" />
                        Descrição da Oportunidade
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed font-medium">
                        {job.description}
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
