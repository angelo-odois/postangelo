export { HeroBlock, heroSchema } from "./HeroBlock";
export { TextBlock, textSchema } from "./TextBlock";
export { ServicesGridBlock, servicesGridSchema } from "./ServicesGridBlock";
export { ImageBlock, imageSchema } from "./ImageBlock";
export { ColumnsBlock, columnsSchema } from "./ColumnsBlock";
export { StatsBlock, statsSchema } from "./StatsBlock";
export { FeaturesBlock, featuresSchema } from "./FeaturesBlock";
export { FigmaEmbedBlock, figmaEmbedSchema } from "./FigmaEmbedBlock";
export { TestimonialsBlock, testimonialsSchema } from "./TestimonialsBlock";
export { AccordionBlock, accordionSchema } from "./AccordionBlock";
export { VideoEmbedBlock, videoEmbedSchema } from "./VideoEmbedBlock";
export { CTABlock, ctaSchema } from "./CTABlock";
export { PricingBlock, pricingSchema } from "./PricingBlock";
export { DividerBlock, dividerSchema } from "./DividerBlock";
export { SectionBlock, sectionSchema } from "./SectionBlock";
export { CounterBlock } from "./CounterBlock";
export { ProgressBarBlock } from "./ProgressBarBlock";
export { TabsBlock } from "./TabsBlock";
export { ToggleBlock } from "./ToggleBlock";
export { CountdownBlock } from "./CountdownBlock";
export { LogoCloudBlock } from "./LogoCloudBlock";
export { TeamBlock } from "./TeamBlock";
export { TimelineBlock } from "./TimelineBlock";
export { GalleryBlock } from "./GalleryBlock";
export { FormBlock } from "./FormBlock";
export { ProcessBlock, processSchema } from "./ProcessBlock";
export { BlockRenderer } from "./BlockRenderer";

