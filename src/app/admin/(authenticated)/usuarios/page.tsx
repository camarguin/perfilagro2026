'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { supabase } from '@/lib/supabase'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface UserRole {
    id: string
    email: string
    role: string
    created_at: string
}

import { inviteAdmin } from './actions'

export default function UsersPage() {
    const [users, setUsers] = useState<UserRole[]>([])
    const [loading, setLoading] = useState(true)
    const [newEmail, setNewEmail] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleAddUser() {
        if (!newEmail) return

        setIsAdding(true)
        try {
            const result = await inviteAdmin(newEmail)

            if (result.error) {
                toast.error('Erro ao convidar: ' + result.error)
                return
            }

            setNewEmail('')
            setIsOpen(false)
            fetchUsers()
            toast.success('Convite enviado com sucesso para: ' + newEmail)
        } catch (error: any) {
            console.error('Error adding user:', error)
            toast.error('Erro inesperado: ' + error.message)
        } finally {
            setIsAdding(false)
        }
    }

    const [userToDelete, setUserToDelete] = useState<string | null>(null)

    async function handleRemoveUser() {
        if (!userToDelete) return

        try {
            const { error } = await supabase
                .from('user_roles')
                .delete()
                .eq('id', userToDelete)

            if (error) throw error

            fetchUsers()
            toast.success('Usuário removido com sucesso.')
        } catch (error) {
            console.error('Error removing user:', error)
            toast.error('Erro ao remover usuário.')
        } finally {
            setUserToDelete(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
                    <p className="text-muted-foreground">
                        Gerencie quem tem acesso ao painel administrativo.
                    </p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Administrador</DialogTitle>
                            <DialogDescription>
                                Digite o email do novo administrador.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="col-span-3"
                                    placeholder="usuario@exemplo.com"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddUser} disabled={isAdding} className="bg-green-600 hover:bg-green-700">
                                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Adicionar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Administradores</CardTitle>
                    <CardDescription>Lista de usuários com permissão de acesso.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead>Criado em</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                        Nenhum administrador encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="capitalize">{user.role}</TableCell>
                                        <TableCell>{new Date(user.created_at).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setUserToDelete(user.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser descrita. Isso excluirá permanentemente o usuário
                            e removerá seus dados de nossos servidores.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveUser}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
