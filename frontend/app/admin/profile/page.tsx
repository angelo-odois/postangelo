"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Check,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { AdminLayout } from "@/components/admin";
import { ImageUpload } from "@/components/ui/image-upload";

interface Profile {
  id?: string;
  fullName: string;
  title?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  dribbbleUrl?: string;
  behanceUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  contactEmail?: string;
  phone?: string;
  isAvailableForWork?: boolean;
  availabilityStatus?: string;
}

export default function ProfileAdminPage() {
  const { user, getValidToken, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile>({ fullName: "" });
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const profileData = await api.getMyProfile(token).catch(() => null);
      if (profileData) setProfile(profileData as Profile);

      if (user?.username) {
        setUsername(user.username);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    const token = await getValidToken();
    if (!token) return;

    setSaving(true);
    try {
      await api.saveProfile(profile, token);
      alert("Perfil salvo com sucesso!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const checkUsernameAvailability = async (value: string) => {
    if (value.length < 3) {
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
      alert("Username atualizado!");
    } catch (error) {
      console.error("Failed to save username:", error);
      alert("Erro ao salvar username");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informacoes pessoais</p>
        </div>

        <div className="space-y-6">
          {/* Username Card */}
          <Card>
            <CardHeader>
              <CardTitle>URL do Portfolio</CardTitle>
              <CardDescription>
                Escolha um username unico para sua URL publica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1">
                  <Label>Username</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground text-sm sm:text-base">postangelo.com/u/</span>
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

          {/* Profile Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informacoes Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <Label>Titulo Profissional</Label>
                  <Input
                    value={profile.title || ""}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="Ex: Product Designer"
                  />
                </div>
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Conte um pouco sobre voce..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Localizacao</Label>
                  <Input
                    value={profile.location || ""}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Ex: Sao Paulo, Brasil"
                  />
                </div>
                <div>
                  <Label>Email de Contato</Label>
                  <Input
                    type="email"
                    value={profile.contactEmail || ""}
                    onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                    placeholder="contato@email.com"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Foto de Perfil</Label>
                  <ImageUpload
                    value={profile.avatarUrl}
                    onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                    aspectRatio="square"
                    placeholder="Arraste sua foto ou clique para selecionar"
                    className="max-w-[200px]"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Imagem de Capa</Label>
                  <ImageUpload
                    value={profile.coverImageUrl}
                    onChange={(url) => setProfile({ ...profile, coverImageUrl: url })}
                    aspectRatio="banner"
                    placeholder="Arraste uma imagem de capa"
                  />
                </div>
              </div>

              <div>
                <Label>Telefone</Label>
                <Input
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+55 11 99999-9999"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={profile.isAvailableForWork}
                    onCheckedChange={(checked) => setProfile({ ...profile, isAvailableForWork: checked })}
                  />
                  <Label>Disponivel para trabalho</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={profile.linkedinUrl || ""}
                    onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label>GitHub</Label>
                  <Input
                    value={profile.githubUrl || ""}
                    onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <Label>Twitter/X</Label>
                  <Input
                    value={profile.twitterUrl || ""}
                    onChange={(e) => setProfile({ ...profile, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input
                    value={profile.websiteUrl || ""}
                    onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>Dribbble</Label>
                  <Input
                    value={profile.dribbbleUrl || ""}
                    onChange={(e) => setProfile({ ...profile, dribbbleUrl: e.target.value })}
                    placeholder="https://dribbble.com/..."
                  />
                </div>
                <div>
                  <Label>Behance</Label>
                  <Input
                    value={profile.behanceUrl || ""}
                    onChange={(e) => setProfile({ ...profile, behanceUrl: e.target.value })}
                    placeholder="https://behance.net/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Perfil
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
