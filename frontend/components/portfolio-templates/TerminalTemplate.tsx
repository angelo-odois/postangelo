"use client";

import Link from "next/link";
import { ProfileImage } from "@/components/ProfileImage";
import { RevuuLogo } from "@/components/RevuuLogo";
import {
  MapPin, Mail, ExternalLink, Github, Linkedin, Globe, ChevronRight, Download,
} from "lucide-react";
import { TemplateProps, getAccentClasses } from "./types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function TerminalTemplate({ portfolio, accentColor = "emerald" }: TemplateProps) {
  const { user, profile, experiences, educations, skills, projects, pages = [], planFeatures } = portfolio;
  const showBranding = planFeatures?.showBranding !== false;
  const colors = getAccentClasses(accentColor);

  const name = profile?.fullName || user.name;
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const username = user.username || name.toLowerCase().replace(/\s/g, "");

  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <main className="min-h-screen bg-zinc-950 text-green-400 font-mono">
      {/* Terminal Window */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Window Chrome */}
        <div className="rounded-t-lg bg-zinc-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-zinc-500 ml-2">~/{username}/portfolio</span>
          </div>
          {planFeatures?.hasExportPdf && (
            <button
              onClick={() => window.print()}
              className="text-xs px-2 py-1 rounded bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white transition-all print:hidden flex items-center gap-1"
              title="Exportar como PDF"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">export</span>
            </button>
          )}
        </div>

        {/* Terminal Content */}
        <div className="bg-zinc-900 rounded-b-lg p-6 min-h-[80vh] border border-zinc-800 border-t-0">
          {/* ASCII Art Header */}
          <pre className={`text-xs ${colors.text} mb-6 hidden md:block`}>
{`
  ██████╗ ███████╗██╗   ██╗██╗   ██╗██╗   ██╗
  ██╔══██╗██╔════╝██║   ██║██║   ██║██║   ██║
  ██████╔╝█████╗  ██║   ██║██║   ██║██║   ██║
  ██╔══██╗██╔══╝  ╚██╗ ██╔╝██║   ██║██║   ██║
  ██║  ██║███████╗ ╚████╔╝ ╚██████╔╝╚██████╔╝
  ╚═╝  ╚═╝╚══════╝  ╚═══╝   ╚═════╝  ╚═════╝
`}
          </pre>

          {/* Prompt: whoami */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={colors.text}>$</span>
              <span className="text-white">whoami</span>
            </div>
            <div className="pl-4 flex items-start gap-4">
              <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-700">
                <ProfileImage src={profile?.avatarUrl} alt={name} initials={initials} size="sm" />
              </div>
              <div>
                <p className="text-white text-lg font-bold">{name}</p>
                {profile?.title && <p className={colors.text}>{profile.title}</p>}
                {profile?.location && (
                  <p className="text-zinc-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </p>
                )}
                {profile?.isAvailableForWork && (
                  <p className="text-green-400 text-sm mt-1">
                    <span className="animate-pulse">●</span> status: available_for_hire
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Prompt: cat about.txt */}
          {profile?.bio && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={colors.text}>$</span>
                <span className="text-white">cat about.txt</span>
              </div>
              <div className="pl-4">
                <p className="text-zinc-400 leading-relaxed">{profile.bio}</p>
              </div>
            </div>
          )}

          {/* Prompt: ls skills/ */}
          {skills.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={colors.text}>$</span>
                <span className="text-white">ls -la skills/</span>
              </div>
              <div className="pl-4">
                <table className="text-sm">
                  <tbody>
                    {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                      <tr key={category}>
                        <td className="text-zinc-600 pr-4">drwxr-xr-x</td>
                        <td className={`${colors.text} pr-4`}>{category}/</td>
                        <td className="text-zinc-400">
                          {categorySkills.map(s => s.name).join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Prompt: git log --experience */}
          {experiences.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={colors.text}>$</span>
                <span className="text-white">git log --oneline experience/</span>
              </div>
              <div className="pl-4 space-y-3">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="border-l-2 border-zinc-700 pl-3">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold">{String(index + 1).padStart(7, '0')}</span>
                      <span className="text-white">{exp.position}</span>
                    </div>
                    <p className={`text-sm ${colors.text}`}>@ {exp.company}</p>
                    <p className="text-xs text-zinc-600">
                      {formatDate(exp.startDate)} → {exp.isCurrent ? "HEAD" : exp.endDate ? formatDate(exp.endDate) : ""}
                    </p>
                    {exp.description && (
                      <p className="text-zinc-500 text-sm mt-1"># {exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt: ls education/ */}
          {educations.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={colors.text}>$</span>
                <span className="text-white">ls education/</span>
              </div>
              <div className="pl-4">
                {educations.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <span className="text-blue-400">{edu.degree}</span>
                    {edu.field && <span className="text-zinc-500"> in {edu.field}</span>}
                    <span className="text-zinc-600"> @ {edu.institution}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt: find projects/ */}
          {(projects.length > 0 || pages.length > 0) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={colors.text}>$</span>
                <span className="text-white">find projects/ -type f</span>
              </div>
              <div className="pl-4 space-y-2">
                {pages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    className="flex items-center gap-2 hover:text-white transition-colors group"
                  >
                    <ChevronRight className={`h-3 w-3 ${colors.text}`} />
                    <span className="text-cyan-400">./projects/{page.slug}</span>
                    <span className="text-zinc-600 group-hover:text-zinc-400">- {page.title}</span>
                  </Link>
                ))}
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center gap-2">
                    <ChevronRight className={`h-3 w-3 ${colors.text}`} />
                    <span className="text-cyan-400">./projects/{project.title.toLowerCase().replace(/\s/g, "-")}</span>
                    <div className="flex gap-2 ml-2">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {project.repositoryUrl && (
                        <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white">
                          <Github className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt: cat contact.json */}
          {(profile?.contactEmail || profile?.linkedinUrl || profile?.githubUrl) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={colors.text}>$</span>
                <span className="text-white">cat contact.json</span>
              </div>
              <div className="pl-4">
                <pre className="text-sm">
                  <span className="text-zinc-500">{"{"}</span>{"\n"}
                  {profile?.contactEmail && (
                    <>
                    {"  "}<span className="text-purple-400">"email"</span>: <a href={`mailto:${profile.contactEmail}`} className="text-yellow-400 hover:underline">"{profile.contactEmail}"</a>,{"\n"}
                    </>
                  )}
                  {profile?.linkedinUrl && (
                    <>
                    {"  "}<span className="text-purple-400">"linkedin"</span>: <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">"{profile.linkedinUrl}"</a>,{"\n"}
                    </>
                  )}
                  {profile?.githubUrl && (
                    <>
                    {"  "}<span className="text-purple-400">"github"</span>: <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">"{profile.githubUrl}"</a>{"\n"}
                    </>
                  )}
                  <span className="text-zinc-500">{"}"}</span>
                </pre>
              </div>
            </div>
          )}

          {/* Cursor */}
          <div className="flex items-center gap-2">
            <span className={colors.text}>$</span>
            <span className="w-2 h-5 bg-green-400 animate-pulse" />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex items-center justify-between text-xs text-zinc-600">
          {showBranding ? (
            <>
              <p>
                powered_by <Link href="/admin" className={`${colors.text} hover:underline`}>revuu</Link>
              </p>
              <RevuuLogo className="h-4 w-auto opacity-30" accentColor={accentColor} />
            </>
          ) : (
            <p className="w-full text-center">© {new Date().getFullYear()} {profile?.fullName || user.name}</p>
          )}
        </footer>
      </div>
    </main>
  );
}
