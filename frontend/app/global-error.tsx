"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="max-w-md w-full px-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-2">
              Erro Critico
            </h1>

            <p className="text-slate-400 mb-6">
              Ocorreu um erro grave no sistema. Por favor, tente recarregar a pagina.
            </p>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 font-medium rounded-full hover:bg-amber-400 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Recarregar
            </button>

            <p className="mt-8 text-xs text-slate-500">
              Codigo: <span className="font-mono text-red-400">E9001</span>
              {error.digest && (
                <span className="ml-2">| ID: {error.digest}</span>
              )}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
