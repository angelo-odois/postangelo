"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { TagInput } from "@/components/ui/tag-input";

// Experience Dialog
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

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience | null;
  onSave: (data: Partial<Experience>) => Promise<void>;
  isNew?: boolean;
}

export function ExperienceDialog({
  open,
  onOpenChange,
  experience,
  onSave,
  isNew = false,
}: ExperienceDialogProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    technologies: [] as string[],
  });

  useEffect(() => {
    if (experience) {
      setForm({
        company: experience.company || "",
        position: experience.position || "",
        location: experience.location || "",
        description: experience.description || "",
        startDate: experience.startDate?.split("T")[0] || "",
        endDate: experience.endDate?.split("T")[0] || "",
        isCurrent: experience.isCurrent || false,
        technologies: experience.technologies || [],
      });
    } else {
      setForm({
        company: "",
        position: "",
        location: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        isCurrent: true,
        technologies: [],
      });
    }
  }, [experience, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Nova Experiencia" : "Editar Experiencia"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Empresa</Label>
              <Input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
            <div>
              <Label>Cargo</Label>
              <Input
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Seu cargo"
              />
            </div>
          </div>
          <div>
            <Label>Localizacao</Label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Ex: Sao Paulo, Brasil"
            />
          </div>
          <div>
            <Label>Descricao</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descreva suas responsabilidades e conquistas..."
              rows={4}
            />
          </div>
          <div>
            <Label>Tags</Label>
            <TagInput
              value={form.technologies}
              onChange={(tags) => setForm({ ...form, technologies: tags })}
              placeholder="Digite e pressione Enter (ex: UX Research)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Adicione tags para destacar projetos, habilidades ou atividades
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Data Inicio</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                disabled={form.isCurrent}
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isCurrent}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isCurrent: checked })
                  }
                />
                <Label>Atual</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isNew ? "Criar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Education Dialog
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

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education: Education | null;
  onSave: (data: Partial<Education>) => Promise<void>;
  isNew?: boolean;
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
  onSave,
  isNew = false,
}: EducationDialogProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    institution: "",
    degree: "",
    field: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });

  useEffect(() => {
    if (education) {
      setForm({
        institution: education.institution || "",
        degree: education.degree || "",
        field: education.field || "",
        description: education.description || "",
        startDate: education.startDate?.split("T")[0] || "",
        endDate: education.endDate?.split("T")[0] || "",
        isCurrent: education.isCurrent || false,
      });
    } else {
      setForm({
        institution: "",
        degree: "",
        field: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        isCurrent: false,
      });
    }
  }, [education, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Nova Formacao" : "Editar Formacao"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Instituicao</Label>
              <Input
                value={form.institution}
                onChange={(e) =>
                  setForm({ ...form, institution: e.target.value })
                }
                placeholder="Nome da instituicao"
              />
            </div>
            <div>
              <Label>Curso/Grau</Label>
              <Input
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="Ex: Bacharelado"
              />
            </div>
          </div>
          <div>
            <Label>Area/Campo</Label>
            <Input
              value={form.field}
              onChange={(e) => setForm({ ...form, field: e.target.value })}
              placeholder="Ex: Ciencia da Computacao"
            />
          </div>
          <div>
            <Label>Descricao</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descreva sua formacao..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Data Inicio</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Data Conclusao</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                disabled={form.isCurrent}
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isCurrent}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isCurrent: checked })
                  }
                />
                <Label>Cursando</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isNew ? "Criar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Skill Dialog
interface Skill {
  id: string;
  name: string;
  category: string;
  level: string;
  yearsOfExperience?: number;
  iconUrl?: string;
  order: number;
}

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
  onSave: (data: Partial<Skill>) => Promise<void>;
  isNew?: boolean;
}

export function SkillDialog({
  open,
  onOpenChange,
  skill,
  onSave,
  isNew = false,
}: SkillDialogProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "technical",
    level: "intermediate",
    yearsOfExperience: 0,
  });

  useEffect(() => {
    if (skill) {
      setForm({
        name: skill.name || "",
        category: skill.category || "technical",
        level: skill.level || "intermediate",
        yearsOfExperience: skill.yearsOfExperience || 0,
      });
    } else {
      setForm({
        name: "",
        category: "technical",
        level: "intermediate",
        yearsOfExperience: 0,
      });
    }
  }, [skill, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? "Nova Skill" : "Editar Skill"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: React, TypeScript, Figma"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Tecnica</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                  <SelectItem value="language">Idioma</SelectItem>
                  <SelectItem value="tool">Ferramenta</SelectItem>
                  <SelectItem value="other">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nivel</Label>
              <Select
                value={form.level}
                onValueChange={(value) => setForm({ ...form, level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediario</SelectItem>
                  <SelectItem value="advanced">Avancado</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Anos de Experiencia</Label>
            <Input
              type="number"
              min="0"
              value={form.yearsOfExperience}
              onChange={(e) =>
                setForm({ ...form, yearsOfExperience: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isNew ? "Criar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Project Dialog
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

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSave: (data: Partial<Project>) => Promise<void>;
  isNew?: boolean;
}

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
  isNew = false,
}: ProjectDialogProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    liveUrl: "",
    repositoryUrl: "",
    thumbnailUrl: "",
    isFeatured: false,
    status: "completed",
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        liveUrl: project.liveUrl || "",
        repositoryUrl: project.repositoryUrl || "",
        thumbnailUrl: project.thumbnailUrl || "",
        isFeatured: project.isFeatured || false,
        status: project.status || "completed",
      });
    } else {
      setForm({
        title: "",
        description: "",
        liveUrl: "",
        repositoryUrl: "",
        thumbnailUrl: "",
        isFeatured: false,
        status: "completed",
      });
    }
  }, [project, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Novo Projeto" : "Editar Projeto"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Titulo</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nome do projeto"
              />
            </div>
            <div className="flex items-end gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isFeatured: checked })
                  }
                />
                <Label>Destaque</Label>
              </div>
              <div className="flex-1">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Concluido</SelectItem>
                    <SelectItem value="in_progress">Em Progresso</SelectItem>
                    <SelectItem value="planned">Planejado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div>
            <Label>Descricao</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descreva o projeto..."
              rows={3}
            />
          </div>
          <div>
            <Label className="mb-2 block">Imagem do Projeto</Label>
            <ImageUpload
              value={form.thumbnailUrl}
              onChange={(url) => setForm({ ...form, thumbnailUrl: url || "" })}
              aspectRatio="video"
              placeholder="Arraste uma imagem do projeto"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>URL do Projeto</Label>
              <Input
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Repositorio</Label>
              <Input
                value={form.repositoryUrl}
                onChange={(e) =>
                  setForm({ ...form, repositoryUrl: e.target.value })
                }
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isNew ? "Criar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
