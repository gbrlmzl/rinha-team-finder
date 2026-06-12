# ⚔️ Rinha Team Finder

**Encontre jogadores e monte seu time para a Rinha do Campus IV — Edição II**

Aplicação web full-stack para conectar jogadores (Free Agents) e equipes da competição de **League of Legends** da **Rinha do Campus IV**.

---

## 📖 Sobre o Projeto

O **Rinha Team Finder** é uma plataforma onde jogadores anunciam que estão disponíveis e equipes anunciam suas vagas em aberto — cada um encontra o outro pelas **rotas (lanes)** que precisa. O contato final é feito pelo **Discord** da comunidade.

A experiência é dividida em **duas personas**, com identidade visual própria:

- 🔵 **Jogador (Free Agent)** — cor **ciano**
- 🔴 **Equipe** — cor **rosa**

---

## ✨ Funcionalidades

### 👤 Free Agent (jogador buscando equipe)
- Cadastro com **nickname**, **rota principal**, **rota secundária** e **usuário do Discord**.
- **Regra do Fill:** se a rota principal for **Fill**, o jogador joga qualquer rota e a **secundária deixa de ser pedida** (some do formulário).
- **Apenas um free agent por conta** — para criar outro, é preciso remover o atual.

### 🛡️ Equipe (buscando jogadores)
- Cadastro com **nome**, **nickname do capitão**, **usuário do Discord do capitão** e as **vagas abertas**.
- **De 1 a 5 vagas** — toda equipe precisa ter **ao menos uma vaga** aberta.
- Edição e remoção das próprias equipes.

### 🔎 Listagens e filtros
- Páginas de **Equipes** e **Free Agents** são **públicas** (qualquer um navega).
- **Filtro por rota**: seletor de chips, **desmarcado por padrão**, permite escolher **até 2 rotas**. Mostra apenas quem tem aquela(s) rota(s) — equipes pelas vagas, jogadores pela rota principal/secundária.

