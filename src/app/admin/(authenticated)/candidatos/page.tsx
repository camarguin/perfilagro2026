'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, FileText, MoreHorizontal, Download, Loader2, Search, Filter, X, Trash2, Briefcase } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { useSearchParams, useRouter } from 'next/navigation'

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

export default function AdminCandidatosPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const urlJobId = searchParams.get('jobId')

    const [candidates, setCandidates] = useState<any[]>([])
    const [filteredCandidates, setFilteredCandidates] = useState<any[]>([])
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusLoading, setStatusLoading] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    // Filter States
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [filterSeniority, setFilterSeniority] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterJobId, setFilterJobId] = useState(urlJobId || 'all')

    useEffect(() => {
        fetchInitialData()
    }, [])

    async function fetchInitialData() {
        setLoading(true)
        await Promise.all([
            fetchCandidates(),
            fetchJobs()
        ])
        setLoading(false)
    }

    async function fetchJobs() {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('id, title')
                .order('title', { ascending: true })
            if (error) throw error
            setJobs(data || [])
        } catch (error) {
            console.error('Error fetching jobs:', error)
        }
    }

    useEffect(() => {
        applyFilters()
    }, [candidates, searchTerm, filterCategory, filterSeniority, filterStatus])

    async function fetchCandidates() {
        try {
            const { data, error } = await supabase
                .from('candidates')
                .select('*, jobs(title)')
                .order('created_at', { ascending: false })

            if (error) throw error
            setCandidates(data || [])
        } catch (error) {
            console.error('Error fetching candidates:', error)
        }
    }

    function applyFilters() {
        let result = [...candidates]

        if (searchTerm) {
            result = result.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.region?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (filterCategory !== 'all') {
            result = result.filter(c => c.category === filterCategory)
        }

        if (filterSeniority !== 'all') {
            result = result.filter(c => c.seniority === filterSeniority)
        }

        if (filterStatus !== 'all') {
            result = result.filter(c => c.status === filterStatus)
        }

        if (filterJobId !== 'all') {
            if (filterJobId === 'direct') {
                result = result.filter(c => !c.job_id)
            } else {
                result = result.filter(c => c.job_id === filterJobId)
            }
        }

        setFilteredCandidates(result)
    }

    async function updateStatus(id: string, newStatus: string) {
        try {
            console.log(`Updating status for ${id} to ${newStatus}`);
            setStatusLoading(id)
            const { data, error } = await supabase
                .from('candidates')
                .update({ status: newStatus })
                .eq('id', id)
                .select()

            if (error) {
                console.error("Supabase update error:", error);
                throw error
            }

            console.log("Supabase update success:", data);

            // Optimization: Update local state immediately for instant feedback
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
            setFilteredCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))

            toast.success("Status atualizado!")
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error("Erro ao atualizar status.")
            // Revert optimistic update if needed, fetching again
            fetchCandidates()
        } finally {
            setStatusLoading(null)
        }
    }

    async function deleteCandidate(id: string, resumeUrl: string | null) {
        try {
            setIsDeleting(id)

            // 1. Delete from DB
            const { error: dbError } = await supabase
                .from('candidates')
                .delete()
                .eq('id', id)

            if (dbError) throw dbError

            // 2. Delete from Storage if exists
            if (resumeUrl) {
                const { error: storageError } = await supabase.storage
                    .from('resumes')
                    .remove([resumeUrl])

                if (storageError) {
                    console.error('Error deleting file from storage:', storageError)
                    // We don't throw here to not block the UI if the file is already gone
                }
            }

            setCandidates(prev => prev.filter(c => c.id !== id))
            toast.success("Candidato excluído permanentemente.")
        } catch (error) {
            console.error('Error deleting:', error)
            toast.error("Erro ao excluir candidato.")
        } finally {
            setIsDeleting(null)
        }
    }

    async function handleDownloadResume(path: string) {
        const promise = new Promise(async (resolve, reject) => {
            try {
                const { data, error } = await supabase.storage
                    .from('resumes')
                    .createSignedUrl(path, 60)

                if (error) throw error
                window.open(data.signedUrl, '_blank')
                resolve(true)
            } catch (error) {
                console.error('Error getting resume link:', error)
                reject(error)
            }
        })

        toast.promise(promise, {
            loading: 'Gerando link do currículo...',
            success: 'Pronto!',
            error: 'Erro ao abrir currículo.',
        })
    }

    function handleExport() {
        const headers = ["Nome", "Email", "Telefone", "Cidade/Estado", "Vaga de Interesse", "Nível", "Área", "Status", "Data Cadastro"]
        const csvContent = [
            headers.join(","),
            ...filteredCandidates.map(c => [
                `"${c.name}"`,
                `"${c.email}"`,
                `"${c.phone}"`,
                `"${c.region || ''}"`,
                `"${c.jobs?.title || 'Banco Geral'}"`,
                `"${c.seniority || ''}"`,
                `"${c.category || ''}"`,
                `"${c.status || 'Novo'}"`,
                `"${new Date(c.created_at).toLocaleDateString('pt-BR')}"`
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `candidatos_perfilagro_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    function clearFilters() {
        setSearchTerm('')
        setFilterCategory('all')
        setFilterSeniority('all')
        setFilterStatus('all')
        setFilterJobId('all')
    }

    return (
        <TooltipProvider>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">Banco de Talentos</h1>
                        <p className="text-muted-foreground font-medium">Gestão profissional e filtragem de candidatos.</p>
                        <p className="text-[10px] text-gray-400 mt-2 italic flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                            <strong>O que é o Banco Geral?</strong> Candidatos que enviaram currículo espontaneamente para o pool de talentos, sem selecionar uma vaga ativa.
                        </p>
                    </div>
                    <Button onClick={handleExport} variant="outline" size="lg" className="border-2 rounded-2xl group shadow-sm bg-white">
                        <Download className="h-5 w-5 mr-2 group-hover:translate-y-0.5 transition-transform" /> Exportar Planilha
                    </Button>
                </div>

                {/* Compact Filters */}
                <Card className="border-none shadow-sm rounded-3xl ring-1 ring-black/5 bg-white p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-[200px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-11 h-11 bg-gray-50 border-none rounded-xl font-medium focus:ring-2 focus:ring-primary/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="h-11 w-[160px] bg-gray-50 border-none rounded-xl font-medium shadow-none">
                                <SelectValue placeholder="Área" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                <SelectItem value="all">Todas as Áreas</SelectItem>
                                <SelectItem value="Agronômico / Técnico">Agronômico</SelectItem>
                                <SelectItem value="Comercial / Vendas">Comercial</SelectItem>
                                <SelectItem value="Operacional / Maquinário">Operacional</SelectItem>
                                <SelectItem value="Gestão / Administrativo">Gestão</SelectItem>
                                <SelectItem value="Pecuária">Pecuária</SelectItem>
                                <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterSeniority} onValueChange={setFilterSeniority}>
                            <SelectTrigger className="h-11 w-[140px] bg-gray-50 border-none rounded-xl font-medium shadow-none">
                                <SelectValue placeholder="Nível" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                <SelectItem value="all">Níveis</SelectItem>
                                <SelectItem value="Estagiário">Estagiário</SelectItem>
                                <SelectItem value="Júnior">Júnior</SelectItem>
                                <SelectItem value="Pleno">Pleno</SelectItem>
                                <SelectItem value="Sênior">Sênior</SelectItem>
                                <SelectItem value="Especialista / Gestor">Especialista</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="h-11 w-[140px] bg-gray-50 border-none rounded-xl font-medium shadow-none">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                <SelectItem value="all">Status</SelectItem>
                                <SelectItem value="Novo">Novo</SelectItem>
                                <SelectItem value="Em Análise">Em Análise</SelectItem>
                                <SelectItem value="Entrevista">Entrevista</SelectItem>
                                <SelectItem value="Contratado">Contratado</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filterJobId} onValueChange={setFilterJobId}>
                            <SelectTrigger className="h-11 w-[180px] bg-gray-50 border-none rounded-xl font-medium shadow-none">
                                <SelectValue placeholder="Vaga" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                <SelectItem value="all">Todas as Vagas</SelectItem>
                                <SelectItem value="direct">Banco Geral</SelectItem>
                                {jobs.map(job => (
                                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" className="h-11 px-3 text-gray-400 font-bold gap-2 hover:bg-gray-50 rounded-xl" onClick={clearFilters}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>

                <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden ring-1 ring-black/5 bg-white">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-gray-100 bg-gray-50/50">
                                        <TableHead className="px-8 font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Candidato</TableHead>
                                        <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Data</TableHead>
                                        <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Perfil & Local</TableHead>
                                        <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Área / Senioridade</TableHead>
                                        <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Status</TableHead>
                                        <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14 text-center">Currículo</TableHead>
                                        <TableHead className="text-right px-8 font-bold uppercase tracking-widest text-[10px] text-gray-400 h-14">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-40 text-center">
                                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary/40" />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCandidates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-40 text-center text-gray-400 font-medium font-heading">
                                                Nenhum candidato encontrado com estes filtros.
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCandidates.map((candidate) => {
                                        const isNew = (new Date().getTime() - new Date(candidate.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
                                        return (
                                            <TableRow key={candidate.id} className="hover:bg-gray-50/50 transition-all border-gray-100 group">
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">{candidate.name}</span>
                                                            {isNew && (
                                                                <Badge className="bg-red-500 text-white text-[8px] px-1.5 py-0 h-4 uppercase tracking-wider font-black border-none animate-pulse">Novo</Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px] uppercase tracking-wider">{candidate.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs font-bold text-gray-500">
                                                        {new Date(candidate.created_at).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-600">{candidate.region || 'Não inf.'}</span>
                                                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                                                            {candidate.jobs?.title || 'Banco Geral'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">{candidate.category}</span>
                                                        <Badge variant="outline" className="w-fit text-[9px] font-bold uppercase tracking-widest rounded-md border-primary/20 bg-primary/5 text-primary">
                                                            {candidate.seniority}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        defaultValue={candidate.status || 'Novo'}
                                                        onValueChange={(val) => updateStatus(candidate.id, val)}
                                                    >
                                                        <SelectTrigger className={`h-8 w-fit min-w-[120px] text-[9px] font-black uppercase tracking-widest border-none shadow-none rounded-lg px-3 ${candidate.status === 'Contratado' ? 'bg-green-100 text-green-700' :
                                                            candidate.status === 'Entrevista' ? 'bg-blue-100 text-blue-700' :
                                                                candidate.status === 'Em Análise' ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border-none shadow-2xl p-1">
                                                            <SelectItem value="Novo" className="text-[9px] font-black uppercase rounded-lg">Novo</SelectItem>
                                                            <SelectItem value="Em Análise" className="text-[9px] font-black uppercase rounded-lg">Em Análise</SelectItem>
                                                            <SelectItem value="Entrevista" className="text-[9px] font-black uppercase rounded-lg">Entrevista</SelectItem>
                                                            <SelectItem value="Contratado" className="text-[9px] font-black uppercase rounded-lg">Contratado</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {candidate.resume_url ? (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 rounded-xl hover:bg-primary hover:text-white transition-all shadow-none"
                                                                    onClick={() => handleDownloadResume(candidate.resume_url)}
                                                                >
                                                                    <FileText className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Abrir Currículo</TooltipContent>
                                                        </Tooltip>
                                                    ) : (
                                                        <span className="text-[9px] font-black text-gray-200 uppercase tracking-widest">N/A</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right px-8">
                                                    <div className="flex justify-end gap-2">
                                                        <AlertDialog>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                                            disabled={isDeleting === candidate.id}
                                                                        >
                                                                            {isDeleting === candidate.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Excluir Permanentemente</TooltipContent>
                                                            </Tooltip>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-red-600">Excluir Permanentemente?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta ação é irreversível. O candidato <strong>{candidate.name}</strong> será removido do banco de dados e seu currículo será excluído do armazenamento para liberar espaço.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => deleteCandidate(candidate.id, candidate.resume_url)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                                    >
                                                                        Sim, Excluir Agora
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    )
}
