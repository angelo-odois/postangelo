"use client";

import Image from "next/image";
import { useState } from "react";

interface ProfileImageProps {
  src?: string;
  alt: string;
  initials: string;
  size?: "sm" | "lg";
  className?: string;
}

export function ProfileImage({ src, alt, initials, size = "lg", className = "" }: ProfileImageProps) {
  const [hasError, setHasError] = useState(false);

  const textSize = size === "lg" ? "text-6xl" : "text-2xl";
  const showImage = src && !hasError;

  return (
    <>
      {showImage && (
        <Image
          src={src}
          alt={alt}
          fill={size === "lg"}
          width={size === "sm" ? 96 : undefined}
          height={size === "sm" ? 96 : undefined}
          className={`object-cover ${size === "sm" ? "absolute inset-0" : ""} ${className}`}
          priority={size === "lg"}
          onError={() => setHasError(true)}
        />
      )}
      <span className={`text-white ${textSize} font-bold select-none ${showImage ? "absolute" : ""}`}>
        {initials}
      </span>
    </>
  );
}
