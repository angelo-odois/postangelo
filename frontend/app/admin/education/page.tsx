"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { AdminLayout, EducationDialog, ListPageSkeleton } from "@/components/admin";
import { SortableList } from "@/components/ui/sortable-list";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  institutionLogoUrl?: string;
  institutionUrl?: string;
  grade?: string;
  order: number;
}

export default function EducationAdminPage() {
  const { getValidToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [education, setEducation] = useState<Education[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const data = await api.getEducation(token).catch(() => []);
      setEducation(data as Education[]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setSelectedEducation(null);
    setDialogOpen(true);
  };

  const openEdit = (edu: Education) => {
    setSelectedEducation(edu);
    setDialogOpen(true);
  };

  const save = async (data: Partial<Education>) => {
    const token = await getValidToken();
    if (!token) return;

    if (selectedEducation) {
      const updated = await api.updateEducation(selectedEducation.id, data, token);
      setEducation(education.map(e => e.id === selectedEducation.id ? updated as Education : e));
    } else {
      const newEdu = await api.createEducation(data, token);
      setEducation([...education, newEdu as Education]);
    }
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir esta formacao?")) return;

    const token = await getValidToken();
    if (!token) return;

    try {
      await api.deleteEducation(id, token);
      setEducation(education.filter(edu => edu.id !== id));
    } catch (error) {
      console.error("Failed to delete education:", error);
    }
  };

  const reorder = async (items: Education[]) => {
    setEducation(items);
    const token = await getValidToken();
    if (!token) return;

    try {
      await api.reorderEducation(
        items.map((item, index) => ({ id: item.id, order: index })),
        token
      );
    } catch (error) {
      console.error("Failed to reorder education:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <ListPageSkeleton count={2} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Formacao</h1>
            <p className="text-muted-foreground">Gerencie sua formacao academica</p>
          </div>
          <Button onClick={openNew} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {education.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma formacao adicionada</p>
              <Button variant="outline" className="mt-4" onClick={openNew}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeira formacao
              </Button>
            </CardContent>
          </Card>
        ) : (
          <SortableList
            items={education}
            onReorder={reorder}
            className="space-y-3"
            renderItem={(edu) => (
              <Card
                className="cursor-pointer hover:border-amber-500/50 transition-colors"
                onClick={() => openEdit(edu)}
              >
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{edu.degree || "Curso nao informado"}</h3>
                        {edu.isCurrent && (
                          <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">
                            Cursando
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{edu.institution || "Instituicao nao informada"}</p>
                      {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {edu.startDate ? new Date(edu.startDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : "?"}
                        {" - "}
                        {edu.isCurrent ? "Presente" : (edu.endDate ? new Date(edu.endDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : "?")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => deleteItem(edu.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          />
        )}
      </div>

      <EducationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        education={selectedEducation}
        onSave={save}
        isNew={!selectedEducation}
      />
    </AdminLayout>
  );
}
