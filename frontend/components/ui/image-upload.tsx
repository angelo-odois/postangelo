"use client";

import * as React from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  onUpload?: (url: string) => void;
  className?: string;
  placeholder?: string;
  aspectRatio?: "square" | "video" | "banner";
  maxSize?: number; // in MB
  accept?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  className,
  placeholder = "Arraste uma imagem ou clique para selecionar",
  aspectRatio = "square",
  maxSize = 10,
  accept = "image/*",
  disabled = false,
}: ImageUploadProps) {
  const { getValidToken } = useAuthStore();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[3/1]",
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione uma imagem");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Maximo: ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error("Nao autenticado");
      }

      const result = await api.uploadFile(file, token);
      const url = result.url;

      onChange(url);
      onUpload?.(url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Falha ao fazer upload. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative overflow-hidden rounded-lg border-2 border-dashed transition-all cursor-pointer",
          aspectRatioClasses[aspectRatio],
          isDragging
            ? "border-amber-500 bg-amber-500/10"
            : value
            ? "border-border bg-muted/50"
            : "border-muted-foreground/25 hover:border-amber-500/50 bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "pointer-events-none"
        )}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleClick}
                >
                  Trocar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                <p className="text-sm text-muted-foreground">Enviando...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  {isDragging ? (
                    <Upload className="h-6 w-6 text-amber-500" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-amber-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  {placeholder}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP - max {maxSize}MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
