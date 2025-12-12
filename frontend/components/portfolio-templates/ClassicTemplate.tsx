"use client";

import Link from "next/link";
import { ProfileImage } from "@/components/ProfileImage";
import { RevuuLogo } from "@/components/RevuuLogo";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Linkedin, Globe,
  Briefcase, GraduationCap, Calendar, Download,
} from "lucide-react";
import { TemplateProps, getAccentClasses, getFontClass } from "./types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = formatDate(startDate);
  if (isCurrent) return `${start} - Presente`;
  if (endDate) return `${start} - ${formatDate(endDate)}`;
  return start;
}

export function ClassicTemplate({ portfolio, accentColor = "amber", fontFamily = "inter" }: TemplateProps) {
  const { user, profile, experiences, educations, skills, projects, pages = [], planFeatures } = portfolio;
  const showBranding = planFeatures?.showBranding !== false;
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

  return (
    <main className={`min-h-screen bg-zinc-100 dark:bg-zinc-950 ${fontClass}`}>
      {/* A4-like Container */}
      <div className="max-w-[850px] mx-auto py-8 px-4 md:px-0">
        {/* Print/Download Header */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          {showBranding ? (
            <Link href="/">
              <RevuuLogo className="h-5 w-auto opacity-60 hover:opacity-100 transition-opacity" accentColor={accentColor} />
            </Link>
          ) : (
            <span className="text-sm font-medium">{profile?.fullName || user.name}</span>
          )}
          {planFeatures?.hasExportPdf && (
            <button onClick={() => window.print()}
              className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}>
              <Download className="h-4 w-4" />
              Baixar PDF
            </button>
          )}
        </div>

        {/* Resume Paper */}
        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          {/* Header - Simpler style like Modern */}
          <header className="p-8 border-b">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar with animated ring */}
              <div className="relative flex-shrink-0">
                <div className={`w-32 h-32 rounded-full p-1 bg-gradient-to-br ${colors.gradient}`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900">
                    <ProfileImage src={profile?.avatarUrl} alt={name} initials={initials} size="lg" />
                  </div>
                </div>
                {profile?.isAvailableForWork && (
                  <div className="absolute -bottom-1 -right-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Disponivel
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
                {profile?.title && <p className={`text-xl ${colors.text} font-medium mb-3`}>{profile.title}</p>}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
                  {profile?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className={`h-4 w-4 ${colors.text}`} />
                      {profile.location}
                    </span>
                  )}
                  {profile?.contactEmail && (
                    <a href={`mailto:${profile.contactEmail}`} className="flex items-center gap-1.5 hover:text-foreground">
                      <Mail className={`h-4 w-4 ${colors.text}`} />
                      {profile.contactEmail}
                    </a>
                  )}
                  {profile?.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 hover:text-foreground">
                      <Phone className={`h-4 w-4 ${colors.text}`} />
                      {profile.phone}
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {profile?.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 ${colors.bg}/10 ${colors.text} rounded-lg hover:${colors.bg}/20 transition-colors`}>
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {profile?.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 ${colors.bg}/10 ${colors.text} rounded-lg hover:${colors.bg}/20 transition-colors`}>
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {profile?.websiteUrl && (
                    <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 ${colors.bg}/10 ${colors.text} rounded-lg hover:${colors.bg}/20 transition-colors`}>
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-8 grid md:grid-cols-[1fr_280px] gap-8">
            {/* Main Column */}
            <div className="space-y-8">
              {/* Summary */}
              {profile?.bio && (
                <section>
                  <h2 className={`text-lg font-bold ${colors.text} border-b-2 ${colors.border} pb-2 mb-4 uppercase tracking-wider`}>
                    Resumo Profissional
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                </section>
              )}

              {/* Experience */}
              {experiences.length > 0 && (
                <section>
                  <h2 className={`text-lg font-bold ${colors.text} border-b-2 ${colors.border} pb-2 mb-4 uppercase tracking-wider flex items-center gap-2`}>
                    <Briefcase className="h-5 w-5" />
                    Experiencia Profissional
                  </h2>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="relative pl-6 border-l-2 border-muted">
                        <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full ${colors.bg}`} />
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-bold text-foreground">{exp.position}</h3>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                          </span>
                        </div>
                        <p className={`${colors.text} font-medium mb-2`}>
                          {exp.company}{exp.location && ` - ${exp.location}`}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mb-2">{exp.description}</p>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.technologies.map((tech, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded">{tech}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {(projects.length > 0 || pages.length > 0) && (
                <section>
                  <h2 className={`text-lg font-bold ${colors.text} border-b-2 ${colors.border} pb-2 mb-4 uppercase tracking-wider`}>
                    Projetos em Destaque
                  </h2>
                  <div className="space-y-4">
                    {pages.slice(0, 3).map((page) => (
                      <Link key={page.id} href={`/${page.slug}`}
                        className={`block p-4 border rounded-lg hover:${colors.border}/50 transition-colors`}>
                        <h3 className="font-bold">{page.title}</h3>
                        {page.seoDescription && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{page.seoDescription}</p>
                        )}
                      </Link>
                    ))}
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold">{project.title}</h3>
                          <div className="flex gap-1.5 flex-shrink-0">
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                className={`${colors.text} hover:opacity-70`}>
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                            {project.repositoryUrl && (
                              <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer"
                                className={`${colors.text} hover:opacity-70`}>
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {project.technologies.slice(0, 5).map((tech, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded">{tech}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Education */}
              {educations.length > 0 && (
                <section>
                  <h2 className={`text-lg font-bold ${colors.text} border-b-2 ${colors.border} pb-2 mb-4 uppercase tracking-wider flex items-center gap-2`}>
                    <GraduationCap className="h-5 w-5" />
                    Formacao
                  </h2>
                  <div className="space-y-4">
                    {educations.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-sm">{edu.degree}</h3>
                        {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
                        <p className={`text-sm ${colors.text}`}>{edu.institution}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <section>
                  <h2 className={`text-lg font-bold ${colors.text} border-b-2 ${colors.border} pb-2 mb-4 uppercase tracking-wider`}>
                    Habilidades
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 capitalize">{category}</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {categorySkills.map((skill) => (
                            <span key={skill.id} className={`text-xs px-2 py-1 ${colors.bg}/10 ${colors.text} rounded`}>
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="px-8 py-4 border-t bg-muted/30 flex items-center justify-between print:bg-transparent">
            {showBranding ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Criado com <Link href="/admin" className={`${colors.text} hover:underline`}>Revuu</Link>
                </p>
                <RevuuLogo className="h-4 w-auto opacity-40" accentColor={accentColor} />
              </>
            ) : (
              <p className="text-xs text-muted-foreground w-full text-center">
                © {new Date().getFullYear()} {profile?.fullName || user.name}
              </p>
            )}
          </footer>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  );
}
