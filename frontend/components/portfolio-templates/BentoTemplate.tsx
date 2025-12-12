"use client";

import Link from "next/link";
import { ProfileImage } from "@/components/ProfileImage";
import { RevuuLogo } from "@/components/RevuuLogo";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Linkedin, Twitter, Globe,
  Briefcase, GraduationCap, Instagram, Youtube, Dribbble, Palette,
  ArrowUpRight, ChevronDown, Download,
} from "lucide-react";
import { TemplateProps, getAccentClasses, getFontClass } from "./types";

function formatPeriod(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate).getFullYear();
  if (isCurrent) return `${start} - Presente`;
  if (endDate) return `${start} - ${new Date(endDate).getFullYear()}`;
  return `${start}`;
}

export function BentoTemplate({ portfolio, accentColor = "amber", fontFamily = "inter" }: TemplateProps) {
  const { user, profile, experiences, educations, skills, projects, pages = [], planFeatures } = portfolio;
  const showBranding = planFeatures?.showBranding !== false;
  const colors = getAccentClasses(accentColor);
  const fontClass = getFontClass(fontFamily);

  const name = profile?.fullName || user.name;
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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

  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <main className={`min-h-screen bg-zinc-950 text-white ${fontClass}`}>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Fixed */}
        <div className="lg:w-[420px] lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:overflow-hidden flex-shrink-0">
          <div className={`h-full bg-gradient-to-br ${colors.gradient} p-8 lg:p-12 flex flex-col`}>
            {/* Logo & Actions */}
            <div className="mb-auto flex items-center justify-between">
              {showBranding ? (
                <Link href="/">
                  <RevuuLogo className="h-6 w-auto text-white/80 hover:text-white transition-colors" />
                </Link>
              ) : (
                <span className="text-white/80 font-semibold">{profile?.fullName || user.name}</span>
              )}
              {planFeatures?.hasExportPdf && (
                <button
                  onClick={() => window.print()}
                  className="text-sm px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all print:hidden flex items-center gap-1.5"
                  title="Exportar como PDF"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              )}
            </div>

            {/* Profile */}
            <div className="py-8 lg:py-0">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-white/20 mb-6">
                <ProfileImage src={profile?.avatarUrl} alt={name} initials={initials} size="lg" />
              </div>

              {/* Name & Title */}
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{name}</h1>
              {profile?.title && (
                <p className="text-white/80 text-lg mb-4">{profile.title}</p>
              )}

              {/* Location & Status */}
              <div className="space-y-2 mb-6">
                {profile?.location && (
                  <p className="flex items-center gap-2 text-white/70 text-sm">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </p>
                )}
                {profile?.isAvailableForWork && (
                  <p className="flex items-center gap-2 text-white text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {profile.availabilityStatus || "Disponivel para projetos"}
                  </p>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex gap-2 mb-6">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      title={link.label}
                    >
                      <link.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}

              {/* Contact */}
              {profile?.contactEmail && (
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 rounded-xl font-medium hover:bg-white/90 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Entrar em contato
                </a>
              )}
            </div>

            {/* Scroll indicator - mobile */}
            <div className="lg:hidden flex justify-center pt-4">
              <ChevronDown className="h-6 w-6 text-white/50 animate-bounce" />
            </div>

            {/* Footer */}
            {showBranding && (
              <div className="mt-auto pt-8 hidden lg:block">
                <p className="text-white/40 text-xs">
                  Feito com Revuu
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Scrollable */}
        <div className="flex-1 lg:ml-[420px]">
          <div className="p-8 lg:p-16 max-w-3xl">
            {/* Bio */}
            {profile?.bio && (
              <section className="mb-16">
                <p className="text-xl lg:text-2xl text-zinc-300 leading-relaxed">
                  {profile.bio}
                </p>
              </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <section className="mb-16">
                <h2 className={`text-sm font-semibold ${colors.text} uppercase tracking-wider mb-8`}>
                  Experiencia
                </h2>
                <div className="space-y-8">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="group">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${colors.bg}/20 flex items-center justify-center flex-shrink-0`}>
                          <Briefcase className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{exp.position}</h3>
                            {exp.isCurrent && (
                              <span className={`px-2 py-0.5 ${colors.bg}/20 ${colors.text} text-xs rounded-full`}>
                                Atual
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-400">{exp.company}</p>
                          <p className="text-zinc-600 text-sm mt-1">
                            {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                            {exp.location && ` · ${exp.location}`}
                          </p>
                          {exp.description && (
                            <p className="text-zinc-500 mt-3">{exp.description}</p>
                          )}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {exp.technologies.map((tech, i) => (
                                <span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <section className="mb-16">
                <h2 className={`text-sm font-semibold ${colors.text} uppercase tracking-wider mb-8`}>
                  Formacao
                </h2>
                <div className="space-y-6">
                  {educations.map((edu) => (
                    <div key={edu.id} className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg}/20 flex items-center justify-center flex-shrink-0`}>
                        <GraduationCap className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        {edu.field && <p className="text-zinc-400">{edu.field}</p>}
                        <p className="text-zinc-500 text-sm">{edu.institution}</p>
                        <p className="text-zinc-600 text-xs mt-1">
                          {formatPeriod(edu.startDate, edu.endDate, edu.isCurrent)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="mb-16">
                <h2 className={`text-sm font-semibold ${colors.text} uppercase tracking-wider mb-8`}>
                  Skills
                </h2>
                <div className="space-y-6">
                  {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <div key={category}>
                      <h3 className="text-zinc-500 text-sm mb-3 capitalize">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <span
                            key={skill.id}
                            className={`px-3 py-1.5 ${colors.bg}/10 ${colors.text} rounded-lg text-sm`}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {(projects.length > 0 || pages.length > 0) && (
              <section className="mb-16">
                <h2 className={`text-sm font-semibold ${colors.text} uppercase tracking-wider mb-8`}>
                  Projetos
                </h2>
                <div className="grid gap-4">
                  {pages.map((page) => (
                    <Link
                      key={page.id}
                      href={`/${page.slug}`}
                      className="group p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold group-hover:text-white transition-colors">
                            {page.title}
                          </h3>
                          {page.seoDescription && (
                            <p className="text-zinc-500 mt-1 line-clamp-2">{page.seoDescription}</p>
                          )}
                        </div>
                        <ArrowUpRight className={`h-5 w-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0`} />
                      </div>
                    </Link>
                  ))}
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          {project.description && (
                            <p className="text-zinc-500 mt-1">{project.description}</p>
                          )}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {project.technologies.slice(0, 4).map((tech, i) => (
                                <span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-9 h-9 rounded-lg ${colors.bg}/20 ${colors.text} flex items-center justify-center hover:${colors.bg}/30 transition-colors`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {project.repositoryUrl && (
                            <a
                              href={project.repositoryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contact Section */}
            {(profile?.contactEmail || profile?.phone) && (
              <section className="mb-16">
                <h2 className={`text-sm font-semibold ${colors.text} uppercase tracking-wider mb-8`}>
                  Contato
                </h2>
                <div className="space-y-3">
                  {profile?.contactEmail && (
                    <a
                      href={`mailto:${profile.contactEmail}`}
                      className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <Mail className={`h-5 w-5 ${colors.text}`} />
                      <span className="text-zinc-300">{profile.contactEmail}</span>
                    </a>
                  )}
                  {profile?.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <Phone className={`h-5 w-5 ${colors.text}`} />
                      <span className="text-zinc-300">{profile.phone}</span>
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="pt-8 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                {showBranding ? (
                  <>
                    <p className="text-zinc-600 text-sm">
                      Criado com <Link href="/admin" className={`${colors.text} hover:underline`}>Revuu</Link>
                    </p>
                    <RevuuLogo className="h-4 w-auto opacity-30" accentColor={accentColor} />
                  </>
                ) : (
                  <p className="text-zinc-600 text-sm w-full text-center">
                    © {new Date().getFullYear()} {profile?.fullName || user.name}
                  </p>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
