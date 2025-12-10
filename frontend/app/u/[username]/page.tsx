import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/ViewTracker";
import {
  getTemplateComponent,
  type PortfolioData,
} from "@/components/portfolio-templates";
import { getServerApiUrl } from "@/lib/server-api";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    preview?: string;
    template?: string;
    color?: string;
    font?: string;
  }>;
}

async function getPortfolio(username: string): Promise<PortfolioData | null> {
  try {
    const API_URL = getServerApiUrl();
    const response = await fetch(`${API_URL}/api/portfolio/${username}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch portfolio:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    return {
      title: "Portfolio nao encontrado",
    };
  }

  const name = portfolio.profile?.fullName || portfolio.user.name;
  const title = portfolio.profile?.title || "";

  return {
    title: `${name} - ${title || "Portfolio"}`,
    description: portfolio.profile?.bio?.slice(0, 160) || `Portfolio de ${name}`,
    openGraph: {
      title: `${name} - ${title || "Portfolio"}`,
      description: portfolio.profile?.bio?.slice(0, 160) || `Portfolio de ${name}`,
      images: portfolio.profile?.avatarUrl ? [portfolio.profile.avatarUrl] : [],
    },
  };
}

export default async function PortfolioPage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { preview, template: previewTemplate, color: previewColor, font: previewFont } = await searchParams;

  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    notFound();
  }

  // Determine which settings to use (preview mode or saved profile settings)
  const isPreviewMode = preview === "true";
  const templateId = isPreviewMode && previewTemplate
    ? previewTemplate
    : portfolio.profile?.template || "modern";
  const accentColor = isPreviewMode && previewColor
    ? previewColor
    : portfolio.profile?.accentColor || "amber";
  const fontFamily = isPreviewMode && previewFont
    ? previewFont
    : portfolio.profile?.fontFamily || "inter";

  // Get the appropriate template component
  const TemplateComponent = getTemplateComponent(templateId);

  return (
    <>
      {/* Analytics Tracking - only track if not in preview mode */}
      {!isPreviewMode && <ViewTracker username={username} />}

      {/* Render the selected template */}
      <TemplateComponent
        portfolio={portfolio}
        accentColor={accentColor}
        fontFamily={fontFamily}
      />
    </>
  );
}
