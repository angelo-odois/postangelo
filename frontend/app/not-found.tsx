import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
            <FileQuestion className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <h1 className="text-7xl font-bold text-foreground mb-2">404</h1>

        <p className="text-xl font-medium text-foreground mb-2">
          Pagina nao encontrada
        </p>

        <p className="text-muted-foreground mb-8">
          A pagina que voce esta procurando nao existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Pagina Inicial
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Codigo do erro: <span className="font-mono font-semibold text-amber-600">E9005</span>
        </p>
      </div>
    </div>
  );
}
