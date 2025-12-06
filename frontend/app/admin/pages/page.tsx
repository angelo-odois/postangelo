"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileText, Edit, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
}

export default function AdminPagesPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/admin");
      return;
    }

    loadPages();
  }, [user, router]);

  const loadPages = async () => {
    try {
      const allPages = await api.getPages();
      const draftPages = await api.getPages("draft");
      setPages([...(allPages as Page[]), ...(draftPages as Page[])]);
    } catch (error) {
      console.error("Failed to load pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta página?")) return;

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

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  const handleCreatePage = async () => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      const newPage = await api.createPage(
        {
          title: "Nova Página",
          slug: `nova-pagina-${Date.now()}`,
          status: "draft",
        },
        token
      );
      router.push(`/admin/pages/${(newPage as Page).id}`);
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">PostAngelo Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Páginas</h2>
          <Button onClick={handleCreatePage}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando...
          </div>
        ) : pages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhuma página criada ainda
              </p>
              <Button onClick={handleCreatePage}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira página
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      /{page.slug}
                      <span
                        className={`ml-2 px-2 py-0.5 rounded text-xs ${
                          page.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {page.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
