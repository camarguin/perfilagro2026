'use client'

import { useState, useEffect, useRef } from 'react'
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
import { Loader2, CheckCircle2, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { maskPhone } from "@/lib/masks"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import { sendJobNotification } from '@/app/actions/send-email'

const formSchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    email: z.string().email('Email inválido. Ex: seu@email.com').min(5, 'Email é obrigatório'),
    phone: z.string().min(14, 'Telefone é obrigatório'),
    motivation: z.string().optional(),
    region: z.string().min(2, 'Região é obrigatória'),
    category: z.string().min(1, 'Área é obrigatória'),
    seniority: z.string().min(1, 'Senioridade é obrigatória'),
    privacyPolicy: z.boolean().refine(val => val === true, { message: 'Você precisa aceitar a política de privacidade' }),
})

export function JobApplicationForm({ jobId, jobTitle, ownerEmail }: { jobId: string; jobTitle: string; ownerEmail?: string }) {
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null)
    const toastShownRef = useRef(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            region: '',
            category: '',
            seniority: '',
            privacyPolicy: false,
        },
    })

    // Load saved data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem('perfilagro_user_data')
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                form.reset(parsed)
                // If we have saved data, we likely have an existing resume in the DB
                if (parsed.email) {
                    checkExistingCandidate(parsed.email)
                }
            } catch (e) {
                console.error('Failed to parse saved user data', e)
            }
        }
    }, [form])

    async function checkExistingCandidate(email: string) {
        try {
            const { data, error } = await supabase
                .from('candidates')
                .select('resume_url, region, category, seniority, name, phone')
                .eq('email', email)
                .order('created_at', { ascending: false })
                .limit(1)

            if (data && data[0]) {
                setExistingResumeUrl(data[0].resume_url)
                // If the user didn't have local data but exists in DB, we can pre-fill
                const currentValues = form.getValues()
                if (!currentValues.name) {
                    form.reset({
                        name: data[0].name,
                        email: email,
                        phone: data[0].phone,
                        region: data[0].region,
                        category: data[0].category,
                        seniority: data[0].seniority,
                        privacyPolicy: currentValues.privacyPolicy
                    })
                }

                if (!toastShownRef.current) {
                    toast.info("Seus dados foram preenchidos automaticamente!", {
                        description: "Reutilizaremos seu último currículo enviado."
                    })
                    toastShownRef.current = true
                }
            }
        } catch (err) {
            console.error('Error checking existing candidate:', err)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Only require file if we don't have an existing one OR they uploaded a new one
        if (!resumeFile && !existingResumeUrl) {
            toast.error('Por favor, anexe seu currículo em PDF.')
            return
        }

        // Validate PDF if a new file is provided
        if (resumeFile && !resumeFile.type.includes('pdf')) {
            toast.error('Somente arquivos PDF são permitidos.')
            return
        }

        setIsSubmitting(true)
        try {
            // Save to localStorage for future use
            localStorage.setItem('perfilagro_user_data', JSON.stringify(values))

            let resumePath = existingResumeUrl

            // If a new file is provided, upload it (even if one exists)
            if (resumeFile) {
                const fileExt = resumeFile.name.split('.').pop()
                const fileName = `${jobId}/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, resumeFile)

                if (uploadError) throw uploadError
                resumePath = fileName
            }

            // Insert Candidate
            const { error: insertError } = await supabase
                .from('candidates')
                .insert({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    region: values.region,
                    category: values.category,
                    seniority: values.seniority,
                    resume_url: resumePath,
                    job_id: jobId,
                    status: 'Novo'
                })

            if (insertError) throw insertError

            // Send Notification Email
            await sendJobNotification(
                ownerEmail || '',
                jobTitle,
                {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    region: values.region,
                    category: values.category,
                    seniority: values.seniority
                },
                resumePath || ''
            )

            setSuccess(true)
            setResumeFile(null)
        } catch (error) {
            console.error('Error applying for job:', error)
            toast.error('Erro ao enviar candidatura. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="cta-primary" size="lg" className="w-full md:w-auto">
                    Candidatar-se para esta vaga
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto custom-scrollbar" showCloseButton={false}>
                {success ? (
                    <div className="bg-white p-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                        <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-6 ring-8 ring-green-50/50">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3 leading-tight">Candidatura Enviada!</h2>
                        <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed max-w-sm">
                            Recebemos seu currículo para a vaga de <span className="text-primary font-bold block mt-1">{jobTitle}</span>
                        </p>

                        <div className="w-full bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <p className="text-sm text-gray-400 font-medium uppercase tracking-widest mb-1">Status Atual</p>
                            <p className="text-lg font-bold text-gray-900 flex items-center justify-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                Em Análise
                            </p>
                        </div>

                        <Button
                            onClick={() => { setSuccess(false); setIsOpen(false); }}
                            variant="default"
                            size="xl"
                            className="w-full font-bold shadow-xl shadow-primary/20"
                        >
                            Voltar para a vaga
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="bg-primary pt-10 pb-12 px-10 text-white relative">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                            <DialogHeader className="relative z-10 text-left pr-8">
                                <DialogTitle className="text-3xl font-black mb-2">Quase lá!</DialogTitle>
                                <DialogDescription className="text-primary-foreground/80 text-base font-medium">
                                    Preencha seus dados para completar a candidatura em <span className="text-white font-bold">{jobTitle}</span>.
                                </DialogDescription>
                            </DialogHeader>
                            <Button
                                onClick={() => setIsOpen(false)}
                                variant="ghost"
                                size="icon"
                                className="absolute top-6 right-6 text-white/50 hover:text-white hover:bg-white/10 rounded-full z-20"
                            >
                                <XIcon className="h-5 w-5" />
                            </Button>
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
                                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">Nome Completo <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Seu nome" className="h-12 bg-gray-50 border-none focus:bg-white focus:ring-primary focus:border-primary transition-all rounded-xl font-medium" {...field} value={field.value ?? ''} />
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
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">Email Profissional <span className="text-red-500">*</span></FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="seu@email.com"
                                                                type="email"
                                                                className="h-12 bg-gray-50 border-none focus:bg-white focus:ring-primary transition-all rounded-xl font-medium"
                                                                {...field}
                                                                value={field.value ?? ''}
                                                                onBlur={(e) => {
                                                                    field.onBlur();
                                                                    checkExistingCandidate(e.target.value);
                                                                }}
                                                            />
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
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">WhatsApp <span className="text-red-500">*</span></FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="(00) 00000-0000"
                                                                className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6"
                                                                {...field}
                                                                value={field.value ?? ''}
                                                                onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="region"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">Região / Estado</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Ex: MT, Balsas, Sul..." className="h-12 bg-gray-50 border-none focus:bg-white focus:ring-primary transition-all rounded-xl font-medium" {...field} value={field.value ?? ''} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="category"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">Área</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 bg-gray-50 border-none focus:bg-white focus:ring-primary transition-all rounded-xl font-medium shadow-none">
                                                                    <SelectValue placeholder="Selecione" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                                <SelectItem value="Agronômico / Técnico">Agronômico</SelectItem>
                                                                <SelectItem value="Comercial / Vendas">Comercial</SelectItem>
                                                                <SelectItem value="Operacional / Maquinário">Operacional</SelectItem>
                                                                <SelectItem value="Gestão / Administrativo">Gestão</SelectItem>
                                                                <SelectItem value="Pecuária">Pecuária</SelectItem>
                                                                <SelectItem value="Outros">Outros</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="seniority"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">Nível</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 bg-gray-50 border-none focus:bg-white focus:ring-primary transition-all rounded-xl font-medium shadow-none">
                                                                    <SelectValue placeholder="Selecione" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                                <SelectItem value="Estagiário">Estagiário</SelectItem>
                                                                <SelectItem value="Júnior">Júnior</SelectItem>
                                                                <SelectItem value="Pleno">Pleno</SelectItem>
                                                                <SelectItem value="Sênior">Sênior</SelectItem>
                                                                <SelectItem value="Especialista / Gestor">Especialista</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="space-y-2">
                                                <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    {existingResumeUrl ? 'Novo Currículo (PDF Opcional)' : 'Currículo (PDF)'}
                                                </FormLabel>
                                                <div className={`flex items-center gap-4 p-2 border-2 border-dashed rounded-xl transition-all group ${existingResumeUrl ? 'border-green-100 bg-green-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                                                    <Input
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                                        className="cursor-pointer border-none shadow-none h-8 text-[11px] file:bg-primary/10 file:text-primary file:border-none file:px-2 file:py-0.5 file:rounded file:text-[10px] file:font-black"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {existingResumeUrl && !resumeFile && (
                                            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> Usaremos seu último currículo enviado.
                                            </p>
                                        )}
                                        <p className="text-[10px] text-muted-foreground font-medium italic">
                                            * Seus dados ficam salvos para facilitar as próximas candidaturas.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="privacyPolicy"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-sm font-medium text-gray-600 cursor-pointer">
                                                            Li e concordo com a <Link href="/politica-privacidade" className="text-primary font-bold hover:underline" target="_blank">Política de Privacidade</Link>
                                                        </FormLabel>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit" variant="cta" size="xl" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                'Finalizar Candidatura'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

