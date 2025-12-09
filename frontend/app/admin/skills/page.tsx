"use client";

import { useEffect, useState } from "react";
import {
  Lightbulb,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { AdminLayout, SkillDialog } from "@/components/admin";
import { SortableList } from "@/components/ui/sortable-list";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  yearsOfExperience?: number;
  iconUrl?: string;
  order: number;
}

export default function SkillsAdminPage() {
  const { getValidToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const data = await api.getSkills(token).catch(() => []);
      setSkills(data as Skill[]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setSelectedSkill(null);
    setDialogOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setDialogOpen(true);
  };

  const save = async (data: Partial<Skill>) => {
    const token = await getValidToken();
    if (!token) return;

    if (selectedSkill) {
      const updated = await api.updateSkill(selectedSkill.id, data, token);
      setSkills(skills.map(s => s.id === selectedSkill.id ? updated as Skill : s));
    } else {
      const newSkill = await api.createSkill(data, token);
      setSkills([...skills, newSkill as Skill]);
    }
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir esta skill?")) return;

    const token = await getValidToken();
    if (!token) return;

    try {
      await api.deleteSkill(id, token);
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const reorder = async (items: Skill[]) => {
    setSkills(items);
    const token = await getValidToken();
    if (!token) return;

    try {
      await api.reorderSkills(
        items.map((item, index) => ({ id: item.id, order: index })),
        token
      );
    } catch (error) {
      console.error("Failed to reorder skills:", error);
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
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Skills</h1>
            <p className="text-muted-foreground">Gerencie suas habilidades</p>
          </div>
          <Button onClick={openNew} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {skills.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma skill adicionada</p>
              <Button variant="outline" className="mt-4" onClick={openNew}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeira skill
              </Button>
            </CardContent>
          </Card>
        ) : (
          <SortableList
            items={skills}
            onReorder={reorder}
            className="space-y-3"
            renderItem={(skill) => (
              <Card
                className="cursor-pointer hover:border-amber-500/50 transition-colors"
                onClick={() => openEdit(skill)}
              >
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold">{skill.name || "Skill nao informada"}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">
                            {skill.category === 'technical' && 'Tecnica'}
                            {skill.category === 'soft' && 'Soft Skill'}
                            {skill.category === 'language' && 'Idioma'}
                            {skill.category === 'tool' && 'Ferramenta'}
                            {skill.category === 'other' && 'Outra'}
                            {!skill.category && 'Categoria'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {skill.level === 'beginner' && 'Iniciante'}
                            {skill.level === 'intermediate' && 'Intermediario'}
                            {skill.level === 'advanced' && 'Avancado'}
                            {skill.level === 'expert' && 'Expert'}
                            {!skill.level && 'Nivel'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => deleteItem(skill.id, e)}
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

      <SkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        skill={selectedSkill}
        onSave={save}
        isNew={!selectedSkill}
      />
    </AdminLayout>
  );
}
