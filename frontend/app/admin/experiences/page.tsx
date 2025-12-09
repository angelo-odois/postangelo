"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { AdminLayout, ExperienceDialog, ListPageSkeleton } from "@/components/admin";
import { SortableList } from "@/components/ui/sortable-list";

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  employmentType?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  companyLogoUrl?: string;
  companyUrl?: string;
  technologies?: string[];
  order: number;
}

export default function ExperiencesAdminPage() {
  const { getValidToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const data = await api.getExperiences(token).catch(() => []);
      setExperiences(data as Experience[]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setSelectedExperience(null);
    setDialogOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setSelectedExperience(exp);
    setDialogOpen(true);
  };

  const save = async (data: Partial<Experience>) => {
    const token = await getValidToken();
    if (!token) return;

    if (selectedExperience) {
      const updated = await api.updateExperience(selectedExperience.id, data, token);
      setExperiences(experiences.map(e => e.id === selectedExperience.id ? updated as Experience : e));
    } else {
      const newExp = await api.createExperience(data, token);
      setExperiences([...experiences, newExp as Experience]);
    }
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir esta experiencia?")) return;

    const token = await getValidToken();
    if (!token) return;

    try {
      await api.deleteExperience(id, token);
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (error) {
      console.error("Failed to delete experience:", error);
    }
  };

  const reorder = async (items: Experience[]) => {
    setExperiences(items);
    const token = await getValidToken();
    if (!token) return;

    try {
      await api.reorderExperiences(
        items.map((item, index) => ({ id: item.id, order: index })),
        token
      );
    } catch (error) {
      console.error("Failed to reorder experiences:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <ListPageSkeleton count={3} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Experiencias</h1>
            <p className="text-muted-foreground">Gerencie suas experiencias profissionais</p>
          </div>
          <Button onClick={openNew} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {experiences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma experiencia adicionada</p>
              <Button variant="outline" className="mt-4" onClick={openNew}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeira experiencia
              </Button>
            </CardContent>
          </Card>
        ) : (
          <SortableList
            items={experiences}
            onReorder={reorder}
            className="space-y-3"
            renderItem={(exp) => (
              <Card
                className="cursor-pointer hover:border-amber-500/50 transition-colors"
                onClick={() => openEdit(exp)}
              >
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{exp.position || "Cargo nao informado"}</h3>
                        {exp.isCurrent && (
                          <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{exp.company || "Empresa nao informada"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : "?"}
                        {" - "}
                        {exp.isCurrent ? "Presente" : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : "?")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => deleteItem(exp.id, e)}
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

      <ExperienceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        experience={selectedExperience}
        onSave={save}
        isNew={!selectedExperience}
      />
    </AdminLayout>
  );
}
