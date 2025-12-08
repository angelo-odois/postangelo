"use client";

import { cn } from "@/lib/utils";
import { BlockRenderer } from "./BlockRenderer";

interface NestedBlock {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

interface ColumnItem {
  title?: string;
  content?: string;
  icon?: string;
  blocks?: NestedBlock[];
}

interface ColumnsBlockProps {
  columns?: "2" | "3" | "4";
  items?: ColumnItem[];
  gap?: "small" | "medium" | "large";
  style?: "simple" | "cards" | "bordered";
  verticalAlign?: "top" | "center" | "bottom";
}

export function ColumnsBlock({
  columns = "2",
  items = [],
  gap = "medium",
  style = "simple",
  verticalAlign = "top",
}: ColumnsBlockProps) {
  const columnClasses = {
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-2 lg:grid-cols-3",
    "4": "md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClasses = {
    small: "gap-4",
    medium: "gap-6",
    large: "gap-8",
  };

  const verticalAlignClasses = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
  };

  const getItemClasses = () => {
    switch (style) {
      case "cards":
        return "p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-lg transition-all duration-300";
      case "bordered":
        return "p-6 border-l-2 border-amber-500/50";
      default:
        return "";
    }
  };

  if (items.length === 0) {
    return (
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 bg-muted/30 rounded-xl border-2 border-dashed border-border text-center">
            <p className="text-muted-foreground">Adicione itens nas colunas</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className={cn(
          "grid grid-cols-1",
          columnClasses[columns],
          gapClasses[gap],
          verticalAlignClasses[verticalAlign]
        )}>
          {items.map((item, index) => (
            <div key={index} className={getItemClasses()}>
              {/* Title (optional) */}
              {item.title && (
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {item.title}
                </h3>
              )}

              {/* Legacy content support (richtext) */}
              {item.content && (
                <div
                  className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              )}

              {/* Nested blocks */}
              {item.blocks && item.blocks.length > 0 && (
                <div className="space-y-4">
                  {item.blocks.map((block) => (
                    <BlockRenderer key={block.id} block={block} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const columnsSchema = {
  columns: {
    type: "select" as const,
    label: "Numero de Colunas",
    options: ["2", "3", "4"],
    default: "2",
  },
  gap: {
    type: "select" as const,
    label: "Espacamento",
    options: ["small", "medium", "large"],
    default: "medium",
  },
  style: {
    type: "select" as const,
    label: "Estilo",
    options: ["simple", "cards", "bordered"],
    default: "cards",
  },
  verticalAlign: {
    type: "select" as const,
    label: "Alinhamento Vertical",
    options: ["top", "center", "bottom"],
    default: "top",
  },
  items: {
    type: "repeater" as const,
    label: "Itens das Colunas",
    default: [],
    itemSchema: {
      title: { type: "string" as const, label: "Titulo (opcional)" },
      content: { type: "richtext" as const, label: "Conteudo (opcional)" },
      blocks: {
        type: "blocks" as const,
        label: "Blocos Aninhados",
        default: [],
      },
    },
  },
};
