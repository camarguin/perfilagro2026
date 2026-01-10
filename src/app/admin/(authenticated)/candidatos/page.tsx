'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileText, MoreHorizontal, Download, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminCandidatosPage() {
    const [candidates, setCandidates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCandidates()
    }, [])

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
        } finally {
            setLoading(false)
        }
    }

    async function handleDownloadResume(path: string) {
        try {
            const { data, error } = await supabase.storage
                .from('resumes')
                .createSignedUrl(path, 60) // 1 minute link

            if (error) throw error
            window.open(data.signedUrl, '_blank')
        } catch (error) {
            console.error('Error getting resume link:', error)
            alert('Erro ao carregar currículo.')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">Banco de Talentos</h1>
                    <p className="text-muted-foreground font-medium">Gerencie os profissionais que se candidataram às vagas.</p>
                </div>
                <Button variant="outline" size="lg" className="border-2 rounded-2xl group shadow-sm bg-white">
                    <Download className="h-5 w-5 mr-2 group-hover:translate-y-0.5 transition-transform" /> Exportar Planilha
                </Button>
            </div>

            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden ring-1 ring-black/5 bg-white">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-6 w-1 bg-secondary rounded-full"></div>
                        Candidatos Cadastrados
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-gray-100">
                                    <TableHead className="px-8 font-bold uppercase tracking-widest text-[10px] text-gray-400">Nome do Candidato</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Vaga Aplicada</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Contato</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Data</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Currículo</TableHead>
                                    <TableHead className="text-right px-8 font-bold uppercase tracking-widest text-[10px] text-gray-400">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-40 text-center">
                                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary/40" />
                                        </TableCell>
                                    </TableRow>
                                ) : candidates.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-40 text-center text-gray-400 font-medium">
                                            Nenhum candidato encontrado no momento.
                                        </TableCell>
                                    </TableRow>
                                ) : candidates.map((candidate) => (
                                    <TableRow key={candidate.id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                                        <TableCell className="px-8 font-bold text-gray-900 leading-tight">
                                            <div className="flex flex-col">
                                                <span>{candidate.name}</span>
                                                <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px]">{candidate.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="bg-primary/5 text-primary text-[11px] font-bold px-3 py-1 rounded-lg w-fit">
                                                {candidate.jobs?.title || 'Vaga Direta'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500 font-medium whitespace-nowrap">{candidate.phone}</TableCell>
                                        <TableCell className="text-gray-500 font-medium whitespace-nowrap text-xs">{new Date(candidate.created_at).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell>
                                            {candidate.resume_url ? (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 gap-2 font-bold text-[10px] uppercase tracking-widest"
                                                    onClick={() => handleDownloadResume(candidate.resume_url)}
                                                >
                                                    <FileText className="h-3.5 w-3.5" /> Abrir PDF
                                                </Button>
                                            ) : (
                                                <span className="text-[10px] font-black text-gray-300 uppercase italic">Indisponível</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right px-8">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-primary transition-colors">
                                                <MoreHorizontal className="h-5 w-5" />
                                                <span className="sr-only">Ações</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
