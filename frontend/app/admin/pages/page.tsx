"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileText, Edit, Trash2, Search, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout, TemplateSelectionDialog, PagesListSkeleton } from "@/components/admin";
import { useAuthStore } from "@/lib/store";
import { api, PageTemplate } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
}

export default function AdminPagesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [pages, setPages] = useState<Page[]>([]);
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/admin");
      return;
    }

    loadPages();
  }, [user, router]);

  useEffect(() => {
    if (search) {
      setFilteredPages(
        pages.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.slug.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredPages(pages);
    }
  }, [search, pages]);

  const loadPages = async () => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      // Get user's own pages (both published and drafts)
      const publishedPages = await api.getMyPages(token, "published");
      const draftPages = await api.getMyPages(token, "draft");
      const combined = [...(publishedPages as Page[]), ...(draftPages as Page[])];
      // Remove duplicates
      const unique = combined.filter(
        (page, index, self) => index === self.findIndex((p) => p.id === page.id)
      );
      setPages(unique);
      setFilteredPages(unique);
    } catch (error) {
      console.error("Failed to load pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      await api.deletePage(id, token);
      setPages(pages.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const handleCreatePage = () => {
    setTemplateDialogOpen(true);
  };

  const handleTemplateSelect = async (
    template: PageTemplate | null,
    title: string,
    slug: string
  ) => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    setCreating(true);

    try {
      let newPage;

      if (template) {
        // Create page from template
        newPage = await api.createPageFromTemplate(template.slug, title, slug, token);
      } else {
        // Create blank page
        newPage = await api.createPage(
          {
            title,
            slug,
            status: "draft",
          },
          token
        );
      }

      setTemplateDialogOpen(false);
      router.push(`/admin/pages/${(newPage as Page).id}`);
    } catch (error: unknown) {
      console.error("Failed to create page:", error);
      const err = error as { message?: string };
      const isLimitError = err.message?.includes("limite") || err.message?.includes("upgrade");

      if (isLimitError) {
        toast({
          title: "Limite de projetos atingido",
          description: "Faca upgrade do seu plano para criar mais projetos.",
          variant: "destructive",
          action: (
            <ToastAction altText="Fazer upgrade" asChild>
              <Link href="/admin/subscription" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Upgrade
              </Link>
            </ToastAction>
          ),
        });
      } else {
        toast({ title: "Erro ao criar projeto", description: err.message || "Verifique se o slug ja existe.", variant: "destructive" });
      }
    } finally {
      setCreating(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <AdminLayout>
        <PagesListSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projetos</h1>
            <p className="text-muted-foreground">
              Gerencie seus projetos do portfolio
            </p>
          </div>
          <Button onClick={handleCreatePage}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Pages List */}
        {filteredPages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {search
                  ? "Nenhum projeto encontrado"
                  : "Nenhum projeto criado ainda"}
              </p>
              {!search && (
                <Button onClick={handleCreatePage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro projeto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPages.map((page) => (
              <Card
                key={page.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{page.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        /{page.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        page.status === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {page.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/pages/${page.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(page.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <TemplateSelectionDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSelect={handleTemplateSelect}
        loading={creating}
      />
    </AdminLayout>
  );
}
