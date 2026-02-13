'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sprout, ShieldCheck, Loader2 } from 'lucide-react'
import { useState } from 'react'

function ConfirmContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/admin/dashboard'

    const handleConfirm = () => {
        setIsLoading(true)
        // Redirect to the actual callback route that handles the exchange
        // This second step ensures that scanners don't consume the code
        const callbackUrl = new URL('/auth/callback', window.location.origin)
        callbackUrl.searchParams.set('code', code || '')
        callbackUrl.searchParams.set('next', next)

        router.push(callbackUrl.toString())
    }

    if (!code) {
        return (
            <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white text-center p-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-black text-destructive">Link Inválido</CardTitle>
                    <CardDescription>O código de acesso não foi encontrado ou é inválido.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full" onClick={() => router.push('/admin/login')}>
                        Voltar para Login
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] bg-white ring-1 ring-black/5 relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            <CardHeader className="text-center pt-12 pb-8 px-10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
                    <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Verificação de Segurança</CardTitle>
                <CardDescription className="text-base font-medium text-gray-400 mt-2">
                    Clique no botão abaixo para confirmar seu acesso ao <span className="text-primary font-bold">Perfil Agro</span>.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-12">
                <Button
                    onClick={handleConfirm}
                    variant="cta-primary"
                    size="xl"
                    className="w-full shadow-lg shadow-primary/20"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processando...
                        </>
                    ) : (
                        "Confirmar Acesso"
                    )}
                </Button>

                <p className="text-[10px] text-gray-400 text-center mt-6 font-medium leading-relaxed">
                    Esta etapa extra garante que seu convite não expire acidentalmente por sistemas automáticos de leitura de e-mail.
                </p>
            </CardContent>
        </Card>
    )
}

export default function ConfirmPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden px-4">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed74a62?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 grayscale" />
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
                <ConfirmContent />
            </Suspense>
        </div>
    )
}
