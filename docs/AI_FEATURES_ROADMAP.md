# Revuu - AI Features Roadmap

> Documento com ideias de funcionalidades de Inteligência Artificial para implementação futura usando OpenAI.

## Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ AI Chat      │  │ AI Generators│  │ AI Analysis Tools    │  │
│  │ Component    │  │ (Bio, Case)  │  │ (Resume, Portfolio)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
└─────────┼─────────────────┼─────────────────────┼───────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    AI Service Layer                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐  │   │
│  │  │ OpenAI     │  │ Embeddings │  │ Prompt Templates   │  │   │
│  │  │ Client     │  │ Service    │  │ Manager            │  │   │
│  │  └─────┬──────┘  └─────┬──────┘  └─────────┬──────────┘  │   │
│  └────────┼───────────────┼───────────────────┼─────────────┘   │
│           │               │                   │                  │
│  ┌────────▼───────────────▼───────────────────▼─────────────┐   │
│  │              Vector Database (pgvector)                   │   │
│  │         Para RAG - Embeddings do Portfolio               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Funcionalidades por Prioridade

### Alta Prioridade (MVP de IA)

#### 1. Chat Inteligente no Portfolio ⭐ FAVORITO
**Descrição:** Visitantes podem conversar com um chatbot que conhece todo o portfolio do usuario. Usa RAG (Retrieval Augmented Generation) para responder perguntas sobre experiencias, projetos, habilidades.

**Exemplos de uso:**
- "Quais projetos o Angelo fez com React?"
- "Ele tem experiencia com backend?"
- "Quanto tempo de experiencia em design?"

**Implementacao:**
- Gerar embeddings de todo o portfolio (profile, experiences, projects, skills, pages)
- Armazenar em pgvector
- Quando visitante perguntar, buscar contexto relevante e enviar para GPT
- Streaming de resposta para UX fluida

**Modelo:** GPT-4o-mini (custo-beneficio) ou GPT-4o para respostas mais complexas

---

#### 2. Gerador de Bio Profissional
**Descrição:** Gera bio otimizada baseada nas experiencias e skills do usuario.

**Input:** Experiencias, skills, tom desejado (formal, casual, criativo)
**Output:** Bio de 2-3 paragrafos

**Prompt base:**
```
Baseado nas seguintes experiencias e habilidades, gere uma bio profissional
{tom} para um portfolio. A bio deve destacar os pontos fortes e ser atraente
para recrutadores.
```

---

#### 3. Melhorador de Texto
**Descrição:** Melhora descricoes de projetos, experiencias e textos gerais.

**Opcoes:**
- Tornar mais profissional
- Tornar mais conciso
- Adicionar palavras-chave
- Corrigir gramatica

---

### Media Prioridade

#### 4. Gerador de Case Study
**Descrição:** Transforma informacoes basicas de um projeto em um case study completo.

**Input:** Nome do projeto, descricao curta, tecnologias, resultados
**Output:** Case study estruturado com:
- Contexto/Desafio
- Solucao
- Processo
- Resultados
- Aprendizados

---

#### 5. Analise de Curriculo (Upload PDF)
**Descrição:** Usuario faz upload de CV em PDF, IA extrai informacoes e sugere como preencher o portfolio.

**Funcionalidades:**
- Parsing de PDF
- Extracao de experiencias, educacao, skills
- Sugestoes de melhoria
- Importacao automatica para o portfolio

---

#### 6. Portfolio Coach
**Descrição:** IA analisa o portfolio e da feedback personalizado.

**Analisa:**
- Completude (secoes faltando)
- Qualidade dos textos
- SEO das descricoes
- Ordem das experiencias
- Projetos em destaque

**Output:** Lista de sugestoes priorizadas com explicacao

---

#### 7. Gerador de Cover Letter
**Descrição:** Gera carta de apresentacao personalizada para uma vaga.

