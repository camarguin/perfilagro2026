'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from "sonner"
import { maskPhone } from "@/lib/masks"
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Loader2, Upload, Briefcase, MapPin, Calendar, CheckCircle2, Image as ImageIcon, Sparkles, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

title: z.string().min(2, 'Título é obrigatório'),
    description: z.string().min(10, 'Descrição é obrigatória'),
        location: z.string().min(2, 'Localização é obrigatória'),
            type: z.string().min(1, 'Selecione um tipo de vaga'),
                owner_email: z.string().email('Email inválido. Ex: seu@email.com').min(5, 'Email é obrigatório'),
                    phone: z.string().min(14, 'Telefone é obrigatório'),
})

export default function AnunciarVagaPage() {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            location: '',
            type: '',
            owner_email: '',
            phone: '',
        },
    })

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            let imageUrl = ''

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}.${fileExt}`
                const { error: uploadError } = await supabase.storage
                    .from('job-images')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('job-images')
                    .getPublicUrl(fileName)

                imageUrl = publicUrl
            }

            const { error: insertError } = await supabase
                .from('jobs')
                .insert({
                    title: values.title,
                    description: values.description,
                    location: values.location,
                    type: values.type,
                    image_url: imageUrl,
                    owner_email: values.owner_email,
                    phone: values.phone,
                    status: 'inactive',
                    is_approved: false // New jobs from public page start unapproved
                })

            if (insertError) throw insertError

            setSuccess(true)
            form.reset()
            setImageFile(null)
            setImagePreview(null)
        } catch (error) {
            console.error('Error submitting job:', error)
            alert('Erro ao anunciar vaga. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50/50">
                <div className="bg-primary pt-32 pb-24 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay scale-110" />
                    <div className="container mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl mb-6 ring-1 ring-white/30"
                        >
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </motion.div>
                        <h1 className="font-heading text-4xl font-black text-white mb-2">Vaga Anunciada!</h1>
                        <p className="text-primary-foreground/80 text-lg">Sua oportunidade já está disponível para milhares de talentos.</p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-16 pb-20 max-w-lg relative z-20">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-white ring-1 ring-black/5 overflow-hidden">
                        <CardContent className="p-10 pt-12 text-center">
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                Parabéns! Sua vaga foi enviada com sucesso. Ela passará por uma breve moderação pela nossa equipe e em breve estará disponível no portal.
                            </p>
                            <div className="space-y-4">
                                <Link href="/vagas" className="block">
                                    <Button variant="cta-primary" size="xl" className="w-full">
                                        Ver Vagas Publicadas
                                    </Button>
                                </Link>
                                <Button variant="ghost" onClick={() => setSuccess(false)} className="w-full font-bold text-gray-400 hover:text-primary">
                                    Anunciar outra vaga
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
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

                <div className="container mx-auto relative z-10 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-6 mx-auto md:mx-0">
                            <Sparkles className="h-3 w-3 text-secondary" />
                            Para Empresas
                        </div>
                        <h1 className="font-heading text-4xl md:text-6xl font-black text-white mb-4 leading-[1.1] tracking-tight">
                            Divulgue sua vaga agora <span className="text-secondary italic">gratuitamente</span>
                        </h1>
                        <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl font-medium mb-8 leading-relaxed">
                            Se sua empresa é do agronegócio, a Perfil Agro oferece divulgação gratuita em nossos canais especializados. Uma forma rápida e eficiente de alcançar profissionais qualificados.
                        </p>

                        {/* Como funciona steps - simplified for header */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-3xl">
                            {[
                                "Você envia as informações da vaga",
                                "Perfil Agro realiza divulgação estratégica",
                                "Candidatos se inscrevem",
                                "Você recebe mais alcance e visibilidade"
                            ].map((step, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                                    <div className="h-6 w-6 rounded-full bg-secondary text-primary font-bold flex items-center justify-center text-xs mb-2">{i + 1}</div>
                                    <p className="text-sm text-white/90 leading-tight">{step}</p>
                                </div>
                            ))}
                        </div>
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
                                    <CardTitle className="text-3xl font-black text-gray-900 tracking-tight leading-none">Nova Oportunidade</CardTitle>
                                    <CardDescription className="text-base text-gray-400 font-medium mt-2">Sua vaga passará por aprovação antes de ser publicada.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 md:p-12">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                                    {/* Section 1: Essentials */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Informações Básicas</h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-8">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Título da Vaga <span className="text-red-500">*</span></FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Ex: Engenheiro Agrônomo Sênior" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} value={field.value ?? ''} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <FormField
                                                    control={form.control}
                                                    name="location"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-3">
                                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Localização <span className="text-red-500">*</span></FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Ex: Itapeva/SP, Guarapuava/PR" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} value={field.value ?? ''} />
                                                            </FormControl>
                                                            <FormDescription className="text-[10px] text-gray-400 font-medium ml-1 italic">Dica: Você pode listar várias cidades se necessário.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="type"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-3">
                                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Modalidade <span className="text-red-500">*</span></FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6 shadow-none">
                                                                        <SelectValue placeholder="Selecione o tipo" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                                    <SelectItem value="CLT" className="rounded-xl py-3 px-4 focus:bg-primary/5">CLT + Benefícios</SelectItem>
                                                                    <SelectItem value="PJ" className="rounded-xl py-3 px-4 focus:bg-primary/5">PJ</SelectItem>
                                                                    <SelectItem value="Estágio" className="rounded-xl py-3 px-4 focus:bg-primary/5">Estágio</SelectItem>
                                                                    <SelectItem value="Temporário" className="rounded-xl py-3 px-4 focus:bg-primary/5">Temporário</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="owner_email"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-3">
                                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Email do Responsável <span className="text-red-500">*</span></FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="email@vaga.com.br" className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6" {...field} value={field.value ?? ''} />
                                                            </FormControl>
                                                            <FormDescription className="text-[10px] text-gray-400 font-medium ml-1 italic">Este e-mail receberá os currículos dos candidatos desta vaga.</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-3">
                                                            <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">WhatsApp para Contato <span className="text-red-500">*</span></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="(00) 00000-0000"
                                                                    className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6"
                                                                    {...field}
                                                                    value={field.value ?? ''}
                                                                    onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormDescription className="text-[10px] text-gray-400 font-medium ml-1 italic">Número para contato direto (WhatsApp).</FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Content */}
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Detalhamento</h3>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 px-3 py-1 rounded-lg">
                                                Use Markdown para formatar
                                            </Badge>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Descrição e Requisitos <span className="text-red-500">*</span></FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={`### Formação\n- Ex: Técnico Agrícola ou Engenheiro Agrônomo\n\n### Perfil\n- Conhecimento da cultura de Soja e Milho\n- Experiência com GPS\n\n### Requisitos\n- Disponibilidade para viagens\n- CNH B`}
                                                            className="min-h-[350px] bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all rounded-3xl font-medium p-8 leading-relaxed resize-none font-mono text-sm"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs text-gray-400 font-medium ml-1">
                                                        Dica: Use **### Título** para criar seções e **- Item** para listas, como nas artes clássicas.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Section 3: Media */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
                                                <ImageIcon className="h-5 w-5" />
                                            </div>
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Identidade Visual</h3>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            <div className="flex-1 w-full p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 hover:bg-primary/5 hover:border-primary/30 transition-all text-center group relative overflow-hidden">
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                                                        <Upload className="h-8 w-8 text-primary" />
                                                    </div>
                                                    <p className="font-bold text-gray-900 mb-1">Upload da Imagem</p>
                                                    <p className="text-xs text-gray-400 font-medium">PNG ou JPG (Max 2MB)</p>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {imagePreview && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-white shrink-0 group"
                                                    >
                                                        <Image
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="cta-primary"
                                        size="xl"
                                        className="w-full shadow-2xl shadow-primary/20 mt-6"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                                Publicando...
                                            </>
                                        ) : (
                                            'Publicar Oportunidade'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

