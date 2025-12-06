"use client";

export const dynamic = 'force-dynamic';

import Image from "next/image";
import { useEffect } from "react";

export default function CVPage() {
  useEffect(() => {
    const styleId = 'cv-print-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 print:bg-white">

      {/* Action buttons */}
      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Exportar PDF
        </button>
        <a
          href="/"
          className="px-5 py-2.5 bg-white text-zinc-700 rounded-full hover:bg-zinc-50 transition-all font-medium shadow-lg border border-zinc-200"
        >
          Voltar
        </a>
      </div>

      {/* CV Container - A4 aspect ratio */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] flex">

        {/* Sidebar */}
        <aside className="w-[72mm] bg-zinc-900 text-white p-6 print:p-5 flex flex-col">
          {/* Photo */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg ring-2 ring-amber-400/50">
              <Image
                src="/images/angelo.jpg"
                alt="Angelo Pimentel"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold tracking-tight">Angelo Pimentel</h1>
            <p className="text-amber-400 font-medium text-xs mt-1">Product Designer / Product Owner</p>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">Contato</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-zinc-300 text-xs">Brasília, DF</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-zinc-300 text-xs break-all">ahspimentel@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-zinc-300 text-xs">(61) 99991-1676</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className="text-zinc-300 text-xs">/in/ahspimentel</span>
              </div>
            </div>
          </div>

          {/* Design Skills */}
          <div className="mb-6">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">Design</h2>
            <div className="space-y-2.5">
              {[
                { name: "UI Design", level: 95 },
                { name: "UX Research", level: 90 },
                { name: "Design Systems", level: 88 },
                { name: "Prototipação", level: 92 },
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300">{skill.name}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Skills */}
          <div className="mb-6">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">Product</h2>
            <div className="space-y-2.5">
              {[
                { name: "Product Discovery", level: 90 },
                { name: "Product Strategy", level: 85 },
                { name: "Roadmap", level: 88 },
                { name: "Métricas & OKRs", level: 82 },
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300">{skill.name}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="mb-6">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">Ferramentas</h2>
            <div className="flex flex-wrap gap-1.5">
              {["Figma", "Miro", "Jira", "Power Apps", "Power Automate", "Hotjar", "Maze"].map((tool) => (
                <span key={tool} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] rounded-md">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mt-auto">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">Formação</h2>
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="font-semibold text-sm">Design Gráfico</p>
              <p className="text-amber-400 text-xs">Unyleya</p>
              <p className="text-zinc-500 text-[10px] mt-1">2014 - 2018</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 print:p-5">
          {/* Header */}
          <header className="mb-5">
            <h2 className="text-lg font-bold text-zinc-900 mb-2">Sobre mim</h2>
            <p className="text-zinc-600 text-xs leading-relaxed">
              Designer de Produto com <span className="font-semibold text-zinc-900">+8 anos</span> de experiência unindo <span className="font-semibold text-zinc-900">visão estratégica</span> e <span className="font-semibold text-zinc-900">execução centrada no usuário</span>. Atuo do Discovery ao Delivery, traduzindo necessidades complexas em soluções intuitivas. Já impactei <span className="font-semibold text-zinc-900">milhões de usuários</span> em apps bancários, sistemas para restaurantes e plataformas de pagamento sempre guiado por dados, métricas e empatia.
            </p>
          </header>

          {/* Experience */}
          <section className="mb-6">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-4">Experiência</h2>

            <div className="space-y-5">
              {[
                {
                  role: "Product Designer",
                  company: "BCodex - Grupo Entre",
                  period: "2025",
                  current: false,
                  description: "Liderança de UX em fintechs. Design de jornadas de pagamento, gestão de squad de designers e definição de estratégias de produto.",
                  tags: ["PixPay", "APKDex", "Gateway Pay1"]
                },
                {
                  role: "Product Owner",
                  company: "Coco Bambu Restaurantes",
                  period: "2024 - 2025",
                  description: "Gestão end-to-end de produtos digitais. Product Discovery, priorização de backlog, definição de OKRs e roadmap estratégico.",
                  tags: ["Maestro", "eCheck", "Product Discovery"]
                },
                {
                  role: "Sênior UX Designer",
                  company: "Banco do Brasil",
                  period: "2022 - 2024",
                  description: "UX Research e Design para apps com milhões de usuários. Testes de usabilidade, análise de métricas e iteração baseada em dados.",
                  tags: ["App OuroCard", "App BB", "UX Research"]
                },
                {
                  role: "UI/UX Designer",
                  company: "Coco Bambu Restaurantes",
                  period: "2019 - 2023",
                  description: "Criação de Design System, prototipação de alta fidelidade e condução de Discovery com stakeholders e usuários.",
                  tags: ["App Coco Bambu", "Design System"]
                },
                {
                  role: "UX Designer",
                  company: "M2sys Digital",
                  period: "2017 - 2019",
                  description: "Pesquisa de usuário, arquitetura de informação e prototipação interativa.",
                  tags: []
                }
              ].map((job, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-zinc-200">
                  {job.current && (
                    <div className="absolute -left-[5px] top-0 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                  {!job.current && (
                    <div className="absolute -left-[5px] top-0 w-2 h-2 bg-zinc-300 rounded-full" />
                  )}
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <h3 className="font-semibold text-zinc-900 text-sm">{job.role}</h3>
                      <p className="text-amber-600 text-xs font-medium">{job.company}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                      job.current
                        ? 'bg-amber-100 text-amber-700 font-medium'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {job.period}
                    </span>
                  </div>
                  <p className="text-zinc-600 text-xs mt-1 leading-relaxed">{job.description}</p>
                  {job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] rounded-md font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Projects Highlight */}
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">Projetos em Destaque</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Nexus CRM", desc: "CRM SaaS omnichannel + IA", color: "from-violet-600 to-indigo-600", slug: "projetos/nexus-crm" },
                { name: "Bio", desc: "Plataforma SaaS de biolinks", color: "from-pink-500 to-rose-500", slug: "projetos/bio" },
                { name: "Checkout Smart", desc: "Débitos veiculares 12x", color: "from-sky-500 to-blue-600", slug: "projetos/checkout-smart" },
                { name: "App OuroCard", desc: "App de cartões BB", color: "from-amber-500 to-orange-500", slug: "projetos/app-ourocard" },
                { name: "Maestro", desc: "Integração delivery", color: "from-emerald-500 to-teal-500", slug: "projetos/maestro" },
                { name: "eCheck", desc: "POS restaurantes", color: "from-violet-500 to-purple-500", slug: "projetos/echeck" },
                { name: "PixPay", desc: "Pagamentos Pix", color: "from-cyan-500 to-blue-500", slug: "projetos/pixpay" },
                { name: "App Coco Bambu", desc: "Delivery e pedidos online", color: "from-lime-500 to-green-500", slug: "projetos/app-coco-bambu" },
              ].map((project) => (
                <a
                  key={project.name}
                  href={`/${project.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-zinc-50 p-3 hover:bg-zinc-100 transition-colors no-print"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${project.color}`} />
                  <h3 className="font-semibold text-zinc-900 text-sm">{project.name}</h3>
                  <p className="text-zinc-500 text-xs">{project.desc}</p>
                </a>
              ))}
              {/* Print version without links */}
              {[
                { name: "Nexus CRM", desc: "CRM SaaS omnichannel + IA", color: "from-violet-600 to-indigo-600" },
                { name: "Bio", desc: "Plataforma SaaS de biolinks", color: "from-pink-500 to-rose-500" },
                { name: "Checkout Smart", desc: "Débitos veiculares 12x", color: "from-sky-500 to-blue-600" },
                { name: "App OuroCard", desc: "App de cartões BB", color: "from-amber-500 to-orange-500" },
                { name: "Maestro", desc: "Integração delivery", color: "from-emerald-500 to-teal-500" },
                { name: "eCheck", desc: "POS restaurantes", color: "from-violet-500 to-purple-500" },
                { name: "PixPay", desc: "Pagamentos Pix", color: "from-cyan-500 to-blue-500" },
                { name: "App Coco Bambu", desc: "Delivery e pedidos online", color: "from-lime-500 to-green-500" },
              ].map((project) => (
                <div key={`print-${project.name}`} className="hidden print:block relative overflow-hidden rounded-xl bg-zinc-50 p-3">
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${project.color}`} />
                  <h3 className="font-semibold text-zinc-900 text-sm">{project.name}</h3>
                  <p className="text-zinc-500 text-xs">{project.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
