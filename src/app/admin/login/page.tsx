'use client'

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

import { useSearchParams } from "next/navigation";

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(
        searchParams.get('error') === 'unauthorized'
            ? "Acesso negado: Este email não está cadastrado como administrador."
            : null
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError("Credenciais inválidas. Verifique seu email e senha.");
                return;
            }

            router.push("/admin/dashboard");
        } catch (err) {
            setError("Ocorreu um erro inesperado. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-black/5 relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary opacity-50" />
            <CardHeader className="text-center pt-12 pb-8 px-10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Sprout className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Painel Administrativo</CardTitle>
                <CardDescription className="text-base font-medium text-gray-400 mt-2">
                    Bem-vindo de volta ao <span className="text-primary font-bold">Perfil Agro</span>.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
                <CardContent className="space-y-6 px-10">
                    {error && (
                        <Alert variant="destructive" className="rounded-xl border-none bg-red-50 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs font-bold uppercase tracking-wider">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Administrativo</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@perfilagro.com.br"
                            className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-2 focus:ring-primary transition-all rounded-xl font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Senha de Acesso</Label>
                            <Button variant="link" className="h-auto p-0 text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest" type="button">Esqueci a senha</Button>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-2 focus:ring-primary transition-all rounded-xl font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 transition-colors hover:bg-gray-50">
                        <Checkbox
                            id="rememberMe"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked === true)}
                            className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="rememberMe"
                                className="text-xs font-bold text-gray-600 cursor-pointer select-none"
                            >
                                Mantenha-me conectado
                            </label>
                            <p className="text-[10px] text-gray-400 font-medium">
                                Recomendado apenas em computadores pessoais.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-6 pt-4 pb-12 px-10">
                    <Button
                        type="submit"
                        variant="cta-primary"
                        size="xl"
                        className="w-full shadow-lg shadow-primary/20"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            "Acessar Painel"
                        )}
                    </Button>
                    <Link href="/" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                        ← Voltar para o site público
                    </Link>
                </CardFooter>
            </form>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden px-4">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed74a62?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 grayscale" />
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

            <Suspense fallback={<div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
