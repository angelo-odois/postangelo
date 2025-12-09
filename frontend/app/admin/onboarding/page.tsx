"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Profile {
  fullName: string;
  title?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  contactEmail?: string;
}

interface Experience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

interface Skill {
  id?: string;
  name: string;
  category: string;
  level: string;
}

const steps = [
  { id: "profile", title: "Perfil", icon: User },
  { id: "experiences", title: "Experiencias", icon: Briefcase },
  { id: "education", title: "Formacao", icon: GraduationCap },
  { id: "skills", title: "Skills", icon: Lightbulb },
];

const skillCategories = [
  { value: "technical", label: "Tecnico" },
  { value: "soft", label: "Soft Skill" },
  { value: "language", label: "Idioma" },
  { value: "tool", label: "Ferramenta" },
];

const skillLevels = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediario" },
  { value: "advanced", label: "Avancado" },
  { value: "expert", label: "Expert" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, getValidToken, updateUser } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState<Profile>({ fullName: "" });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // New item forms
  const [newExperience, setNewExperience] = useState<Experience | null>(null);
  const [newEducation, setNewEducation] = useState<Education | null>(null);
  const [newSkill, setNewSkill] = useState<Skill | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/admin");
    } else if (user.onboardingCompleted) {
      router.push("/admin/dashboard");
    } else {
      // Initialize profile with user data
      setProfile({ fullName: user.name, contactEmail: user.email });
    }
  }, [user, router]);

  if (!user || user.onboardingCompleted) {
    return null;
  }

  const handleNext = async () => {
    setSaving(true);
    const token = await getValidToken();
    if (!token) return;

    try {
      // Save current step data
      if (currentStep === 0) {
        await api.saveProfile(profile, token);
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        await api.completeOnboarding(token);
        updateUser({ onboardingCompleted: true });
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Experience handlers
  const addExperience = async () => {
    if (!newExperience) return;
    const token = await getValidToken();
    if (!token) return;

    try {
      const created = await api.createExperience(newExperience, token);
      setExperiences([...experiences, created as Experience]);
      setNewExperience(null);
    } catch (error) {
      console.error("Error creating experience:", error);
    }
  };

  const removeExperience = async (id: string) => {
    const token = await getValidToken();
    if (!token) return;

    try {
      await api.deleteExperience(id, token);
      setExperiences(experiences.filter(e => e.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  // Education handlers
  const addEducation = async () => {
    if (!newEducation) return;
    const token = await getValidToken();
    if (!token) return;

    try {
      const created = await api.createEducation(newEducation, token);
      setEducation([...education, created as Education]);
      setNewEducation(null);
    } catch (error) {
      console.error("Error creating education:", error);
    }
  };

  const removeEducation = async (id: string) => {
    const token = await getValidToken();
    if (!token) return;

    try {
      await api.deleteEducation(id, token);
      setEducation(education.filter(e => e.id !== id));
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  // Skill handlers
  const addSkill = async () => {
    if (!newSkill) return;
    const token = await getValidToken();
    if (!token) return;

    try {
      const created = await api.createSkill(newSkill, token);
      setSkills([...skills, created as Skill]);
      setNewSkill(null);
    } catch (error) {
      console.error("Error creating skill:", error);
    }
  };

  const removeSkill = async (id: string) => {
    const token = await getValidToken();
    if (!token) return;

    try {
      await api.deleteSkill(id, token);
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Profile
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Vamos comecar pelo seu perfil</h2>
              <p className="text-muted-foreground mt-2">
                Essas informacoes aparecerao no seu curriculo publico
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <ImageUpload
                value={profile.avatarUrl}
                onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                aspectRatio="square"
                placeholder="Adicionar foto"
                className="w-32 h-32 rounded-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label>Titulo Profissional</Label>
                <Input
                  value={profile.title || ""}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="Ex: Product Designer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Conte um pouco sobre voce e sua carreira..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Localizacao</Label>
                <Input
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Ex: Sao Paulo, Brasil"
                />
              </div>
              <div className="space-y-2">
                <Label>Email de Contato</Label>
                <Input
                  type="email"
                  value={profile.contactEmail || ""}
                  onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                  placeholder="contato@email.com"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Experiences
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Adicione suas experiencias</h2>
              <p className="text-muted-foreground mt-2">
                Compartilhe sua trajetoria profissional
              </p>
            </div>

            {/* List of added experiences */}
            {experiences.length > 0 && (
              <div className="space-y-3 mb-6">
                {experiences.map((exp) => (
                  <Card key={exp.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => exp.id && removeExperience(exp.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-4">
                      <p className="font-semibold">{exp.position}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.startDate} - {exp.isCurrent ? "Atual" : exp.endDate}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add new experience form */}
            {newExperience ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nova Experiencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Empresa *</Label>
                      <Input
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cargo *</Label>
                      <Input
                        value={newExperience.position}
                        onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                        placeholder="Seu cargo"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data de Inicio *</Label>
                      <Input
                        type="month"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Termino</Label>
                      <Input
                        type="month"
                        value={newExperience.endDate || ""}
                        onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                        disabled={newExperience.isCurrent}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="current"
                      checked={newExperience.isCurrent}
                      onChange={(e) => setNewExperience({ ...newExperience, isCurrent: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="current" className="cursor-pointer">Trabalho atual</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Descricao</Label>
                    <Textarea
                      value={newExperience.description || ""}
                      onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                      placeholder="Descreva suas atividades e conquistas..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setNewExperience(null)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={addExperience}
                      disabled={!newExperience.company || !newExperience.position || !newExperience.startDate}
                    >
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outline"
                className="w-full h-12 border-dashed"
                onClick={() => setNewExperience({
                  company: "",
                  position: "",
                  startDate: "",
                  isCurrent: false,
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Experiencia
              </Button>
            )}

            {experiences.length === 0 && !newExperience && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Voce pode pular esta etapa e adicionar experiencias depois
              </p>
            )}
          </div>
        );

      case 2: // Education
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Sua formacao</h2>
              <p className="text-muted-foreground mt-2">
                Adicione sua formacao academica e cursos
              </p>
            </div>

            {/* List of added education */}
            {education.length > 0 && (
              <div className="space-y-3 mb-6">
                {education.map((edu) => (
                  <Card key={edu.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => edu.id && removeEducation(edu.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-4">
                      <p className="font-semibold">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {edu.startDate} - {edu.isCurrent ? "Cursando" : edu.endDate}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add new education form */}
            {newEducation ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nova Formacao</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Instituicao *</Label>
                      <Input
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                        placeholder="Nome da instituicao"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Titulo/Grau *</Label>
                      <Input
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        placeholder="Ex: Bacharelado, MBA, Certificacao"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Area de Estudo</Label>
                    <Input
                      value={newEducation.field || ""}
                      onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                      placeholder="Ex: Ciencia da Computacao"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data de Inicio *</Label>
                      <Input
                        type="month"
                        value={newEducation.startDate}
                        onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Termino</Label>
                      <Input
                        type="month"
                        value={newEducation.endDate || ""}
                        onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                        disabled={newEducation.isCurrent}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="current-edu"
                      checked={newEducation.isCurrent}
                      onChange={(e) => setNewEducation({ ...newEducation, isCurrent: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="current-edu" className="cursor-pointer">Cursando atualmente</Label>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setNewEducation(null)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={addEducation}
                      disabled={!newEducation.institution || !newEducation.degree || !newEducation.startDate}
                    >
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outline"
                className="w-full h-12 border-dashed"
                onClick={() => setNewEducation({
                  institution: "",
                  degree: "",
                  startDate: "",
                  isCurrent: false,
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Formacao
              </Button>
            )}

            {education.length === 0 && !newEducation && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Voce pode pular esta etapa e adicionar formacao depois
              </p>
            )}
          </div>
        );

      case 3: // Skills
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Suas habilidades</h2>
              <p className="text-muted-foreground mt-2">
                Adicione suas principais skills e competencias
              </p>
            </div>

            {/* List of added skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-sm"
                  >
                    <span>{skill.name}</span>
                    <button
                      onClick={() => skill.id && removeSkill(skill.id)}
                      className="hover:text-amber-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new skill form */}
            {newSkill ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nova Skill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome da Skill *</Label>
                    <Input
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="Ex: React, Lideranca, Ingles"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        {skillCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Nivel</Label>
                      <select
                        value={newSkill.level}
                        onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        {skillLevels.map((level) => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setNewSkill(null)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={addSkill}
                      disabled={!newSkill.name}
                    >
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outline"
                className="w-full h-12 border-dashed"
                onClick={() => setNewSkill({
                  name: "",
                  category: "technical",
                  level: "intermediate",
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Skill
              </Button>
            )}

            {skills.length === 0 && !newSkill && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Voce pode pular esta etapa e adicionar skills depois
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Image
            src="/revuuLogo.png"
            alt="Revuu"
            width={100}
            height={32}
            className="dark:invert"
          />
          <span className="text-sm text-muted-foreground">
            Passo {currentStep + 1} de {steps.length}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        isCompleted && "bg-green-500 text-white",
                        isActive && "bg-amber-500 text-white",
                        !isActive && !isCompleted && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs mt-1 hidden sm:block",
                      isActive ? "text-amber-500 font-medium" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-8 sm:w-16 md:w-24 mx-2",
                        index < currentStep ? "bg-green-500" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || saving}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Button
            onClick={handleNext}
            disabled={saving || (currentStep === 0 && !profile.fullName)}
            className="bg-amber-500 hover:bg-amber-600"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                Concluir
                <Check className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Proximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
