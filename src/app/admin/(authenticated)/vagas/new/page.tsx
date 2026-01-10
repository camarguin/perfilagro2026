import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import Link from "next/link";

export default function NewJobPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/vagas">
                    <Button variant="outline" size="icon">
                        <X className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-heading font-bold tracking-tight">Nova Vaga</h1>
                    <p className="text-muted-foreground">Preencha os dados e faça o upload da imagem da vaga.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações da Vaga</CardTitle>
                    <CardDescription>
                        A imagem é o item principal. O texto será usado para busca e SEO.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título da Vaga</Label>
                        <Input id="title" placeholder="Ex: Gerente de Fazenda" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Empresa</Label>
                            <Input id="company" placeholder="Nome da empresa contratante" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Localização</Label>
                            <Input id="location" placeholder="Cidade - UF" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Flyer / Imagem da Vaga (PNG/JPG)</Label>
                        <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-sm font-medium mb-1">Clique para fazer upload ou arraste e solte</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG até 5MB</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição (Opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Breve descrição para ajudar na busca..."
                            className="h-24"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button className="w-full">Publicar Vaga</Button>
                        <Button variant="outline" className="w-full">Salvar Rascunho</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
