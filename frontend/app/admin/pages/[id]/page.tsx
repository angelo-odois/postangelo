"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { useAuthStore, useEditorStore, Block } from "@/lib/store";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface PageData {
  id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  coverImageUrl?: string;
  ogImageUrl?: string;
  status: "draft" | "published";
  contentJSON: {
    blocks: Block[];
    meta?: Record<string, unknown>;
  };
}

export default function PageEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const { setBlocks, blocks, updatePageSettings, pageSettings } = useEditorStore();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Page metadata
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [layout, setLayout] = useState<"contained" | "full">("contained");

  useEffect(() => {
    if (!user || !accessToken) {
      router.push("/admin");
      return;
    }

    loadPage();
  }, [user, accessToken, id, router]);

  const loadPage = async () => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      const foundPage = await api.getPageById(id, token) as PageData;

      if (foundPage) {
        setPage(foundPage);
        setTitle(foundPage.title);
        setSlug(foundPage.slug);
        setSeoTitle(foundPage.seoTitle || "");
        setSeoDescription(foundPage.seoDescription || "");
        setStatus(foundPage.status);
        setLayout((foundPage.contentJSON?.meta?.layout as "contained" | "full") || "contained");
        setBlocks(foundPage.contentJSON?.blocks || []);
        // Load cover image into pageSettings
        updatePageSettings({
          coverImage: foundPage.coverImageUrl || "",
          ogImage: foundPage.ogImageUrl || "",
          title: foundPage.seoTitle || "",
          description: foundPage.seoDescription || "",
          slug: foundPage.slug,
          layout: (foundPage.contentJSON?.meta?.layout as "contained" | "full") || "contained",
        });
      }
    } catch (error) {
      console.error("Failed to load page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (editorBlocks: Block[]) => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    // Get current pageSettings from store
    const currentPageSettings = useEditorStore.getState().pageSettings;

    setSaving(true);
    try {
      await api.updatePage(
        id,
        {
          title,
          slug,
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
          coverImageUrl: currentPageSettings.coverImage || undefined,
          ogImageUrl: currentPageSettings.ogImage || undefined,
          status,
          contentJSON: {
            blocks: editorBlocks,
            meta: {
              ...(page?.contentJSON?.meta || {}),
              layout,
            },
          },
        },
        token
      );
    } catch (error) {
      console.error("Failed to save page:", error);
      toast({ title: "Erro ao salvar pagina", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/${slug}`, "_blank");
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/pages")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="h-6 w-px bg-border" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold border-0 bg-transparent px-2 py-1 h-auto text-lg focus-visible:ring-1 focus-visible:ring-amber-500 hover:bg-muted/50 transition-colors min-w-[200px]"
            placeholder="Título da página"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            Configurações
          </Button>
          <Select value={status} onValueChange={(v: "draft" | "published") => setStatus(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-muted/50 border-b px-6 py-4 shrink-0">
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="minha-pagina"
              />
            </div>
            <div className="space-y-2">
              <Label>Layout</Label>
              <Select value={layout} onValueChange={(v: "contained" | "full") => {
                setLayout(v);
                updatePageSettings({ layout: v });
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contained">Contido</SelectItem>
                  <SelectItem value="full">Tela Cheia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Título para SEO"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <textarea
                id="seoDescription"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Descrição para SEO"
              />
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <BlockEditor onSave={handleSave} onPreview={handlePreview} saving={saving} />
      </div>
    </div>
  );
}