**Input:** URL ou descricao da vaga + portfolio do usuario
**Output:** Cover letter personalizada destacando experiencias relevantes

---

#### 8. Match de Vagas
**Descrição:** Analisa vagas e mostra % de compatibilidade com o perfil.

**Funcionalidades:**
- Colar descricao de vaga
- IA compara com skills/experiencias
- Mostra % match
- Destaca gaps e pontos fortes
- Sugere como apresentar experiencias

---

### Baixa Prioridade (Futuro)

#### 9. Simulador de Entrevista
**Descrição:** Chat que simula entrevista tecnica ou comportamental.

**Tipos:**
- Entrevista comportamental (STAR method)
- Entrevista tecnica (baseada nas skills)
- Perguntas sobre projetos do portfolio

**Features:**
- Feedback em tempo real
- Pontuacao
- Sugestoes de melhoria nas respostas

---

#### 10. Persona do Recrutador
**Descrição:** IA simula como diferentes recrutadores veriam o portfolio.

**Personas:**
- Tech Recruiter de startup
- HR de empresa tradicional
- Tech Lead avaliando candidato
- Headhunter de executive search

**Output:** Feedback do ponto de vista de cada persona

---

#### 11. Story Generator para Projetos
**Descrição:** Transforma bullet points em narrativa envolvente.

**Input:** Lista de features/resultados do projeto
**Output:** Historia do projeto contada de forma envolvente

---

#### 12. Network Suggester
**Descrição:** Baseado no perfil, sugere pessoas para conectar no LinkedIn.

**Analisa:** Skills, industria, objetivos de carreira
**Sugere:** Tipos de pessoas para networking estrategico

---

#### 13. Portfolio A/B Tester com IA
**Descrição:** Gera variacoes de textos para testes A/B.

**Funcionalidades:**
- Gera 3 versoes de headlines
- Gera variacoes de CTAs
- Sugere ordem diferente de secoes
- Tracking de qual versao performa melhor

---

#### 14. Salary Negotiator
**Descrição:** Ajuda a preparar negociacao salarial.

**Input:** Cargo desejado, experiencia, localizacao
**Output:**
- Faixa salarial de mercado
- Argumentos baseados no portfolio
- Scripts de negociacao
- Como responder contra-ofertas

---

#### 15. Portfolio Narrator (Audio)
**Descrição:** Gera versao em audio do portfolio.

**Usa:** OpenAI TTS (Text-to-Speech)
**Output:** Audio de 2-3 minutos resumindo o portfolio

**Util para:** Acessibilidade, LinkedIn voice messages

---

#### 16. Competitive Analysis
**Descrição:** Compara portfolio com outros profissionais da area.

**Analisa:**
- Portfolios publicos similares
- O que esta faltando
- Diferenciais do usuario
- Tendencias do mercado

---

#### 17. Auto-Update de Skills
**Descrição:** Monitora projetos e sugere novas skills.

**Funcionalidades:**
- Analisa descricoes de projetos
- Detecta tecnologias mencionadas
- Sugere adicionar ao perfil
- Mantem skills atualizadas

---

#### 18. Dream Job Roadmap
**Descrição:** Cria plano de carreira personalizado.

**Input:** Cargo dos sonhos
**Output:**
- Skills necessarias vs atuais
- Experiencias recomendadas
- Cursos sugeridos
- Timeline estimada
- Proximos passos concretos

---

#### 19. Referral Request Generator
**Descrição:** Gera mensagens para pedir recomendacoes.

**Input:** Pessoa que vai recomendar, contexto do trabalho junto
**Output:** Mensagem personalizada pedindo recomendacao no LinkedIn

---

#### 20. Portfolio Insights Dashboard
**Descrição:** Dashboard com insights de IA sobre o portfolio.

**Metricas:**
- Score geral do portfolio
- Areas de melhoria
- Comparativo com mercado
- Tendencias de visualizacao
- Keywords mais relevantes

