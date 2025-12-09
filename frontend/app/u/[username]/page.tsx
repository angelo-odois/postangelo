import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { ProfileImage } from "@/components/ProfileImage";
import {
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  ArrowDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Palette,
  Code,
  Layers,
  Instagram,
  Youtube,
  Dribbble,
  FileText,
  Rocket,
  Award,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ username: string }>;
}

interface PortfolioData {
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

async function getPortfolio(username: string): Promise<PortfolioData | null> {
  try {
    const data = await api.getPortfolio(username);
    return data as PortfolioData;
  } catch {
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = formatDate(startDate);
  if (isCurrent) return `${start} - Atual`;
  if (endDate) return `${start} - ${formatDate(endDate)}`;
  return start;
}

function formatPeriod(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate).getFullYear();
  if (isCurrent) return `${start} - Presente`;
  if (endDate) return `${start} - ${new Date(endDate).getFullYear()}`;
  return `${start}`;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    technical: "Tecnicas",
    soft: "Soft Skills",
    language: "Idiomas",
    tool: "Ferramentas",
    other: "Outras",
  };
  return labels[category] || category;
}

function getCategoryIcon(category: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    technical: Code,
    soft: CheckCircle2,
    language: Globe,
    tool: Layers,
    other: Star,
  };
  return icons[category] || Star;
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    notFound();
  }

  const { user, profile, experiences, educations, skills, projects, pages = [] } = portfolio;
  const name = profile?.fullName || user.name;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  // Get top 3 categories for "About" section cards
  const topCategories = Object.entries(skillsByCategory)
    .slice(0, 3)
    .map(([category, categorySkills]) => ({
      category,
      skills: categorySkills,
      icon: getCategoryIcon(category),
      label: getCategoryLabel(category),
    }));

  const featuredProjects = projects.filter((p) => p.isFeatured);
  const otherProjects = projects.filter((p) => !p.isFeatured);

  // Calculate stats
  const yearsOfExperience = experiences.length > 0
    ? Math.max(...experiences.map(e => {
        const start = new Date(e.startDate).getFullYear();
        const end = e.isCurrent ? new Date().getFullYear() : e.endDate ? new Date(e.endDate).getFullYear() : start;
        return end - start;
      })) + 1
    : 0;

  // Get unique companies
  const uniqueCompanies = [...new Set(experiences.map(e => e.company))];

  // Social links
  const socialLinks = [
    { url: profile?.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { url: profile?.githubUrl, icon: Github, label: "GitHub" },
    { url: profile?.twitterUrl, icon: Twitter, label: "Twitter" },
    { url: profile?.websiteUrl, icon: Globe, label: "Website" },
    { url: profile?.dribbbleUrl, icon: Dribbble, label: "Dribbble" },
    { url: profile?.behanceUrl, icon: Palette, label: "Behance" },
    { url: profile?.instagramUrl, icon: Instagram, label: "Instagram" },
    { url: profile?.youtubeUrl, icon: Youtube, label: "YouTube" },
  ].filter(link => link.url);

  // Get featured skills (first 5)
  const featuredSkills = skills.slice(0, 5);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {profile?.coverImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${profile.coverImageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-amber-500/20 opacity-20 blur-[100px]" />
        <div className="absolute right-1/4 top-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-orange-500/10 opacity-30 blur-[100px]" />
        <div className="absolute left-1/4 bottom-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-yellow-500/10 opacity-30 blur-[100px]" />
      </div>

      {/* Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/revuuLogo.png"
              alt="Revuu"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {skills.length > 0 && (
              <a href="#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </a>
            )}
            {experiences.length > 0 && (
              <a href="#resultados" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Resultados
              </a>
            )}
            {experiences.length > 0 && (
              <a href="#experiencia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Experiencia
              </a>
            )}
            {(projects.length > 0 || pages.length > 0) && (
              <a href="#projetos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projetos
              </a>
            )}
          </div>
          {profile?.contactEmail ? (
            <a
              href={`mailto:${profile.contactEmail}`}
              className="text-sm px-4 py-2 bg-amber-500 text-white rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            >
              Contato
            </a>
          ) : profile?.linkedinUrl ? (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 bg-amber-500 text-white rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            >
              Contato
            </a>
          ) : null}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-6 relative">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">Ola, eu sou</p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  {name}
                </h1>
                {profile?.title && (
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    {profile.title}
                  </h2>
                )}
              </div>

              {profile?.bio && (
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {profile.bio}
                </p>
              )}

              {/* Stats */}
              {(yearsOfExperience > 0 || projects.length > 0 || experiences.length > 0) && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 py-4">
                  {yearsOfExperience > 0 && (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-500">{yearsOfExperience}+</div>
                        <div className="text-xs text-muted-foreground">Anos de Experiencia</div>
                      </div>
                      <div className="w-px h-10 bg-border" />
                    </>
                  )}
                  {projects.length > 0 && (
                    <>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-500">{projects.length + pages.length}</div>
                        <div className="text-xs text-muted-foreground">Projetos Entregues</div>
                      </div>
                      <div className="w-px h-10 bg-border" />
                    </>
                  )}
                  {uniqueCompanies.length > 0 && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-500">{uniqueCompanies.length}</div>
                      <div className="text-xs text-muted-foreground">Empresas Atendidas</div>
                    </div>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                {(profile?.contactEmail || profile?.phone) && (
                  <a
                    href={profile?.phone ? `https://wa.me/${profile.phone.replace(/\D/g, '')}` : `mailto:${profile?.contactEmail}`}
                    target={profile?.phone ? "_blank" : undefined}
                    rel={profile?.phone ? "noopener noreferrer" : undefined}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
                  >
                    <span className="relative z-10">Iniciar Conversa</span>
                    <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    Ver LinkedIn
                  </a>
                )}
              </div>

              {/* Featured Skills */}
              {featuredSkills.length > 0 && (
                <div className="pt-8 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Especialidades</p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    {featuredSkills.map((skill) => (
                      <span key={skill.id} className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Section */}
            <div className="relative flex flex-col items-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-orange-500/20 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full border border-yellow-500/20 animate-[spin_25s_linear_infinite]" />

                {/* Profile Image */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 p-1">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <ProfileImage
                      src={profile?.avatarUrl}
                      alt={name}
                      initials={initials}
                      size="lg"
                    />
                  </div>
                </div>

                {/* Floating badges */}
                {profile?.isAvailableForWork && (
                  <div className="absolute -top-2 right-8 px-3 py-1.5 bg-green-500/90 backdrop-blur text-white rounded-full shadow-lg animate-bounce flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {profile.availabilityStatus || "Disponivel"}
                    </span>
                  </div>
                )}
                {profile?.location && (
                  <div className="absolute top-1/4 -right-4 px-3 py-1.5 bg-card/90 backdrop-blur border border-border/50 rounded-full shadow-lg animate-bounce [animation-delay:0.5s] flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-amber-500" />
                    <span className="text-xs font-medium">{profile.location.split(',')[0]}</span>
                  </div>
                )}
                {featuredSkills[0] && (
                  <div className="absolute bottom-1/4 -left-4 px-3 py-1.5 bg-card/90 backdrop-blur border border-border/50 rounded-full shadow-lg animate-bounce [animation-delay:1s] flex items-center gap-1">
                    <Palette className="h-3 w-3 text-orange-500" />
                    <span className="text-xs font-medium">{featuredSkills[0].name}</span>
                  </div>
                )}
              </div>

              {/* Scroll indicator */}
              <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
                <span className="text-xs">Scroll para descobrir</span>
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {skills.length > 0 && (
        <section id="sobre" className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
                Sobre Mim
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Competencias & <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Habilidades</span>
              </h2>
              {profile?.bio && (
                <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Skills Cards by Category */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {topCategories.map((cat) => {
                const IconComponent = cat.icon;
                const gradients = [
                  "from-amber-500 to-yellow-500",
                  "from-orange-500 to-red-500",
                  "from-yellow-500 to-amber-500",
                ];
                const index = topCategories.indexOf(cat);
                return (
                  <div
                    key={cat.category}
                    className="group p-8 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[index % 3]} p-3.5 mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{cat.label}</h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.slice(0, 5).map((skill) => (
                        <span key={skill.id} className="px-2 py-1 bg-muted rounded text-sm">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* All Skills Grid */}
            {Object.keys(skillsByCategory).length > 3 && (
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Todas as Competencias</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                      <div key={category} className="p-4 bg-card/50 border border-border/50 rounded-xl">
                        <h4 className="font-semibold text-amber-500 mb-2">{getCategoryLabel(category)}</h4>
                        <div className="flex flex-wrap gap-2">
                          {categorySkills.map((skill) => (
                            <span key={skill.id} className="px-2 py-1 bg-muted rounded text-xs">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {educations.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Formacao Academica</h3>
                    <ul className="space-y-4">
                      {educations.map((edu) => (
                        <li key={edu.id} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium">{edu.degree}</span>
                            {edu.field && <span className="text-muted-foreground"> - {edu.field}</span>}
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Results/Companies Section */}
      {experiences.length > 0 && (
        <section id="resultados" className="py-32 px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
                Resultados Reais
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Empresas onde <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">atuei</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {experiences.slice(0, 4).map((exp) => (
                <div
                  key={exp.id}
                  className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 transition-all text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center overflow-hidden">
                    {exp.companyLogoUrl ? (
                      <img src={exp.companyLogoUrl} alt={exp.company} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="h-8 w-8 text-amber-500" />
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{exp.company}</h3>
                  <p className="text-amber-500 text-sm font-medium">{exp.position}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}</p>
                </div>
              ))}
            </div>

            {/* Key Metrics */}
            {(projects.length > 0 || featuredProjects.length > 0) && (
              <div className="p-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl border border-amber-500/20">
                <h3 className="text-xl font-bold text-center mb-8">Principais Entregas</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                  {featuredProjects.slice(0, 3).map((project) => (
                    <div key={project.id}>
                      <div className="text-2xl font-bold text-amber-500">{project.title}</div>
                      <div className="text-sm text-muted-foreground">{project.description?.slice(0, 50) || "Projeto em destaque"}</div>
                    </div>
                  ))}
                  <div>
                    <div className="text-2xl font-bold text-amber-500">+{projects.length + pages.length}</div>
                    <div className="text-sm text-muted-foreground">Projetos entregues</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section id="experiencia" className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="max-w-4xl mx-auto relative">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
                Experiencia
              </span>
              <h2 className="text-4xl md:text-5xl font-bold">
                Minha <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">trajetoria</span>
              </h2>
            </div>

            <div className="space-y-8">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="group p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                      {exp.companyLogoUrl ? (
                        <img
                          src={exp.companyLogoUrl}
                          alt={exp.company}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-amber-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-amber-500 transition-colors">
                          {exp.position}
                        </h3>
                        <p className="text-amber-500/80 font-medium">
                          {exp.companyUrl ? (
                            <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {exp.company}
                            </a>
                          ) : (
                            exp.company
                          )}
                          {exp.location && ` - ${exp.location}`}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium">
                      {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-muted-foreground mb-4">{exp.description}</p>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Education */}
            {educations.length > 0 && (
              <div className="mt-12 p-6 bg-card/50 border border-border/50 rounded-2xl">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Formacao
                </h3>
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id}>
                      <p className="font-medium">{edu.degree}{edu.field && ` - ${edu.field}`}</p>
                      <p className="text-muted-foreground">{edu.institution} | {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {(projects.length > 0 || pages.length > 0) && (
        <section id="projetos" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
                Projetos
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Trabalhos <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">recentes</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore projetos e paginas criadas
              </p>
            </div>

            {/* Pages */}
            {pages.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {pages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    className="group relative bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20">
                      {page.coverImageUrl ? (
                        <img
                          src={page.coverImageUrl}
                          alt={page.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                            <Rocket className="h-8 w-8 text-amber-500/70" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <ExternalLink className="h-5 w-5 text-white/70 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-amber-500 transition-colors line-clamp-1">
                        {page.title}
                      </h3>
                      {page.seoDescription && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {page.seoDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-muted/50 rounded">/{page.slug}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Em Destaque
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group relative bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20">
                        {project.thumbnailUrl ? (
                          <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                              <Star className="h-8 w-8 text-amber-500/70" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-full hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {project.repositoryUrl && (
                            <a
                              href={project.repositoryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-full hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-lg mb-2 group-hover:text-amber-500 transition-colors">
                          {project.title}
                        </h4>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 4).map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Projects */}
            {otherProjects.length > 0 && (
              <div>
                {featuredProjects.length > 0 && (
                  <h3 className="text-xl font-semibold mb-6">Outros Projetos</h3>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group p-5 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="font-bold group-hover:text-amber-500 transition-colors">
                          {project.title}
                        </h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted rounded">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {project.repositoryUrl && (
                            <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted rounded">
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {project.description}
                        </p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-muted rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {(profile?.contactEmail || profile?.phone || socialLinks.length > 0) && (
        <section id="contato" className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Vamos criar algo <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">incrivel</span> juntos?
            </h2>
            <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
              Estou aberto a discutir novos projetos, oportunidades de trabalho ou colaboracoes.
            </p>
            {profile?.location && (
              <p className="text-sm text-muted-foreground mb-10 flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                {profile.location}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {profile?.phone && (
                <a
                  href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-medium hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all"
                >
                  <Phone className="h-5 w-5" />
                  Falar no WhatsApp
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
              {profile?.contactEmail && (
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card/50 border border-border/50 rounded-full font-medium hover:bg-muted hover:border-amber-500/50 transition-all"
                >
                  <Mail className="h-5 w-5" />
                  {profile.contactEmail}
                </a>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card/50 border border-border/50 rounded-full font-medium hover:bg-muted hover:border-amber-500/50 transition-all"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Revuu CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Powered by Revuu
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quer um portfolio como este?
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crie seu portfolio profissional em minutos com o <span className="text-amber-500 font-semibold">Revuu</span>.
            Sem codigo, totalmente personalizavel e pronto para impressionar recrutadores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all"
            >
              Criar meu Revuu gratis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Ja usado por <span className="text-foreground font-medium">+500 profissionais</span> para destacar suas carreiras
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center">
            <Image
              src="/revuuLogo.png"
              alt="Revuu"
              width={100}
              height={32}
              className="h-6 w-auto mb-3 opacity-70"
            />
            <p className="text-sm text-muted-foreground text-center max-w-md">
              A plataforma para profissionais criarem portfolios que convertem.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
