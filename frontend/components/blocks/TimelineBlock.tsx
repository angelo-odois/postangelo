"use client";

import { cn } from "@/lib/utils";
import { Circle, CheckCircle } from "lucide-react";

interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  tag?: string;
  completed?: boolean;
  icon?: string;
}

interface TimelineBlockProps {
  title?: string;
  subtitle?: string;
  items?: TimelineItem[];
  style?: "default" | "alternating" | "compact" | "process";
  lineColor?: "primary" | "muted" | "gradient";
  alignment?: "left" | "center";
}

export function TimelineBlock({
  title = "Nossa Historia",
  subtitle,
  items = [],
  style = "default",
  lineColor = "primary",
  alignment = "left",
}: TimelineBlockProps) {
  const defaultItems: TimelineItem[] = style === "process" ? [
    {
      tag: "Research",
      title: "Desk Research & Benchmarking",
      description: "Analyzed digital banking context, credit solutions, and competitive landscape to identify market opportunities and gaps.",
    },
    {
      tag: "Discovery",
      title: "User Research & Validation",
      description: "Conducted interviews and surveys with low-income users to understand financial needs, pain points, and validate hypotheses.",
    },
    {
      tag: "Analysis",
      title: "Data Triangulation & Insights",
      description: "Cross-referenced research data to identify benefits aligned with user demands and extract key pain points.",
    },
  ] : [
    {
      title: "Fundacao",
      description: "Inicio da nossa jornada com foco em inovacao",
      date: "2020",
      completed: true,
    },
    {
      title: "Expansao",
      description: "Crescimento da equipe e novos servicos",
      date: "2021",
      completed: true,
    },
    {
      title: "Reconhecimento",
      description: "Premiacao como empresa inovadora do ano",
      date: "2022",
      completed: true,
    },
    {
      title: "Futuro",
      description: "Novos projetos e metas ambiciosas",
      date: "2024",
      completed: false,
    },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  const lineColorClasses = {
    primary: "bg-primary",
    muted: "bg-muted-foreground/30",
    gradient: "bg-gradient-to-b from-primary via-primary/50 to-muted",
  };

  // Process style - matches the design reference with cards and tags
  if (style === "process") {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {(title || subtitle) && (
            <div className={cn("mb-12", alignment === "center" && "text-center")}>
              {title && <h2 className="text-3xl font-bold">{title}</h2>}
              {subtitle && <p className="mt-3 text-muted-foreground text-lg">{subtitle}</p>}
            </div>
          )}

          <div className="relative">
            {/* Vertical line */}
            <div className={cn(
              "absolute left-[11px] top-3 bottom-3 w-0.5",
              lineColorClasses[lineColor]
            )} />

            <div className="space-y-6">
              {displayItems.map((item, index) => (
                <div key={index} className="relative flex gap-6">
                  {/* Circle marker */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 border-primary bg-background flex items-center justify-center",
                      index === 0 && "bg-primary"
                    )}>
                      {index === 0 && <div className="w-2 h-2 rounded-full bg-background" />}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
                    {(item.tag || item.date) && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                        {item.tag || item.date}
                      </span>
                    )}
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === "compact") {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {(title || subtitle) && (
            <div className={cn("mb-10", alignment === "center" && "text-center")}>
              {title && <h2 className="text-3xl font-bold">{title}</h2>}
              {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
            </div>
          )}

          <div className="relative">
            <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-full", lineColorClasses[lineColor])} />
            <div className="space-y-4 pl-8">
              {displayItems.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-8 top-1">
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-4">
                    {item.date && (
                      <span className="text-sm font-medium text-primary min-w-[60px]">
                        {item.date}
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (style === "alternating") {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {(title || subtitle) && (
            <div className="text-center mb-12">
              {title && <h2 className="text-3xl font-bold">{title}</h2>}
              {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
            </div>
          )}

          <div className="relative">
            <div className={cn("absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full", lineColorClasses[lineColor])} />
            <div className="space-y-12">
              {displayItems.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex items-center",
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "w-5/12 p-6 bg-card rounded-xl shadow-sm",
                      index % 2 === 0 ? "text-right mr-auto" : "text-left ml-auto"
                    )}
                  >
                    {item.date && (
                      <span className="text-sm font-medium text-primary">{item.date}</span>
                    )}
                    <h3 className="font-semibold text-lg mt-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-muted-foreground mt-2">{item.description}</p>
                    )}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default style
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {(title || subtitle) && (
          <div className={cn("mb-12", alignment === "center" && "text-center")}>
            {title && <h2 className="text-3xl font-bold">{title}</h2>}
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        <div className="relative">
          <div className={cn("absolute left-4 top-0 bottom-0 w-1 rounded-full", lineColorClasses[lineColor])} />
          <div className="space-y-8">
            {displayItems.map((item, index) => (
              <div key={index} className="relative flex gap-6 pl-12">
                <div className="absolute left-2 top-2">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 bg-card p-6 rounded-xl shadow-sm">
                  {item.date && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                      {item.date}
                    </span>
                  )}
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="text-muted-foreground mt-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
