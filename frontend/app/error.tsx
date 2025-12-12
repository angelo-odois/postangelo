"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorInfo {
  code?: string;
  message?: string;
  requestId?: string;
  timestamp?: string;
}

function parseErrorInfo(error: Error): ErrorInfo {
  // Try to extract error info from API errors
  if (error.message) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.error) {
        return {
          code: parsed.error.code,
          message: parsed.error.message,
          requestId: parsed.error.requestId,
          timestamp: parsed.error.timestamp,
        };
      }
    } catch {
      // Not JSON, use raw message
    }
  }

  return {
    code: "E9001",
    message: error.message || "Erro interno do servidor",
  };
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({});

  useEffect(() => {
    console.error("[Error Page]", error);
    setErrorInfo(parseErrorInfo(error));
  }, [error]);

  const copyErrorInfo = () => {
    const text = `Codigo: ${errorInfo.code || "E9001"}
Mensagem: ${errorInfo.message || error.message}
Request ID: ${errorInfo.requestId || error.digest || "N/A"}
Timestamp: ${errorInfo.timestamp || new Date().toISOString()}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-2">
          Ops! Algo deu errado
        </h1>

        <p className="text-muted-foreground mb-6">
          {errorInfo.message || "Ocorreu um erro inesperado. Por favor, tente novamente."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button onClick={reset} variant="default">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Pagina Inicial
            </Link>
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              Detalhes do Erro
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={copyErrorInfo}
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <p>
              <span className="text-muted-foreground">Codigo:</span>{" "}
              <span className="text-red-500 font-semibold">
                {errorInfo.code || "E9001"}
              </span>
            </p>
            {(errorInfo.requestId || error.digest) && (
              <p>
                <span className="text-muted-foreground">Request:</span>{" "}
                <span className="text-foreground">
                  {errorInfo.requestId || error.digest}
                </span>
              </p>
            )}
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Se o problema persistir, entre em contato com o suporte informando o codigo do erro.
        </p>
      </div>
    </div>
  );
}
