<p align="center">
  <img src="frontend/public/revuuLogo.png" alt="Revuu Logo" width="300" />
</p>

<h1 align="center">Revuu</h1>

<p align="center">
  <em>Pronuncia-se "Review" - Plataforma de portfolios profissionais</em>
</p>

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#instalacao">Instalacao</a> •
  <a href="#estrutura">Estrutura</a>
</p>

---

## Sobre

**Revuu** e uma plataforma moderna para criacao de portfolios e landing pages profissionais. Com um editor visual intuitivo e templates personalizaveis, qualquer pessoa pode criar sua presenca online em minutos.

### Por que Revuu?

- **Simples**: Editor drag-and-drop sem necessidade de codigo
- **Profissional**: Templates modernos e responsivos
- **Rapido**: Deploy em segundos com URLs personalizadas
- **Flexivel**: Blocos customizaveis para qualquer tipo de conteudo

---

## Funcionalidades

- **Editor Visual** - Arraste e solte blocos para construir sua pagina
- **6 Templates** - Modern, Minimal, Classic, Bento, Terminal e Gradient
- **Cores e Fontes** - Personalize com diferentes paletas e tipografias
- **Responsivo** - Visualizacao perfeita em qualquer dispositivo
- **Multi-usuario** - Cada usuario com seu proprio portfolio
- **Autenticacao** - Sistema seguro com JWT e refresh tokens
- **SEO** - Meta tags e Open Graph configuraveis
- **Upload de Imagens** - Gerenciamento de assets integrado

---

## Tecnologias

### Frontend

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white" alt="Radix UI" />
</p>

### Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
</p>

### Infraestrutura

<p>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</p>

---

## Instalacao

### Pre-requisitos

- Node.js 18+
- pnpm 8+
- PostgreSQL
- Redis (opcional)
- Docker (opcional)

### Desenvolvimento Local

1. **Clone o repositorio**
```bash
git clone https://github.com/angelo-odois/revuu.git
cd revuu
```

2. **Instale as dependencias**
```bash
pnpm install
```

3. **Configure as variaveis de ambiente**

Backend (`backend/.env`):
```env
POSTGRES_URL=postgres://postgres:example@localhost:5432/revuu
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=sua-chave-secreta
UPLOADS_PATH=./uploads
```

Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Inicie os servicos (com Docker)**
```bash
docker-compose up -d
```

5. **Execute as migrations e seed**
```bash
pnpm seed
```

6. **Inicie o desenvolvimento**
```bash
pnpm dev
```

O frontend estara em `http://localhost:3000` e o backend em `http://localhost:3001`.

### Credenciais padrao

- **Email**: admin@postangelo.com
- **Senha**: admin123

---

## Estrutura

```
revuu/
├── frontend/                # Aplicacao Next.js
│   ├── app/                 # App Router (paginas)
│   │   ├── admin/           # Dashboard administrativo
│   │   ├── u/[username]/    # Paginas publicas de usuarios
│   │   └── [slug]/          # Landing pages publicas
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes base (shadcn/ui)
│   │   ├── blocks/          # Blocos do editor
│   │   └── admin/           # Componentes do admin
│   └── lib/                 # Utilitarios e API client
│
├── backend/                 # API Express
│   ├── src/
│   │   ├── entities/        # Entidades TypeORM
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Servicos (Redis, etc)
│   │   └── seeds/           # Dados iniciais
│   └── uploads/             # Arquivos enviados
│
└── docker-compose.yml       # Configuracao Docker
```

---

## API

A documentacao da API esta disponivel em `/api/docs` quando o backend esta rodando.

### Endpoints principais

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/auth/login` | Autenticacao |
| POST | `/api/auth/register` | Registro de usuario |
| GET | `/api/pages` | Listar paginas |
| POST | `/api/pages` | Criar pagina |
| GET | `/api/profile/me` | Perfil do usuario |
| PUT | `/api/profile` | Atualizar perfil |
| GET | `/api/portfolio/:username` | Portfolio publico |

---

## Templates

| Template | Descricao |
|----------|-----------|
| **Modern** | Design limpo e contemporaneo |
| **Minimal** | Minimalista com foco no conteudo |
| **Classic** | Layout tradicional e elegante |
| **Bento** | Grid estilo bento box |
| **Terminal** | Estetica hacker/desenvolvedor |
| **Gradient** | Cores vibrantes com gradientes |

---

## Licenca

MIT

---

<p align="center">
  Feito com ❤️ usando <strong>Revuu</strong>
</p>
