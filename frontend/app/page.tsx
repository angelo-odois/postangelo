import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowRight, Sparkles, Palette, Briefcase, Rocket,
  CheckCircle2, Star, Zap, Layout, Globe, Shield,
  BarChart3, Users, Code2, Smartphone, FileText,
  ChevronRight, Play, Check, X, Crown, Building2
} from "lucide-react";
import { AnimatedHero } from "@/components/landing/AnimatedHero";

export const metadata: Metadata = {
  title: "Revuu - Crie seu Portfólio Profissional em Minutos",
  description: "A plataforma mais fácil para criar portfólios profissionais. Sem código, totalmente personalizável. Ideal para designers, desenvolvedores e criativos.",
  openGraph: {
    title: "Revuu - Crie seu Portfólio Profissional em Minutos",
    description: "A plataforma mais fácil para criar portfólios profissionais. Sem código, totalmente personalizável.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
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
          <Link href="/" className="flex items-center gap-2">
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
            <Link href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </Link>
            <Link href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </Link>
            <Link href="#templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </Link>
            <Link href="#precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/admin/register"
              className="text-sm px-4 py-2 bg-amber-500 text-white rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
            >
              Começar Grátis
            </Link>
          </div>
        </nav>
      </header>

      {/* Animated Hero Section */}
      <AnimatedHero />

      {/* Logos/Companies Section */}
      <section className="py-16 px-6 border-y border-border/50 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Profissionais de empresas como estas já usam o Revuu
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {["Google", "Microsoft", "Apple", "Meta", "Amazon", "Netflix"].map((company) => (
              <div key={company} className="text-xl font-bold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              Recursos
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tudo que você precisa para
              <br />
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                destacar sua carreira
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Ferramentas poderosas para criar, personalizar e compartilhar seu portfólio profissional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layout,
                title: "Editor Visual Drag & Drop",
                description: "Arraste e solte blocos para criar páginas incríveis. Sem precisar escrever uma linha de código.",
                color: "from-amber-500 to-yellow-500"
              },
              {
                icon: Palette,
                title: "Templates Profissionais",
                description: "Escolha entre dezenas de templates prontos para designers, devs, marketers e mais.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Globe,
                title: "Domínio Personalizado",
                description: "Use seu próprio domínio ou um subdomínio gratuito revuu.com.br/seu-nome.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Smartphone,
                title: "100% Responsivo",
                description: "Seu portfólio fica perfeito em qualquer dispositivo - desktop, tablet ou mobile.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "Analytics Integrado",
                description: "Acompanhe visitas, cliques e métricas importantes do seu portfólio em tempo real.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Shield,
                title: "SEO Otimizado",
                description: "Meta tags, Open Graph e sitemap automáticos para você aparecer no Google.",
                color: "from-indigo-500 to-violet-500"
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-8 bg-card/50 backdrop-blur border border-border/50 rounded-2xl hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3.5 mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Extra Features List */}
          <div className="mt-16 p-8 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-yellow-500/5 rounded-2xl border border-amber-500/10">
            <h3 className="text-xl font-bold mb-6 text-center">E muito mais...</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Blocos de formulário de contato",
                "Galeria de imagens",
                "Integração com YouTube/Vimeo",
                "Depoimentos e testemunhos",
                "Timeline de experiência",
                "Grid de habilidades",
                "Links para redes sociais",
                "Modo escuro automático",
                "Embed de Figma/Behance",
                "Seções customizáveis",
                "Backup automático",
                "Exportar como PDF",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-32 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              Como Funciona
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              3 passos para seu
              <br />
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                portfólio profissional
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Crie sua conta",
                description: "Cadastre-se gratuitamente em menos de 30 segundos. Sem cartão de crédito.",
                icon: Users
              },
              {
                step: "02",
                title: "Escolha um template",
                description: "Selecione um dos nossos templates profissionais ou comece do zero.",
                icon: FileText
              },
              {
                step: "03",
                title: "Personalize e publique",
                description: "Adicione seu conteúdo, personalize cores e publique com um clique.",
                icon: Rocket
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent -translate-x-8 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <item.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-amber-500 font-bold text-sm mb-2">PASSO {item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/admin/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-full font-medium hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all"
            >
              Começar Agora - É Grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              Templates
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Templates para cada
              <br />
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                tipo de profissional
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Escolha entre templates otimizados para diferentes áreas de atuação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Modern", category: "Designer", color: "from-amber-500 to-orange-500" },
              { name: "Classic", category: "Desenvolvedor", color: "from-blue-500 to-cyan-500" },
              { name: "Terminal", category: "Dev/Hacker", color: "from-green-500 to-emerald-500" },
              { name: "Minimal", category: "Fotógrafo", color: "from-gray-500 to-slate-500" },
              { name: "Creative", category: "Artista", color: "from-purple-500 to-pink-500" },
              { name: "Corporate", category: "Executivo", color: "from-indigo-500 to-violet-500" },
            ].map((template) => (
              <div
                key={template.name}
                className="group relative bg-card/50 border border-border/50 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-48 bg-gradient-to-br ${template.color} opacity-20`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-bold text-xl mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link
                    href="/admin/register"
                    className="px-6 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
                  >
                    Usar Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-32 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              Preços
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Planos para cada
              <br />
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                momento da sua carreira
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comece grátis e evolua conforme sua necessidade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 bg-card/50 border border-border/50 rounded-2xl">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">Grátis</h3>
                <p className="text-sm text-muted-foreground">Para começar sua jornada</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  { included: true, text: "1 portfólio" },
                  { included: true, text: "Subdomínio revuu.com.br" },
                  { included: true, text: "Templates básicos" },
                  { included: true, text: "Editor visual completo" },
                  { included: true, text: "Analytics básico" },
                  { included: false, text: "Domínio personalizado" },
                  { included: false, text: "Remover branding Revuu" },
                  { included: false, text: "Suporte prioritário" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {item.included ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                    )}
                    <span className={item.included ? "" : "text-muted-foreground/50"}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/admin/register"
                className="block w-full py-3 text-center border border-border rounded-full font-medium hover:bg-muted transition-colors"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="p-8 bg-gradient-to-b from-amber-500/10 to-orange-500/5 border-2 border-amber-500/50 rounded-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-amber-500 text-white text-sm font-medium rounded-full">
                  Mais Popular
                </span>
              </div>
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Pro</h3>
                <p className="text-sm text-muted-foreground">Para profissionais sérios</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 29</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  { included: true, text: "5 portfólios" },
                  { included: true, text: "Domínio personalizado" },
                  { included: true, text: "Todos os templates" },
                  { included: true, text: "Analytics avançado" },
                  { included: true, text: "Remover branding Revuu" },
                  { included: true, text: "Formulário de contato" },
                  { included: true, text: "Suporte prioritário" },
                  { included: true, text: "Exportar para PDF" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/admin/register?plan=pro"
                className="block w-full py-3 text-center bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                Começar Pro
              </Link>
            </div>

            {/* Business Plan */}
            <div className="p-8 bg-card/50 border border-border/50 rounded-2xl">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">Business</h3>
                <p className="text-sm text-muted-foreground">Para times e empresas</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 99</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  { included: true, text: "Portfólios ilimitados" },
                  { included: true, text: "Múltiplos domínios" },
                  { included: true, text: "Templates exclusivos" },
                  { included: true, text: "Analytics de equipe" },
                  { included: true, text: "White-label completo" },
                  { included: true, text: "API de integração" },
                  { included: true, text: "Suporte dedicado" },
                  { included: true, text: "Treinamento incluso" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/admin/register?plan=business"
                className="block w-full py-3 text-center border border-border rounded-full font-medium hover:bg-muted transition-colors"
              >
                Falar com Vendas
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Todos os planos incluem SSL grátis, backups diários e 99.9% de uptime.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              Depoimentos
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O que nossos usuários
              <br />
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                estão dizendo
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marina Silva",
                role: "UX Designer @ Google",
                text: "O Revuu me ajudou a criar um portfólio que realmente destaca meu trabalho. Recebi 3 propostas de emprego em 2 semanas!",
                avatar: "MS"
              },
              {
                name: "Carlos Eduardo",
                role: "Dev Full Stack",
                text: "Finalmente um builder que não parece genérico. O template Terminal é perfeito para devs como eu.",
                avatar: "CE"
              },
              {
                name: "Ana Paula",
                role: "Product Manager",
                text: "Construí meu portfólio em 30 minutos. A integração com Analytics me ajuda a entender quem está vendo meu perfil.",
                avatar: "AP"
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 bg-card/50 border border-border/50 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Preciso saber programar para usar o Revuu?",
                a: "Não! O Revuu foi criado para ser 100% visual. Você arrasta e solta blocos para criar seu portfólio, sem precisar escrever nenhum código."
              },
              {
                q: "Posso usar meu próprio domínio?",
                a: "Sim! No plano Pro e Business você pode conectar seu próprio domínio. No plano gratuito, você recebe um subdomínio gratuito (seuname.revuu.com.br)."
              },
              {
                q: "Quanto tempo leva para criar um portfólio?",
                a: "A maioria dos usuários cria seu primeiro portfólio em menos de 30 minutos. Com nossos templates, você pode ter algo pronto em 5 minutos."
              },
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Não há contratos de longo prazo. Você pode cancelar sua assinatura a qualquer momento e continuar usando até o fim do período pago."
              },
              {
                q: "O Revuu funciona bem no celular?",
                a: "Sim! Todos os portfólios criados no Revuu são 100% responsivos e ficam perfeitos em qualquer dispositivo."
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-6 bg-card/50 border border-border/50 rounded-xl"
              >
                <h3 className="font-bold mb-2 flex items-start gap-3">
                  <ChevronRight className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-muted-foreground pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Comece grátis, sem cartão de crédito
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Pronto para destacar
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              sua carreira?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já estão usando o Revuu para conquistar as melhores oportunidades.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/register"
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-amber-500 text-white rounded-full font-medium text-lg hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105 transition-all"
            >
              Criar Meu Portfólio Grátis
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Setup em menos de 2 minutos • Cancele quando quiser • Suporte em português
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Image
                src="/revuuLogo.png"
                alt="Revuu"
                width={120}
                height={40}
                className="h-8 w-auto mb-4"
              />
              <p className="text-muted-foreground max-w-md">
                A plataforma mais fácil para criar portfólios profissionais. Destaque sua carreira e conquiste as melhores oportunidades.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#recursos" className="hover:text-foreground transition-colors">Recursos</Link></li>
                <li><Link href="#templates" className="hover:text-foreground transition-colors">Templates</Link></li>
                <li><Link href="#precos" className="hover:text-foreground transition-colors">Preços</Link></li>
                <li><Link href="/admin" className="hover:text-foreground transition-colors">Entrar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/ajuda" className="hover:text-foreground transition-colors">Central de Ajuda</Link></li>
                <li><Link href="/contato" className="hover:text-foreground transition-colors">Contato</Link></li>
                <li><Link href="/termos" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Revuu. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
