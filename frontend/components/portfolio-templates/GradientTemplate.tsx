"use client";

import Link from "next/link";
import { ProfileImage } from "@/components/ProfileImage";
import { RevuuLogo } from "@/components/RevuuLogo";
import {
  MapPin, Mail, Phone, ExternalLink, Github, Linkedin, Twitter, Globe,
  Briefcase, GraduationCap, Instagram, Youtube, Dribbble, Palette,
  ArrowRight, Sparkles, Star, Download,
} from "lucide-react";
import { TemplateProps, getAccentClasses, getFontClass } from "./types";

function formatPeriod(startDate: string, endDate?: string, isCurrent?: boolean): string {
  const start = new Date(startDate).getFullYear();
  if (isCurrent) return `${start} - Presente`;
  if (endDate) return `${start} - ${new Date(endDate).getFullYear()}`;
  return `${start}`;
}

export function GradientTemplate({ portfolio, accentColor = "violet", fontFamily = "inter" }: TemplateProps) {
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
    <main className={`min-h-screen bg-zinc-950 text-white overflow-hidden ${fontClass}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute top-0 -left-40 w-96 h-96 bg-gradient-to-r ${colors.gradient} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob`} />
        <div className={`absolute top-0 -right-40 w-96 h-96 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000`} />
        <div className={`absolute -bottom-40 left-40 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000`} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {showBranding ? (
            <Link href="/">
              <RevuuLogo className="h-7 w-auto" accentColor={accentColor} />
            </Link>
          ) : (
            <span className="text-white font-semibold">{profile?.fullName || user.name}</span>
          )}
          <nav className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            {skills.length > 0 && <a href="#skills" className="text-sm text-zinc-400 hover:text-white transition-colors">Skills</a>}
            {experiences.length > 0 && <a href="#experiencia" className="text-sm text-zinc-400 hover:text-white transition-colors">Experiencia</a>}
            {(projects.length > 0 || pages.length > 0) && <a href="#projetos" className="text-sm text-zinc-400 hover:text-white transition-colors">Projetos</a>}
          </nav>
          <div className="flex items-center gap-3">
            {planFeatures?.hasExportPdf && (
              <button
                onClick={() => window.print()}
                className="text-sm px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all print:hidden flex items-center gap-2"
                title="Exportar como PDF"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}
            {profile?.contactEmail && (
              <a
                href={`mailto:${profile.contactEmail}`}
                className={`text-sm px-5 py-2 bg-gradient-to-r ${colors.gradient} rounded-full font-medium hover:shadow-lg hover:shadow-${accentColor}-500/25 transition-all`}
              >
                Contato
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-4xl">
          {/* Avatar */}
          <div className="relative inline-block mb-8">
            <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-full blur-2xl opacity-50`} />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-r from-white/20 to-white/5">
              <div className="w-full h-full rounded-full overflow-hidden">
                <ProfileImage src={profile?.avatarUrl} alt={name} initials={initials} size="lg" />
              </div>
            </div>
            {profile?.isAvailableForWork && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500/20 backdrop-blur border border-green-500/30 rounded-full">
                <span className="text-green-400 text-xs font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Disponivel
                </span>
              </div>
            )}
          </div>

          {/* Name & Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
            {name}
          </h1>
          {profile?.title && (
            <p className={`text-xl md:text-2xl bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent font-medium mb-6`}>
              {profile.title}
            </p>
          )}

          {/* Bio */}
          {profile?.bio && (
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Info & Social */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {profile?.location && (
              <span className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur rounded-full text-sm text-zinc-400">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </span>
            )}
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 backdrop-blur rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <link.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* CTA */}
          {profile?.contactEmail && (
            <a
              href={`mailto:${profile.contactEmail}`}
              className={`inline-flex items-center gap-2 text-lg px-8 py-4 bg-gradient-to-r ${colors.gradient} rounded-full font-medium hover:scale-105 hover:shadow-xl transition-all`}
            >
              <Mail className="h-5 w-5" />
              Vamos conversar
              <ArrowRight className="h-5 w-5" />
            </a>
          )}
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg}/20 ${colors.text} rounded-full text-sm font-medium mb-4`}>
                <Sparkles className="h-4 w-4" />
                Competencias
              </span>
              <h2 className="text-4xl font-bold">Skills & Tecnologias</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div
                  key={category}
                  className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-colors"
                >
                  <h3 className={`text-sm font-semibold ${colors.text} uppercase tracking-wider mb-4`}>{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-zinc-300"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section id="experiencia" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg}/20 ${colors.text} rounded-full text-sm font-medium mb-4`}>
                <Briefcase className="h-4 w-4" />
                Trajetoria
              </span>
              <h2 className="text-4xl font-bold">Experiencia Profissional</h2>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className="group p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.07]"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{exp.position}</h3>
                        {exp.isCurrent && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Atual</span>
                        )}
                      </div>
                      <p className={`${colors.text} font-medium`}>{exp.company}</p>
                      <p className="text-zinc-500 text-sm mt-1">
                        {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                      {exp.description && (
                        <p className="text-zinc-400 mt-3">{exp.description}</p>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {exp.technologies.map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-zinc-400">{tech}</span>
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
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg}/20 ${colors.text} rounded-full text-sm font-medium mb-4`}>
                <GraduationCap className="h-4 w-4" />
                Formacao
              </span>
              <h2 className="text-4xl font-bold">Educacao</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <GraduationCap className={`h-8 w-8 ${colors.text} mb-4`} />
                  <h3 className="text-lg font-bold">{edu.degree}</h3>
                  {edu.field && <p className="text-zinc-400">{edu.field}</p>}
                  <p className={`${colors.text} text-sm mt-2`}>{edu.institution}</p>
                  <p className="text-zinc-500 text-sm">
                    {formatPeriod(edu.startDate, edu.endDate, edu.isCurrent)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {(projects.length > 0 || pages.length > 0) && (
        <section id="projetos" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg}/20 ${colors.text} rounded-full text-sm font-medium mb-4`}>
                <Star className="h-4 w-4" />
                Portfolio
              </span>
              <h2 className="text-4xl font-bold">Projetos em Destaque</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="group p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
                >
                  {page.coverImageUrl && (
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                      <img src={page.coverImageUrl} alt={page.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{page.title}</h3>
                  {page.seoDescription && (
                    <p className="text-zinc-400 line-clamp-2">{page.seoDescription}</p>
                  )}
                  <span className={`inline-flex items-center gap-1 ${colors.text} text-sm mt-4 group-hover:gap-2 transition-all`}>
                    Ver projeto <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  {project.thumbnailUrl && (
                    <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                      <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-zinc-400 line-clamp-2">{project.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-xl ${colors.bg}/20 ${colors.text} flex items-center justify-center hover:${colors.bg}/30 transition-colors`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-zinc-400">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          {showBranding ? (
            <>
              <RevuuLogo className="h-8 w-auto mb-4 opacity-70" accentColor={accentColor} />
              <p className="text-zinc-500 text-sm">
                Criado com <Link href="/admin" className={`${colors.text} hover:underline`}>Revuu</Link>
              </p>
            </>
          ) : (
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} {profile?.fullName || user.name}
            </p>
          )}
        </div>
      </footer>

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
