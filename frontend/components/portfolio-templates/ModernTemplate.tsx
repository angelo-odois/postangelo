import Link from "next/link";
import { ProfileImage } from "@/components/ProfileImage";
import { RevuuLogo } from "@/components/RevuuLogo";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Linkedin, Twitter, Globe,
  Briefcase, GraduationCap, Star, ArrowDown, ArrowRight, Sparkles,
  CheckCircle2, Palette, Code, Layers, Instagram, Youtube, Dribbble,
  Rocket, Award, Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TemplateProps, getAccentClasses, getFontClass } from "./types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function formatPeriod(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate).getFullYear();
  if (isCurrent) return `${start} - Presente`;
  if (endDate) return `${start} - ${new Date(endDate).getFullYear()}`;
  return `${start}`;
}

function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = formatDate(startDate);
  if (isCurrent) return `${start} - Atual`;
  if (endDate) return `${start} - ${formatDate(endDate)}`;
  return start;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    technical: "Tecnicas", soft: "Soft Skills", language: "Idiomas",
    tool: "Ferramentas", other: "Outras",
  };
  return labels[category] || category;
}

function getCategoryIcon(category: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    technical: Code, soft: CheckCircle2, language: Globe, tool: Layers, other: Star,
  };
  return icons[category] || Star;
}