export const blockRegistry = {
  hero: {
    name: "Hero",
    category: "header",
    schema: {
      // Content
      title: { type: "string", label: "Titulo", required: true },
      subtitle: { type: "richtext", label: "Subtitulo" },
      description: { type: "textarea", label: "Descricao" },
      badge: { type: "string", label: "Badge" },

      // Title Styling
      titleColor: {
        type: "select",
        label: "Cor do Titulo",
        options: ["default", "primary", "muted", "white", "amber", "custom"],
        default: "default",
      },
      titleCustomColor: { type: "string", label: "Cor Personalizada do Titulo (hex)" },
      titleSize: {
        type: "select",
        label: "Tamanho do Titulo",
        options: ["small", "medium", "large", "xlarge"],
        default: "large",
      },
      titleWeight: {
        type: "select",
        label: "Peso do Titulo",
        options: ["normal", "medium", "semibold", "bold", "extrabold"],
        default: "bold",
      },

      // Subtitle Styling
      subtitleColor: {
        type: "select",
        label: "Cor do Subtitulo",
        options: ["default", "muted", "primary", "white", "custom"],
        default: "muted",
      },
      subtitleCustomColor: { type: "string", label: "Cor Personalizada do Subtitulo (hex)" },
      subtitleSize: {
        type: "select",
        label: "Tamanho do Subtitulo",
        options: ["small", "base", "large", "xl"],
        default: "large",
      },

      // Description Styling
      descriptionColor: {
        type: "select",
        label: "Cor da Descricao",
        options: ["default", "muted", "primary", "white", "custom"],
        default: "muted",
      },
      descriptionCustomColor: { type: "string", label: "Cor Personalizada da Descricao (hex)" },
      descriptionSize: {
        type: "select",
        label: "Tamanho da Descricao",
        options: ["small", "base", "large"],
        default: "base",
      },

      // Badge Styling
      badgeColor: {
        type: "select",
        label: "Cor do Badge",
        options: ["amber", "primary", "secondary", "success", "destructive"],
        default: "amber",
      },

      // Layout & Background
      background: { type: "image", label: "Imagem de Fundo" },
      backgroundColor: {
        type: "select",
        label: "Cor de Fundo",
        options: ["none", "gradient", "muted", "amber", "primary", "dark"],
        default: "none",
      },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center", "right"],
        default: "center",
      },
      size: {
        type: "select",
        label: "Altura",
        options: ["small", "medium", "large", "full"],
        default: "large",
      },
      overlayOpacity: {
        type: "number",
        label: "Opacidade do Overlay",
        default: 0.5,
      },
    },
    defaultProps: {
      title: "Welcome to My Portfolio",
      subtitle: "Full-Stack Developer & Designer",
      alignment: "center",
      backgroundColor: "gradient",
      size: "large",
      titleColor: "default",
      titleSize: "large",
      titleWeight: "bold",
      subtitleColor: "muted",
      subtitleSize: "large",
      descriptionColor: "muted",
      descriptionSize: "base",
      badgeColor: "amber",
      overlayOpacity: 0.5,
    },
  },
  text: {
    name: "Text Block",
    category: "content",
    schema: {
      content: { type: "richtext", label: "Content", required: true },
      alignment: {
        type: "select",
        label: "Alignment",
        options: ["left", "center", "right"],
        default: "left",
      },
    },
    defaultProps: {
      content: "<p>This is a sample text block. You can add rich text content here.</p>",
      alignment: "left",
    },
  },
  image: {
    name: "Image",
    category: "media",
    schema: {
      src: { type: "image", label: "Image", required: true },
      alt: { type: "string", label: "Alt Text" },
      caption: { type: "string", label: "Caption" },
      size: {
        type: "select",
        label: "Size",
        options: ["small", "medium", "large", "full"],
        default: "large",
      },
      rounded: {
        type: "select",
        label: "Rounded Corners",
        options: ["none", "small", "medium", "large"],
        default: "medium",
      },
      shadow: {
        type: "boolean",
        label: "Show Shadow",
        default: true,
      },
    },
    defaultProps: {
      src: "",
      alt: "Image",
      size: "large",
      rounded: "medium",
      shadow: true,
    },
  },
  columns: {
    name: "Colunas",
    category: "layout",
    schema: {
      columns: {
        type: "select",
        label: "Numero de Colunas",
        options: ["2", "3", "4"],
        default: "2",
      },
      gap: {
        type: "select",
        label: "Espacamento",
        options: ["small", "medium", "large"],
        default: "medium",
      },
      style: {
        type: "select",
        label: "Estilo",
        options: ["simple", "cards", "bordered"],
        default: "cards",
      },
      verticalAlign: {
        type: "select",
        label: "Alinhamento Vertical",
        options: ["top", "center", "bottom"],
        default: "top",
      },
      items: {
        type: "repeater",
        label: "Itens das Colunas",
        default: [],
        itemSchema: {
          title: { type: "string", label: "Titulo (opcional)" },
          content: { type: "richtext", label: "Conteudo (opcional)" },
          blocks: {
            type: "blocks",
            label: "Blocos Aninhados",
            default: [],
          },
        },
      },
    },
    defaultProps: {
      columns: "2",
      gap: "medium",
      style: "cards",
      verticalAlign: "top",
      items: [
        { title: "Coluna 1", content: "<p>Conteudo da primeira coluna</p>", blocks: [] },
        { title: "Coluna 2", content: "<p>Conteudo da segunda coluna</p>", blocks: [] },
      ],
    },
  },
  stats: {
    name: "Stats",
    category: "content",
    schema: {
      title: { type: "string", label: "Title" },
      subtitle: { type: "string", label: "Subtitle" },
      columns: {
        type: "select",
        label: "Columns",
        options: ["2", "3", "4", "5"],
        default: "4",
      },
      style: {
        type: "select",
        label: "Style",
        options: ["simple", "cards", "gradient"],
        default: "gradient",
      },
      stats: {
        type: "repeater",
        label: "Statistics",
        default: [],
        itemSchema: {
          value: { type: "string", label: "Value" },
          label: { type: "string", label: "Label" },
        },
      },
    },
    defaultProps: {
      title: "",
      columns: "4",
      style: "gradient",
      stats: [
        { value: "50+", label: "Projects" },
        { value: "7+", label: "Years Experience" },
        { value: "100%", label: "Satisfaction" },
        { value: "5", label: "Companies" },
      ],
    },
  },
  features: {
    name: "Features",
    category: "content",
    schema: {
      title: { type: "string", label: "Title" },
      subtitle: { type: "string", label: "Subtitle" },
      columns: {
        type: "select",
        label: "Columns",
        options: ["2", "3", "4"],
        default: "3",
      },
      style: {
        type: "select",
        label: "Style",
        options: ["cards", "minimal", "gradient"],
        default: "cards",
      },
      features: {
        type: "repeater",
        label: "Features",
        default: [],
        itemSchema: {
          title: { type: "string", label: "Title" },
          description: { type: "string", label: "Description" },
          icon: {
            type: "select",
            label: "Icon",
            options: ["rocket", "code", "palette", "lightbulb", "shield", "zap", "chart", "users", "settings", "globe", "database", "layout", "smartphone", "cloud", "lock", "check", "star", "heart"],
            default: "rocket",
          },
        },
      },
    },
    defaultProps: {
      title: "Features",
      columns: "3",
      style: "cards",
      features: [
        { title: "Feature 1", description: "Description for feature 1", icon: "rocket" },
        { title: "Feature 2", description: "Description for feature 2", icon: "palette" },
        { title: "Feature 3", description: "Description for feature 3", icon: "code" },
      ],
    },
  },
  "services-grid": {
    name: "Services Grid",
    category: "content",
    schema: {
      title: { type: "string", label: "Section Title" },
      services: {
        type: "repeater",
        label: "Services",
        default: [],
        itemSchema: {
          title: { type: "string", label: "Title" },
          description: { type: "string", label: "Description" },
          icon: {
            type: "select",
            label: "Icon",
            options: ["rocket", "code", "palette", "lightbulb", "shield", "zap", "chart", "users", "settings", "globe", "database", "layout", "smartphone", "cloud", "lock", "check", "star", "heart"],
            default: "rocket",
          },
        },
      },
      columns: {
        type: "select",
        label: "Columns",
        options: ["2", "3", "4"],
        default: "3",
      },
    },
    defaultProps: {
      title: "My Services",
      columns: "3",
      services: [
        { title: "Web Development", description: "Modern web applications", icon: "code" },
        { title: "UI/UX Design", description: "Beautiful interfaces", icon: "palette" },
        { title: "Consulting", description: "Technical guidance", icon: "lightbulb" },
      ],
    },
  },
  "figma-embed": {
    name: "Figma Embed",
    category: "media",
    schema: {
      url: { type: "string", label: "URL do Figma", required: true },
      height: {
        type: "select",
        label: "Altura",
        options: ["small", "medium", "large", "full"],
        default: "large",
      },
      hideUI: {
        type: "boolean",
        label: "Esconder UI do Figma",
        default: false,
      },
      allowFullscreen: {
        type: "boolean",
        label: "Permitir Fullscreen",
        default: true,
      },
      caption: { type: "string", label: "Legenda" },
    },
    defaultProps: {
      url: "",
      height: "large",
      hideUI: false,
      allowFullscreen: true,
      caption: "",
    },
  },
  testimonials: {
    name: "Testimonials",
    category: "content",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      columns: {
        type: "select",
        label: "Colunas",
        options: ["1", "2", "3"],
        default: "2",
      },
      style: {
        type: "select",
        label: "Estilo",
        options: ["cards", "minimal", "bubble"],
        default: "cards",
      },
      showRating: {
        type: "boolean",
        label: "Mostrar Avaliacao",
        default: true,
      },
      testimonials: {
        type: "repeater",
        label: "Depoimentos",
        default: [],
        itemSchema: {
          quote: { type: "richtext", label: "Depoimento" },
          name: { type: "string", label: "Nome" },
          role: { type: "string", label: "Cargo/Empresa" },
          avatar: { type: "string", label: "URL do Avatar" },
          rating: {
            type: "select",
            label: "Avaliacao",
            options: ["1", "2", "3", "4", "5"],
            default: "5",
          },
        },
      },
    },
    defaultProps: {
      title: "O que dizem sobre mim",
      columns: "2",
      style: "cards",
      showRating: true,
      testimonials: [],
    },
  },
  accordion: {
    name: "Accordion/FAQ",
    category: "content",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      style: {
        type: "select",
        label: "Estilo",
        options: ["simple", "bordered", "separated"],
        default: "bordered",
      },
      allowMultiple: {
        type: "boolean",
        label: "Permitir Multiplos Abertos",
        default: false,
      },
      defaultOpen: {
        type: "boolean",
        label: "Primeiro Aberto por Padrao",
        default: false,
      },
      items: {
        type: "repeater",
        label: "Itens",
        default: [],
        itemSchema: {
          title: { type: "string", label: "Pergunta" },
          content: { type: "richtext", label: "Resposta" },
        },
      },
    },
    defaultProps: {
      title: "Perguntas Frequentes",
      style: "bordered",
      allowMultiple: false,
      defaultOpen: false,
      items: [],
    },
  },
  "video-embed": {
    name: "Video Embed",
    category: "media",
    schema: {
      url: { type: "string", label: "URL do Video", required: true },
      caption: { type: "string", label: "Legenda" },
      size: {
        type: "select",
        label: "Tamanho",
        options: ["small", "medium", "large", "full"],
        default: "large",
      },
      aspectRatio: {
        type: "select",
        label: "Proporcao",
        options: ["16:9", "4:3", "1:1", "9:16"],
        default: "16:9",
      },
      autoplay: {
        type: "boolean",
        label: "Autoplay",
        default: false,
      },
      muted: {
        type: "boolean",
        label: "Mudo",
        default: false,
      },
      loop: {
        type: "boolean",
        label: "Loop",
        default: false,
      },
    },
    defaultProps: {
      url: "",
      caption: "",
      size: "large",
      aspectRatio: "16:9",
      autoplay: false,
      muted: false,
      loop: false,
    },
  },
  cta: {
    name: "Call to Action",
    category: "content",
    schema: {
      title: { type: "string", label: "Titulo", required: true },
      description: { type: "richtext", label: "Descricao" },
      buttonText: { type: "string", label: "Texto do Botao Principal" },
      buttonUrl: { type: "string", label: "URL do Botao Principal" },
      secondaryButtonText: { type: "string", label: "Texto do Botao Secundario" },
      secondaryButtonUrl: { type: "string", label: "URL do Botao Secundario" },
      style: {
        type: "select",
        label: "Estilo",
        options: ["simple", "gradient", "bordered", "image"],
        default: "gradient",
      },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center", "right"],
        default: "center",
      },
      backgroundImage: { type: "image", label: "Imagem de Fundo" },
    },
    defaultProps: {
      title: "Pronto para comecar?",
      description: "Entre em contato e vamos conversar sobre seu projeto.",
      buttonText: "Fale Comigo",
      buttonUrl: "#contato",
      style: "gradient",
      alignment: "center",
    },
  },
  pricing: {
    name: "Pricing",
    category: "content",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      columns: {
        type: "select",
        label: "Colunas",
        options: ["2", "3", "4"],
        default: "3",
      },
      style: {
        type: "select",
        label: "Estilo",
        options: ["simple", "cards", "gradient"],
        default: "cards",
      },
      plans: {
        type: "repeater",
        label: "Planos",
        default: [],
        itemSchema: {
          name: { type: "string", label: "Nome do Plano" },
          price: { type: "string", label: "Preco" },
          period: { type: "string", label: "Periodo" },
          description: { type: "string", label: "Descricao" },
          features: { type: "richtext", label: "Features (uma por linha)" },
          buttonText: { type: "string", label: "Texto do Botao" },
          buttonUrl: { type: "string", label: "URL do Botao" },
          highlighted: {
            type: "select",
            label: "Destacar",
            options: ["false", "true"],
            default: "false",
          },
        },
      },
    },
    defaultProps: {
      title: "Planos e Precos",
      columns: "3",
      style: "cards",
      plans: [],
    },
  },
  divider: {
    name: "Divider",
    category: "layout",
    schema: {
      style: {
        type: "select",
        label: "Estilo",
        options: ["line", "dashed", "dotted", "gradient", "wave", "spacer"],
        default: "line",
      },
      size: {
        type: "select",
        label: "Tamanho",
        options: ["small", "medium", "large"],
        default: "medium",
      },
      color: {
        type: "select",
        label: "Cor",
        options: ["default", "primary", "muted"],
        default: "default",
      },
      width: {
        type: "select",
        label: "Largura",
        options: ["full", "wide", "medium", "narrow"],
        default: "full",
      },
      icon: {
        type: "select",
        label: "Icone Central",
        options: ["none", "star", "diamond", "circle", "dot"],
        default: "none",
      },
    },
    defaultProps: {
      style: "line",
      size: "medium",
      color: "default",
      width: "full",
      icon: "none",
    },
  },
  section: {
    name: "Section",
    category: "layout",
    schema: {
      layout: {
        type: "select",
        label: "Layout",
        options: ["full", "boxed", "wide"],
        default: "boxed",
      },
      minHeight: {
        type: "select",
        label: "Altura Minima",
        options: ["none", "small", "medium", "large", "full"],
        default: "none",
      },
      verticalAlign: {
        type: "select",
        label: "Alinhamento Vertical",
        options: ["top", "center", "bottom"],
        default: "center",
      },
      horizontalAlign: {
        type: "select",
        label: "Alinhamento Horizontal",
        options: ["left", "center", "right"],
        default: "center",
      },
      backgroundColor: {
        type: "select",
        label: "Cor de Fundo",
        options: ["none", "white", "muted", "primary", "dark", "gradient", "amber"],
        default: "none",
      },
      backgroundImage: {
        type: "image",
        label: "Imagem de Fundo",
      },
      backgroundOverlay: {
        type: "select",
        label: "Overlay",
        options: ["none", "light", "dark", "gradient"],
        default: "none",
      },
      overlayOpacity: {
        type: "number",
        label: "Opacidade do Overlay",
        default: 0.5,
      },
      paddingTop: {
        type: "select",
        label: "Padding Superior",
        options: ["none", "small", "medium", "large", "xlarge"],
        default: "medium",
      },
      paddingBottom: {
        type: "select",
        label: "Padding Inferior",
        options: ["none", "small", "medium", "large", "xlarge"],
        default: "medium",
      },
      content: {
        type: "repeater",
        label: "Elementos de Conteudo",
        default: [],
        itemSchema: {
          type: {
            type: "select",
            label: "Tipo",
            options: ["badge", "heading", "text", "button", "spacer"],
            default: "heading",
          },
          alignment: {
            type: "select",
            label: "Alinhamento",
            options: ["left", "center", "right"],
            default: "center",
          },
          maxWidth: {
            type: "select",
            label: "Largura Maxima",
            options: ["none", "sm", "md", "lg", "xl", "2xl"],
            default: "none",
          },
          // Badge
          badgeText: { type: "string", label: "Texto do Badge" },
          badgeColor: {
            type: "select",
            label: "Cor do Badge",
            options: ["amber", "primary", "secondary", "success", "destructive"],
            default: "amber",
          },
          // Heading
          headingText: { type: "string", label: "Texto do Titulo" },
          headingSize: {
            type: "select",
            label: "Tamanho do Titulo",
            options: ["h1", "h2", "h3", "h4"],
            default: "h2",
          },
          headingColor: {
            type: "select",
            label: "Cor do Titulo",
            options: ["default", "primary", "muted", "white", "amber", "custom"],
            default: "default",
          },
          headingCustomColor: { type: "string", label: "Cor Personalizada (hex)" },
          headingWeight: {
            type: "select",
            label: "Peso da Fonte",
            options: ["normal", "medium", "semibold", "bold", "extrabold"],
            default: "bold",
          },
          // Text
          text: { type: "richtext", label: "Texto" },
          textColor: {
            type: "select",
            label: "Cor do Texto",
            options: ["default", "muted", "primary", "white", "custom"],
            default: "muted",
          },
          textCustomColor: { type: "string", label: "Cor Personalizada (hex)" },
          textSize: {
            type: "select",
            label: "Tamanho do Texto",
            options: ["small", "base", "large", "xl"],
            default: "large",
          },
          // Button
          buttonText: { type: "string", label: "Texto do Botao" },
          buttonUrl: { type: "string", label: "URL do Botao" },
          buttonStyle: {
            type: "select",
            label: "Estilo do Botao",
            options: ["primary", "secondary", "outline", "ghost"],
            default: "primary",
          },
          buttonSize: {
            type: "select",
            label: "Tamanho do Botao",
            options: ["small", "medium", "large"],
            default: "medium",
          },
          // Spacer
          spacerSize: {
            type: "select",
            label: "Tamanho do Espacador",
            options: ["small", "medium", "large", "xlarge"],
            default: "medium",
          },
        },
      },
    },
    defaultProps: {
      layout: "boxed",
      minHeight: "medium",
      verticalAlign: "center",
      horizontalAlign: "center",
      backgroundColor: "gradient",
      paddingTop: "large",
      paddingBottom: "large",
      content: [
        { type: "badge", badgeText: "Novo", badgeColor: "amber", alignment: "center" },
        { type: "heading", headingText: "Bem-vindo", headingSize: "h1", headingWeight: "bold", headingColor: "default", alignment: "center" },
        { type: "text", text: "<p>Descricao da secao aqui.</p>", textColor: "muted", textSize: "large", alignment: "center" },
        { type: "spacer", spacerSize: "small" },
        { type: "button", buttonText: "Saiba Mais", buttonUrl: "#", buttonStyle: "primary", buttonSize: "medium", alignment: "center" },
      ],
    },
  },
  counter: {
    name: "Counter",
    category: "interactive",
    schema: {
      startValue: { type: "number", label: "Valor Inicial", default: 0 },
      endValue: { type: "number", label: "Valor Final", default: 100 },
      duration: { type: "number", label: "Duracao (ms)", default: 2000 },
      prefix: { type: "string", label: "Prefixo" },
      suffix: { type: "string", label: "Sufixo" },
      title: { type: "string", label: "Titulo" },
      titleColor: {
        type: "select",
        label: "Cor do Titulo",
        options: ["default", "muted", "primary", "white"],
        default: "muted",
      },
      numberColor: {
        type: "select",
        label: "Cor do Numero",
        options: ["default", "primary", "amber", "white"],
        default: "primary",
      },
      numberSize: {
        type: "select",
        label: "Tamanho",
        options: ["small", "medium", "large", "xlarge"],
        default: "large",
      },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center", "right"],
        default: "center",
      },
    },
    defaultProps: {
      startValue: 0,
      endValue: 100,
      duration: 2000,
      prefix: "",
      suffix: "+",
      title: "Projetos Concluidos",
      titleColor: "muted",
      numberColor: "primary",
      numberSize: "large",
      alignment: "center",
    },
  },
  "progress-bar": {
    name: "Progress Bar",
    category: "interactive",
    schema: {
      label: { type: "string", label: "Label" },
      value: { type: "number", label: "Valor", default: 75 },
      maxValue: { type: "number", label: "Valor Maximo", default: 100 },
      showPercentage: { type: "boolean", label: "Mostrar Porcentagem", default: true },
      barColor: {
        type: "select",
        label: "Cor da Barra",
        options: ["primary", "amber", "green", "red", "blue"],
        default: "primary",
      },
      barHeight: {
        type: "select",
        label: "Altura",
        options: ["thin", "medium", "thick"],
        default: "medium",
      },
      animated: { type: "boolean", label: "Animado", default: true },
    },
    defaultProps: {
      label: "Progresso",
      value: 75,
      maxValue: 100,
      showPercentage: true,
      barColor: "primary",
      barHeight: "medium",
      animated: true,
    },
  },
  tabs: {
    name: "Tabs",
    category: "interactive",
    schema: {
      tabs: {
        type: "repeater",
        label: "Tabs",
        default: [],
        itemSchema: {
          title: { type: "string", label: "Titulo" },
          content: { type: "richtext", label: "Conteudo" },
        },
      },
      defaultTab: { type: "number", label: "Tab Padrao", default: 0 },
      tabStyle: {
        type: "select",
        label: "Estilo",
        options: ["default", "pills", "underline"],
        default: "default",
      },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center", "right"],
        default: "left",
      },
    },
    defaultProps: {
      tabs: [
        { title: "Tab 1", content: "<p>Conteudo da primeira tab</p>" },
        { title: "Tab 2", content: "<p>Conteudo da segunda tab</p>" },
        { title: "Tab 3", content: "<p>Conteudo da terceira tab</p>" },
      ],
      defaultTab: 0,
      tabStyle: "default",
      alignment: "left",
    },
  },
  toggle: {
    name: "Toggle/FAQ",
    category: "interactive",
    schema: {
      items: {
        type: "repeater",
        label: "Items",
        default: [],
        itemSchema: {
          title: { type: "string", label: "Titulo" },
          content: { type: "richtext", label: "Conteudo" },
          defaultOpen: { type: "boolean", label: "Aberto por Padrao", default: false },
        },
      },
      allowMultiple: { type: "boolean", label: "Permitir Multiplos", default: true },
      iconPosition: {
        type: "select",
        label: "Posicao do Icone",
        options: ["left", "right"],
        default: "right",
      },
      borderStyle: {
        type: "select",
        label: "Estilo de Borda",
        options: ["none", "bordered", "separated"],
        default: "bordered",
      },
    },
    defaultProps: {
      items: [
        { title: "Item 1", content: "<p>Conteudo do primeiro item</p>", defaultOpen: true },
        { title: "Item 2", content: "<p>Conteudo do segundo item</p>" },
        { title: "Item 3", content: "<p>Conteudo do terceiro item</p>" },
      ],
      allowMultiple: true,
      iconPosition: "right",
      borderStyle: "bordered",
    },
  },
  countdown: {
    name: "Countdown",
    category: "interactive",
    schema: {
      targetDate: { type: "string", label: "Data Alvo (ISO)" },
      showDays: { type: "boolean", label: "Mostrar Dias", default: true },
      showHours: { type: "boolean", label: "Mostrar Horas", default: true },
      showMinutes: { type: "boolean", label: "Mostrar Minutos", default: true },
      showSeconds: { type: "boolean", label: "Mostrar Segundos", default: true },
      style: {
        type: "select",
        label: "Estilo",
        options: ["boxes", "inline", "minimal"],
        default: "boxes",
      },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center", "right"],
        default: "center",
      },
      expiredMessage: { type: "string", label: "Mensagem Expirado", default: "Tempo esgotado!" },
    },
    defaultProps: {
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      style: "boxes",
      alignment: "center",
      expiredMessage: "Tempo esgotado!",
    },
  },
  "logo-cloud": {
    name: "Logo Cloud",
    category: "content",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      logos: {
        type: "repeater",
        label: "Logos",
        default: [],
        itemSchema: {
          name: { type: "string", label: "Nome" },
          imageUrl: { type: "image", label: "Imagem" },
          link: { type: "string", label: "Link" },
        },
      },
      columns: {
        type: "select",
        label: "Colunas",
        options: [3, 4, 5, 6],
        default: 5,
      },
      grayscale: { type: "boolean", label: "Escala de Cinza", default: true },
      animated: { type: "boolean", label: "Animado", default: true },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center", "right"],
        default: "center",
      },
    },
    defaultProps: {
      title: "Empresas que confiam em nos",
      logos: [],
      columns: 5,
      grayscale: true,
      animated: true,
      alignment: "center",
    },
  },
  team: {
    name: "Equipe",
    category: "content",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      members: {
        type: "repeater",
        label: "Membros",
        default: [],
        itemSchema: {
          name: { type: "string", label: "Nome" },
          role: { type: "string", label: "Cargo" },
          image: { type: "image", label: "Foto" },
          bio: { type: "textarea", label: "Bio" },
          linkedin: { type: "string", label: "LinkedIn" },
          twitter: { type: "string", label: "Twitter" },
          github: { type: "string", label: "GitHub" },
          email: { type: "string", label: "Email" },
        },
      },
      columns: {
        type: "select",
        label: "Colunas",
        options: [2, 3, 4],
        default: 3,
      },
      style: {
        type: "select",
        label: "Estilo",
        options: ["cards", "minimal", "detailed"],
        default: "cards",
      },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center", "right"],
        default: "center",
      },
    },
    defaultProps: {
      title: "Nossa Equipe",
      subtitle: "Conheca os profissionais por tras do sucesso",
      members: [],
      columns: 3,
      style: "cards",
      alignment: "center",
    },
  },
  timeline: {
    name: "Timeline",
    category: "content",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      items: {
        type: "repeater",
        label: "Itens",
        default: [],
        itemSchema: {
          title: { type: "string", label: "Titulo" },
          description: { type: "textarea", label: "Descricao" },
          date: { type: "string", label: "Data" },
          completed: { type: "boolean", label: "Concluido", default: true },
        },
      },
      style: {
        type: "select",
        label: "Estilo",
        options: ["default", "alternating", "compact"],
        default: "default",
      },
      lineColor: {
        type: "select",
        label: "Cor da Linha",
        options: ["primary", "muted", "gradient"],
        default: "primary",
      },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center"],
        default: "left",
      },
    },
    defaultProps: {
      title: "Nossa Historia",
      items: [],
      style: "default",
      lineColor: "primary",
      alignment: "left",
    },
  },
  gallery: {
    name: "Galeria",
    category: "media",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      images: {
        type: "repeater",
        label: "Imagens",
        default: [],
        itemSchema: {
          src: { type: "image", label: "Imagem" },
          alt: { type: "string", label: "Alt Text" },
          caption: { type: "string", label: "Legenda" },
        },
      },
      columns: {
        type: "select",
        label: "Colunas",
        options: [2, 3, 4],
        default: 3,
      },
      gap: {
        type: "select",
        label: "Espacamento",
        options: ["small", "medium", "large"],
        default: "medium",
      },
      style: {
        type: "select",
        label: "Estilo",
        options: ["grid", "masonry", "carousel"],
        default: "grid",
      },
      lightbox: { type: "boolean", label: "Lightbox", default: true },
      rounded: { type: "boolean", label: "Arredondado", default: true },
      aspectRatio: {
        type: "select",
        label: "Proporcao",
        options: ["square", "video", "portrait", "auto"],
        default: "square",
      },
    },
    defaultProps: {
      images: [],
      columns: 3,
      gap: "medium",
      style: "grid",
      lightbox: true,
      rounded: true,
      aspectRatio: "square",
    },
  },
  form: {
    name: "Formulario",
    category: "interactive",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      fields: {
        type: "repeater",
        label: "Campos",
        default: [],
        itemSchema: {
          name: { type: "string", label: "Nome do Campo" },
          label: { type: "string", label: "Label" },
          type: {
            type: "select",
            label: "Tipo",
            options: ["text", "email", "tel", "textarea", "select"],
            default: "text",
          },
          placeholder: { type: "string", label: "Placeholder" },
          required: { type: "boolean", label: "Obrigatorio", default: false },
        },
      },
      submitText: { type: "string", label: "Texto do Botao", default: "Enviar Mensagem" },
      successMessage: { type: "string", label: "Mensagem de Sucesso" },
      formAction: { type: "string", label: "URL de Acao" },
      style: {
        type: "select",
        label: "Estilo",
        options: ["default", "inline", "minimal"],
        default: "default",
      },
      alignment: {
        type: "select",
        label: "Alinhamento",
        options: ["left", "center", "right"],
        default: "center",
      },
    },
    defaultProps: {
      title: "Entre em Contato",
      subtitle: "Preencha o formulario e entraremos em contato em breve.",
      fields: [],
      submitText: "Enviar Mensagem",
      successMessage: "Mensagem enviada com sucesso!",
      style: "default",
      alignment: "center",
    },
  },
  process: {
    name: "Processo",
    category: "content",
    schema: {
      title: { type: "string", label: "Titulo" },
      subtitle: { type: "string", label: "Subtitulo" },
      style: {
        type: "select",
        label: "Estilo",
        options: ["horizontal", "vertical", "cards"],
        default: "horizontal",
      },
      showConnectors: {
        type: "boolean",
        label: "Mostrar Conectores",
        default: true,
      },
      iconStyle: {
        type: "select",
        label: "Estilo do Icone",
        options: ["circle", "square", "minimal"],
        default: "circle",
      },
      iconColor: {
        type: "select",
        label: "Cor do Icone",
        options: ["amber", "primary", "muted", "gradient"],
        default: "muted",
      },
      steps: {
        type: "repeater",
        label: "Etapas",
        default: [],
        itemSchema: {
          title: { type: "string", label: "Titulo" },
          description: { type: "string", label: "Descricao" },
          icon: {
            type: "select",
            label: "Icone",
            options: ["search", "target", "lightbulb", "pentool", "check", "rocket", "code", "palette", "users", "settings", "zap", "chart", "shield", "globe", "database", "layout", "lock"],
            default: "search",
          },
        },
      },
    },
    defaultProps: {
      title: "Nosso Processo",
      style: "horizontal",
      showConnectors: true,
      iconStyle: "circle",
      iconColor: "amber",
      steps: [
        { title: "Pesquisa", description: "Entender o problema e contexto", icon: "search" },
        { title: "Definicao", description: "Definir objetivos claros", icon: "target" },
        { title: "Ideacao", description: "Gerar solucoes criativas", icon: "lightbulb" },
        { title: "Design", description: "Prototipar e refinar", icon: "pentool" },
        { title: "Teste", description: "Validar com usuarios", icon: "check" },
      ],
    },
  },
};
