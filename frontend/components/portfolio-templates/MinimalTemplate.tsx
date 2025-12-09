import Link from "next/link";
import { ProfileImage } from "@/components/ProfileImage";
import { RevuuLogo } from "@/components/RevuuLogo";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Linkedin, Twitter, Globe,
  Briefcase, GraduationCap, ArrowRight, Instagram, Youtube, Dribbble,
  Palette, ChevronRight,
} from "lucide-react";
import { TemplateProps, getAccentClasses, getFontClass } from "./types";

function formatPeriod(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate).getFullYear();
  if (isCurrent) return `${start} - Presente`;
  if (endDate) return `${start} - ${new Date(endDate).getFullYear()}`;
  return `${start}`;
}

export function MinimalTemplate({ portfolio, accentColor = "amber", fontFamily = "inter" }: TemplateProps) {
  const { user, profile, experiences, educations, skills, projects, pages = [] } = portfolio;
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

  return (
    <main className={`min-h-screen bg-background ${fontClass}`}>
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            <RevuuLogo className="h-5 w-auto opacity-60 hover:opacity-100 transition-opacity" accentColor={accentColor} />
          </Link>
          <nav className="flex items-center gap-6">
            {experiences.length > 0 && <a href="#experiencia" className="text-sm text-muted-foreground hover:text-foreground">Experiencia</a>}
            {skills.length > 0 && <a href="#skills" className="text-sm text-muted-foreground hover:text-foreground">Skills</a>}
            {(projects.length > 0 || pages.length > 0) && <a href="#projetos" className="text-sm text-muted-foreground hover:text-foreground">Projetos</a>}
          </nav>
        </div>
      </header>

      {/* Hero - Simple and Clean */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                <ProfileImage src={profile?.avatarUrl} alt={name} initials={initials} size="lg" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{name}</h1>
              {profile?.title && <p className={`text-xl ${colors.text} font-medium mb-4`}>{profile.title}</p>}
              {profile?.bio && <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">{profile.bio}</p>}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                {profile?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                {profile?.isAvailableForWork && (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {profile.availabilityStatus || "Disponivel para projetos"}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {profile?.contactEmail && (
                  <a href={`mailto:${profile.contactEmail}`}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 ${colors.bg} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}>
                    <Mail className="h-4 w-4" />
                    Contato
                  </a>
                )}
                {socialLinks.slice(0, 3).map((link) => (
                  <a key={link.label} href={link.url!} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      {experiences.length > 0 && (
        <section id="experiencia" className="py-16 px-6 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">Experiencia Profissional</h2>
            <div className="space-y-0">
              {experiences.map((exp, index) => (
                <div key={exp.id} className={`py-6 ${index !== experiences.length - 1 ? "border-b border-dashed" : ""}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="md:w-32 flex-shrink-0">
                      <span className="text-sm text-muted-foreground">{formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        {exp.companyLogoUrl ? (
                          <img src={exp.companyLogoUrl} alt={exp.company} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg ${colors.bg}/10 flex items-center justify-center`}>
                            <Briefcase className={`h-5 w-5 ${colors.text}`} />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-muted-foreground text-sm">{exp.company}{exp.location && ` · ${exp.location}`}</p>
                        </div>
                      </div>
                      {exp.description && <p className="text-muted-foreground text-sm mt-2 ml-13">{exp.description}</p>}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 ml-13">
                          {exp.technologies.map((tech, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section className="py-16 px-6 border-t bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">Formacao Academica</h2>
            <div className="space-y-0">
              {educations.map((edu, index) => (
                <div key={edu.id} className={`py-6 ${index !== educations.length - 1 ? "border-b border-dashed" : ""}`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="md:w-32 flex-shrink-0">
                      <span className="text-sm text-muted-foreground">{formatPeriod(edu.startDate, edu.endDate, edu.isCurrent)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${colors.bg}/10 flex items-center justify-center`}>
                          <GraduationCap className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{edu.degree}{edu.field && ` em ${edu.field}`}</h3>
                          <p className="text-muted-foreground text-sm">{edu.institution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section id="skills" className="py-16 px-6 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">Skills & Competencias</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className={`text-sm font-medium ${colors.text} mb-3 capitalize`}>{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span key={skill.id} className="px-3 py-1.5 bg-muted rounded-lg text-sm">{skill.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {(projects.length > 0 || pages.length > 0) && (
        <section id="projetos" className="py-16 px-6 border-t bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">Projetos</h2>

            <div className="space-y-4">
              {pages.map((page) => (
                <Link key={page.id} href={`/${page.slug}`}
                  className={`group block p-5 bg-background rounded-xl border hover:${colors.border} hover:shadow-sm transition-all`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {page.coverImageUrl && (
                        <img src={page.coverImageUrl} alt={page.title} className="w-16 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <h3 className={`font-semibold group-hover:${colors.text} transition-colors`}>{page.title}</h3>
                        {page.seoDescription && <p className="text-sm text-muted-foreground line-clamp-1">{page.seoDescription}</p>}
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-muted-foreground group-hover:${colors.text} group-hover:translate-x-1 transition-all`} />
                  </div>
                </Link>
              ))}

              {projects.map((project) => (
                <div key={project.id} className="p-5 bg-background rounded-xl border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {project.thumbnailUrl && (
                        <img src={project.thumbnailUrl} alt={project.title} className="w-16 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        {project.description && <p className="text-sm text-muted-foreground mt-1">{project.description}</p>}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.technologies.slice(0, 4).map((tech, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded">{tech}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.repositoryUrl && (
                        <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {(profile?.contactEmail || profile?.phone) && (
        <section className="py-16 px-6 border-t">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-8">Contato</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {profile?.contactEmail && (
                <a href={`mailto:${profile.contactEmail}`}
                  className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <Mail className={`h-5 w-5 ${colors.text}`} />
                  <span>{profile.contactEmail}</span>
                </a>
              )}
              {profile?.phone && (
                <a href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
                  <Phone className={`h-5 w-5 ${colors.text}`} />
                  <span>{profile.phone}</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Criado com <Link href="/admin" className={`${colors.text} hover:underline`}>Revuu</Link>
          </p>
          <RevuuLogo className="h-5 w-auto opacity-50" accentColor={accentColor} />
        </div>
      </footer>
    </main>
  );
}
