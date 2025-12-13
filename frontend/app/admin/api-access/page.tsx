"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Crown,
  AlertTriangle,
  Check,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin";
import { useAuthStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string | null;
  createdAt: string;
}

export default function ApiAccessPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const userPlan = user?.plan || "free";
  const hasApiAccess = userPlan === "business";

  useEffect(() => {
    if (!user) {
      router.push("/admin");
      return;
    }
    setLoading(false);
  }, [user, router]);

  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "revuu_";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast({ title: "Digite um nome para a chave", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const newKey = generateApiKey();
      const newApiKey: ApiKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: newKey,
        lastUsed: null,
        createdAt: new Date().toISOString(),
      };
      setApiKeys([...apiKeys, newApiKey]);
      setNewKeyName("");
      setNewlyCreatedKey(newKey);
      toast({ title: "Chave API criada", description: "Copie a chave agora - ela nao sera exibida novamente.", variant: "success" });
    } catch (error) {
      console.error("Failed to create API key:", error);
      toast({ title: "Erro ao criar chave", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta chave? Aplicacoes usando esta chave deixarao de funcionar.")) return;

    try {
      setApiKeys(apiKeys.filter((k) => k.id !== id));
      toast({ title: "Chave excluida", variant: "success" });
    } catch (error) {
      console.error("Failed to delete API key:", error);
      toast({ title: "Erro ao excluir chave", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", variant: "success" });
  };

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return key.slice(0, 10) + "..." + key.slice(-4);
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
            <Key className="h-6 w-6 text-amber-500" />
            Acesso API
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas chaves de API para integracao
          </p>
        </div>

        {/* Upgrade Card for non-Business users */}
        {!hasApiAccess && (
          <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <Lock className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Acesso API - Exclusivo Business</h3>
                  <p className="text-sm text-muted-foreground">
                    Integre seu portfolio com outras aplicacoes usando nossa API REST.
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

        {/* API Documentation Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              Documentacao da API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Nossa API REST permite integrar seu portfolio com outras aplicacoes.
                {!hasApiAccess && " Faca upgrade para Business para ter acesso."}
              </p>

              <div className="p-4 rounded-lg bg-muted/50 font-mono text-sm">
                <p className="text-muted-foreground"># Exemplo de requisicao</p>
                <p className="text-green-600">GET</p>
                <p>https://api.revuu.com.br/v1/portfolio/{"{username}"}</p>
                <p className="mt-2 text-muted-foreground"># Headers</p>
                <p>Authorization: Bearer {"<sua_chave_api>"}</p>
              </div>

              <div className="grid gap-2 text-sm">
                <p className="font-medium">Endpoints disponiveis:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>GET /v1/portfolio/:username - Dados do portfolio</li>
                  <li>GET /v1/analytics - Metricas e estatisticas</li>
                  <li>POST /v1/pages - Criar nova pagina</li>
                  <li>PUT /v1/pages/:id - Atualizar pagina</li>
                  <li>DELETE /v1/pages/:id - Excluir pagina</li>
                </ul>
              </div>

              <Button variant="outline" asChild>
                <a href="https://docs.revuu.com.br/api" target="_blank" rel="noopener noreferrer">
                  Ver Documentacao Completa
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create API Key - Only for Business */}
        {hasApiAccess && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Criar Nova Chave</CardTitle>
                <CardDescription>
                  Chaves API permitem acesso programatico ao seu portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label>Nome da Chave</Label>
                    <Input
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Ex: Meu App, Integracao CRM"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleCreateKey}
                      disabled={creating || !newKeyName}
                    >
                      {creating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Chave
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Newly Created Key Alert */}
            {newlyCreatedKey && (
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Chave criada com sucesso!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        Copie esta chave agora. Por seguranca, ela nao sera exibida novamente.
                      </p>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-black/20 font-mono text-sm">
                        <span className="flex-1 break-all">{newlyCreatedKey}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(newlyCreatedKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setNewlyCreatedKey(null)}
                      >
                        Entendi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Keys List */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Chaves API</CardTitle>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma chave API criada ainda
                  </p>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className="p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-medium">{apiKey.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                            </code>
                            <button
                              onClick={() => toggleShowKey(apiKey.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {showKeys[apiKey.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Criada em {new Date(apiKey.createdAt).toLocaleDateString("pt-BR")}
                            {apiKey.lastUsed && ` | Ultimo uso: ${new Date(apiKey.lastUsed).toLocaleDateString("pt-BR")}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKey(apiKey.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rate Limits Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Limites de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Requisicoes/minuto</p>
                    <p className="text-2xl font-bold">100</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Requisicoes/dia</p>
                    <p className="text-2xl font-bold">10.000</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Chaves ativas</p>
                    <p className="text-2xl font-bold">{apiKeys.length}/10</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
