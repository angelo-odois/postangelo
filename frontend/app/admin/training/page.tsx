"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Play,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Lock,
  Crown,
  Clock,
  Users,
  Star,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin";
import { useAuthStore } from "@/lib/store";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  category: "getting-started" | "advanced" | "business";
  thumbnail: string;
  isPremium: boolean;
  isCompleted?: boolean;
}

const COURSES: Course[] = [
  {
    id: "1",
    title: "Primeiros Passos com Revuu",
    description: "Aprenda a criar seu primeiro portfolio do zero",
    duration: "15 min",
    lessons: 5,
    category: "getting-started",
    thumbnail: "/training/getting-started.jpg",
    isPremium: false,
  },
  {
    id: "2",
    title: "Personalizando seu Portfolio",
    description: "Explore todas as opcoes de customizacao",
    duration: "25 min",
    lessons: 8,
    category: "getting-started",
    thumbnail: "/training/customization.jpg",
    isPremium: false,
  },
  {
    id: "3",
    title: "Dominando Blocos Avancados",
    description: "Use blocos aninhados, grids e layouts complexos",
    duration: "40 min",
    lessons: 12,
    category: "advanced",
    thumbnail: "/training/advanced-blocks.jpg",
    isPremium: true,
  },
  {
    id: "4",
    title: "SEO e Performance",
    description: "Otimize seu portfolio para buscadores",
    duration: "30 min",
    lessons: 7,
    category: "advanced",
    thumbnail: "/training/seo.jpg",
    isPremium: true,
  },
  {
    id: "5",
    title: "Integracao com API",
    description: "Conecte seu portfolio a outras aplicacoes",
    duration: "45 min",
    lessons: 10,
    category: "business",
    thumbnail: "/training/api.jpg",
    isPremium: true,
  },
  {
    id: "6",
    title: "Gestao de Equipe",
    description: "Gerencie portfolios de toda sua equipe",
    duration: "35 min",
    lessons: 8,
    category: "business",
    thumbnail: "/training/team.jpg",
    isPremium: true,
  },
];

export default function TrainingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const userPlan = user?.plan || "free";
  const hasTraining = userPlan === "business";
  const hasPremiumContent = userPlan === "pro" || userPlan === "business";

  useEffect(() => {
    if (!user) {
      router.push("/admin");
      return;
    }
    setLoading(false);
  }, [user, router]);

  const getCategoryLabel = (category: Course["category"]) => {
    switch (category) {
      case "getting-started":
        return "Iniciante";
      case "advanced":
        return "Avancado";
      case "business":
        return "Business";
    }
  };

  const getCategoryColor = (category: Course["category"]) => {
    switch (category) {
      case "getting-started":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "business":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    }
  };

  const canAccessCourse = (course: Course) => {
    if (!course.isPremium) return true;
    if (course.category === "business") return hasTraining;
    return hasPremiumContent;
  };

  if (!user) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-amber-500" />
            Treinamento
          </h1>
          <p className="text-muted-foreground">
            Aprenda a criar portfolios incriveis com nossos cursos
          </p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Seu Progresso</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>0 cursos completos</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>0 horas assistidas</span>
                  </div>
                </div>
              </div>
              {hasTraining && (
                <Badge className="bg-amber-500">
                  <Users className="h-3 w-3 mr-1" />
                  Treinamento Dedicado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dedicated Training for Business */}
        {hasTraining && (
          <Card className="border-2 border-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-amber-500" />
                Treinamento Dedicado
                <Badge className="bg-amber-500">Business</Badge>
              </CardTitle>
              <CardDescription>
                Agende uma sessao de treinamento ao vivo com nossa equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Onboarding Personalizado</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sessao de 1 hora para configurar seu portfolio do zero
                  </p>
                  <Button variant="outline" size="sm">
                    Agendar Sessao
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Workshop de Equipe</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Treinamento para toda sua equipe (ate 10 pessoas)
                  </p>
                  <Button variant="outline" size="sm">
                    Solicitar Workshop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Card for non-Business */}
        {!hasTraining && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="p-3 rounded-xl bg-muted">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Treinamento Dedicado</h3>
                  <p className="text-sm text-muted-foreground">
                    Usuarios Business tem acesso a sessoes de treinamento ao vivo com nossa equipe.
                  </p>
                </div>
                <Link href="/admin/subscription">
                  <Button className="gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade para Business
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Courses by Category */}
        {["getting-started", "advanced", "business"].map((category) => {
          const categoryCourses = COURSES.filter((c) => c.category === category);
          if (categoryCourses.length === 0) return null;

          return (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {category === "getting-started" && <BookOpen className="h-5 w-5 text-green-500" />}
                {category === "advanced" && <Video className="h-5 w-5 text-blue-500" />}
                {category === "business" && <Users className="h-5 w-5 text-amber-500" />}
                {getCategoryLabel(category as Course["category"])}
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryCourses.map((course) => {
                  const canAccess = canAccessCourse(course);

                  return (
                    <Card
                      key={course.id}
                      className={`relative overflow-hidden ${!canAccess ? "opacity-75" : ""}`}
                    >
                      {!canAccess && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                      {course.isPremium && canAccess && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-amber-500">
                            <Crown className="h-3 w-3 mr-1" />
                            PRO
                          </Badge>
                        </div>
                      )}

                      {/* Thumbnail placeholder */}
                      <div className="h-32 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                        <Play className={`h-12 w-12 ${canAccess ? "text-amber-500" : "text-muted-foreground"}`} />
                      </div>

                      <CardContent className="pt-4">
                        <Badge className={`mb-2 ${getCategoryColor(course.category)}`}>
                          {getCategoryLabel(course.category)}
                        </Badge>
                        <h3 className="font-semibold mb-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {course.lessons} licoes
                            </span>
                          </div>
                        </div>

                        <Button
                          variant={canAccess ? "default" : "outline"}
                          size="sm"
                          className="w-full mt-4"
                          disabled={!canAccess}
                        >
                          {canAccess ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Comecar
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              {course.category === "business" ? "Requer Business" : "Requer PRO"}
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Help Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Recursos Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="https://docs.revuu.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border hover:border-foreground/20 transition-colors flex items-start gap-3"
              >
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Documentacao</h4>
                  <p className="text-sm text-muted-foreground">Guias e referencias</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a
                href="https://youtube.com/@revuu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border hover:border-foreground/20 transition-colors flex items-start gap-3"
              >
                <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">YouTube</h4>
                  <p className="text-sm text-muted-foreground">Tutoriais em video</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a
                href="https://comunidade.revuu.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border hover:border-foreground/20 transition-colors flex items-start gap-3"
              >
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Comunidade</h4>
                  <p className="text-sm text-muted-foreground">Forum de usuarios</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
