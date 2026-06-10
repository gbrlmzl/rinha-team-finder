# ⚔️ Rinha Team Finder

**Encontre jogadores e monte seu time para a Rinha do Campus IV — Edição II**

Aplicação web full-stack desenvolvida pela **Equipe 16** como projeto da disciplina de **Desenvolvimento de Sistemas Corporativos (DSC)** na UFPB — Campus IV.

> **Acesso em produção:** [https://eq16.dsc.rodrigor.com](https://eq16.dsc.rodrigor.com)

---

## 📖 Sobre o Projeto

O **Rinha Team Finder** é uma plataforma para conectar jogadores que buscam equipes (Free Agents) com equipes que buscam jogadores para a competição **Rinha do Campus IV**. A aplicação permite que os usuários:

- Se cadastrem e autentiquem na plataforma
- Publiquem seu perfil como **Free Agent**, indicando suas lanes principal e secundária
- Criem **Equipes** com vagas abertas para posições específicas
- Naveguem pela lista de Free Agents e Equipes disponíveis
- Gerenciem seus próprios anúncios (editar e excluir)

---

## 🛠️ Tecnologias Utilizadas

| Camada         | Tecnologia                                                         |
| -------------- | ------------------------------------------------------------------ |
| **Framework**  | [Next.js 16](https://nextjs.org/) (App Router)                    |
| **Linguagem**  | [TypeScript 5](https://www.typescriptlang.org/)                   |
| **UI**         | [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| **Fontes**     | Inter, Space Grotesk (via `next/font`)                            |
| **Autenticação** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials + JWT) |
| **ORM**        | [Prisma 7](https://www.prisma.io/) (com `prisma.config.ts`)      |
| **Banco de Dados** | [PostgreSQL 16](https://www.postgresql.org/)                  |
| **Hash de Senhas** | [bcryptjs](https://www.npmjs.com/package/bcryptjs)            |
| **Container**  | [Docker](https://www.docker.com/) (multi-stage build, Alpine)     |
| **CI/CD**      | [GitHub Actions](https://github.com/features/actions) + GHCR      |
| **Servidor**   | Infraestrutura DSC UFPB (`dsc.rodrigor.com`)                     |

---

## 📁 Estrutura do Projeto

```
projeto-eq16/
├── .github/workflows/
│   └── deploy.yml              # Pipeline CI/CD (build + push + deploy)
├── prisma/
│   ├── migrations/             # Migrations do banco de dados
│   ├── schema.prisma           # Schema do Prisma (modelos e enums)
│   └── seed.ts                 # Script de seed do banco
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # Rota de autenticação NextAuth
│   │   │   ├── equipes/             # API REST de equipes
│   │   │   ├── free-agents/         # API REST de free agents
│   │   │   └── usuarios/            # API REST de usuários
│   │   ├── auth/
│   │   │   ├── login/          # Página de login
│   │   │   └── registro/      # Página de registro
│   │   ├── conta/              # Página de conta do usuário
│   │   ├── equipes/            # Página de listagem de equipes
│   │   ├── freeagents/         # Página de listagem de free agents
│   │   ├── inicio/             # Página inicial (home)
│   │   ├── ping/               # Health check endpoint
│   │   ├── layout.tsx          # Layout raiz da aplicação
│   │   ├── page.tsx            # Redirect para /inicio
│   │   └── globals.css         # Estilos globais
│   ├── components/
│   │   ├── modals/             # Modais (cadastro, edição, confirmação)
│   │   ├── Navbar.tsx          # Barra de navegação
│   │   ├── EquipeInfoResume.tsx    # Card de resumo de equipe
│   │   ├── FreeAgentInfoResume.tsx # Card de resumo de free agent
│   │   ├── PositionSelector.tsx    # Seletor de lanes/posições
│   │   └── Providers.tsx       # Providers (SessionProvider)
│   ├── lib/
│   │   ├── auth.ts             # Configuração do NextAuth
│   │   └── prisma.ts           # Instância do Prisma Client
│   ├── constants/              # Constantes da aplicação
│   └── types/                  # Tipagens TypeScript
├── prisma.config.ts            # Configuração do Prisma 7 (datasource)
├── Dockerfile                  # Build multi-stage para produção
├── docker-compose.yml          # Orquestração local (dev + produção)
├── next.config.ts              # Configuração do Next.js (standalone)
├── package.json
└── tsconfig.json
```

---

## 🗃️ Banco de Dados

### Schema (Prisma)

O banco de dados possui 3 modelos e 2 enums:

**Enums:**
- **`Role`** — `USER` | `ADMIN`
- **`Lane`** — `TOP` | `JUNGLE` | `MID` | `ADC` | `SUPPORT` | `FILL`

**Modelos:**

| Modelo       | Descrição                                      | Campos Principais                                        |
| ------------ | ---------------------------------------------- | -------------------------------------------------------- |
| `User`       | Usuário autenticado                            | `username`, `password` (hash), `role`                    |
| `FreeAgent`  | Jogador buscando equipe                        | `nickname`, `lanePrincipal`, `laneSecundaria`, `contato` |
| `Equipe`     | Equipe buscando jogadores                      | `nome`, `contatoCapitao`, `laneCapitao`, `vagasLanes[]`  |

Relações:
- Um `User` pode ter vários `FreeAgent` e várias `Equipe`
- Ao deletar um `User`, todos os seus registros são removidos em cascata (`onDelete: Cascade`)

---

## 🔐 Autenticação

A autenticação é feita via **NextAuth.js v4** com estratégia **JWT** e provider **Credentials**:

1. O usuário se cadastra em `/auth/registro` (senha salva com hash `bcryptjs`)
2. O login é feito em `/auth/login`
3. Sessões são gerenciadas via JWT (sem banco de sessões)
4. O token JWT contém: `id`, `username` e `role`

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 16](https://www.postgresql.org/) (ou Docker)
- [npm](https://www.npmjs.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/Des-Sist-Corp-UFPB/projeto-eq16.git
cd projeto-eq16
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

# NextAuth
NEXTAUTH_SECRET="uma-chave-secreta-qualquer"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Suba o banco de dados (via Docker, opcional)

Se não tiver o PostgreSQL instalado, use o Docker Compose:

```bash
docker compose up db -d
```

### 5. Rode as migrations

```bash
npx prisma migrate deploy
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## 🐳 Docker

### Build e execução com Docker Compose

```bash
docker compose up --build
```

A aplicação estará disponível em `http://localhost:8116`.

### Dockerfile (Multi-stage)

O Dockerfile utiliza 3 estágios para otimizar a imagem:

| Estágio    | Função                                                   |
| ---------- | -------------------------------------------------------- |
| `deps`     | Instala as dependências (`npm ci`)                       |
| `builder`  | Gera o Prisma Client e faz o build do Next.js            |
| `runner`   | Imagem mínima de produção (standalone + prisma + migrate)|

Na inicialização do container (`CMD`):
1. Executa `prisma migrate deploy` para aplicar migrations pendentes
2. Inicia o servidor Next.js standalone na **porta 8080**

---

## ⚙️ Variáveis de Ambiente

| Variável            | Descrição                                     | Exemplo                                                    |
| ------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`      | Connection string do PostgreSQL               | `postgresql://eq16:senha@postgres:5432/eq16`               |
| `DATABASE_USERNAME` | Usuário do PostgreSQL (usado no docker-compose) | `eq16`                                                   |
| `DATABASE_PASSWORD` | Senha do PostgreSQL (usado no docker-compose)   | `senha_segura`                                           |
| `NEXTAUTH_SECRET`   | Chave secreta para assinar os JWTs            | `uma-string-aleatoria-longa`                               |
| `NEXTAUTH_URL`      | URL base da aplicação                         | `https://eq16.dsc.rodrigor.com`                            |

> **Em produção**, as variáveis são configuradas diretamente no portal do servidor DSC (painel de variáveis de ambiente da equipe).

---

## 🔄 CI/CD — Deploy Automático

O deploy acontece automaticamente a cada push na branch `main`:

```
Push na main → GitHub Actions → Build Docker Image → Push para GHCR → SSH Deploy no servidor
```

### Fluxo detalhado (`deploy.yml`):

1. **Checkout** do código
2. **Login** no GitHub Container Registry (GHCR)
3. **Build e push** da imagem Docker para `ghcr.io/des-sist-corp-ufpb/projeto-eq16:latest`
4. **Deploy via SSH** no servidor `dsc.rodrigor.com`, enviando o token efêmero para o servidor puxar a nova imagem

### Secrets necessários no GitHub:

| Secret           | Descrição                                      |
| ---------------- | ---------------------------------------------- |
| `SSH_DEPLOY_KEY` | Chave SSH privada para acesso ao servidor      |
| `SSH_USERNAME`   | Usuário SSH no servidor                        |
| `GITHUB_TOKEN`   | Gerado automaticamente pelo GitHub Actions     |

---

## 📡 API Routes

| Método | Rota                     | Autenticação | Descrição                        |
| ------ | ------------------------ | ------------ | -------------------------------- |
| `GET`  | `/ping`                  | ❌ Pública    | Health check (status do serviço) |
| `*`    | `/api/auth/[...nextauth]`| —            | Rotas do NextAuth (login/logout) |
| `*`    | `/api/equipes`           | ✅ JWT        | CRUD de equipes                  |
| `*`    | `/api/free-agents`       | ✅ JWT        | CRUD de free agents              |
| `*`    | `/api/usuarios`          | ✅ JWT        | Gestão de usuários               |

### Health Check (`/ping`)

Endpoint público que retorna o status da aplicação. Verificado a cada 15 segundos pelo portal do servidor:

```json
{
  "status": "ok",
  "service": "eq16",
  "timestamp": "2026-06-09T14:32:10Z"
}
```

---

## 🏗️ Configuração do Prisma 7

O projeto utiliza o **Prisma 7** com o novo sistema de configuração via `prisma.config.ts`:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
```

> **Nota:** O `schema.prisma` não contém a `url` diretamente (padrão do Prisma 7). A URL vem exclusivamente do `prisma.config.ts`, que lê de `process.env.DATABASE_URL`.

---

## 👥 Equipe 16

Projeto desenvolvido para a disciplina de **Desenvolvimento de Sistemas Corporativos** — UFPB, Campus IV.
