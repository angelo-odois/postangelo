"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeadphonesIcon,
  MessageCircle,
  Mail,
  Clock,
  Star,
  Zap,
  Crown,
  CheckCircle,
  ExternalLink,
  FileText,
  Users,
  Phone,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin";
import { useAuthStore } from "@/lib/store";

interface SupportTier {
  name: string;
  description: string;
  responseTime: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
}

const SUPPORT_TIERS: Record<string, SupportTier> = {
  free: {
    name: "Suporte Padrao",
    description: "Suporte por email e documentacao",
    responseTime: "Ate 72 horas",
    features: [
      "Acesso a documentacao",
      "Suporte por email",
      "FAQ e tutoriais",
    ],
    icon: <Mail className="h-6 w-6" />,
    color: "text-gray-500",
  },
  pro: {
    name: "Suporte Prioritario",
    description: "Respostas mais rapidas e chat ao vivo",
    responseTime: "Ate 24 horas",
    features: [
      "Tudo do plano anterior",
      "Chat ao vivo",
      "Prioridade na fila",
      "Suporte tecnico avancado",
    ],
    icon: <Zap className="h-6 w-6" />,
    color: "text-indigo-500",
  },
  business: {
    name: "Suporte Dedicado",
    description: "Gerente de conta dedicado e suporte 24/7",
    responseTime: "Ate 4 horas",
    features: [
      "Tudo do plano anterior",
      "Gerente de conta dedicado",
      "Suporte por telefone",
      "Chamadas de video",
      "SLA garantido",
      "Onboarding personalizado",
    ],
    icon: <Crown className="h-6 w-6" />,
    color: "text-amber-500",
  },
};

export default function SupportPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const userPlan = user?.plan || "free";
  const currentTier = SUPPORT_TIERS[userPlan];
  const hasPrioritySupport = userPlan === "pro" || userPlan === "business";
  const hasDedicatedSupport = userPlan === "business";

  useEffect(() => {
    if (!user) {
      router.push("/admin");
      return;
    }
    setLoading(false);
  }, [user, router]);

  if (!user) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeadphonesIcon className="h-6 w-6 text-amber-500" />
            Suporte
          </h1>
          <p className="text-muted-foreground">
            Estamos aqui para ajudar
          </p>
        </div>

        {/* Current Support Tier */}
        <Card className={`border-2 ${userPlan === "business" ? "border-amber-500" : userPlan === "pro" ? "border-indigo-500" : "border-gray-200"}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`p-3 rounded-xl ${userPlan === "business" ? "bg-amber-500/20" : userPlan === "pro" ? "bg-indigo-500/20" : "bg-gray-500/20"}`}>
                <span className={currentTier.color}>{currentTier.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{currentTier.name}</h3>
                  <Badge className={userPlan === "business" ? "bg-amber-500" : userPlan === "pro" ? "bg-indigo-500" : "bg-gray-500"}>
                    {userPlan === "free" ? "Free" : userPlan === "pro" ? "PRO" : "Business"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentTier.description}
                </p>
                <p className="text-sm mt-1 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Tempo de resposta: <strong>{currentTier.responseTime}</strong>
                </p>
              </div>
              {userPlan !== "business" && (
                <Link href="/admin/subscription">
                  <Button className="gap-2">
                    <Star className="h-4 w-4" />
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">Seu plano inclui:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {currentTier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Email Support - Available to all */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-5 w-5 text-blue-500" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Envie sua duvida por email
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:suporte@revuu.com.br">
                  suporte@revuu.com.br
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Live Chat - PRO and Business */}
          <Card className={!hasPrioritySupport ? "opacity-75" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-5 w-5 text-green-500" />
                Chat ao Vivo
                {!hasPrioritySupport && <Badge variant="outline">PRO</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Converse em tempo real com nossa equipe
              </p>
              <Button
                variant={hasPrioritySupport ? "default" : "outline"}
                className="w-full"
                disabled={!hasPrioritySupport}
              >
                {hasPrioritySupport ? "Iniciar Chat" : "Disponivel no PRO"}
              </Button>
            </CardContent>
          </Card>

          {/* Phone Support - Business only */}
          <Card className={!hasDedicatedSupport ? "opacity-75" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-5 w-5 text-amber-500" />
                Telefone
                {!hasDedicatedSupport && <Badge variant="outline">Business</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Ligue para nosso suporte dedicado
              </p>
              <Button
                variant={hasDedicatedSupport ? "default" : "outline"}
                className="w-full"
                disabled={!hasDedicatedSupport}
                asChild={hasDedicatedSupport}
              >
                {hasDedicatedSupport ? (
                  <a href="tel:+5511999999999">+55 11 99999-9999</a>
                ) : (
                  "Disponivel no Business"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dedicated Account Manager - Business only */}
        {hasDedicatedSupport && (
          <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                Seu Gerente de Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Equipe Revuu Business</h4>
                  <p className="text-sm text-muted-foreground">
                    Seu gerente de conta esta disponivel para ajudar com qualquer necessidade.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" asChild>
                      <a href="mailto:business@revuu.com.br">
                        <Mail className="h-4 w-4 mr-1" />
                        Email Direto
                      </a>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Agendar Reuniao
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compare Support Tiers */}
        {userPlan !== "business" && (
          <Card>
            <CardHeader>
              <CardTitle>Compare os Niveis de Suporte</CardTitle>
              <CardDescription>
                Veja o que cada plano oferece
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4">Recurso</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">PRO</th>
                      <th className="text-center py-3 px-4">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Tempo de resposta</td>
                      <td className="text-center py-3 px-4">72h</td>
                      <td className="text-center py-3 px-4">24h</td>
                      <td className="text-center py-3 px-4 font-semibold text-amber-500">4h</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Email</td>
                      <td className="text-center py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Chat ao vivo</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500 mx-auto" /></td>
                      <td className="text-center py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Telefone</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4">Gerente dedicado</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">SLA garantido</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4"><CheckCircle className="h-4 w-4 text-green-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-6">
                <Link href="/admin/subscription">
                  <Button className="gap-2">
                    <Crown className="h-4 w-4" />
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Recursos de Ajuda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="https://docs.revuu.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border hover:border-foreground/20 transition-colors"
              >
                <FileText className="h-5 w-5 text-muted-foreground mb-2" />
                <h4 className="font-medium">Documentacao</h4>
                <p className="text-xs text-muted-foreground">Guias completos</p>
              </a>
              <a
                href="https://revuu.com.br/faq"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border hover:border-foreground/20 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-muted-foreground mb-2" />
                <h4 className="font-medium">FAQ</h4>
                <p className="text-xs text-muted-foreground">Perguntas frequentes</p>
              </a>
              <a
                href="https://status.revuu.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border hover:border-foreground/20 transition-colors"
              >
                <Zap className="h-5 w-5 text-muted-foreground mb-2" />
                <h4 className="font-medium">Status</h4>
                <p className="text-xs text-muted-foreground">Status do sistema</p>
              </a>
              <Link
                href="/admin/training"
                className="p-4 rounded-lg border hover:border-foreground/20 transition-colors"
              >
                <Star className="h-5 w-5 text-muted-foreground mb-2" />
                <h4 className="font-medium">Treinamento</h4>
                <p className="text-xs text-muted-foreground">Cursos e tutoriais</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
