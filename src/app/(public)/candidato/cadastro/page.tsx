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
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'

const formSchema = z.object({
    name: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    city: z.string().min(2, 'Cidade obrigatória'),
    category: z.string().min(1, 'Selecione uma categoria'),
    skills: z.string().min(10, 'Conte um pouco mais sobre você'),
    terms: z.boolean().refine(val => val === true, 'Você precisa aceitar os termos')
})

export default function CadastroCandidatoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            city: '',
            category: '',
            skills: '',
            terms: false
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        // Mock submission
        setTimeout(() => {
            setIsSubmitting(false)
            setSuccess(true)
        }, 1500)
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
                                                            <Input placeholder="seu@email.com.br" type="email" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} />
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
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Cidade - UF</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Onde você reside?" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} />
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
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Objetivos</h3>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Cargo de Interesse</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6 shadow-none">
                                                                <SelectValue placeholder="Selecione sua área" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                            <SelectItem value="agronomia" className="rounded-xl py-3 px-4 focus:bg-primary/5">Agronomia / Técnico</SelectItem>
                                                            <SelectItem value="operacional" className="rounded-xl py-3 px-4 focus:bg-primary/5">Operacional / Maquinário</SelectItem>
                                                            <SelectItem value="gestao" className="rounded-xl py-3 px-4 focus:bg-primary/5">Gestão / Administrativo</SelectItem>
                                                            <SelectItem value="comercial" className="rounded-xl py-3 px-4 focus:bg-primary/5">Comercial / Vendas</SelectItem>
                                                            <SelectItem value="pecuaria" className="rounded-xl py-3 px-4 focus:bg-primary/5">Pecuária</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="skills"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Resumo de Qualificações</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Fale um pouco sobre sua trajetória profissional..."
                                                            className="min-h-[160px] bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-3xl font-medium p-8 leading-relaxed resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
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
                                                <p className="font-bold text-gray-900 mb-1">Anexar Currículo</p>
                                                <p className="text-xs text-gray-400 font-medium">PNG, PDF ou DOCX (Max 5MB)</p>
                                                <Input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept=".pdf,.doc,.docx"
                                                />
                                            </div>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="terms"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="h-6 w-6 rounded-lg border-2 border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-sm font-medium text-gray-500">
                                                            Aceito os termos da <Link href="#" className="text-primary font-bold hover:underline">Política de Privacidade</Link>.
                                                        </FormLabel>
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

