"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Lock,
  Crown,
  ExternalLink,
  Copy,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin";
import { useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

interface CustomDomain {
  id: string;
  domain: string;
  status: "pending" | "verified" | "failed";
  sslStatus: "pending" | "active" | "failed";
  createdAt: string;
}

export default function DomainsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);

  const userPlan = user?.plan || "free";
  const hasCustomDomain = userPlan === "pro" || userPlan === "business";
  const maxDomains = userPlan === "business" ? -1 : userPlan === "pro" ? 1 : 0;
  const canAddMore = maxDomains === -1 || domains.length < maxDomains;

  useEffect(() => {
    if (!user) {
      router.push("/admin");
      return;
    }
    // Simulated load - in production, fetch from API
    setLoading(false);
  }, [user, router]);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain)) {
      toast({ title: "Dominio invalido", description: "Digite um dominio valido (ex: meusite.com)", variant: "destructive" });
      return;
    }

    setAdding(true);
    try {
      // TODO: Implement actual API call
      const newDomainObj: CustomDomain = {
        id: Date.now().toString(),
        domain: newDomain,
        status: "pending",
        sslStatus: "pending",
        createdAt: new Date().toISOString(),
      };
      setDomains([...domains, newDomainObj]);
      setNewDomain("");
      toast({ title: "Dominio adicionado", description: "Configure os registros DNS para verificar.", variant: "success" });
    } catch (error) {
      console.error("Failed to add domain:", error);
      toast({ title: "Erro ao adicionar dominio", variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveDomain = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este dominio?")) return;

    try {
      setDomains(domains.filter((d) => d.id !== id));
      toast({ title: "Dominio removido", variant: "success" });
    } catch (error) {
      console.error("Failed to remove domain:", error);
      toast({ title: "Erro ao remover dominio", variant: "destructive" });
    }
  };

  const handleVerify = async (id: string) => {
    const domain = domains.find((d) => d.id === id);
    if (!domain) return;

    // Simulate verification
    toast({ title: "Verificando...", description: "Isso pode levar alguns minutos" });

    // Update to verified after delay (simulation)
    setTimeout(() => {
      setDomains(domains.map((d) =>
        d.id === id ? { ...d, status: "verified" as const, sslStatus: "active" as const } : d
      ));
      toast({ title: "Dominio verificado!", variant: "success" });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", variant: "success" });
  };

  if (!user) return null;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-amber-500" />
            Dominios Personalizados
          </h1>
          <p className="text-muted-foreground">
            Conecte seu proprio dominio ao seu portfolio
          </p>
        </div>

        {/* Upgrade Card for Free users */}
        {!hasCustomDomain && (
          <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <Lock className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Dominios Personalizados</h3>
                  <p className="text-sm text-muted-foreground">
                    Faca upgrade para PRO ou Business para usar seu proprio dominio.
                  </p>
                </div>
                <Link href="/admin/subscription">
                  <Button className="gap-2">
                    <Crown className="h-4 w-4" />
                    Fazer Upgrade
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Domain Form - Only for PRO/Business */}
        {hasCustomDomain && (
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Dominio</CardTitle>
              <CardDescription>
                {maxDomains === -1
                  ? "Voce pode adicionar dominios ilimitados"
                  : `Voce pode adicionar ate ${maxDomains} dominio(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label>Dominio</Label>
                  <Input
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value.toLowerCase())}
                    placeholder="meusite.com"
                    disabled={!canAddMore}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddDomain}
                    disabled={adding || !canAddMore || !newDomain}
                  >
                    {adding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {!canAddMore && maxDomains !== -1 && (
                <p className="text-sm text-amber-600 mt-2">
                  Limite de {maxDomains} dominio(s) atingido.
                  {userPlan === "pro" && (
                    <Link href="/admin/subscription" className="underline ml-1">
                      Upgrade para Business para dominios ilimitados
                    </Link>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* DNS Configuration Guide */}
        {hasCustomDomain && domains.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Configuracao de DNS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione os seguintes registros DNS no seu provedor de dominio:
              </p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Tipo: CNAME</p>
                    <p className="text-xs text-muted-foreground">
                      Host: @ ou www → Valor: revuu.com.br
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("revuu.com.br")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Tipo: TXT (Verificacao)</p>
                    <p className="text-xs text-muted-foreground">
                      Host: _revuu → Valor: verify={user?.id?.slice(0, 8)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`verify=${user?.id?.slice(0, 8)}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Domains List */}
        {hasCustomDomain && (
          <Card>
            <CardHeader>
              <CardTitle>Seus Dominios</CardTitle>
            </CardHeader>
            <CardContent>
              {domains.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum dominio configurado ainda
                </p>
              ) : (
                <div className="space-y-3">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      className="p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{domain.domain}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span
                              className={`flex items-center gap-1 ${
                                domain.status === "verified"
                                  ? "text-green-600"
                                  : domain.status === "failed"
                                  ? "text-red-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {domain.status === "verified" ? (
                                <Check className="h-3 w-3" />
                              ) : domain.status === "failed" ? (
                                <X className="h-3 w-3" />
                              ) : (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                              {domain.status === "verified"
                                ? "Verificado"
                                : domain.status === "failed"
                                ? "Falhou"
                                : "Pendente"}
                            </span>
                            <span className="text-muted-foreground">|</span>
                            <span
                              className={`flex items-center gap-1 ${
                                domain.sslStatus === "active"
                                  ? "text-green-600"
                                  : domain.sslStatus === "failed"
                                  ? "text-red-600"
                                  : "text-amber-600"
                              }`}
                            >
                              SSL: {domain.sslStatus === "active" ? "Ativo" : domain.sslStatus === "failed" ? "Falhou" : "Pendente"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {domain.status === "verified" && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {domain.status === "pending" && (
                          <Button variant="outline" size="sm" onClick={() => handleVerify(domain.id)}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Verificar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDomain(domain.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
