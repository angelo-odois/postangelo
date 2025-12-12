"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { AdminLayout, ProfilePageSkeleton } from "@/components/admin";
import { ImageUpload } from "@/components/ui/image-upload";
import { TagInput } from "@/components/ui/tag-input";
import { toast } from "@/hooks/use-toast";

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
  tags?: string;
}

export default function ProfileAdminPage() {
  const { getValidToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile>({ fullName: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const profileData = await api.getMyProfile(token).catch(() => null);
      if (profileData) setProfile(profileData as Profile);
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
      toast({ title: "Perfil salvo com sucesso!", variant: "success" });
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({ title: "Erro ao salvar perfil", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <ProfilePageSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informacoes do curriculo</p>
        </div>

        <div className="space-y-6">
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

              <div>
                <Label>Tags</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Adicione tags que descrevem voce (ex: React, UX Design, Node.js)
                </p>
                <TagInput
                  value={profile.tags ? profile.tags.split(",").map(t => t.trim()).filter(Boolean) : []}
                  onChange={(tags) => setProfile({ ...profile, tags: tags.join(",") })}
                  placeholder="Digite uma tag e pressione Enter"
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
