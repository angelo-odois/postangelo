"use client";

import { useEffect, useState } from "react";
import { FileText, Layout, Link2, User, Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, PageTemplate } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: PageTemplate | null, title: string, slug: string) => void;
  loading?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  cv: <User className="h-6 w-6" />,
  landing: <Layout className="h-6 w-6" />,
  links: <Link2 className="h-6 w-6" />,
  other: <FileText className="h-6 w-6" />,
};

const categoryColors: Record<string, string> = {
  cv: "from-blue-500 to-indigo-500",
  landing: "from-purple-500 to-pink-500",
  links: "from-green-500 to-teal-500",
  other: "from-gray-500 to-gray-600",
};

export function TemplateSelectionDialog({
  open,
  onOpenChange,
  onSelect,
  loading = false,
}: TemplateSelectionDialogProps) {
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [step, setStep] = useState<"select" | "details">("select");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (open) {
      loadTemplates();
      setStep("select");
      setSelectedTemplate(null);
      setTitle("");
      setSlug("");
    }
  }, [open]);

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const data = await api.getPageTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = (template: PageTemplate | null) => {
    setSelectedTemplate(template);
    setTitle(template?.defaultTitle || "Novo Projeto");
    setSlug(generateSlug(template?.defaultTitle || "novo-projeto"));
    setStep("details");
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleCreate = () => {
    if (!title || !slug) return;
    onSelect(selectedTemplate, title, slug);
  };

  const handleBack = () => {
    setStep("select");
    setSelectedTemplate(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {step === "select" ? "Escolha um Template" : "Detalhes do Projeto"}
          </DialogTitle>
        </DialogHeader>

        {step === "select" ? (
          <div className="space-y-6">
            {loadingTemplates ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            ) : (
              <>
                {/* Free Templates */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Templates Gratuitos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {templates.filter(t => !t.isPremium).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={cn(
                          "group relative rounded-xl border-2 p-4 text-left transition-all hover:border-amber-500 hover:shadow-lg",
                          "bg-gradient-to-br from-muted/50 to-muted"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3",
                          `bg-gradient-to-br ${categoryColors[template.category] || categoryColors.other}`
                        )}>
                          {categoryIcons[template.category] || categoryIcons.other}
                        </div>
                        <h4 className="font-semibold group-hover:text-amber-500 transition-colors">
                          {template.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        <span className="absolute top-3 right-3 text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                          Gratis
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blank Page Option */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Ou comece do zero
                  </h3>
                  <button
                    onClick={() => handleTemplateSelect(null)}
                    className={cn(
                      "w-full rounded-xl border-2 border-dashed p-6 text-center transition-all",
                      "hover:border-amber-500 hover:bg-amber-500/5"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold">Projeto em Branco</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comece com um projeto vazio e adicione seus proprios blocos
                    </p>
                  </button>
                </div>

                {/* Premium Templates (Coming Soon) */}
                {templates.filter(t => t.isPremium).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Templates Premium
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-60">
                      {templates.filter(t => t.isPremium).map((template) => (
                        <div
                          key={template.id}
                          className="relative rounded-xl border-2 p-4 bg-muted/50 cursor-not-allowed"
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3",
                            `bg-gradient-to-br ${categoryColors[template.category] || categoryColors.other}`
                          )}>
                            {categoryIcons[template.category] || categoryIcons.other}
                          </div>
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {template.description}
                          </p>
                          <span className="absolute top-3 right-3 text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">
                            Em breve
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              {selectedTemplate ? (
                <>
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                    `bg-gradient-to-br ${categoryColors[selectedTemplate.category] || categoryColors.other}`
                  )}>
                    {categoryIcons[selectedTemplate.category] || categoryIcons.other}
                  </div>
                  <div>
                    <p className="font-medium">{selectedTemplate.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Projeto em Branco</p>
                    <p className="text-sm text-muted-foreground">Comece do zero</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo do Projeto</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ex: Meu App"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL do Projeto</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="meu-app"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!title || !slug || loading}
                className="bg-amber-500 hover:bg-amber-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Projeto"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
