"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { AdminLayout, ProjectDialog } from "@/components/admin";
import { SortableList } from "@/components/ui/sortable-list";

interface Project {
  id: string;
  title: string;
  description?: string;
  longDescription?: string;
  thumbnailUrl?: string;
  images?: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  figmaUrl?: string;
  technologies?: string[];
  tags?: string[];
  status: string;
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
  order: number;
}

export default function ProjectsAdminPage() {
  const { getValidToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const data = await api.getProjects(token).catch(() => []);
      setProjects(data as Project[]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setSelectedProject(null);
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const save = async (data: Partial<Project>) => {
    const token = await getValidToken();
    if (!token) return;

    if (selectedProject) {
      const updated = await api.updateProject(selectedProject.id, data, token);
      setProjects(projects.map(p => p.id === selectedProject.id ? updated as Project : p));
    } else {
      const newProject = await api.createProject(data, token);
      setProjects([...projects, newProject as Project]);
    }
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir este projeto?")) return;

    const token = await getValidToken();
    if (!token) return;

    try {
      await api.deleteProject(id, token);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const reorder = async (items: Project[]) => {
    setProjects(items);
    const token = await getValidToken();
    if (!token) return;

    try {
      await api.reorderProjects(
        items.map((item, index) => ({ id: item.id, order: index })),
        token
      );
    } catch (error) {
      console.error("Failed to reorder projects:", error);
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
            <h1 className="text-2xl font-bold">Projetos</h1>
            <p className="text-muted-foreground">Gerencie seus projetos</p>
          </div>
          <Button onClick={openNew} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum projeto adicionado</p>
              <Button variant="outline" className="mt-4" onClick={openNew}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeiro projeto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <SortableList
            items={projects}
            onReorder={reorder}
            className="space-y-3"
            renderItem={(project) => (
              <Card
                className="cursor-pointer hover:border-amber-500/50 transition-colors"
                onClick={() => openEdit(project)}
              >
                <CardContent className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {project.thumbnailUrl && (
                        <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                          <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{project.title || "Projeto sem titulo"}</h3>
                          {project.isFeatured && (
                            <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">
                              Destaque
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {project.liveUrl && <span>Live</span>}
                          {project.repositoryUrl && <span>Repositorio</span>}
                          {project.technologies && project.technologies.length > 0 && (
                            <span>{project.technologies.length} tecnologias</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => deleteItem(project.id, e)}
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

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={selectedProject}
        onSave={save}
        isNew={!selectedProject}
      />
    </AdminLayout>
  );
}
