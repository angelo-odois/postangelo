"use client";

import { cn } from "@/lib/utils";

interface ImageBlockProps {
  src?: string;
  alt?: string;
  caption?: string;
  size?: "small" | "medium" | "large" | "full";
  rounded?: "none" | "small" | "medium" | "large";
  shadow?: boolean;
}

export function ImageBlock({
  src = "",
  alt = "Image",
  caption = "",
  size = "large",
  rounded = "medium",
  shadow = true,
}: ImageBlockProps) {
  if (!src) {
    return (
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-muted/50 rounded-xl flex items-center justify-center border-2 border-dashed border-border">
            <p className="text-muted-foreground">Add an image</p>
          </div>
        </div>
      </section>
    );
  }

  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-2xl",
    large: "max-w-4xl",
    full: "max-w-6xl",
  };

  const roundedClasses = {
    none: "rounded-none",
    small: "rounded-lg",
    medium: "rounded-xl",
    large: "rounded-2xl",
  };

  return (
    <section className="py-8 px-6">
      <figure className={cn("mx-auto", sizeClasses[size])}>
        <div
          className={cn(
            "relative overflow-hidden bg-muted/30",
            roundedClasses[rounded],
            shadow && "shadow-xl shadow-black/10"
          )}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover"
          />
        </div>
        {caption && (
          <figcaption className="mt-4 text-center text-sm text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>
    </section>
  );
}

export const imageSchema = {
  src: { type: "image" as const, label: "Image", required: true },
  alt: { type: "string" as const, label: "Alt Text" },
  caption: { type: "string" as const, label: "Caption" },
  size: {
    type: "select" as const,
    label: "Size",
    options: ["small", "medium", "large", "full"],
    default: "large",
  },
  rounded: {
    type: "select" as const,
    label: "Rounded Corners",
    options: ["none", "small", "medium", "large"],
    default: "medium",
  },
  shadow: {
    type: "boolean" as const,
    label: "Show Shadow",
    default: true,
  },
};
