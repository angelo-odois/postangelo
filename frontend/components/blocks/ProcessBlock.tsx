"use client";

import { cn } from "@/lib/utils";
import {
  Search, Target, Lightbulb, PenTool, CheckCircle2,
  Rocket, Code, Palette, Users, Settings, Zap,
  BarChart3, Shield, Globe, Database, Layout, Lock
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  search: Search,
  target: Target,
  lightbulb: Lightbulb,
  pentool: PenTool,
  check: CheckCircle2,
  rocket: Rocket,
  code: Code,
  palette: Palette,
  users: Users,
  settings: Settings,
  zap: Zap,
  chart: BarChart3,
  shield: Shield,
  globe: Globe,
  database: Database,
  layout: Layout,
  lock: Lock,
};

interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}

interface ProcessBlockProps {
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
  style?: "horizontal" | "vertical" | "cards";
  showConnectors?: boolean;
  iconStyle?: "circle" | "square" | "minimal";
  iconColor?: "amber" | "primary" | "muted" | "gradient";
}

export function ProcessBlock({
  title = "",
  subtitle = "",
  steps = [],
  style = "horizontal",
  showConnectors = true,
  iconStyle = "circle",
  iconColor = "muted",
}: ProcessBlockProps) {
  const iconColorClasses = {
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    primary: "bg-primary/10 text-primary",
    muted: "bg-muted text-muted-foreground",
    gradient: "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400",
  };

  const iconShapeClasses = {
    circle: "rounded-full",
    square: "rounded-xl",
    minimal: "rounded-lg",
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Search;
    return IconComponent;
  };

  if (steps.length === 0) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="p-8 bg-muted/50 rounded-xl border-2 border-dashed border-border">
            <p className="text-muted-foreground">Adicione etapas ao processo</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Horizontal Layout */}
        {style === "horizontal" && (
          <div className="relative">
            {/* Connector Line */}
            {showConnectors && steps.length > 1 && (
              <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-border"
                   style={{ left: `${100 / steps.length / 2}%`, right: `${100 / steps.length / 2}%` }} />
            )}

            <div className={cn(
              "grid gap-8",
              steps.length === 3 && "md:grid-cols-3",
              steps.length === 4 && "md:grid-cols-4",
              steps.length === 5 && "md:grid-cols-5",
              steps.length === 6 && "md:grid-cols-6",
              steps.length <= 2 && "md:grid-cols-2",
              steps.length > 6 && "md:grid-cols-4"
            )}>
              {steps.map((step, index) => {
                const Icon = getIcon(step.icon);
                return (
                  <div key={index} className="relative flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={cn(
                      "w-20 h-20 flex items-center justify-center mb-4 relative z-10 bg-background",
                      iconShapeClasses[iconStyle],
                      iconColorClasses[iconColor]
                    )}>
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Connector Arrows (Mobile) */}
                    {showConnectors && index < steps.length - 1 && (
                      <div className="md:hidden text-muted-foreground/50 my-2 text-2xl">
                        ↓
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vertical Layout */}
        {style === "vertical" && (
          <div className="max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = getIcon(step.icon);
              return (
                <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
                  {/* Vertical Line */}
                  {showConnectors && index < steps.length - 1 && (
                    <div className="absolute left-10 top-20 bottom-0 w-0.5 bg-border" />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "w-20 h-20 flex-shrink-0 flex items-center justify-center relative z-10",
                    iconShapeClasses[iconStyle],
                    iconColorClasses[iconColor]
                  )}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-4">
                    <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cards Layout */}
        {style === "cards" && (
          <div className={cn(
            "grid gap-6",
            steps.length === 3 && "md:grid-cols-3",
            steps.length === 4 && "md:grid-cols-4",
            steps.length === 5 && "md:grid-cols-5",
            steps.length <= 2 && "md:grid-cols-2",
            steps.length > 5 && "md:grid-cols-3"
          )}>
            {steps.map((step, index) => {
              const Icon = getIcon(step.icon);
              return (
                <div
                  key={index}
                  className="group p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-lg transition-all duration-300"
                >
                  {/* Step Number */}
                  <div className="text-xs font-medium text-muted-foreground mb-4">
                    Etapa {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    "w-14 h-14 flex items-center justify-center mb-4",
                    iconShapeClasses[iconStyle],
                    iconColorClasses[iconColor]
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-amber-500 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export const processSchema = {
  title: { type: "string" as const, label: "Titulo" },
  subtitle: { type: "string" as const, label: "Subtitulo" },
  style: {
    type: "select" as const,
    label: "Estilo",
    options: ["horizontal", "vertical", "cards"],
    default: "horizontal",
  },
  showConnectors: {
    type: "boolean" as const,
    label: "Mostrar Conectores",
    default: true,
  },
  iconStyle: {
    type: "select" as const,
    label: "Estilo do Icone",
    options: ["circle", "square", "minimal"],
    default: "circle",
  },
  iconColor: {
    type: "select" as const,
    label: "Cor do Icone",
    options: ["amber", "primary", "muted", "gradient"],
    default: "muted",
  },
  steps: {
    type: "repeater" as const,
    label: "Etapas",
    default: [],
    itemSchema: {
      title: { type: "string" as const, label: "Titulo" },
      description: { type: "string" as const, label: "Descricao" },
      icon: {
        type: "select" as const,
        label: "Icone",
        options: ["search", "target", "lightbulb", "pentool", "check", "rocket", "code", "palette", "users", "settings", "zap", "chart", "shield", "globe", "database", "layout", "lock"],
        default: "search",
      },
    },
  },
};
