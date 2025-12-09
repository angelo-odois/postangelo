"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Lock, Mail, ArrowRight, User, AtSign, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [usernameMessage, setUsernameMessage] = useState("");

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      if (!user.onboardingCompleted) {
        router.push("/admin/onboarding");
      } else {
        router.push("/admin/dashboard");
      }
    }
  }, [user, router]);

  // Username validation with debounce
  useEffect(() => {
    if (!username) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }

    // Validate format
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameStatus("invalid");
      setUsernameMessage("Apenas letras, numeros e hifens");
      return;
    }

    if (username.length < 3) {
      setUsernameStatus("invalid");
      setUsernameMessage("Minimo 3 caracteres");
      return;
    }

    if (username.length > 30) {
      setUsernameStatus("invalid");
      setUsernameMessage("Maximo 30 caracteres");
      return;
    }

    // Check availability
    const timer = setTimeout(async () => {
      setUsernameStatus("checking");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/portfolio/check-username/${username}`
        );
        const data = await response.json();

        if (data.available) {
          setUsernameStatus("available");
          setUsernameMessage("Disponivel!");
        } else {
          setUsernameStatus("taken");
          setUsernameMessage(data.reason || "Username indisponivel");
        }
      } catch {
        setUsernameStatus("idle");
        setUsernameMessage("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas nao conferem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (usernameStatus !== "available") {
      setError("Escolha um username valido e disponivel");
      return;
    }

    setLoading(true);

    try {
      const response = await api.register({ name, email, password, username });
      setAuth(
        response.user as any,
        response.accessToken,
        response.refreshToken
      );
      router.push("/admin/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <Image
            src="/revuuLogo.png"
            alt="Revuu"
            width={280}
            height={90}
            className="mb-8 brightness-0 invert"
            priority
          />
          <h1 className="text-4xl font-bold text-center mb-4">
            Comece sua jornada
          </h1>
          <p className="text-xl text-white/90 text-center max-w-md">
            Crie seu curriculo profissional e compartilhe com o mundo
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4 text-white/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-bold">1</span>
              </div>
              <span>Crie sua conta em segundos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-bold">2</span>
              </div>
              <span>Configure seu curriculo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-bold">3</span>
              </div>
              <span>Compartilhe seu link unico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/revuuLogo.png"
              alt="Revuu"
              width={180}
              height={60}
              priority
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Criar conta
            </h2>
            <p className="text-muted-foreground mt-2">
              Preencha os dados para comecar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="seu-username"
                  className={cn(
                    "pl-10 pr-10 h-12",
                    usernameStatus === "available" && "border-green-500 focus-visible:ring-green-500",
                    usernameStatus === "taken" && "border-red-500 focus-visible:ring-red-500",
                    usernameStatus === "invalid" && "border-yellow-500 focus-visible:ring-yellow-500"
                  )}
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                  {usernameStatus === "available" && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {usernameStatus === "taken" && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  {usernameStatus === "invalid" && (
                    <X className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
              {username && (
                <div className="flex items-center justify-between text-xs">
                  <span className={cn(
                    usernameStatus === "available" && "text-green-600",
                    usernameStatus === "taken" && "text-red-600",
                    usernameStatus === "invalid" && "text-yellow-600",
                    usernameStatus === "checking" && "text-muted-foreground"
                  )}>
                    {usernameMessage}
                  </span>
                  <span className="text-muted-foreground">
                    revuu.com/u/{username || "..."}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 6 caracteres"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  className={cn(
                    "pl-10 h-12",
                    confirmPassword && password !== confirmPassword && "border-red-500"
                  )}
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600">As senhas nao conferem</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-medium text-base group"
              disabled={loading || usernameStatus !== "available"}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Criar conta
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ja tem uma conta?{" "}
            <Link href="/admin" className="text-amber-500 hover:text-amber-600 font-medium">
              Entrar
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Powered by{" "}
            <span className="font-semibold text-amber-500">Revuu</span>
          </p>
        </div>
      </div>
    </div>
  );
}