### 🔗 Nicknames e contato
- O **nickname** segue o formato `Nome#TAG` (a TAG após o `#` tem **no máximo 5 caracteres**). Ex.: `Chico kit lasca#Chico`. É exibido **exatamente como o usuário digitou** (sem caixa alta forçada).
- O nickname (do jogador e do capitão) é **clicável** e abre o perfil no **[League of Graphs](https://www.leagueofgraphs.com/)** — solução temporária até integrarmos a API oficial da Riot.
- O **contato é via Discord**. Cada cadastro informa o usuário do Discord, exibido em um chip nos cards.

### 🔒 Acesso aos contatos (privacidade)
- As listagens são públicas, mas **ver/acessar os canais de comunicação exige login**. Deslogado, o chip do Discord aparece como **"entre para ver"** e leva à tela de login (que devolve à página de origem). O nickname → League of Graphs continua público (é perfil de jogo, não contato).

### 🛠️ Gestão e permissões
- Cada usuário gerencia **seus próprios** anúncios (editar/excluir).
- **ADMIN** pode remover qualquer anúncio.
- Páginas de conta para **trocar a senha**.

### 🎨 Experiência / Design
- **Home "Split Path"**: duas jornadas lado a lado (Jogador × Equipe), com ações primárias em destaque e atalhos secundários.
- **Cores por persona** aplicadas de forma sóbria nas listagens, na navbar (hover/aba ativa) e nos modais.
- **Iluminação de fundo (vinheta)** em cada listagem, na cor da persona.
- Badge da home leva à **página oficial do torneio**.
- Atalhos para o **Servidor do Discord** e o **Grupo do WhatsApp** da comunidade.

> Links e regras (convite do Discord, grupo do WhatsApp, base do League of Graphs e o regex do nickname) ficam centralizados em [`src/constants/links.ts`](src/constants/links.ts).

---

## 📋 Regras de Negócio (resumo)

| Regra | Onde é validada |
| ----- | --------------- |
| Nickname no formato `Nome#TAG` (TAG ≤ 5) | Formulário + API (jogador e capitão) |
| Free Agent: 1 por conta | API (`POST /api/free-agents` → 409) |
| Free Agent Fill: sem rota secundária | Formulário + API + banco (`laneSecundaria` opcional) |
| Equipe: 1 a 5 vagas, no mínimo 1 | Formulário + API |
| Editar/excluir: dono ou ADMIN | API |
| Contato (Discord) só logado | UI dos cards |

---

## 🛠️ Tecnologias Utilizadas

| Camada           | Tecnologia                                                                  |
| ---------------- | --------------------------------------------------------------------------- |
| **Framework**    | [Next.js 16](https://nextjs.org/) (App Router)                              |
| **Linguagem**    | [TypeScript 5](https://www.typescriptlang.org/)                            |
| **UI**           | [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| **Autenticação** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials + JWT)            |
| **ORM**          | [Prisma 7](https://www.prisma.io/) (com `prisma.config.ts`)               |
| **Banco**        | [PostgreSQL 16](https://www.postgresql.org/)                              |
| **Hospedagem**   | [Vercel](https://vercel.com/) (produção)                                  |
| **Banco local**  | [Docker](https://www.docker.com/) (apenas em desenvolvimento)             |

---

## 📁 Estrutura do Projeto

```
rinha-team-finder/
├── prisma/
│   ├── migrations/             # Migrations do banco de dados
│   ├── schema.prisma           # Schema do Prisma (modelos e enums)
│   └── seed.ts                 # Script de seed (usuário admin)
├── src/
│   ├── app/
│   │   ├── api/                # Rotas REST (auth, equipes, free-agents, usuarios)
│   │   ├── auth/               # Login e registro
│   │   ├── conta/              # Conta do usuário (trocar senha)
│   │   ├── equipes/            # Listagem de equipes
│   │   ├── freeagents/         # Listagem de free agents
│   │   ├── inicio/             # Home (Split Path)
│   │   └── ping/               # Health check (opcional)
│   ├── components/
│   │   ├── Navbar.tsx              # Navegação (cores por persona)
│   │   ├── EquipeInfoResume.tsx    # Card de equipe
│   │   ├── FreeAgentInfoResume.tsx # Card de free agent
│   │   ├── LaneFilter.tsx          # Filtro de rotas (multi-select, até 2)
│   │   ├── PositionSelector.tsx    # Seletor radial de lanes (accent ciano/rosa)
│   │   ├── PageGlow.tsx            # Iluminação de fundo das listagens
│   │   └── modals/                 # Cadastro, edição, confirmação, sucesso
│   ├── constants/
│   │   ├── links.ts            # Discord, WhatsApp, League of Graphs e regex do nickname
│   │   └── positions.ts        # Lanes/posições
│   ├── lib/                    # NextAuth e Prisma Client
│   └── types/                  # Tipagens TypeScript
├── prisma.config.ts            # Configuração do Prisma 7 (datasource)
├── docker-compose.yml          # Banco PostgreSQL para desenvolvimento local
├── .env.example                # Modelo de variáveis de ambiente
└── next.config.ts
```

---

## 🗃️ Banco de Dados

**Enums:**
- **`Role`** — `USER` | `ADMIN`
- **`Lane`** — `TOP` | `JUNGLE` | `MID` | `ADC` | `SUPPORT` | `FILL`

**Modelos:**

| Modelo      | Descrição                | Campos Principais                                                     |
| ----------- | ------------------------ | --------------------------------------------------------------------- |
| `User`      | Usuário autenticado      | `username`, `password` (hash), `role`                                 |
| `FreeAgent` | Jogador buscando equipe  | `nickname`, `lanePrincipal`, `laneSecundaria?` (opcional), `discord`  |
| `Equipe`    | Equipe buscando jogadores| `nome`, `nicknameCapitao`, `discord`, `vagasLanes[]`                   |

- `laneSecundaria` é **opcional** (jogadores Fill não têm secundária).
- Ao deletar um `User`, todos os seus registros são removidos em cascata (`onDelete: Cascade`).

---

## 🔐 Autenticação

Autenticação via **NextAuth.js v4** com estratégia **JWT** e provider **Credentials**:

1. O usuário se cadastra em `/auth/registro` (senha salva com hash `bcryptjs`).
2. O login é feito em `/auth/login` (respeita `?redirect=` para voltar à página de origem).
3. Sessões são gerenciadas via JWT (sem banco de sessões).
4. O token JWT contém: `id`, `username` e `role`.

---

## 🚀 Como Rodar Localmente

O perfil de desenvolvimento roda a **aplicação na sua máquina** (`npm run dev`) e o
**banco em Docker** — assim você não precisa instalar PostgreSQL nem usar o pgAdmin.

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (para o banco)

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env        # Linux/Mac
# ou, no PowerShell:
Copy-Item .env.example .env
```

Os valores padrão do `.env.example` já batem com o `docker-compose.yml`, então
normalmente não é preciso alterar nada para desenvolver localmente.

> ⚠️ Se a porta **5432** já estiver em uso (ex.: um PostgreSQL instalado na máquina),
> defina `DB_PORT` (ex.: `5433`) no `.env` e ajuste a porta no `DATABASE_URL`.

### 3. Suba o banco (Docker)

```bash
npm run db:up        # equivale a: docker compose up -d
```

### 4. Aplique as migrations (e gere o cliente Prisma)

```bash
npm run db:migrate   # equivale a: prisma migrate dev
```

### 5. (Opcional) Crie o usuário admin

```bash
npx prisma db seed
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para parar o banco: `npm run db:down` (mantém os dados) ou `docker compose down -v` (apaga os dados).

---

## ☁️ Deploy na Vercel

1. Importe o repositório na [Vercel](https://vercel.com/new).
2. Configure um banco PostgreSQL (Vercel Postgres, Neon, Supabase, etc.) e copie a connection string.
3. Defina as variáveis de ambiente do projeto (veja a tabela abaixo).
4. A Vercel roda o `build` automaticamente — o script já executa
   `prisma generate && prisma migrate deploy && next build`, aplicando as migrations no deploy.

> O `postinstall` (`prisma generate`) garante que o Prisma Client seja gerado após o `npm install`.

---

## ⚙️ Variáveis de Ambiente

| Variável          | Descrição                         | Exemplo                                          |
| ----------------- | --------------------------------- | ------------------------------------------------ |
| `DATABASE_URL`    | Connection string do PostgreSQL   | `postgresql://rinha:rinha@localhost:5432/rinha`  |
| `NEXTAUTH_SECRET` | Chave secreta para assinar os JWT | `uma-string-aleatoria-longa`                     |
| `NEXTAUTH_URL`    | URL base da aplicação             | `http://localhost:3000` / URL da Vercel          |

Variáveis usadas **apenas** pelo `docker-compose.yml` local (opcionais, têm defaults):
`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DB_PORT`.

---

## 🏗️ Configuração do Prisma 7

O projeto usa o **Prisma 7** com `prisma.config.ts`:

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

> O `schema.prisma` não contém a `url` diretamente (padrão do Prisma 7). A URL vem do
> `prisma.config.ts`, que lê de `process.env.DATABASE_URL`.

---

## 📡 Principais Rotas da API

| Método   | Rota                     | Acesso        | Descrição                                  |
| -------- | ------------------------ | ------------- | ------------------------------------------ |
| `GET`    | `/api/equipes`           | Público       | Lista equipes                              |
| `POST`   | `/api/equipes`           | Autenticado   | Cria equipe (≥ 1 vaga)                     |
| `PUT`    | `/api/equipes/[id]`      | Dono/ADMIN    | Atualiza equipe                            |
| `DELETE` | `/api/equipes/[id]`      | Dono/ADMIN    | Remove equipe                              |
| `GET`    | `/api/free-agents`       | Público       | Lista free agents                          |
| `POST`   | `/api/free-agents`       | Autenticado   | Cria free agent (1 por conta)              |
| `DELETE` | `/api/free-agents/[id]`  | Dono/ADMIN    | Remove free agent                          |
| `*`      | `/api/auth/[...nextauth]`| —             | Login/logout (NextAuth)                    |
| `GET`    | `/ping`                  | Público       | Health check                               |
