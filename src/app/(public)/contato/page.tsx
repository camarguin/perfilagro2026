'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Loader2, Headset } from "lucide-react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/ui/page-header"

const formSchema = z.object({
    name: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    subject: z.string().min(5, 'Assunto muito curto'),
    message: z.string().min(10, 'Mensagem muito curta'),
})

import { toast } from "sonner"
import { sendContactEmail } from "@/app/actions/send-email"

export default function ContatoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('email', values.email)
            formData.append('subject', values.subject)
            formData.append('message', values.message)

            const result = await sendContactEmail(formData)

            if (result.success) {
                setSuccess(true)
            } else {
                toast.error(result.error || "Erro ao enviar mensagem.")
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro inesperado. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50/50">
                <div className="bg-primary pt-32 pb-24 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay scale-110" />
                    <div className="container mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl mb-6 ring-1 ring-white/30"
                        >
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </motion.div>
                        <h1 className="font-heading text-4xl font-black text-white mb-2">Mensagem Enviada!</h1>
                        <p className="text-primary-foreground/80 text-lg">Obrigado pelo contato. Retornaremos em breve.</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-16 pb-20 max-w-lg relative z-20">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-white ring-1 ring-black/5 overflow-hidden">
                        <CardContent className="p-10 pt-12 text-center">
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                Sua solicitação foi recebida por nossa equipe de atendimento. Em até 24 horas úteis você receberá uma resposta no seu e-mail.
                            </p>
                            <div className="space-y-4">
                                <Button variant="cta-primary" size="xl" className="w-full" onClick={() => setSuccess(false)}>
                                    Voltar para o site
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
            {/* Premium Header Banner using PageHeader */}
            <PageHeader
                title="Fale com a Perfil Agro"
                description="Entre em contato e descubra como podemos apoiar seu crescimento com soluções completas em recrutamento, seleção e gestão de pessoas para o agro."
                badge="Contato"
                imageSrc="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop"
                className="pb-40 md:pb-48"
            />

            {/* Overlapping Content */}
            <div className="container mx-auto px-4 -mt-24 pb-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Contact Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white ring-1 ring-black/5 p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">Telefone</h4>
                                    <p className="text-gray-500 font-medium">(00) 0000-0000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">E-mail</h4>
                                    <p className="text-gray-500 font-medium">contato@perfilagro.com.br</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900">Localização</h4>
                                    <p className="text-gray-500 font-medium">Brasil</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-xl rounded-[2.5rem] bg-primary text-white p-8 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10">
                                <h4 className="text-2xl font-black mb-2 italic">Perfil Agro</h4>
                                <p className="text-primary-foreground/80 font-medium text-sm leading-relaxed">
                                    Conectando talentos e oportunidades desde 2012. Somos a maior rede de recrutamento especializada no agronegócio.
                                </p>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[3rem] bg-white ring-1 ring-black/5 overflow-hidden font-jakarta">
                            <CardHeader className="p-8 md:p-12 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-3 bg-secondary rounded-full shadow-lg shadow-secondary/20" />
                                    <div>
                                        <CardTitle className="text-3xl font-black text-gray-900">Envie uma Mensagem</CardTitle>
                                        <CardDescription className="text-base text-gray-400 font-medium mt-1">Responderemos o mais breve possível.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 md:p-12">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Nome Completo</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Seu nome" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} />
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
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">E-mail</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="seu@email.com" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Assunto</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Sobre o que você quer falar?" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Mensagem</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Como podemos te ajudar hoje?"
                                                            className="min-h-[180px] bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-3xl font-medium p-8 leading-relaxed resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

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
                                                <>
                                                    Enviar Mensagem
                                                    <Send className="ml-3 h-5 w-5" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
