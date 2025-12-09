"use client";

import { useState, useRef } from "react";
import { Settings, Search, Globe, Code, Image, Upload, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useEditorStore, PageSettings as PageSettingsType } from "@/lib/store";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface PageSettingsProps {
  children: React.ReactNode;
}

export function PageSettings({ children }: PageSettingsProps) {
  const { pageSettings, updatePageSettings } = useEditorStore();
  const { getValidToken } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<PageSettingsType>(pageSettings);
  const [uploading, setUploading] = useState(false);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSettings(pageSettings);
    }
    setOpen(isOpen);
  };

  const handleSave = () => {
    updatePageSettings(localSettings);
    setOpen(false);
  };

  const updateLocal = (key: keyof PageSettingsType, value: string | boolean) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = await getValidToken();
      if (!token) {
        toast({ title: "Sessao expirada", description: "Faca login novamente.", variant: "destructive" });
        return;
      }
      const result = await api.uploadFile(file, token) as { url: string };
      updateLocal("coverImage", result.url);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({ title: "Erro ao fazer upload da imagem", variant: "destructive" });
    } finally {
      setUploading(false);
      if (coverImageInputRef.current) {
        coverImageInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuracoes da Pagina
          </DialogTitle>
          <DialogDescription>
            Configure SEO, meta tags e outras opcoes da pagina.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Avancado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Imagem de Capa</Label>
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageUpload}
              />

              {localSettings.coverImage ? (
                <div className="relative rounded-lg border overflow-hidden">
                  <img
                    src={localSettings.coverImage}
                    alt="Cover"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => coverImageInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Trocar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateLocal("coverImage", "")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => coverImageInputRef.current?.click()}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      <p className="text-sm text-muted-foreground">Enviando...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Clique para fazer upload da imagem de capa
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recomendado: 1920x1080px ou maior
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Ou cole a URL da imagem"
                  value={localSettings.coverImage}
                  onChange={(e) => updateLocal("coverImage", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titulo da Pagina</Label>
              <Input
                id="title"
                placeholder="Titulo para SEO"
                value={localSettings.title}
                onChange={(e) => updateLocal("title", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: 50-60 caracteres ({localSettings.title.length}/60)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Meta Descricao</Label>
              <Textarea
                id="description"
                placeholder="Descricao para motores de busca"
                value={localSettings.description}
                onChange={(e) => updateLocal("description", e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Recomendado: 150-160 caracteres ({localSettings.description.length}/160)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  id="slug"
                  placeholder="url-da-pagina"
                  value={localSettings.slug}
                  onChange={(e) => updateLocal("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">URL Canonica</Label>
              <Input
                id="canonicalUrl"
                placeholder="https://exemplo.com/pagina-original"
                value={localSettings.canonicalUrl}
                onChange={(e) => updateLocal("canonicalUrl", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use se esta pagina for uma copia de outra
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Bloquear Indexacao</Label>
                <p className="text-xs text-muted-foreground">
                  Impede que motores de busca indexem esta pagina
                </p>
              </div>
              <Switch
                checked={localSettings.noIndex}
                onCheckedChange={(checked) => updateLocal("noIndex", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="ogImage">Imagem Open Graph</Label>
              <div className="flex gap-2">
                <Input
                  id="ogImage"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={localSettings.ogImage}
                  onChange={(e) => updateLocal("ogImage", e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Imagem exibida ao compartilhar nas redes sociais (1200x630px recomendado)
              </p>
            </div>

            {localSettings.ogImage && (
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium mb-2">Preview</p>
                <div className="aspect-[1200/630] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={localSettings.ogImage}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                placeholder="https://exemplo.com/favicon.ico"
                value={localSettings.favicon}
                onChange={(e) => updateLocal("favicon", e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="customCss">CSS Customizado</Label>
              <Textarea
                id="customCss"
                placeholder=".minha-classe { color: red; }"
                value={localSettings.customCss}
                onChange={(e) => updateLocal("customCss", e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                CSS adicional aplicado apenas a esta pagina
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customJs">JavaScript Customizado</Label>
              <Textarea
                id="customJs"
                placeholder="console.log('Hello World');"
                value={localSettings.customJs}
                onChange={(e) => updateLocal("customJs", e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                JavaScript executado apos o carregamento da pagina
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Configuracoes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