export function ModernTemplate({ portfolio, accentColor = "amber", fontFamily = "inter" }: TemplateProps) {
  const { user, profile, experiences, educations, skills, projects, pages = [], planFeatures } = portfolio;
  const showBranding = planFeatures?.showBranding !== false; // Default to true if not set
  const colors = getAccentClasses(accentColor);
  const fontClass = getFontClass(fontFamily);

  const name = profile?.fullName || user.name;
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const topCategories = Object.entries(skillsByCategory).slice(0, 3).map(([category, categorySkills]) => ({
    category, skills: categorySkills, icon: getCategoryIcon(category), label: getCategoryLabel(category),
  }));

  const featuredProjects = projects.filter((p) => p.isFeatured);
  const otherProjects = projects.filter((p) => !p.isFeatured);

  const yearsOfExperience = experiences.length > 0
    ? Math.max(...experiences.map(e => {
        const start = new Date(e.startDate).getFullYear();
        const end = e.isCurrent ? new Date().getFullYear() : e.endDate ? new Date(e.endDate).getFullYear() : start;
        return end - start;
      })) + 1
    : 0;

  const uniqueCompanies = [...new Set(experiences.map(e => e.company))];

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

  const featuredSkills = skills.slice(0, 5);

  return (
    <main className={`min-h-screen bg-background overflow-x-hidden ${fontClass}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {profile?.coverImageUrl && (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: `url(${profile.coverImageUrl})` }} />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className={`absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full ${colors.bg}/20 opacity-20 blur-[100px]`} />
      </div>

      {/* Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><RevuuLogo className="h-8 w-auto" accentColor={accentColor} /></Link>
          <div className="hidden md:flex items-center gap-8">
            {skills.length > 0 && <a href="#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre</a>}
            {experiences.length > 0 && <a href="#experiencia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Experiencia</a>}
            {(projects.length > 0 || pages.length > 0) && <a href="#projetos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Projetos</a>}
          </div>
          <div className="flex items-center gap-3">
            {planFeatures?.hasExportPdf && (
              <button
                onClick={() => window.print()}
                className={`text-sm px-4 py-2 border ${colors.border} ${colors.text} rounded-full hover:${colors.bg} hover:text-white transition-all duration-300 print:hidden flex items-center gap-2`}
                title="Exportar como PDF"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}
            {profile?.contactEmail && (
              <a href={`mailto:${profile.contactEmail}`} className={`text-sm px-4 py-2 ${colors.bg} text-white rounded-full hover:shadow-lg transition-all duration-300`}>Contato</a>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-6 relative">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">Ola, eu sou</p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{name}</h1>
                {profile?.title && (
                  <h2 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>{profile.title}</h2>
                )}
              </div>

              {profile?.bio && <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">{profile.bio}</p>}

              {(yearsOfExperience > 0 || projects.length > 0 || experiences.length > 0) && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 py-4">
                  {yearsOfExperience > 0 && (
                    <>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${colors.text}`}>{yearsOfExperience}+</div>
                        <div className="text-xs text-muted-foreground">Anos de Experiencia</div>
                      </div>
                      <div className="w-px h-10 bg-border" />
                    </>
                  )}
                  {projects.length > 0 && (
                    <>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${colors.text}`}>{projects.length + pages.length}</div>
                        <div className="text-xs text-muted-foreground">Projetos Entregues</div>
                      </div>
                      <div className="w-px h-10 bg-border" />
                    </>
                  )}
                  {uniqueCompanies.length > 0 && (
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${colors.text}`}>{uniqueCompanies.length}</div>
                      <div className="text-xs text-muted-foreground">Empresas Atendidas</div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                {(profile?.contactEmail || profile?.phone) && (
                  <a href={profile?.phone ? `https://wa.me/${profile.phone.replace(/\D/g, '')}` : `mailto:${profile?.contactEmail}`}
                    target={profile?.phone ? "_blank" : undefined} rel={profile?.phone ? "noopener noreferrer" : undefined}
                    className={`group relative inline-flex items-center gap-2 px-8 py-4 ${colors.bg} text-white rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:scale-105`}>
                    <span className="relative z-10">Iniciar Conversa</span>
                    <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>

              {featuredSkills.length > 0 && (
                <div className="pt-8 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Especialidades</p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    {featuredSkills.map((skill) => (
                      <span key={skill.id} className={`px-3 py-1 ${colors.bg}/10 ${colors.text} rounded-full text-sm font-medium`}>{skill.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Section */}
            <div className="relative flex flex-col items-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className={`absolute inset-0 rounded-full border-2 ${colors.border}/20 animate-[spin_20s_linear_infinite]`} />
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 p-1">
                  <div className={`relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                    <ProfileImage src={profile?.avatarUrl} alt={name} initials={initials} size="lg" />
                  </div>
                </div>
                {profile?.isAvailableForWork && (
                  <div className="absolute -top-2 right-8 px-3 py-1.5 bg-green-500/90 backdrop-blur text-white rounded-full shadow-lg animate-bounce flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs font-medium">{profile.availabilityStatus || "Disponivel"}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="absolute top-1/4 -right-4 px-3 py-1.5 bg-card/90 backdrop-blur border border-border/50 rounded-full shadow-lg animate-bounce [animation-delay:0.5s] flex items-center gap-1">
                    <MapPin className={`h-3 w-3 ${colors.text}`} />
                    <span className="text-xs font-medium">{profile.location.split(',')[0]}</span>
                  </div>
                )}
              </div>
              <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
                <span className="text-xs">Scroll para descobrir</span>
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="sobre" className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-16">
              <span className={`inline-block px-4 py-1.5 ${colors.bg}/10 ${colors.text} rounded-full text-sm font-medium mb-4`}>Sobre Mim</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Competencias & <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>Habilidades</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {topCategories.map((cat, index) => {
                const IconComponent = cat.icon;
                return (
                  <div key={cat.category} className="group p-8 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} p-3.5 mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{cat.label}</h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.slice(0, 5).map((skill) => (
                        <span key={skill.id} className="px-2 py-1 bg-muted rounded text-sm">{skill.name}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section id="experiencia" className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
          <div className="max-w-4xl mx-auto relative">
            <div className="text-center mb-16">
              <span className={`inline-block px-4 py-1.5 ${colors.bg}/10 ${colors.text} rounded-full text-sm font-medium mb-4`}>Experiencia</span>
              <h2 className="text-4xl md:text-5xl font-bold">
                Minha <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>trajetoria</span>
              </h2>
            </div>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className={`group p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:${colors.border}/50 hover:shadow-lg transition-all duration-300`}>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                      {exp.companyLogoUrl ? (
                        <img src={exp.companyLogoUrl} alt={exp.company} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className={`h-12 w-12 rounded-lg ${colors.bg}/10 flex items-center justify-center`}>
                          <Briefcase className={`h-6 w-6 ${colors.text}`} />
                        </div>
                      )}
                      <div>
                        <h3 className={`text-xl font-bold group-hover:${colors.text} transition-colors`}>{exp.position}</h3>
                        <p className={`${colors.text}/80 font-medium`}>{exp.company}{exp.location && ` - ${exp.location}`}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 ${colors.bg}/10 ${colors.text} rounded-full text-sm font-medium`}>
                      {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                    </span>
                  </div>
                  {exp.description && <p className="text-muted-foreground mb-4">{exp.description}</p>}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-muted rounded-full text-xs font-medium">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {educations.length > 0 && (
              <div className="mt-12 p-6 bg-card/50 border border-border/50 rounded-2xl">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className={`h-5 w-5 ${colors.text}`} />
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
              <span className={`inline-block px-4 py-1.5 ${colors.bg}/10 ${colors.text} rounded-full text-sm font-medium mb-4`}>Projetos</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Trabalhos <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>recentes</span>
              </h2>
            </div>

            {pages.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {pages.map((page) => (
                  <Link key={page.id} href={`/${page.slug}`}
                    className={`group relative bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:${colors.border}/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20">
                      {page.coverImageUrl ? (
                        <img src={page.coverImageUrl} alt={page.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Rocket className={`h-8 w-8 ${colors.text}/70`} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className={`font-bold text-lg mb-2 group-hover:${colors.text} transition-colors line-clamp-1`}>{page.title}</h3>
                      {page.seoDescription && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{page.seoDescription}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {featuredProjects.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {featuredProjects.map((project) => (
                  <div key={project.id} className={`group relative bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:${colors.border}/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      {project.thumbnailUrl ? (
                        <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                          <Star className={`h-8 w-8 ${colors.text}/70`} />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-full hover:bg-white transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {project.repositoryUrl && (
                          <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-full hover:bg-white transition-colors">
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className={`font-bold text-lg mb-2 group-hover:${colors.text} transition-colors`}>{project.title}</h4>
                      {project.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
              Vamos criar algo <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>incrivel</span> juntos?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Estou aberto a discutir novos projetos, oportunidades de trabalho ou colaboracoes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {profile?.phone && (
                <a href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className={`group inline-flex items-center justify-center gap-2 px-8 py-4 ${colors.bg} text-white rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all`}>
                  <Phone className="h-5 w-5" />
                  Falar no WhatsApp
                </a>
              )}
              {profile?.contactEmail && (
                <a href={`mailto:${profile.contactEmail}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card/50 border border-border/50 rounded-full font-medium hover:bg-muted transition-all">
                  <Mail className="h-5 w-5" />
                  {profile.contactEmail}
                </a>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.url!} target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-card/50 border border-border/50 rounded-full font-medium hover:bg-muted hover:${colors.border}/50 transition-all`}>
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Revuu CTA - Only show for free users */}
      {showBranding && (
        <section className={`py-16 px-6 bg-gradient-to-br ${colors.bg}/10 via-transparent to-transparent border-t border-border/50`}>
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg}/10 border ${colors.border}/20 rounded-full ${colors.text} text-sm font-medium mb-6`}>
              <Sparkles className="h-4 w-4" />
              Powered by Revuu
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quer um portfolio como este?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Crie seu portfolio profissional em minutos com o <span className={`${colors.text} font-semibold`}>Revuu</span>.
            </p>
            <Link href="/admin" className={`group inline-flex items-center justify-center gap-2 px-8 py-4 ${colors.bg} text-white rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all`}>
              Criar meu Revuu gratis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      )}

      {/* Footer - Only show branding for free users */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {showBranding ? (
            <>
              <RevuuLogo className="h-6 w-auto mb-3 opacity-70" accentColor={accentColor} />
              <p className="text-sm text-muted-foreground text-center max-w-md">A plataforma para profissionais criarem portfolios que convertem.</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} {profile?.fullName || user.name}
            </p>
          )}
        </div>
      </footer>
    </main>
  );
}
