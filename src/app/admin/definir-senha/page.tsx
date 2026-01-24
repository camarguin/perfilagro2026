'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DefinirSenhaPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if we have a session (invitation link usually creates one)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session, they might have clicked an expired link or are trying to browse here directly
                // We'll let them try to update, but Supabase will fail if not auth
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 2000);
        } catch (err) {
            setError("Ocorreu um erro inesperado. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white p-10 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-black text-gray-900">Senha Definida!</CardTitle>
                    <p className="text-gray-500 mt-2 font-medium">Sua conta foi ativada com sucesso. Redirecionando para o painel...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden px-4">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

            <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-black/5 relative z-10 overflow-hidden">
                <CardHeader className="text-center pt-12 pb-8 px-10">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
                        <Sprout className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">Crie sua Senha</CardTitle>
                    <CardDescription className="text-base font-medium text-gray-400 mt-2">
                        Para ativar seu acesso ao <span className="text-primary font-bold">Perfil Agro</span>.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdatePassword}>
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
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nova Senha</Label>
                            <Input
                                type="password"
                                className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-2 focus:ring-primary transition-all rounded-xl font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirmar Senha</Label>
                            <Input
                                type="password"
                                className="h-14 bg-gray-50 border-none focus:bg-white focus:ring-2 focus:ring-primary transition-all rounded-xl font-medium"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="******"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 pb-12 px-10">
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
                                    Ativando...
                                </>
                            ) : (
                                "Ativar Conta"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
