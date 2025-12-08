import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ProfileImage } from "@/components/ProfileImage";
import {
  Linkedin, Mail, ExternalLink, MapPin,
  ArrowDown, Sparkles, Palette, Briefcase, Rocket,
  CheckCircle2, ArrowRight, Award,
  Heart, Layers, BarChart3, Phone
} from "lucide-react";

interface PageItem {
  id: string;
  title: string;
  slug: string;
  seoDescription?: string;
  ogImageUrl?: string;
  coverImageUrl?: string;
}

async function getPages(): Promise<PageItem[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/pages`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Angelo Pimentel - Product Designer | UX/UI | Power Platform",
  description: "Portfolio de Angelo Pimentel, Product Designer com 7+ anos de experiência em UX/UI, Product Owner e Power Platform. Especialista em criar soluções digitais que geram resultados.",
};

export default async function HomePage() {
  const pages = await getPages();

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
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
            <Link href="#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </Link>
            <Link href="#resultados" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Resultados
            </Link>
            <Link href="#experiencia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Experiência
            </Link>
            <Link href="#projetos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Projetos
            </Link>
          </div>
          <a
            href="https://wa.me/5561999911676?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio!"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-amber-500 text-white rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
          >
            Contato
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-6 relative">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">Olá, eu sou</p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  Angelo Pimentel
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Product Designer
                </h2>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Uno <span className="text-foreground font-medium">UX, Produto e Tecnologia</span> para criar
                <span className="text-foreground font-medium"> soluções digitais</span> que transformam a
                experiência do usuário e geram resultados reais para o negócio.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 py-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">7+</div>
                  <div className="text-xs text-muted-foreground">Anos de Experiência</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">50+</div>
                  <div className="text-xs text-muted-foreground">Projetos Entregues</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">5</div>
                  <div className="text-xs text-muted-foreground">Empresas Atendidas</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="https://wa.me/5561999911676?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-medium overflow-hidden transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
                >
                  <span className="relative z-10">Iniciar Conversa</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
                <a
                  href="https://linkedin.com/in/ahspimentel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  Ver LinkedIn
                </a>
              </div>

              {/* Tech stack */}
              <div className="pt-8 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Especialidades</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {["UX/UI Design", "Product Owner", "Power BI", "Figma", "Design System"].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Avatar com foto */}
            <div className="relative flex flex-col items-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-orange-500/20 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full border border-yellow-500/20 animate-[spin_25s_linear_infinite]" />

                {/* Foto principal */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 p-1">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <ProfileImage
                      src="/images/angelo.jpg"
                      alt="Angelo Pimentel - Product Designer"
                      initials="AP"
                      size="lg"
                    />
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-2 right-8 px-3 py-1.5 bg-card/90 backdrop-blur border border-border/50 rounded-full shadow-lg animate-bounce flex items-center gap-1">
                  <Palette className="h-3 w-3 text-amber-500" />
                  <span className="text-xs font-medium">UX Expert</span>
                </div>
                <div className="absolute top-1/4 -right-4 px-3 py-1.5 bg-card/90 backdrop-blur border border-border/50 rounded-full shadow-lg animate-bounce [animation-delay:0.5s] flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-orange-500" />
                  <span className="text-xs font-medium">Power BI</span>
                </div>
                <div className="absolute bottom-1/4 -left-4 px-3 py-1.5 bg-card/90 backdrop-blur border border-border/50 rounded-full shadow-lg animate-bounce [animation-delay:1s] flex items-center gap-1">
                  <Layers className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium">Design System</span>
                </div>
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
      <section id="sobre" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              Sobre Mim
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              UX + Produto + <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Tecnologia</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Um profissional que une design, usabilidade e análise de dados para criar soluções digitais completas e orientadas a resultados.
            </p>
          </div>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Palette,
                title: "Design & UX",
                description: "Pesquisa, prototipação de alta e baixa fidelidade, testes de usabilidade e Design Systems completos.",
                color: "from-amber-500 to-yellow-500"
              },
              {
                icon: Briefcase,
                title: "Product Owner",
                description: "Definição de requisitos, histórias de usuário, priorização de backlog e alinhamento com stakeholders.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: BarChart3,
                title: "Power Platform",
                description: "Power BI, Power Apps e Power Automate para dashboards, aplicações internas e automações.",
                color: "from-yellow-500 to-amber-500"
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-8 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} p-3.5 mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="w-full h-full text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Competências Técnicas</h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { category: "Design e Produto", skills: ["Pesquisa e testes", "Prototipação", "Design System", "Figma", "UX Writing"] },
                  { category: "Power Platform", skills: ["Power BI (DAX e M)", "Power Apps", "Power Automate", "Soluções integradas"] },
                  { category: "Programação", skills: ["JavaScript", "Angular", "React", "SQL", "Python"] },
                ].map((group) => (
                  <div key={group.category} className="p-4 bg-card/50 border border-border/50 rounded-xl">
                    <h4 className="font-semibold text-amber-500 mb-2">{group.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-muted rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Habilidades</h3>
              <ul className="space-y-4">
                {[
                  "Gestão Ágil e metodologias Scrum/Kanban",
                  "Testes de Usabilidade e UX Research",
                  "Definição de OKRs e métricas de sucesso",
                  "Liderança de equipes e mentoria",
                  "Comunicação com stakeholders",
                  "Adaptabilidade e flexibilidade",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Results/Testimonials Section */}
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
            {[
              { name: "Banco do Brasil", role: "Sênior UX Designer", period: "2022-2024" },
              { name: "Coco Bambu", role: "Product Owner", period: "2019-2025" },
              { name: "BCodex - Grupo Entre", role: "Product Designer", period: "2025" },
              { name: "óDois Tecnologia", role: "Co-Founder", period: "2023-2025" },
            ].map((company) => (
              <div
                key={company.name}
                className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 transition-all text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="font-bold text-lg">{company.name}</h3>
                <p className="text-amber-500 text-sm font-medium">{company.role}</p>
                <p className="text-xs text-muted-foreground mt-1">{company.period}</p>
              </div>
            ))}
          </div>

          {/* Key Achievements */}
          <div className="p-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl border border-amber-500/20">
            <h3 className="text-xl font-bold text-center mb-8">Principais Entregas</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { value: "App OuroCard", label: "Banco do Brasil - Novo app de cartões" },
                { value: "App Coco Bambu", label: "Aplicativo de delivery e reservas" },
                { value: "PixPay", label: "Sistema de pagamentos Pix" },
                { value: "+100", label: "Fluxos e protótipos criados" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="text-2xl font-bold text-amber-500">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experiencia" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              Experiência
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Minha <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">trajetória</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                role: "Product Designer",
                company: "BCodex - Grupo Entre",
                period: "2025",
                description: "Especialista de UX no desenvolvimento de aplicações financeiras como PixPay, APKDex e melhorias no Gateway Pay1. Liderança de Marketing e gestão de equipe de designers.",
                achievements: ["PixPay", "APKDex", "Gateway Pay1", "Liderança de equipe"]
              },
              {
                role: "Product Owner",
                company: "Coco Bambu Restaurantes",
                period: "2024 - 2025",
                description: "Liderança de iniciativas com foco na eficiência operacional. Definição de especificações de negócio, histórias de usuário e alinhamento com stakeholders.",
                achievements: ["Eficiência operacional", "Histórias de usuário", "Stakeholders"]
              },
              {
                role: "Sênior UX Designer",
                company: "Banco do Brasil (via Coopersystem)",
                period: "2022 - 2024",
                description: "Especialista de UX no desenvolvimento do Novo APP OuroCard e App BB. UX Research, UX Writing, criação de fluxos e testes de usabilidade.",
                achievements: ["App OuroCard", "App BB", "UX Research", "Testes de usabilidade"]
              },
              {
                role: "UI/UX Designer",
                company: "Coco Bambu Restaurantes",
                period: "2019 - 2023",
                description: "Desenvolvimento de produtos digitais para o grupo. UX Discovery, pesquisas, prototipação, Design System e Style Guides.",
                achievements: ["Design System", "UX Discovery", "Prototipação"]
              },
              {
                role: "Co-Founder & Marketing",
                company: "óDois Tecnologia",
                period: "2023 - 2025",
                description: "Planejamento e execução de estratégias de marketing. Campanhas digitais, conteúdo para mídias sociais e relacionamento com parceiros.",
                achievements: ["Estratégia de marketing", "Mídias sociais", "Parcerias"]
              },
            ].map((exp) => (
              <div
                key={`${exp.role}-${exp.company}`}
                className="group p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-amber-500 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-amber-500/80 font-medium">{exp.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium">
                    {exp.period}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.achievements.map((achievement) => (
                    <span key={achievement} className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="mt-12 p-6 bg-card/50 border border-border/50 rounded-2xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Formação
            </h3>
            <div>
              <p className="font-medium">Design Gráfico</p>
              <p className="text-muted-foreground">UDF - Centro Universitário | 2016 - 2018</p>
              <p className="text-sm text-muted-foreground">Brasília - DF</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
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
              Explore projetos e páginas criadas com o editor visual
            </p>
          </div>

          {pages.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="group relative bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20">
                    {(page.coverImageUrl || page.ogImageUrl) ? (
                      <img
                        src={page.coverImageUrl || page.ogImageUrl}
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

                  {/* Content */}
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
          ) : (
            <div className="text-center py-16 bg-card/30 backdrop-blur border border-border/50 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Rocket className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-muted-foreground mb-6">
                Nenhuma página publicada ainda
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Criar primeira página
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vamos criar algo <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">incrível</span> juntos?
          </h2>
          <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
            Estou aberto a discutir novos projetos, oportunidades de trabalho ou colaborações em UX/UI e Produto.
          </p>
          <p className="text-sm text-muted-foreground mb-10 flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-amber-500" />
            Brasília - DF, Brasil
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://wa.me/5561999911676?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio!"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-medium hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all"
            >
              <Phone className="h-5 w-5" />
              Falar no WhatsApp
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="mailto:ahspimentel@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card/50 border border-border/50 rounded-full font-medium hover:bg-muted hover:border-amber-500/50 transition-all"
            >
              <Mail className="h-5 w-5" />
              ahspimentel@gmail.com
            </a>
          </div>

          <div className="flex justify-center gap-4">
            <a
              href="https://linkedin.com/in/ahspimentel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card/50 border border-border/50 rounded-full font-medium hover:bg-muted hover:border-amber-500/50 transition-all"
            >
              <Linkedin className="h-5 w-5" />
              LinkedIn
            </a>
            <a
              href="https://behance.net/ahspimentel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card/50 border border-border/50 rounded-full font-medium hover:bg-muted hover:border-amber-500/50 transition-all"
            >
              <Palette className="h-5 w-5" />
              Behance
            </a>
          </div>
        </div>
      </section>

      {/* Revuu CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Powered by Revuu
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quer um portfólio como este?
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crie seu portfólio profissional em minutos com o <span className="text-amber-500 font-semibold">Revuu</span>.
            Sem código, totalmente personalizável e pronto para impressionar recrutadores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all"
            >
              Criar meu Revuu grátis
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Já usado por <span className="text-foreground font-medium">+500 profissionais</span> para destacar suas carreiras
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
              A plataforma para profissionais criarem portfólios que convertem.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
