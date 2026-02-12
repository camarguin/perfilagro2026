'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function JobFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [location, setLocation] = useState(searchParams.get('l') || 'all')
    const [type, setType] = useState(searchParams.get('t') || 'all')

    function handleApplyFilters() {
        const params = new URLSearchParams(searchParams.toString())

        if (location !== 'all') {
            params.set('l', location)
        } else {
            params.delete('l')
        }

        if (type !== 'all') {
            params.set('t', type)
        } else {
            params.delete('t')
        }

        router.push(`/vagas?${params.toString()}`)
    }

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Localização</label>
                <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="bg-muted/50 border-none h-12 text-base font-medium">
                        <SelectValue placeholder="Todos os estados" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os estados</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tipo de Contrato</label>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="bg-muted/50 border-none h-12 text-base font-medium">
                        <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        <SelectItem value="CLT">CLT</SelectItem>
                        <SelectItem value="PJ">PJ</SelectItem>
                        <SelectItem value="Estágio">Estágio</SelectItem>
                        <SelectItem value="Temporário">Temporário</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                variant="cta-primary"
                className="w-full h-14 text-lg"
                onClick={handleApplyFilters}
            >
                Aplicar Filtros
            </Button>
        </div>
    )
}
