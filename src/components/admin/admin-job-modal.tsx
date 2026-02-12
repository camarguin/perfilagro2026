'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { maskPhone } from "@/lib/masks"

const formSchema = z.object({
    title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
    location: z.string().min(2, 'Localização obrigatória'),
    type: z.string().min(1, 'Selecione um tipo de vaga'),
    description: z.string().optional(),
    category: z.string().min(1, 'Selecione uma área'),
    status: z.enum(['active', 'inactive']),
    owner_email: z.string().email('Email inválido. Ex: seu@email.com').min(5, 'Email muito curto').or(z.literal('')),
    phone: z.string().min(14, 'Telefone incompleto').optional().or(z.literal('')),
})

interface AdminJobModalProps {
    isOpen: boolean
    onClose: () => void
    job?: any // If provided, we are in edit mode
    onSuccess: () => void
}

export function AdminJobModal({ isOpen, onClose, job, onSuccess }: AdminJobModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            location: '',
            type: 'CLT',
            description: '',
            category: 'Outros',
            status: 'active',
            owner_email: '',
            phone: '',
        },
    })

    useEffect(() => {
        if (job) {
            form.reset({
                title: job.title || '',
                location: job.location || '',
                type: job.type || 'CLT',
                description: job.description || '',
                category: job.category || 'Outros',
                status: job.status || 'active',
                owner_email: job.owner_email || '',
                phone: job.phone || '',
            })
            setImagePreview(job.image_url || null)
        } else {
            form.reset({
                title: '',
                location: '',
                type: 'CLT',
                description: '',
                category: 'Outros',
                status: 'active',
                owner_email: '',
                phone: '',
            })
            setImagePreview(null)
        }
        setImageFile(null)
    }, [job, isOpen, form])

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
            let imageUrl = job?.image_url || ''

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

            if (job) {
                // Edit mode
                const { error } = await supabase
                    .from('jobs')
                    .update({
                        ...values,
                        image_url: imageUrl,
                        is_approved: values.status === 'active'
                    })
                    .eq('id', job.id)

                if (error) throw error
                toast.success('Vaga atualizada com sucesso!')
            } else {
                // Create mode
                const { error } = await supabase
                    .from('jobs')
                    .insert({
                        ...values,
                        image_url: imageUrl,
                        is_approved: values.status === 'active'
                    })

                if (error) throw error
                toast.success('Vaga criada com sucesso!')
            }

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error saving job:', error)
            toast.error('Erro ao salvar vaga.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1240px] w-[95vw] max-h-[95vh] rounded-[2rem] p-12 border-none shadow-2xl ring-1 ring-black/5 flex flex-col gap-0 outline-none">
                <DialogHeader className="mb-10">
                    <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight">{job ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
                    <DialogDescription className="text-gray-500 font-medium text-base">
                        Preencha os dados abaixo. Vagas sem descrição serão exibidas apenas como flyer no portal.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                        {/* Compact Top Bar */}
                        <div className="grid grid-cols-12 gap-8 items-end">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-3">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Título da Vaga</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Engenheiro Agrônomo" className="h-12 text-sm bg-gray-50 border-none rounded-xl px-5 focus:ring-2 focus:ring-primary/10 transition-all font-medium" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-3">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cidade / UF</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Itapeva/SP" className="h-12 text-sm bg-gray-50 border-none rounded-xl px-5 focus:ring-2 focus:ring-primary/10 transition-all font-medium" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Área / Categoria</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 text-sm bg-gray-50 border-none rounded-xl px-4 shadow-none font-medium">
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

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="col-span-6 lg:col-span-2">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Modalidade</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 text-sm bg-gray-50 border-none rounded-xl px-4 shadow-none font-medium">
                                                    <SelectValue placeholder="Tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                <SelectItem value="CLT">CLT</SelectItem>
                                                <SelectItem value="PJ">PJ</SelectItem>
                                                <SelectItem value="Estágio">Estágio</SelectItem>
                                                <SelectItem value="Temporário">Temporário</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="col-span-6 lg:col-span-2">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visibilidade</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={`h-12 text-[10px] border-none rounded-xl px-4 shadow-none font-black uppercase tracking-widest ${field.value === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                <SelectItem value="active" className="text-green-600 font-bold">Ativa</SelectItem>
                                                <SelectItem value="inactive" className="text-red-500 font-bold">Inativa</SelectItem>
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
                                    <FormItem className="col-span-12 lg:col-span-4 mt-4 lg:mt-0">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email do Responsável (Notificações)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@exemplo.com.br" className="h-12 text-sm bg-gray-50 border-none rounded-xl px-5 focus:ring-2 focus:ring-primary/10 transition-all font-medium" {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-4 mt-4 lg:mt-0">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">WhatsApp para Contato</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="(00) 00000-0000"
                                                className="h-12 text-sm bg-gray-50 border-none rounded-xl px-5 focus:ring-2 focus:ring-primary/10 transition-all font-medium"
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

                        {/* Main Interaction Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <FormItem className="space-y-3">
                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Flyer da Vaga</FormLabel>
                                <div className="relative h-64 w-full border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50 hover:bg-primary/5 hover:border-primary/20 transition-all text-center group cursor-pointer overflow-hidden shadow-inner">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                                        {imagePreview ? (
                                            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-lg border border-white">
                                                <Image src={imagePreview} alt="Preview" fill className="object-contain bg-white" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <Upload className="h-8 w-8 text-white" />
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Trocar Flyer</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-4 rounded-2xl bg-white shadow-sm text-primary mb-3 group-hover:scale-110 transition-transform ring-1 ring-black/5">
                                                    <ImageIcon className="h-8 w-8" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 leading-tight">Arraste ou clique</p>
                                                <p className="text-[10px] text-gray-400 mt-1 font-medium">Formato PNG ou JPG</p>
                                            </>
                                        )}
                                    </div>
                                    <Input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full w-full" />
                                </div>
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-[10px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg h-7 px-3"
                                        onClick={() => {
                                            setImageFile(null)
                                            setImagePreview(job?.image_url || null)
                                        }}
                                    >
                                        Remover flyer selecionado
                                    </Button>
                                )}
                            </FormItem>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col h-full">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Descrição / Requisitos</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={`### Formação\n- Ex: Técnico Agrícola ou Engenheiro Agrônomo\n\n### Perfil\n- Conhecimento da cultura de Soja e Milho\n- Experiência com GPS\n\n### Requisitos\n- Disponibilidade para viagens\n- CNH B`}
                                                className="flex-1 min-h-[16rem] max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent text-sm bg-gray-50 border-none rounded-[1.5rem] p-6 resize-none leading-relaxed focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                                {...field}
                                                value={field.value ?? ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Sticky Footer */}
                        <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-4">
                            <p className="text-[10px] text-gray-400 font-medium italic">
                                * Sugestão: Use a descrição para melhorar o SEO se a imagem não contiver texto.
                            </p>
                            <div className="flex items-center gap-4">
                                <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-10 px-6 font-bold text-gray-400">
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="cta-primary" disabled={isSubmitting} className="h-11 min-w-[200px] rounded-xl shadow-xl shadow-primary/20 text-sm font-bold">
                                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : (job ? 'Atualizar Vaga' : 'Publicar Vaga')}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
