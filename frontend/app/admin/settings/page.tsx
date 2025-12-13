"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  Trash2,
  Crown,
  Lock,
  Palette,
  Type,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { AdminLayout, SettingsPageSkeleton } from "@/components/admin";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { user, getValidToken, updateUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (user?.username) {
        setUsername(user.username);
      }
      if (user?.avatarUrl) {
        setAvatarUrl(user.avatarUrl);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async (value: string) => {
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    // If same as current username, it's available
    if (value === user?.username) {
      setUsernameAvailable(null);
      return;
    }

    const token = await getValidToken();
    if (!token) return;

    setCheckingUsername(true);
    try {
      const result = await api.checkUsername(value, token);
      setUsernameAvailable(result.available);
    } catch (error) {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const saveUsername = async () => {
    const token = await getValidToken();
    if (!token || !usernameAvailable) return;

    setSaving(true);
    try {
      await api.updateUsername(username, token);
      updateUser({ username });
      setUsernameAvailable(null);
      toast({ title: "Username atualizado!", variant: "success" });
    } catch (error) {
      console.error("Failed to save username:", error);
      toast({ title: "Erro ao salvar username", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveAvatar = async () => {
    const token = await getValidToken();
    if (!token) return;

    setSavingAvatar(true);
    try {
      await api.updateAvatar(avatarUrl, token);
      updateUser({ avatarUrl });
      toast({ title: "Avatar atualizado!", variant: "success" });
    } catch (error) {
      console.error("Failed to save avatar:", error);
      toast({ title: "Erro ao salvar avatar", variant: "destructive" });
    } finally {
      setSavingAvatar(false);
    }
  };

  const savePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "As senhas nao conferem", variant: "destructive" });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: "A nova senha deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }

    const token = await getValidToken();
    if (!token) return;

    setSavingPassword(true);
    try {
      await api.changePassword(currentPassword, newPassword, token);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Senha alterada com sucesso!", variant: "success" });
    } catch (error: unknown) {
      console.error("Failed to change password:", error);
      const err = error as { message?: string };
      toast({ title: err.message || "Erro ao alterar senha", variant: "destructive" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({ title: "Digite sua senha para confirmar", variant: "destructive" });
      return;
    }

    const token = await getValidToken();
    if (!token) return;

    setDeletingAccount(true);
    try {
      await api.deleteAccount(deletePassword, token);
      logout();
      router.push("/admin");
    } catch (error: unknown) {
      console.error("Failed to delete account:", error);
      const err = error as { message?: string };
      toast({ title: err.message || "Erro ao excluir conta", variant: "destructive" });
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <SettingsPageSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Configuracoes</h1>
          <p className="text-muted-foreground">Gerencie as configuracoes da sua conta</p>
        </div>

        <div className="space-y-6">
          {/* Username Card */}
          <Card>
            <CardHeader>
              <CardTitle>URL Revuu</CardTitle>
              <CardDescription>
                Escolha um username unico para sua URL publica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1">
                  <Label>Username</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground text-sm sm:text-base whitespace-nowrap">revuu.com.br/u/</span>
                    <div className="relative flex-1">
                      <Input
                        value={username}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                          setUsername(value);
                          checkUsernameAvailability(value);
                        }}
                        placeholder="seu-username"
                        className="pr-10"
                      />
                      {checkingUsername && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {!checkingUsername && usernameAvailable === true && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                      {!checkingUsername && usernameAvailable === false && (
                        <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={saveUsername}
                  disabled={!usernameAvailable || saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Avatar Card */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>
                Sua foto de perfil exibida no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <ImageUpload
                  value={avatarUrl}
                  onChange={(url) => setAvatarUrl(url || "")}
                  aspectRatio="square"
                  placeholder="Arraste sua foto ou clique para selecionar"
                  className="w-32 h-32"
                />
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Recomendamos uma imagem quadrada de pelo menos 200x200 pixels.
                  </p>
                  <Button
                    onClick={saveAvatar}
                    disabled={savingAvatar || avatarUrl === user?.avatarUrl}
                  >
                    {savingAvatar ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Avatar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informacoes da Conta</CardTitle>
              <CardDescription>
                Dados da sua conta de acesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O email nao pode ser alterado
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Password Card */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Atualize sua senha de acesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Senha Atual</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label>Nova Senha</Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite a nova senha"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimo de 6 caracteres
                </p>
              </div>

              <div>
                <Label>Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={savePassword}
                disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {savingPassword ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          {/* White Label Card - Business Only */}
          <Card className={user?.plan !== "business" ? "border-dashed" : "border-amber-200 dark:border-amber-800"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-amber-500" />
                  <div>
                    <CardTitle>White Label</CardTitle>
                    <CardDescription>
                      Personalize sua marca no portfolio
                    </CardDescription>
                  </div>
                </div>
                {user?.plan === "business" ? (
                  <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full font-medium">
                    Business
                  </span>
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {user?.plan === "business" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        Logo Personalizado
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Substitui o logo Revuu pelo seu
                      </p>
                      <ImageUpload
                        value=""
                        onChange={() => {}}
                        aspectRatio="wide"
                        placeholder="Upload do seu logo"
                        className="h-20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-muted-foreground" />
                        Nome da Marca
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Aparece no footer do portfolio
                      </p>
                      <Input placeholder="Nome da sua empresa" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      Cores da Marca
                    </Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Cor Primaria</Label>
                        <div className="flex gap-2 mt-1">
                          <Input type="color" className="w-12 h-10 p-1 cursor-pointer" defaultValue="#f59e0b" />
                          <Input placeholder="#f59e0b" className="flex-1" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Cor Secundaria</Label>
                        <div className="flex gap-2 mt-1">
                          <Input type="color" className="w-12 h-10 p-1 cursor-pointer" defaultValue="#1f2937" />
                          <Input placeholder="#1f2937" className="flex-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Remover "Powered by Revuu"</p>
                      <p className="text-xs text-muted-foreground">
                        Remove completamente a marca Revuu do seu portfolio
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Salvar White Label
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">
                    Recursos White Label disponiveis apenas no plano Business.
                    Personalize completamente seu portfolio com sua marca.
                  </p>
                  <Link href="/admin/subscription">
                    <Button className="gap-2">
                      <Crown className="h-4 w-4" />
                      Upgrade para Business
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-600 dark:text-red-400">Zona de Perigo</CardTitle>
              </div>
              <CardDescription>
                Acoes irreversiveis para sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showDeleteConfirm ? (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <p className="font-medium">Excluir conta permanentemente</p>
                    <p className="text-sm text-muted-foreground">
                      Todos os seus dados serao removidos e nao poderao ser recuperados.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Conta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-600 dark:text-red-400">Tem certeza?</p>
                      <p className="text-sm text-muted-foreground">
                        Esta acao e irreversivel. Todos os seus dados, incluindo perfil, experiencias, educacao, skills, projetos e paginas serao permanentemente excluidos.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Digite sua senha para confirmar</Label>
                    <Input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Sua senha"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount || !deletePassword}
                    >
                      {deletingAccount ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Confirmar Exclusao
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
