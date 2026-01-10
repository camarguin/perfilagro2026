'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
})

export function JobApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        },
    })

    // Load saved data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('perfilagro_user_data')
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                form.reset(parsed)
            } catch (e) {
                console.error('Failed to parse saved user data', e)
            }
        }
    }, [form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!resumeFile) {
            alert('Por favor, anexe seu currículo.')
            return
        }

        setIsSubmitting(true)
        try {
            // Save to localStorage for future use
            localStorage.setItem('perfilagro_user_data', JSON.stringify(values))

            // Upload Resume
            const fileExt = resumeFile.name.split('.').pop()
            const fileName = `${jobId}/${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(fileName, resumeFile)

            if (uploadError) throw uploadError

            // Note: Resumes bucket is usually private, so we might store the path, not public URL.
            // But for admin access, we can create a signed URL later.
            const resumePath = fileName

            // Insert Candidate
            const { error: insertError } = await supabase
                .from('candidates')
                .insert({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    resume_url: resumePath,
                    job_id: jobId,
                })

            if (insertError) throw insertError

            setSuccess(true)
            form.reset() // Note: this clears the form state, but next time they open user_data will reload due to useEffect if we re-mount, or we can choose NOT to reset if we want them to apply to more.
            // Actually, better to KEEP the data in form if they want to apply again? 
            // The success card replaces the form. When they close, we likely unmount/remount if the parent handles it?
            // Here, we just setSuccess(true).

            setResumeFile(null)
        } catch (error) {
            console.error('Error applying for job:', error)
            alert('Erro ao enviar candidatura. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <Card className="bg-white border-primary/20 shadow-2xl rounded-[2rem] overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="bg-primary h-2 w-full" />
                <CardHeader className="p-8 pb-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-black text-gray-900 leading-tight">Candidatura Enviada!</CardTitle>
                    <CardDescription className="text-base text-gray-400 font-medium">
                        Recebemos seu currículo para a vaga de <span className="text-primary font-bold">{jobTitle}</span>. Sucesso na sua jornada!
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                    <Button onClick={() => { setSuccess(false); setIsOpen(false); }} className="w-full h-12 rounded-xl bg-gray-50 text-gray-600 border-none hover:bg-gray-100 font-bold transition-all">
                        Voltar para a vaga
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="cta-primary" size="lg" className="w-full md:w-auto">
                    Candidatar-se para esta vaga
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
                <div className="bg-primary pt-10 pb-12 px-10 text-white relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                    <DialogHeader className="relative z-10 text-left">
                        <DialogTitle className="text-3xl font-black mb-2">Quase lá!</DialogTitle>
                        <DialogDescription className="text-primary-foreground/80 text-base font-medium">
                            Preencha seus dados para completar a candidatura em <span className="text-white font-bold">{jobTitle}</span>.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-10 -mt-8 bg-white rounded-t-[2rem] relative z-20">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">Nome Completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Seu nome" className="h-12 bg-gray-50 border-none focus:bg-white focus:ring-primary focus:border-primary transition-all rounded-xl font-medium" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">Email Profissional</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="seu@email.com" type="email" className="h-12 bg-gray-50 border-none focus:bg-white focus:ring-primary transition-all rounded-xl font-medium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">WhatsApp</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(00) 00000-0000" className="h-12 bg-gray-50 border-none focus:bg-white focus:ring-primary transition-all rounded-xl font-medium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">Currículo Atualizado (PDF)</FormLabel>
                                    <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-100 rounded-2xl hover:bg-muted/30 transition-all group">
                                        <Input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                            className="cursor-pointer file:bg-primary/10 file:text-primary file:border-none file:px-4 file:py-1 file:rounded-lg file:text-xs file:font-black file:shadow-sm"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium italic">
                                        * Seus dados ficam salvos para facilitar as próximas candidaturas.
                                    </p>
                                </div>
                            </div>

                            <Button type="submit" variant="cta" size="xl" className="w-full mt-4" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Finalizar Candidatura'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

