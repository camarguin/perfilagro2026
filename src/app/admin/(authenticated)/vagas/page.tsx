'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, MoreHorizontal, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default function AdminVagasPage() {
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

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
        } catch (error) {
            console.error('Error fetching jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-foreground">Gerenciamento de Vagas</h1>
                    <p className="text-muted-foreground font-medium">Controle total sobre as oportunidades publicadas.</p>
                </div>
                <Link href="/anunciar-vaga">
                    <Button variant="cta-primary" size="lg" className="shadow-primary/20">
                        <Plus className="h-5 w-5 mr-2" /> Nova Oportunidade
                    </Button>
                </Link>
            </div>

            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden ring-1 ring-black/5 bg-white">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-6 w-1 bg-primary rounded-full"></div>
                        Vagas Ativas no Sistema
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-gray-100">
                                <TableHead className="px-8 font-bold uppercase tracking-widest text-[10px] text-gray-400">Título da Oportunidade</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Modelo</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Local</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Publicação</TableHead>
                                <TableHead className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Status</TableHead>
                                <TableHead className="text-right px-8 font-bold uppercase tracking-widest text-[10px] text-gray-400">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary/40" />
                                    </TableCell>
                                </TableRow>
                            ) : jobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center text-gray-400 font-medium">
                                        Nenhuma vaga encontrada no banco de dados.
                                    </TableCell>
                                </TableRow>
                            ) : jobs.map((job) => (
                                <TableRow key={job.id} className="hover:bg-gray-50/50 transition-colors border-gray-100">
                                    <TableCell className="px-8 font-bold text-gray-900">{job.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-muted text-muted-foreground font-bold text-[10px] rounded-lg">{job.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500 font-medium">{job.location}</TableCell>
                                    <TableCell className="text-gray-500 font-medium">{new Date(job.created_at).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest ${job.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {job.status === 'active' ? 'Ativa' : 'Inativa'}
                                        </span>
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
                </CardContent>
            </Card>

        </div>
    )
}