---

#### 21. Micro-Credentials Generator
**Descrição:** Gera badges/certificados de skills verificadas.

**Funcionalidades:**
- Quiz gerado por IA para cada skill
- Badge ao passar
- Verificacao de conhecimento real
- Integracao com LinkedIn

---

#### 22. Interview Thank You Generator
**Descrição:** Gera email de agradecimento pos-entrevista.

**Input:** Detalhes da entrevista, pontos discutidos
**Output:** Email personalizado de follow-up

---

#### 23. Portfolio Remix
**Descrição:** Reorganiza portfolio para diferentes objetivos.

**Modos:**
- Focado em Frontend
- Focado em Backend
- Focado em Design
- Focado em Lideranca

**Output:** Sugestao de ordem e destaque de conteudos diferentes

---

## Implementacao Tecnica

### Stack Recomendada

```typescript
// Backend Service
interface AIService {
  // Core
  generateCompletion(prompt: string, options?: CompletionOptions): Promise<string>;
  generateEmbedding(text: string): Promise<number[]>;
  streamCompletion(prompt: string, onChunk: (chunk: string) => void): Promise<void>;

  // Features
  generateBio(userId: string, tone: 'formal' | 'casual' | 'creative'): Promise<string>;
  generateCaseStudy(projectId: string): Promise<CaseStudy>;
  analyzeResume(pdfBuffer: Buffer): Promise<ResumeAnalysis>;
  chatWithPortfolio(userId: string, question: string): Promise<string>;
  matchJob(userId: string, jobDescription: string): Promise<JobMatch>;
}
```

### Modelos Recomendados

| Feature | Modelo | Justificativa |
|---------|--------|---------------|
| Chat Portfolio | GPT-4o-mini | Custo-beneficio, bom para RAG |
| Geradores de Texto | GPT-4o-mini | Rapido e barato |
| Analise Complexa | GPT-4o | Melhor raciocinio |
| Embeddings | text-embedding-3-small | Otimo custo-beneficio |
| Audio | tts-1 ou tts-1-hd | Qualidade vs custo |

### Custos Estimados (por 1000 requests)

| Feature | Modelo | Custo Estimado |
|---------|--------|----------------|
| Chat (RAG) | GPT-4o-mini | ~$0.50 |
| Bio Generator | GPT-4o-mini | ~$0.20 |
| Case Study | GPT-4o-mini | ~$0.30 |
| Resume Analysis | GPT-4o | ~$5.00 |
| Embeddings | text-embedding-3-small | ~$0.02 |

---

## Plano de Implementacao

### Fase 1 - Fundacao (2-3 sprints)
1. Setup OpenAI client no backend
2. Implementar AI Service base
3. Setup pgvector para embeddings
4. Criar sistema de rate limiting por plano

### Fase 2 - Features Basicas (2-3 sprints)
1. Melhorador de texto
2. Gerador de bio
3. Gerador de descricao de projeto

### Fase 3 - Chat Portfolio (3-4 sprints)
1. Sistema de embeddings do portfolio
2. RAG pipeline
3. Chat UI com streaming
4. Historico de conversas

### Fase 4 - Features Avancadas (ongoing)
1. Analise de curriculo
2. Match de vagas
3. Portfolio coach
4. Demais features por prioridade

---

## Consideracoes

### Privacidade
- Dados do usuario so sao enviados para OpenAI com consentimento
- Opcao de opt-out de features de IA
- Nao armazenar conversas com visitantes (apenas usuario)

### Limites por Plano
| Plano | Limite Mensal |
|-------|---------------|
| Free | 10 requests |
| Pro | 100 requests |
| Business | 1000 requests |

### Monetizacao
- Features de IA como diferencial do plano Pro/Business
- Possivel pacote adicional de creditos de IA

---

*Documento criado em: Dezembro 2024*
*Ultima atualizacao: Dezembro 2024*
