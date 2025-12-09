// Shared types for portfolio templates
export interface PortfolioData {
  user: {
    id: string;
    name: string;
    username: string;
    memberSince: string;
  };
  profile: {
    id: string;
    fullName: string;
    title?: string;
    bio?: string;
    location?: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    twitterUrl?: string;
    websiteUrl?: string;
    dribbbleUrl?: string;
    behanceUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    contactEmail?: string;
    phone?: string;
    isAvailableForWork?: boolean;
    availabilityStatus?: string;
    template?: string;
    accentColor?: string;
    fontFamily?: string;
  } | null;
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    location?: string;
    employmentType?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    companyLogoUrl?: string;
    companyUrl?: string;
    technologies?: string[];
    order: number;
  }>;
  educations: Array<{
    id: string;
    institution: string;
    degree: string;
    field?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    institutionLogoUrl?: string;
    institutionUrl?: string;
    grade?: string;
    order: number;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    level: string;
    yearsOfExperience?: number;
    iconUrl?: string;
    order: number;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description?: string;
    longDescription?: string;
    thumbnailUrl?: string;
    images?: string[];
    liveUrl?: string;
    repositoryUrl?: string;
    figmaUrl?: string;
    technologies?: string[];
    tags?: string[];
    status: string;
    startDate?: string;
    endDate?: string;
    isFeatured: boolean;
    order: number;
  }>;
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    seoDescription?: string;
    coverImageUrl?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface TemplateProps {
  portfolio: PortfolioData;
  accentColor?: string;
  fontFamily?: string;
}

export type TemplateName = "modern" | "minimal" | "classic" | "bento" | "terminal" | "gradient";

export interface TemplateInfo {
  id: TemplateName;
  name: string;
  description: string;
  preview: string; // Image URL for preview
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "modern",
    name: "Moderno",
    description: "Design contemporaneo com gradientes e animacoes",
    preview: "/templates/modern.png",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Clean e elegante, foco no conteudo",
    preview: "/templates/minimal.png",
  },
  {
    id: "classic",
    name: "Classico",
    description: "Estilo tradicional de curriculo profissional",
    preview: "/templates/classic.png",
  },
  {
    id: "bento",
    name: "Split",
    description: "Tela dividida com painel lateral fixo",
    preview: "/templates/bento.png",
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Estetica hacker para devs",
    preview: "/templates/terminal.png",
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Gradientes bold com glassmorphism",
    preview: "/templates/gradient.png",
  },
];

export const ACCENT_COLORS = [
  { id: "amber", name: "Amber", primary: "#f59e0b", secondary: "#d97706" },
  { id: "blue", name: "Azul", primary: "#3b82f6", secondary: "#2563eb" },
  { id: "green", name: "Verde", primary: "#22c55e", secondary: "#16a34a" },
  { id: "emerald", name: "Esmeralda", primary: "#10b981", secondary: "#059669" },
  { id: "purple", name: "Roxo", primary: "#a855f7", secondary: "#9333ea" },
  { id: "violet", name: "Violeta", primary: "#8b5cf6", secondary: "#7c3aed" },
  { id: "red", name: "Vermelho", primary: "#ef4444", secondary: "#dc2626" },
  { id: "pink", name: "Rosa", primary: "#ec4899", secondary: "#db2777" },
  { id: "teal", name: "Teal", primary: "#14b8a6", secondary: "#0d9488" },
  { id: "cyan", name: "Ciano", primary: "#06b6d4", secondary: "#0891b2" },
  { id: "orange", name: "Laranja", primary: "#f97316", secondary: "#ea580c" },
  { id: "rose", name: "Rose", primary: "#f43f5e", secondary: "#e11d48" },
];

export const FONTS = [
  { id: "inter", name: "Inter", className: "font-sans", preview: "Aa Bb Cc" },
  { id: "serif", name: "Playfair Display", className: "font-serif", preview: "Aa Bb Cc" },
  { id: "mono", name: "JetBrains Mono", className: "font-mono", preview: "Aa Bb Cc" },
  { id: "georgia", name: "Georgia", className: "font-georgia", preview: "Aa Bb Cc" },
];

// Helper to get color classes based on accent color
export function getAccentClasses(accentColor: string = "amber") {
  const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    amber: {
      bg: "bg-amber-500",
      text: "text-amber-500",
      border: "border-amber-500",
      gradient: "from-amber-500 to-orange-500",
    },
    blue: {
      bg: "bg-blue-500",
      text: "text-blue-500",
      border: "border-blue-500",
      gradient: "from-blue-500 to-cyan-500",
    },
    green: {
      bg: "bg-green-500",
      text: "text-green-500",
      border: "border-green-500",
      gradient: "from-green-500 to-emerald-500",
    },
    emerald: {
      bg: "bg-emerald-500",
      text: "text-emerald-500",
      border: "border-emerald-500",
      gradient: "from-emerald-500 to-teal-500",
    },
    purple: {
      bg: "bg-purple-500",
      text: "text-purple-500",
      border: "border-purple-500",
      gradient: "from-purple-500 to-pink-500",
    },
    violet: {
      bg: "bg-violet-500",
      text: "text-violet-500",
      border: "border-violet-500",
      gradient: "from-violet-500 to-purple-500",
    },
    red: {
      bg: "bg-red-500",
      text: "text-red-500",
      border: "border-red-500",
      gradient: "from-red-500 to-rose-500",
    },
    pink: {
      bg: "bg-pink-500",
      text: "text-pink-500",
      border: "border-pink-500",
      gradient: "from-pink-500 to-rose-500",
    },
    teal: {
      bg: "bg-teal-500",
      text: "text-teal-500",
      border: "border-teal-500",
      gradient: "from-teal-500 to-cyan-500",
    },
    cyan: {
      bg: "bg-cyan-500",
      text: "text-cyan-500",
      border: "border-cyan-500",
      gradient: "from-cyan-500 to-blue-500",
    },
    orange: {
      bg: "bg-orange-500",
      text: "text-orange-500",
      border: "border-orange-500",
      gradient: "from-orange-500 to-red-500",
    },
    rose: {
      bg: "bg-rose-500",
      text: "text-rose-500",
      border: "border-rose-500",
      gradient: "from-rose-500 to-pink-500",
    },
  };
  return colorMap[accentColor] || colorMap.amber;
}

// Helper to get font class based on font family
export function getFontClass(fontFamily: string = "inter") {
  const fontMap: Record<string, string> = {
    inter: "font-sans",
    serif: "font-serif",
    mono: "font-mono",
    georgia: "font-georgia",
  };
  return fontMap[fontFamily] || "font-sans";
}
