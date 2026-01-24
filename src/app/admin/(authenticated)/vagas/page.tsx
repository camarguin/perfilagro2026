'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MoreHorizontal, Loader2, Search, X, Archive, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminVagasPage() {
    const [jobs, setJobs] = useState<any[]>([])
    const [filteredJobs, setFilteredJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchJobs()
    }, [])

    async function fetchJobs() {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setJobs(data || [])
            setFilteredJobs(data || [])
        } catch (error) {
            console.error('Error fetching jobs:', error)
            toast.error('Erro ao carregar vagas.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const results = jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredJobs(results)
    }, [searchTerm, jobs])

    async function toggleApproval(id: string, currentStatus: boolean) {
        try {
            setActionLoading(id)
            const { error } = await supabase
                .from('jobs')
                .update({ is_approved: !currentStatus })
                .eq('id', id)

            if (error) throw error

            // Local update for instant feedback
            setJobs(prev => prev.map(j => j.id === id ? { ...j, is_approved: !currentStatus } : j))
            toast.success(currentStatus ? "Vaga desaprovada." : "Vaga aprovada com sucesso!")
        } catch (error) {
            console.error('Error updating job status:', error)
            toast.error('Erro ao atualizar status da vaga.')
        } finally {
            setActionLoading(null)
        }
    }

    async function deleteJob(id: string) {
        try {
            setActionLoading(id)

            // Primeiro deletar aplicações para evitar erro de FK
            await supabase.from('applications').delete().eq('job_id', id)

            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id)

            if (error) throw error

            setJobs(prev => prev.filter(j => j.id !== id))
            toast.success("Vaga excluída permanentemente.")
        } catch (error) {
            console.error('Error deleting job:', error)
            toast.error('Erro ao excluir vaga.')
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">Gestão de Vagas</h1>
                        <p className="text-muted-foreground font-medium">Controle as oportunidades publicadas no portal.</p>
                    </div>
                    <Link href="/anunciar-vaga">
                        <Button variant="cta-primary" size="lg" className="shadow-primary/20 rounded-2xl">
                            <Plus className="h-5 w-5 mr-2" /> Nova Oportunidade
                        </Button>
                    </Link>
                </div>

                {/* Compact Filters - Matching Candidates Page */}
                <Card className="border-none shadow-sm rounded-3xl ring-1 ring-black/5 bg-white p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-[300px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por título, local ou empresa..."
                                className="pl-11 h-11 bg-gray-50 border-none rounded-xl font-medium focus:ring-2 focus:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                className="h-11 px-3 text-gray-400 font-bold gap-2 hover:bg-gray-50 rounded-xl"
                                onClick={() => setSearchTerm('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </Card>

                <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden ring-1 ring-black/5 bg-white">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-gray-100 bg-gray-50/50">
                                        <TableHead className="px-8 font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Título da Oportunidade</TableHead>
                                        <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Modelo / Local</TableHead>
                                        <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14 text-center">Status</TableHead>
                                        <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14 text-center">Aprovação</TableHead>
                                        <TableHead className="text-right px-8 font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-60 text-center">
                                                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary/20" />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredJobs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-60 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <Search className="h-12 w-12 mb-4 opacity-10" />
                                                    <p className="font-bold text-lg">Nenhuma vaga encontrada</p>
                                                    <p className="text-sm">Tente ajustar sua busca ou filtros.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredJobs.map((job) => (
                                        <TableRow key={job.id} className="hover:bg-gray-50/50 transition-colors border-gray-100 group">
                                            <TableCell className="px-8 flex flex-col pt-6 pb-6">
                                                <span className="font-black text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">{job.title}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-wider">{job.company_name || 'Empresa Confidencial'}</span>
                                                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                                                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{new Date(job.created_at).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="outline" className="w-fit bg-gray-50 text-gray-400 border-none font-bold text-[9px] rounded-lg tracking-widest uppercase">
                                                        {job.type}
                                                    </Badge>
                                                    <span className="text-xs font-bold text-gray-500">{job.location}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${job.status === 'active'
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-red-50 text-red-500'
                                                    }`}>
                                                    {job.status === 'active' ? 'Ativa' : 'Inativa'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant={job.is_approved ? "secondary" : "cta-primary"}
                                                            size="sm"
                                                            disabled={actionLoading === job.id}
                                                            className={`h-9 font-black text-[10px] uppercase tracking-widest px-5 rounded-xl shadow-none transition-all ${job.is_approved ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : ''}`}
                                                            onClick={() => toggleApproval(job.id, job.is_approved)}
                                                        >
                                                            {actionLoading === job.id ? <Loader2 className="h-3 w-3 animate-spin" /> : (job.is_approved ? 'Desaprovar' : 'Aprovar')}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {job.is_approved ? 'Remover do portal publico' : 'Publicar no portal'}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className="text-right px-8">
                                                <div className="flex justify-end gap-2">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link href={`/vagas/${job.id}`} target="_blank">
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                                                                    <Eye className="h-5 w-5" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Visualizar Publicação</TooltipContent>
                                                    </Tooltip>

                                                    <AlertDialog>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-10 w-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                    >
                                                                        <Trash2 className="h-5 w-5" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Excluir Permanentemente</TooltipContent>
                                                        </Tooltip>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Excluir Vaga?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta ação não pode ser desfeita. A vaga <strong>{job.title}</strong> e todos os seus dados serão deletados para sempre.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Voltar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 hover:bg-red-700 text-white rounded-2xl"
                                                                    onClick={() => deleteJob(job.id)}
                                                                >
                                                                    Sim, Excluir
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    )
}
