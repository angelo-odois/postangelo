"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  FolderKanban,
  User,
  ExternalLink,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Rocket,
  Target,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";

interface Stats {
  pages: number;
  experiences: number;
  education: number;
  skills: number;
  projects: number;
  profile: boolean;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    pages: 0,
    experiences: 0,
    education: 0,
    skills: 0,
    projects: 0,
    profile: false,
  });
  const [recentPages, setRecentPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { getValidToken } = useAuthStore.getState();
    const token = await getValidToken();

    if (!token) return;

    try {
      const [pages, experiences, education, skills, projects, profile] =
        await Promise.all([
          api.getPages().catch(() => []),
          api.getExperiences(token).catch(() => []),
          api.getEducation(token).catch(() => []),
          api.getSkills(token).catch(() => []),
          api.getProjects(token).catch(() => []),
          api.getMyProfile(token).catch(() => null),
        ]);

      setStats({
        pages: (pages as Page[]).length,
        experiences: (experiences as any[]).length,
        education: (education as any[]).length,
        skills: (skills as any[]).length,
        projects: (projects as any[]).length,
        profile: !!(profile as any)?.fullName,
      });

      setRecentPages((pages as Page[]).slice(0, 3));
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Paginas",
      value: stats.pages,
      icon: FileText,
      href: "/admin/pages",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Experiencias",
      value: stats.experiences,
      icon: Briefcase,
      href: "/admin/experiences",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Educacao",
      value: stats.education,
      icon: GraduationCap,
      href: "/admin/education",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: Code,
      href: "/admin/skills",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Projetos",
      value: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      gradient: "from-pink-500 to-pink-600",
    },
  ];

  const quickActions = [
    {
      title: "Editar Perfil",
      description: "Atualize suas informacoes pessoais",
      href: "/admin/profile",
      icon: User,
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Nova Pagina",
      description: "Crie uma nova landing page",
      href: "/admin/pages",
      icon: Plus,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Adicionar Experiencia",
      description: "Registre uma nova experiencia profissional",
      href: "/admin/experiences",
      icon: Briefcase,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Novo Projeto",
      description: "Adicione um projeto ao seu portfolio",
      href: "/admin/projects",
      icon: FolderKanban,
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "Ver Curriculo",
      description: "Visualize seu curriculo publico",
      href: `/u/${user?.username || "admin"}`,
      icon: ExternalLink,
      external: true,
      color: "bg-green-500/10 text-green-500",
    },
  ];

  const completionItems = [
    {
      label: "Perfil completo",
      completed: stats.profile,
      href: "/admin/profile",
      tip: "Adicione seu nome, titulo e bio"
    },
    {
      label: "Pelo menos 1 experiencia",
      completed: stats.experiences > 0,
      href: "/admin/experiences",
      tip: "Adicione sua experiencia profissional"
    },
    {
      label: "Pelo menos 1 projeto",
      completed: stats.projects > 0,
      href: "/admin/projects",
      tip: "Mostre seus melhores trabalhos"
    },
    {
      label: "Pelo menos 3 skills",
      completed: stats.skills >= 3,
      href: "/admin/skills",
      tip: "Liste suas habilidades tecnicas"
    },
    {
      label: "Pelo menos 1 formacao",
      completed: stats.education > 0,
      href: "/admin/education",
      tip: "Adicione sua formacao academica"
    },
  ];

  const completedCount = completionItems.filter((i) => i.completed).length;
  const completionPercentage = Math.round(
    (completedCount / completionItems.length) * 100
  );

  const tips = [
    { icon: Target, text: "Complete seu perfil para aparecer nas buscas" },
    { icon: Zap, text: "Adicione projetos com imagens para destacar seu trabalho" },
    { icon: TrendingUp, text: "Mantenha suas experiencias atualizadas" },
  ];

  const isNewUser = completionPercentage < 50;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header with Welcome Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 border border-amber-500/20 p-6 md:p-8">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {isNewUser ? "Comece aqui" : "Bem-vindo de volta"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Ola, {user?.name?.split(" ")[0] || "Usuario"}!
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                {isNewUser
                  ? "Complete seu curriculo para comecar a impressionar recrutadores e clientes. Siga os passos abaixo para configurar tudo."
                  : "Seu curriculo esta ficando incrivel! Continue adicionando conteudo para se destacar ainda mais."
                }
              </p>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="gap-2">
                <Link href={`/u/${user?.username || "admin"}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  Ver Curriculo
                </Link>
              </Button>
              <Button asChild className="gap-2 bg-amber-500 hover:bg-amber-600 text-white">
                <Link href="/admin/profile">
                  <Rocket className="h-4 w-4" />
                  {isNewUser ? "Comecar" : "Editar Perfil"}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat, index) => (
            <Link key={stat.title} href={stat.href}>
              <Card
                className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
              >
                <CardContent className="p-6 relative">
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500`} />
                  <div className="flex items-center justify-between relative">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold mt-1 tabular-nums">
                        {loading ? (
                          <span className="inline-block w-8 h-8 bg-muted animate-pulse rounded" />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Acoes Rapidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 hover:border-amber-500/30 transition-all duration-300 group"
                  >
                    <div className={`p-2.5 rounded-xl ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{action.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completion Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Status do Curriculo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Progresso
                  </span>
                  <span className={`text-sm font-bold ${
                    completionPercentage === 100
                      ? "text-green-500"
                      : completionPercentage >= 60
                        ? "text-amber-500"
                        : "text-muted-foreground"
                  }`}>
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out rounded-full ${
                      completionPercentage === 100
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                {completionPercentage === 100 && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Parabens! Curriculo completo
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {completionItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all ${
                      item.completed
                        ? "bg-green-500/5"
                        : "hover:bg-muted cursor-pointer"
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className={item.completed ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}>
                        {item.label}
                      </span>
                      {!item.completed && (
                        <p className="text-xs text-muted-foreground/60 truncate">
                          {item.tip}
                        </p>
                      )}
                    </div>
                    {!item.completed && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        {isNewUser && (
          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Dicas para um portfolio de sucesso</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <tip.icon className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Pages */}
        {recentPages.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Paginas Recentes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/pages">
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/admin/pages/${page.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-blue-500 transition-colors">
                          {page.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          /{page.slug}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        page.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {page.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
