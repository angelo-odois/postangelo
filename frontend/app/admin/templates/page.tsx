"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ExternalLink, ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  TEMPLATES,
  ACCENT_COLORS,
  FONTS,
} from "@/components/portfolio-templates";

interface ThemeSettings {
  template: string;
  accentColor: string;
  fontFamily: string;
}

export default function TemplatesAdminPage() {
  const router = useRouter();
  const { user, getValidToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [settings, setSettings] = useState<ThemeSettings>({
    template: "modern",
    accentColor: "amber",
    fontFamily: "inter",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const profileData = await api.getMyProfile(token).catch(() => null) as {
        template?: string;
        accentColor?: string;
        fontFamily?: string;
      } | null;
      if (profileData) {
        setSettings({
          template: profileData.template || "modern",
          accentColor: profileData.accentColor || "amber",
          fontFamily: profileData.fontFamily || "inter",
        });
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    const token = await getValidToken();
    if (!token) return;

    setSaving(true);
    try {
      await api.saveProfile(settings, token);
      toast({ title: "Alteracoes salvas!", variant: "success" });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const selectedColor = ACCENT_COLORS.find(c => c.id === settings.accentColor);
  const previewUrl = user?.username
    ? `/u/${user.username}?preview=true&template=${settings.template}&color=${settings.accentColor}&font=${settings.fontFamily}`
    : null;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      {/* Top Bar */}
      <header className="h-14 border-b bg-background flex items-center justify-between px-4 gap-4">
        {/* Left: Back button */}
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Center: Controls */}
        <div className="flex items-center gap-3">
          {/* Template */}
          <Select
            value={settings.template}
            onValueChange={(value) => setSettings({ ...settings, template: value })}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Color */}
          <Select
            value={settings.accentColor}
            onValueChange={(value) => setSettings({ ...settings, accentColor: value })}
          >
            <SelectTrigger className="w-[130px] h-9">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: selectedColor?.primary }}
                />
                <span>{selectedColor?.name}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {ACCENT_COLORS.map((color) => (
                <SelectItem key={color.id} value={color.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: color.primary }}
                    />
                    <span>{color.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font */}
          <Select
            value={settings.fontFamily}
            onValueChange={(value) => setSettings({ ...settings, fontFamily: value })}
          >
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem key={font.id} value={font.id}>
                  <span className={font.className}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-0.5 bg-muted/50">
            <button
              onClick={() => setViewMode("desktop")}
              className={`p-1.5 rounded ${viewMode === "desktop" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`p-1.5 rounded ${viewMode === "mobile" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {previewUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button size="sm" onClick={saveSettings} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden p-4 flex items-start justify-center">
        {previewUrl ? (
          <div
            className={`h-full bg-background rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
              viewMode === "mobile" ? "w-[375px]" : "w-full max-w-6xl"
            }`}
          >
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            Configure seu username para ver o preview
          </div>
        )}
      </div>
    </div>
  );
}
