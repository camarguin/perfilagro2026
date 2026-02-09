'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Upload, User, Mail, Phone, MapPin, Briefcase, FileText, CheckCircle2, Loader2 } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'

const formSchema = z.object({
    name: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    region: z.string().min(2, 'Região/Estado obrigatório'),
    category: z.string().min(1, 'Selecione uma área profissional'),
    seniority: z.string().min(1, 'Selecione sua senioridade'),
    experience: z.string().optional(),
    privacyPolicy: z.boolean().refine(val => val === true, { message: 'Você precisa aceitar a política de privacidade' }),
})

import { toast } from "sonner"

export default function CadastroCandidatoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [resumeFile, setResumeFile] = useState<File | null>(null)

    const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            region: '',
            category: '',
            seniority: '',
            experience: '',
            privacyPolicy: false
        },
    })

    async function checkExistingCandidate(email: string) {
        try {
            const { data } = await supabase
                .from('candidates')
                .select('resume_url, region, category, seniority, name, phone, experience')
                .eq('email', email)
                .order('created_at', { ascending: false })
                .limit(1)

            if (data && data[0]) {
                setExistingResumeUrl(data[0].resume_url)
                const currentValues = form.getValues()
                if (!currentValues.name) {
                    form.reset({
                        ...currentValues,
                        name: data[0].name,
                        email: email,
                        phone: data[0].phone,
                        region: data[0].region,
                        category: data[0].category,
                        seniority: data[0].seniority,
                        experience: data[0].experience || ''
                    })
                }
                toast.info("Vimos que você já tem um cadastro. Seus dados foram preenchidos!", {
                    description: "Você pode atualizar os campos se desejar."
                })
            } else {
                setExistingResumeUrl(null)
            }
        } catch (err) {
            console.error('Error checking existing candidate:', err)
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!resumeFile && !existingResumeUrl) {
            toast.error("Por favor, anexe seu currículo.")
            return
        }

        setIsSubmitting(true)
        try {
            // Save to localStorage
            localStorage.setItem('perfilagro_user_data', JSON.stringify({
                name: values.name,
                email: values.email,
                phone: values.phone,
                region: values.region,
                category: values.category,
                seniority: values.seniority
            }))

            let resumePath = existingResumeUrl

            if (resumeFile) {
                const fileExt = resumeFile.name.split('.').pop()
                const fileName = `direct/${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, resumeFile)

                if (uploadError) throw uploadError
                resumePath = fileName
            }

            // Check for existing candidate again before insert
            const { data: existing } = await supabase
                .from('candidates')
                .select('id')
                .eq('email', values.email)
                .maybeSingle()

            if (existing) {
                toast.error("Este email já está cadastrado em nosso banco.")
                return
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
                    experience: values.experience,
                    resume_url: resumePath,
                    status: 'Novo'
                })

            if (insertError) throw insertError

            setSuccess(true)
            toast.success("Cadastro realizado com sucesso!")
            form.reset()
            setResumeFile(null)
        } catch (error) {
            console.error('Error submitting candidate:', error)
            toast.error("Erro ao realizar cadastro. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50/50">
                <div className="bg-primary pt-32 pb-24 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay scale-110" />
                    <div className="container mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl mb-6 ring-1 ring-white/30"
                        >
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </motion.div>
                        <h1 className="font-heading text-4xl font-black text-white mb-2">Currículo Cadastrado!</h1>
                        <p className="text-primary-foreground/80 text-lg">Agora você está no radar das melhores empresas do agro.</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-16 pb-20 max-w-lg relative z-20">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-white ring-1 ring-black/5 overflow-hidden">
                        <CardContent className="p-10 pt-12 text-center">
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                Suas informações foram enviadas para nosso banco de talentos. Entraremos em contato assim que surgir uma oportunidade que combine com seu perfil.
                            </p>
                            <div className="space-y-4">
                                <Link href="/vagas" className="block">
                                    <Button variant="cta-primary" size="xl" className="w-full">
                                        Ver Vagas Abertas
                                    </Button>
                                </Link>
                                <Button variant="ghost" onClick={() => setSuccess(false)} className="w-full font-bold text-gray-400 hover:text-primary">
                                    Fazer outro cadastro
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            {/* Premium Header Banner */}
            <div className="bg-primary pt-32 pb-40 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

                <div className="container mx-auto relative z-10 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-6 mx-auto md:mx-0">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                            </span>
                            Banco de Talentos
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-black text-white mb-4 leading-[1.1] tracking-tight">
                            Sua próxima colheita<br />começa aqui
                        </h1>
                        <p className="text-primary-foreground/70 text-lg md:text-xl max-w-xl font-medium">
                            Cadastre seu perfil e seja encontrado pelas empresas que estão transformando o agronegócio.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Overlapping Form Content */}
            <div className="container mx-auto px-4 -mt-24 pb-24 relative z-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[3rem] bg-white ring-1 ring-black/5 overflow-hidden">
                        <CardHeader className="bg-white border-b border-gray-100 p-8 md:p-12">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-3 bg-secondary rounded-full shadow-lg shadow-secondary/20 shrink-0" />
                                <div>
                                    <CardTitle className="text-3xl font-black text-gray-900 tracking-tight leading-none">Dados Profissionais</CardTitle>
                                    <CardDescription className="text-base text-gray-400 font-medium mt-2">Prometemos cuidar bem dos seus dados.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 md:p-12">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                                    {/* Section 1: Basic Info */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Identificação</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Nome Completo</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Como devemos te chamar?" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Email Principal</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="seu@email.com.br"
                                                                type="email"
                                                                className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6"
                                                                {...field}
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
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Telefone / WhatsApp</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="(00) 00000-0000" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="region"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Região / Estado</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Ex: MT, Maranhão, Balsas..." className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Section 2: Objectivos */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Perfil Profissional</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="category"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Área de Atuação</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6 shadow-none">
                                                                    <SelectValue placeholder="Selecione sua área" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                                <SelectItem value="Agronômico / Técnico" className="rounded-xl py-3 px-4 focus:bg-primary/5">Agronômico / Técnico</SelectItem>
                                                                <SelectItem value="Comercial / Vendas" className="rounded-xl py-3 px-4 focus:bg-primary/5">Comercial / Vendas</SelectItem>
                                                                <SelectItem value="Operacional / Maquinário" className="rounded-xl py-3 px-4 focus:bg-primary/5">Operacional / Maquinário</SelectItem>
                                                                <SelectItem value="Gestão / Administrativo" className="rounded-xl py-3 px-4 focus:bg-primary/5">Gestão / Administrativo</SelectItem>
                                                                <SelectItem value="Pecuária" className="rounded-xl py-3 px-4 focus:bg-primary/5">Pecuária</SelectItem>
                                                                <SelectItem value="Outros" className="rounded-xl py-3 px-4 focus:bg-primary/5">Outros</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="seniority"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Nível de Experiência</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6 shadow-none">
                                                                    <SelectValue placeholder="Selecione seu nível" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                                <SelectItem value="Estagiário" className="rounded-xl py-3 px-4 focus:bg-primary/5">Estagiário</SelectItem>
                                                                <SelectItem value="Júnior" className="rounded-xl py-3 px-4 focus:bg-primary/5">Júnior</SelectItem>
                                                                <SelectItem value="Pleno" className="rounded-xl py-3 px-4 focus:bg-primary/5">Pleno</SelectItem>
                                                                <SelectItem value="Sênior" className="rounded-xl py-3 px-4 focus:bg-primary/5">Sênior</SelectItem>
                                                                <SelectItem value="Especialista / Gestor" className="rounded-xl py-3 px-4 focus:bg-primary/5">Especialista / Gestor</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="experience"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Resumo Profissional (Opcional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Fale brevemente sobre sua experiência..."
                                                            className="min-h-[120px] bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-3xl font-medium p-8 leading-relaxed resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-[10px] ml-2 font-medium">Isso ajuda o recrutador a te encontrar mais rápido.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 3: Upload */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Currículo</h3>
                                        </div>

                                        <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center group relative overflow-hidden">
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                                    <Upload className="h-8 w-8 text-primary" />
                                                </div>
                                                <p className="font-bold text-gray-900 mb-1">
                                                    {resumeFile ? resumeFile.name : 'Anexar Currículo'}
                                                </p>
                                                <p className="text-xs text-gray-400 font-medium">PNG, PDF ou DOCX (Max 5MB)</p>
                                                <Input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                                />
                                            </div>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="privacyPolicy"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="h-6 w-6 rounded-lg border-2 border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none font-medium">
                                                        <FormLabel className="text-sm text-gray-600 cursor-pointer">
                                                            Li e concordo com a <Link href="/politica-privacidade" className="text-primary font-bold hover:underline" target="_blank">Política de Privacidade</Link>
                                                        </FormLabel>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="cta-primary"
                                        size="xl"
                                        className="w-full shadow-2xl shadow-primary/20"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            'Finalizar Cadastro'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

