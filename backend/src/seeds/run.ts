import "dotenv/config";
import { AppDataSource } from "../data-source.js";
import { User, UserRole, BlockTemplate, Page, PageStatus, PageTemplate, PageTemplateCategory } from "../entities/index.js";
import { authService } from "../services/auth.js";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  await AppDataSource.initialize();
  console.log("Database connected");

  const userRepository = AppDataSource.getRepository(User);
  const blockTemplateRepository = AppDataSource.getRepository(BlockTemplate);

  // Create admin user
  const existingAdmin = await userRepository.findOne({
    where: { email: "admin@postangelo.com" },
  });

  const passwordHash = await authService.hashPassword("admin123");

  if (!existingAdmin) {
    const admin = userRepository.create({
      name: "Admin",
      username: "admin",
      email: "admin@postangelo.com",
      passwordHash,
      role: UserRole.ADMIN,
      onboardingCompleted: true,
    });
    await userRepository.save(admin);
    console.log("Admin user created: admin@postangelo.com / admin123");
  } else {
    // Update password, username and onboarding if admin already exists
    await userRepository.update(existingAdmin.id, {
      passwordHash,
      username: existingAdmin.username || "admin",
      onboardingCompleted: true,
    });
    console.log("Admin user password and username updated: admin@postangelo.com / admin123");
  }

  // Create default block templates
  const defaultTemplates = [
    {
      name: "Hero",
      category: "header",
      schemaJSON: {
        title: { type: "string", label: "Title", required: true },
        subtitle: { type: "richtext", label: "Subtitle" },
        background: { type: "image", label: "Background Image" },
        alignment: {
          type: "select",
          label: "Alignment",
          options: ["left", "center", "right"],
          default: "center",
        },
        overlayOpacity: {
          type: "number",
          label: "Overlay Opacity",
          default: 0.5,
        },
      },
      previewDataJSON: {
        title: "Welcome to My Portfolio",
        subtitle: "Full-Stack Developer & Designer",
        alignment: "center",
        overlayOpacity: 0.5,
      },
    },
    {
      name: "Text Block",
      category: "content",
      schemaJSON: {
        content: { type: "richtext", label: "Content", required: true },
        alignment: {
          type: "select",
          label: "Alignment",
          options: ["left", "center", "right"],
          default: "left",
        },
      },
      previewDataJSON: {
        content: "<p>This is a sample text block. You can add rich text content here.</p>",
        alignment: "left",
      },
    },
    {
      name: "Services Grid",
      category: "content",
      schemaJSON: {
        title: { type: "string", label: "Section Title" },
        services: {
          type: "repeater",
          label: "Services",
          default: [],
        },
        columns: {
          type: "select",
          label: "Columns",
          options: ["2", "3", "4"],
          default: "3",
        },
      },
      previewDataJSON: {
        title: "My Services",
        columns: "3",
        services: [
          { title: "Web Development", description: "Modern web applications", icon: "code" },
          { title: "UI/UX Design", description: "Beautiful interfaces", icon: "palette" },
          { title: "Consulting", description: "Technical guidance", icon: "lightbulb" },
        ],
      },
    },
  ];

  for (const template of defaultTemplates) {
    const existing = await blockTemplateRepository.findOne({
      where: { name: template.name },
    });

    if (!existing) {
      const newTemplate = blockTemplateRepository.create(template as unknown as Partial<BlockTemplate>);
      await blockTemplateRepository.save(newTemplate);
      console.log(`Block template created: ${template.name}`);
    }
  }

  // Create project pages
  const pageRepository = AppDataSource.getRepository(Page);

  const projectPages = [
    {
      title: "App OuroCard",
      slug: "projetos/app-ourocard",
      seoTitle: "App OuroCard - Aplicativo de Cartões Banco do Brasil",
      seoDescription: "Design de UX para o aplicativo de gestão de cartões do Banco do Brasil, impactando milhões de usuários.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "App OuroCard",
              subtitle: "<p>Aplicativo de gestão de cartões do Banco do Brasil</p>",
              description: "UX Design para milhões de usuários",
              alignment: "center",
              overlayOpacity: 0.5,
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p>O App OuroCard é o aplicativo oficial do Banco do Brasil para gestão de cartões de crédito. Como <strong>Sênior UX Designer</strong>, fui responsável por conduzir pesquisas com usuários, testes de usabilidade e redesign de fluxos críticos.</p>

<h3>Meu Papel</h3>
<ul>
<li>UX Research com usuários reais do aplicativo</li>
<li>Testes de usabilidade em laboratório</li>
<li>Redesign de fluxos de pagamento e consulta</li>
<li>Análise de métricas e iteração baseada em dados</li>
<li>Colaboração com times de desenvolvimento e produto</li>
</ul>

<h3>Resultados</h3>
<p>O redesign resultou em melhorias significativas na experiência do usuário, com aumento na taxa de conclusão de tarefas e redução no tempo de execução das principais jornadas.</p>`,
              alignment: "left",
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "Maestro",
      slug: "projetos/maestro",
      seoTitle: "Maestro - Sistema de Integração de Delivery",
      seoDescription: "Product Owner responsável pelo sistema de integração de pedidos de delivery para a rede Coco Bambu.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "Maestro",
              subtitle: "<p>Sistema de integração de pedidos de delivery</p>",
              description: "Gestão unificada de múltiplos canais",
              alignment: "center",
              overlayOpacity: 0.5,
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p>O Maestro é um sistema desenvolvido para a rede Coco Bambu que integra pedidos de múltiplas plataformas de delivery (iFood, Rappi, Uber Eats) em uma única interface de gestão.</p>

<h3>Meu Papel como Product Owner</h3>
<ul>
<li>Product Discovery com stakeholders e usuários</li>
<li>Definição de roadmap e priorização de backlog</li>
<li>Especificação de requisitos e histórias de usuário</li>
<li>Acompanhamento de métricas e OKRs</li>
<li>Gestão de squad multidisciplinar</li>
</ul>

<h3>Impacto</h3>
<p>O sistema reduziu significativamente o tempo de gestão de pedidos e erros operacionais, centralizando todos os canais de delivery em uma única plataforma intuitiva.</p>`,
              alignment: "left",
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "eCheck",
      slug: "projetos/echeck",
      seoTitle: "eCheck - Sistema POS para Restaurantes",
      seoDescription: "Sistema de POS para gestão de mesas e cardápio para pedidos dentro do restaurante.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "eCheck",
              subtitle: "<p>Sistema POS para gestão de mesas e cardápio</p>",
              description: "Pedidos dentro do restaurante simplificados",
              alignment: "center",
              overlayOpacity: 0.5,
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p>O eCheck é um sistema de POS (Point of Sale) desenvolvido para otimizar a operação de restaurantes, permitindo gestão de mesas, pedidos e cardápio digital de forma integrada.</p>

<h3>Meu Papel</h3>
<ul>
<li>Product Discovery e validação com gerentes de restaurante</li>
<li>Design de interface otimizada para operação rápida</li>
<li>Prototipação e testes com garçons e atendentes</li>
<li>Definição de fluxos de pedido e pagamento</li>
</ul>

<h3>Funcionalidades Principais</h3>
<ul>
<li>Mapa visual de mesas do restaurante</li>
<li>Cardápio digital com fotos e descrições</li>
<li>Gestão de pedidos por mesa</li>
<li>Fechamento de conta e divisão</li>
<li>Integração com cozinha e bar</li>
</ul>`,
              alignment: "left",
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "PixPay",
      slug: "projetos/pixpay",
      seoTitle: "PixPay - Plataforma de Pagamentos Pix",
      seoDescription: "Design de UX para plataforma de pagamentos via Pix com foco em usabilidade e segurança.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "PixPay",
              subtitle: "<p>Plataforma de pagamentos via Pix</p>",
              description: "Pagamentos instantâneos simplificados",
              alignment: "center",
              overlayOpacity: 0.5,
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p>O PixPay é uma plataforma de pagamentos focada em transações via Pix, desenvolvida para a BCodex (Grupo Entre). O projeto envolveu design de jornadas de pagamento seguras e intuitivas.</p>

<h3>Meu Papel como Product Designer</h3>
<ul>
<li>Liderança de UX em aplicações financeiras</li>
<li>Design de jornadas de pagamento</li>
<li>Gestão de squad de designers</li>
<li>Definição de estratégias de produto</li>
</ul>

<h3>Desafios</h3>
<ul>
<li>Balancear segurança com usabilidade</li>
<li>Criar fluxos de confirmação claros</li>
<li>Otimizar para diferentes perfis de usuário</li>
<li>Garantir conformidade com regulamentações</li>
</ul>`,
              alignment: "left",
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "App Coco Bambu",
      slug: "projetos/app-coco-bambu",
      seoTitle: "App Coco Bambu - Delivery e Pedidos Online",
      seoDescription: "Aplicativo de delivery e reservas para a maior rede de restaurantes do Brasil.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "App Coco Bambu",
              subtitle: "<p>Aplicativo de delivery e pedidos online</p>",
              description: "A experiência Coco Bambu na palma da mão",
              alignment: "center",
              overlayOpacity: 0.5,
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p>O App Coco Bambu é o aplicativo oficial da maior rede de restaurantes casuais do Brasil. Permite fazer pedidos de delivery, reservas de mesa e acompanhar o programa de fidelidade.</p>

<h3>Meu Papel como UI/UX Designer</h3>
<ul>
<li>Criação do Design System da marca</li>
<li>Prototipação de alta fidelidade</li>
<li>Condução de Discovery com stakeholders e usuários</li>
<li>Testes de usabilidade e iteração</li>
</ul>

<h3>Funcionalidades</h3>
<ul>
<li>Cardápio completo com fotos</li>
<li>Pedido de delivery com rastreamento</li>
<li>Reserva de mesas</li>
<li>Programa de fidelidade</li>
<li>Histórico de pedidos e favoritos</li>
</ul>`,
              alignment: "left",
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "SmartPagamento",
      slug: "projetos/smartpagamento",
      seoTitle: "SmartPagamento - Checkout Design + Frontend",
      seoDescription: "Design e desenvolvimento frontend de sistema de checkout para pagamentos online.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "SmartPagamento",
              subtitle: "<p>Checkout design + frontend</p>",
              description: "Experiência de pagamento otimizada",
              alignment: "center",
              overlayOpacity: 0.5,
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p>O SmartPagamento é um sistema de checkout desenvolvido para otimizar a conversão em pagamentos online. O projeto envolveu tanto design quanto desenvolvimento frontend.</p>

<h3>Meu Papel</h3>
<ul>
<li>Design de interface do checkout</li>
<li>Desenvolvimento frontend</li>
<li>Otimização de conversão</li>
<li>Testes A/B de diferentes abordagens</li>
</ul>

<h3>Características</h3>
<ul>
<li>Checkout em uma página</li>
<li>Múltiplos métodos de pagamento</li>
<li>Validação em tempo real</li>
<li>Design responsivo</li>
<li>Feedback visual claro</li>
</ul>`,
              alignment: "left",
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "Débitos EntrePay",
      slug: "projetos/debitos-entrepay",
      seoTitle: "Débitos EntrePay - POS para Débitos Veiculares",
      seoDescription: "Sistema de POS para consulta e pagamento de débitos veiculares junto ao Detran e Denatran.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "Débitos EntrePay",
              subtitle: "<p>POS para débitos Detran/Denatran</p>",
              description: "Pagamento de débitos veiculares simplificado",
              alignment: "center",
              overlayOpacity: 0.5,
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p>Sistema de POS desenvolvido para a EntrePay que permite consulta e pagamento de débitos veiculares junto ao Detran e Denatran de forma rápida e segura.</p>

<h3>Meu Papel</h3>
<ul>
<li>Design de interface para terminais POS</li>
<li>Fluxos de consulta e pagamento</li>
<li>Integração com APIs governamentais</li>
<li>Experiência otimizada para operadores</li>
</ul>

<h3>Funcionalidades</h3>
<ul>
<li>Consulta de débitos por placa ou Renavam</li>
<li>Visualização detalhada de multas e taxas</li>
<li>Pagamento via múltiplos métodos</li>
<li>Emissão de comprovantes</li>
<li>Histórico de transações</li>
</ul>`,
              alignment: "left",
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "Cardápio Online",
      slug: "projetos/cardapio-online",
      seoTitle: "Cardápio Online - Menu via QRCode",
      seoDescription: "Sistema de cardápio digital acessível via QRCode com agregador de links para múltiplas lojas.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "Cardápio Online",
              subtitle: "<p>Menu via QRCode + agregador de links</p>",
              description: "Cardápio digital para restaurantes",
              alignment: "center",
              overlayOpacity: 0.5,
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p>O Cardápio Online é um sistema de menu digital acessível via QRCode, desenvolvido para a rede Coco Bambu. Funciona como um agregador de links que disponibiliza acesso a várias lojas e serviços.</p>

<h3>Meu Papel</h3>
<ul>
<li>Design da experiência mobile-first</li>
<li>Arquitetura de informação do cardápio</li>
<li>Sistema de QRCode dinâmico</li>
<li>Agregador de links para múltiplas lojas</li>
</ul>

<h3>Características</h3>
<ul>
<li>Acesso instantâneo via QRCode</li>
<li>Design responsivo e otimizado para mobile</li>
<li>Fotos e descrições dos pratos</li>
<li>Links para delivery, reservas e redes sociais</li>
<li>Atualização em tempo real</li>
</ul>`,
              alignment: "left",
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "Bio - Plataforma de Biolinks",
      slug: "projetos/bio",
      seoTitle: "Bio - Plataforma SaaS de Biolinks",
      seoDescription: "Plataforma SaaS completa para criação de páginas de biolinks com analytics, personalização avançada e QR codes.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "Bio",
              subtitle: "<p>Plataforma SaaS de Biolinks</p>",
              description: "Centralize todos os seus links em uma única página personalizada",
              badge: "SaaS Platform",
              backgroundColor: "gradient",
              alignment: "center",
              size: "medium",
            },
          },
          {
            type: "stats",
            id: uuidv4(),
            props: {
              title: "Métricas do Projeto",
              columns: "4",
              style: "gradient",
              stats: [
                { value: "15K+", label: "Linhas de Código" },
                { value: "22", label: "Tipos de Blocos" },
                { value: "40+", label: "Endpoints API" },
                { value: "50+", label: "Componentes React" },
              ],
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Visão Geral</h2>
<p>Bio é uma plataforma SaaS completa para criação e gerenciamento de páginas de biolinks, desenvolvida do zero com tecnologias modernas. A solução permite que criadores de conteúdo, influenciadores e empresas centralizem todos os seus links em uma única página personalizada, com recursos avançados de analytics, personalização e monetização.</p>`,
              alignment: "left",
            },
          },
          {
            type: "features",
            id: uuidv4(),
            props: {
              title: "Funcionalidades Principais",
              columns: "3",
              style: "cards",
              features: [
                { title: "22 Tipos de Blocos", description: "Links, headings, imagens, carrossel, embeds (YouTube, Spotify, TikTok), formulários e mais", icon: "layout" },
                { title: "Analytics Real-time", description: "Cliques, visitantes únicos, geolocalização, dispositivos e fontes de tráfego", icon: "chart" },
                { title: "Personalização Total", description: "Backgrounds, tipografia, animações, CSS e JavaScript customizados", icon: "palette" },
                { title: "QR Codes", description: "Geração automática com personalização de cores e tracking de scans", icon: "smartphone" },
                { title: "Domínios Custom", description: "Suporte a domínios próprios com SSL automático via Let's Encrypt", icon: "globe" },
                { title: "Campanhas", description: "Botões promocionais flutuantes com agendamento e tracking", icon: "rocket" },
              ],
            },
          },
          {
            type: "columns",
            id: uuidv4(),
            props: {
              columns: "2",
              style: "cards",
              gap: "large",
              items: [
                {
                  title: "Stack Frontend",
                  content: "<ul><li><strong>Next.js 14</strong> com App Router</li><li><strong>React 18</strong> com Server Components</li><li><strong>TypeScript</strong> end-to-end</li><li><strong>Tailwind CSS</strong> para estilização</li></ul>",
                },
                {
                  title: "Stack Backend",
                  content: "<ul><li><strong>Node.js</strong> com Express.js</li><li><strong>TypeORM</strong> com migrations</li><li><strong>PostgreSQL 15</strong></li><li><strong>Docker + Traefik</strong> + Coolify</li></ul>",
                },
              ],
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "Checkout Smart",
      slug: "projetos/checkout-smart",
      seoTitle: "Checkout Smart - Pagamento de Débitos Veiculares",
      seoDescription: "Plataforma web para consulta e pagamento de débitos veiculares (IPVA, multas, licenciamento) com parcelamento em até 12x no cartão.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "Checkout Smart",
              subtitle: "<p>Plataforma de Pagamento de Débitos Veiculares</p>",
              description: "Consulte e pague IPVA, multas e licenciamento em até 12x no cartão",
              badge: "Fintech / GovTech",
              backgroundColor: "gradient",
              alignment: "center",
              size: "medium",
            },
          },
          {
            type: "stats",
            id: uuidv4(),
            props: {
              title: "Métricas de Performance",
              columns: "4",
              style: "gradient",
              stats: [
                { value: "<3s", label: "Tempo de Consulta" },
                { value: "90+", label: "Lighthouse Score" },
                { value: "180KB", label: "Bundle Size" },
                { value: "70%", label: "Mobile First" },
              ],
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre o Projeto</h2>
<p><strong>Checkout Smart</strong> é uma aplicação web desenvolvida para a <strong>Smart Pagamentos</strong>, uma fintech credenciada pelo DETRAN-SP e SENATRAN. A plataforma centraliza a consulta e pagamento de débitos veiculares em 4 etapas simples: consulta, seleção, dados e pagamento.</p>`,
              alignment: "left",
            },
          },
          {
            type: "features",
            id: uuidv4(),
            props: {
              title: "Funcionalidades",
              columns: "3",
              style: "cards",
              features: [
                { title: "Consulta Rápida", description: "Validação de placa (formato antigo e Mercosul) com busca em menos de 3 segundos", icon: "zap" },
                { title: "Parcelamento 12x", description: "Cálculo em tempo real de 1x a 12x com taxas variáveis e transparentes", icon: "chart" },
                { title: "Sistema de Cupons", description: "Validação em tempo real via API com desconto aplicado sobre juros", icon: "star" },
                { title: "Dependências Inteligentes", description: "Algoritmo recursivo que mapeia dependências e exclusões mútuas entre débitos", icon: "settings" },
                { title: "Busca de CEP", description: "Integração com ViaCEP para preenchimento automático de endereço", icon: "globe" },
                { title: "Pagamento Seguro", description: "Tokenização de cartão, protocolo único e tratamento de erros específicos", icon: "lock" },
              ],
            },
          },
          {
            type: "columns",
            id: uuidv4(),
            props: {
              columns: "2",
              style: "cards",
              gap: "large",
              items: [
                {
                  title: "Stack Tecnológica",
                  content: "<ul><li><strong>React 18</strong> com TypeScript 100%</li><li><strong>Vite</strong> para build ultrarrápido</li><li><strong>Tailwind CSS</strong> + Radix UI</li><li><strong>OAuth 2.0</strong> com API DETRAN-SP</li></ul>",
                },
                {
                  title: "Resultados",
                  content: "<ul><li>Plataforma em <strong>produção</strong> processando pagamentos reais</li><li><strong>Zero downtime</strong> desde o lançamento</li><li>Base técnica para <strong>expansão multi-estado</strong></li><li>Checkout completo em <strong>menos de 2 minutos</strong></li></ul>",
                },
              ],
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
    {
      title: "Nexus CRM",
      slug: "projetos/nexus-crm",
      seoTitle: "Nexus CRM - Plataforma SaaS Enterprise de CRM",
      seoDescription: "CRM enterprise-grade com inbox omnichannel, IA integrada, automações visuais e app desktop para macOS.",
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "Nexus CRM",
              subtitle: "<p>Plataforma SaaS Enterprise de CRM Omnichannel</p>",
              description: "Gestão de relacionamento com clientes potencializada por IA",
              badge: "Enterprise SaaS",
              backgroundColor: "gradient",
              alignment: "center",
              size: "medium",
            },
          },
          {
            type: "stats",
            id: uuidv4(),
            props: {
              title: "Escala do Projeto",
              columns: "5",
              style: "gradient",
              stats: [
                { value: "50K", label: "Linhas de Código" },
                { value: "50+", label: "Entidades" },
                { value: "60+", label: "Endpoints" },
                { value: "100+", label: "Componentes" },
                { value: "6", label: "Canais" },
              ],
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Resumo Executivo</h2>
<p>Nexus CRM é uma plataforma SaaS enterprise-grade de gestão de relacionamento com clientes, projetada para centralizar operações comerciais e comunicação omnichannel. O sistema oferece isolamento completo de dados por empresa (multi-tenancy), inteligência artificial integrada para otimização de vendas, e arquitetura modular escalável.</p>`,
              alignment: "left",
            },
          },
          {
            type: "features",
            id: uuidv4(),
            props: {
              title: "Funcionalidades Principais",
              columns: "3",
              style: "cards",
              features: [
                { title: "Inbox Omnichannel", description: "WhatsApp (WAHA), Instagram e Email em interface unificada", icon: "users" },
                { title: "IA Integrada", description: "Scoring automático de leads, sugestões de resposta e resumos de conversa", icon: "lightbulb" },
                { title: "Automações Visuais", description: "Editor de fluxos com triggers, condições e ações personalizadas", icon: "settings" },
                { title: "Multi-tenancy", description: "Isolamento completo por empresa com RBAC e 11 roles diferentes", icon: "shield" },
                { title: "App Desktop", description: "Electron para macOS com notificações nativas e deep links", icon: "smartphone" },
                { title: "Pipeline Visual", description: "Kanban board com drag-drop para gestão de deals e oportunidades", icon: "layout" },
              ],
            },
          },
          {
            type: "columns",
            id: uuidv4(),
            props: {
              columns: "2",
              style: "cards",
              gap: "large",
              items: [
                {
                  title: "Stack Frontend",
                  content: "<ul><li><strong>Next.js 15</strong> com React 19</li><li><strong>TypeScript</strong> strict mode</li><li><strong>Zustand</strong> + React Query</li><li><strong>TailwindCSS</strong> + Radix UI</li></ul>",
                },
                {
                  title: "Stack Backend",
                  content: "<ul><li><strong>Fastify 5</strong> com TypeScript</li><li><strong>TypeORM</strong> + PostgreSQL</li><li><strong>OpenAI SDK</strong> para IA</li><li><strong>Docker</strong> + GitHub Actions</li></ul>",
                },
              ],
            },
          },
          {
            type: "features",
            id: uuidv4(),
            props: {
              title: "Arquitetura & Segurança",
              columns: "3",
              style: "gradient",
              features: [
                { title: "Autenticação JWT", description: "Refresh tokens com middleware chain e expiração configurável", icon: "lock" },
                { title: "Segurança Avançada", description: "Helmet, CORS, rate limiting e Zod validation em todas as rotas", icon: "shield" },
                { title: "Escalabilidade", description: "Backend stateless, connection pooling e cache inteligente", icon: "zap" },
              ],
            },
          },
        ],
        meta: { theme: "default" },
      },
      status: PageStatus.PUBLISHED,
    },
  ];

  for (const pageData of projectPages) {
    const existing = await pageRepository.findOne({
      where: { slug: pageData.slug },
    });

    if (!existing) {
      const newPage = pageRepository.create(pageData);
      await pageRepository.save(newPage);
      console.log(`Project page created: ${pageData.title}`);
    } else {
      // Update existing page with new content
      await pageRepository.update(existing.id, pageData);
      console.log(`Project page updated: ${pageData.title}`);
    }
  }

  // Create page templates
  const pageTemplateRepository = AppDataSource.getRepository(PageTemplate);

  const pageTemplates = [
    {
      name: "Curriculo Profissional",
      description: "Template de curriculo moderno com secoes para experiencia, educacao e skills",
      slug: "cv-professional",
      category: PageTemplateCategory.CV,
      thumbnailUrl: "/templates/cv-professional.png",
      defaultTitle: "Meu Curriculo",
      isPremium: false,
      order: 1,
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "Seu Nome Aqui",
              subtitle: "<p>Seu Cargo / Titulo Profissional</p>",
              description: "Uma breve descricao sobre voce e suas habilidades principais.",
              alignment: "center",
              size: "medium",
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre Mim</h2>
<p>Escreva aqui uma descricao sobre sua trajetoria profissional, seus objetivos e o que voce pode oferecer. Este e o espaco para mostrar quem voce e como profissional.</p>`,
              alignment: "left",
            },
          },
          {
            type: "timeline",
            id: uuidv4(),
            props: {
              title: "Experiencia Profissional",
              items: [
                { title: "Cargo Atual", subtitle: "Empresa Atual", date: "2022 - Presente", description: "Descreva suas responsabilidades e conquistas nesta posicao." },
                { title: "Cargo Anterior", subtitle: "Empresa Anterior", date: "2020 - 2022", description: "Descreva suas responsabilidades e conquistas nesta posicao." },
                { title: "Primeiro Emprego", subtitle: "Primeira Empresa", date: "2018 - 2020", description: "Descreva suas responsabilidades e conquistas nesta posicao." },
              ],
              style: "alternating",
            },
          },
          {
            type: "timeline",
            id: uuidv4(),
            props: {
              title: "Formacao Academica",
              items: [
                { title: "Pos-Graduacao", subtitle: "Universidade", date: "2020 - 2022", description: "Especializacao em sua area" },
                { title: "Graduacao", subtitle: "Universidade", date: "2016 - 2020", description: "Curso de graduacao" },
              ],
              style: "left",
            },
          },
          {
            type: "features",
            id: uuidv4(),
            props: {
              title: "Habilidades",
              columns: "4",
              style: "minimal",
              features: [
                { title: "Habilidade 1", description: "Descricao breve", icon: "code" },
                { title: "Habilidade 2", description: "Descricao breve", icon: "palette" },
                { title: "Habilidade 3", description: "Descricao breve", icon: "chart" },
                { title: "Habilidade 4", description: "Descricao breve", icon: "users" },
              ],
            },
          },
          {
            type: "cta",
            id: uuidv4(),
            props: {
              title: "Vamos Conversar?",
              description: "Entre em contato para oportunidades de trabalho",
              buttonText: "Enviar Email",
              buttonLink: "mailto:seu@email.com",
              style: "gradient",
            },
          },
        ],
        meta: { theme: "default" },
      },
    },
    {
      name: "Landing Page Portfolio",
      description: "Pagina inicial completa com hero, sobre, projetos e contato",
      slug: "landing-portfolio",
      category: PageTemplateCategory.LANDING,
      thumbnailUrl: "/templates/landing-portfolio.png",
      defaultTitle: "Meu Portfolio",
      isPremium: false,
      order: 2,
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "Ola, eu sou Seu Nome",
              subtitle: "<p>Designer &amp; Desenvolvedor</p>",
              description: "Crio experiencias digitais incriveis que conectam pessoas e marcas.",
              alignment: "center",
              size: "large",
            },
          },
          {
            type: "stats",
            id: uuidv4(),
            props: {
              title: "",
              columns: "4",
              style: "minimal",
              stats: [
                { value: "5+", label: "Anos de Experiencia" },
                { value: "50+", label: "Projetos Entregues" },
                { value: "30+", label: "Clientes Felizes" },
                { value: "100%", label: "Dedicacao" },
              ],
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: `<h2>Sobre Mim</h2>
<p>Sou um profissional apaixonado por criar solucoes digitais que fazem a diferenca. Com experiencia em design e desenvolvimento, busco sempre entregar projetos que superem as expectativas dos clientes.</p>`,
              alignment: "center",
            },
          },
          {
            type: "features",
            id: uuidv4(),
            props: {
              title: "O Que Eu Faco",
              columns: "3",
              style: "cards",
              features: [
                { title: "Design UI/UX", description: "Interfaces intuitivas e experiencias memoraveis", icon: "palette" },
                { title: "Desenvolvimento Web", description: "Sites e aplicacoes modernas e performaticas", icon: "code" },
                { title: "Consultoria", description: "Estrategias digitais para seu negocio", icon: "lightbulb" },
              ],
            },
          },
          {
            type: "gallery",
            id: uuidv4(),
            props: {
              title: "Projetos em Destaque",
              columns: "3",
              images: [
                { url: "/placeholder-project-1.jpg", alt: "Projeto 1", caption: "Nome do Projeto 1" },
                { url: "/placeholder-project-2.jpg", alt: "Projeto 2", caption: "Nome do Projeto 2" },
                { url: "/placeholder-project-3.jpg", alt: "Projeto 3", caption: "Nome do Projeto 3" },
              ],
              style: "masonry",
            },
          },
          {
            type: "cta",
            id: uuidv4(),
            props: {
              title: "Vamos Trabalhar Juntos?",
              description: "Entre em contato para discutir seu proximo projeto",
              buttonText: "Entrar em Contato",
              buttonLink: "mailto:seu@email.com",
              style: "gradient",
            },
          },
        ],
        meta: { theme: "default" },
      },
    },
    {
      name: "Pagina de Links",
      description: "Estilo Linktree com bio e links para redes sociais",
      slug: "links-bio",
      category: PageTemplateCategory.LINKS,
      thumbnailUrl: "/templates/links-bio.png",
      defaultTitle: "Meus Links",
      isPremium: false,
      order: 3,
      contentJSON: {
        blocks: [
          {
            type: "hero",
            id: uuidv4(),
            props: {
              title: "@seunome",
              subtitle: "<p>Criador de Conteudo | Designer | Dev</p>",
              description: "Acompanhe meu trabalho nas redes sociais",
              alignment: "center",
              size: "small",
            },
          },
          {
            type: "features",
            id: uuidv4(),
            props: {
              title: "",
              columns: "1",
              style: "list",
              features: [
                { title: "Meu Portfolio", description: "Veja meus projetos", icon: "globe" },
                { title: "LinkedIn", description: "Conecte-se comigo", icon: "linkedin" },
                { title: "GitHub", description: "Meus repositorios", icon: "github" },
                { title: "Instagram", description: "Siga-me", icon: "instagram" },
                { title: "YouTube", description: "Meu canal", icon: "play" },
                { title: "Email", description: "Entre em contato", icon: "mail" },
              ],
            },
          },
          {
            type: "text",
            id: uuidv4(),
            props: {
              content: "<p style=\"text-align: center; font-size: 0.875rem; color: #666;\">Feito com Revuu</p>",
              alignment: "center",
            },
          },
        ],
        meta: { theme: "default", layout: "centered" },
      },
    },
  ];

  for (const template of pageTemplates) {
    const existing = await pageTemplateRepository.findOne({
      where: { slug: template.slug },
    });

    if (!existing) {
      const newTemplate = pageTemplateRepository.create(template as unknown as Partial<PageTemplate>);
      await pageTemplateRepository.save(newTemplate);
      console.log(`Page template created: ${template.name}`);
    } else {
      // Update existing template with new content
      await pageTemplateRepository.update(existing.id, template);
      console.log(`Page template updated: ${template.name}`);
    }
  }

  console.log("Seeding completed");
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
