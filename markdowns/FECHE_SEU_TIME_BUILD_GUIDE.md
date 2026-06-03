# Feche seu Time — Guia de Construção da Aplicação

> Este documento é um guia detalhado para construção da aplicação **Feche seu Time**, um sistema de matchmaking para o evento **Rinha do Campus IV - Edição II**. Ele deve ser seguido em ordem, etapa por etapa.

---

## Visão Geral

**Feche seu Time** é uma aplicação web onde jogadores de League of Legends podem:
- Se cadastrar como **free agents** (jogadores disponíveis)
- Cadastrar **equipes** com vagas abertas por lane
- Buscar free agents disponíveis para completar seu time

### Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15+ com TypeScript |
| Estilização | Tailwind CSS |
| Banco de Dados | PostgreSQL |
| ORM | Prisma |
| Autenticação | NextAuth.js (JWT) |
| CI/CD | GitHub Actions + Docker + GHCR |
| Hospedagem | Servidor próprio via SSH (`dsc.rodrigor.com`) |

---

## Estrutura de Pastas Esperada

```
feche-seu-time/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── assets/
│       └── icons/
│           ├── Position-Top.png
│           ├── Position-Jungle.png
│           ├── Position-Mid.png
│           ├── Position-Bot.png
│           ├── Position-Support.png
│           ├── Position-Fill.png
│           └── DefaultIcon.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Redireciona para /inicio
│   │   ├── inicio/
│   │   │   └── page.tsx
│   │   ├── freeagents/
│   │   │   └── page.tsx
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── registro/
│   │   │       └── page.tsx
│   │   ├── conta/
│   │   │   └── mudar-senha/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── free-agents/
│   │       │   ├── route.ts          # GET, POST
│   │       │   └── [id]/
│   │       │       └── route.ts      # DELETE
│   │       ├── equipes/
│   │       │   ├── route.ts          # GET, POST
│   │       │   └── [id]/
│   │       │       └── route.ts      # DELETE
│   │       └── usuarios/
│   │           └── mudar-senha/
│   │               └── route.ts      # PATCH
│   ├── components/
│   │   ├── PositionSelector.tsx      # Baseado no arquivo existente
│   │   ├── modals/
│   │   │   ├── CadastroFreeAgent.tsx
│   │   │   └── CadastroEquipeVaga.tsx
│   │   ├── FreeAgentInfoResume.tsx
│   │   └── Navbar.tsx
│   ├── constants/
│   │   └── positions.ts
│   ├── types/
│   │   └── index.ts
│   └── lib/
│       ├── prisma.ts
│       └── auth.ts
├── .env.local
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## ETAPA 1 — Setup Inicial do Projeto

### 1.1 Criar o projeto Next.js

```bash
npx create-next-app@latest feche-seu-time \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### 1.2 Instalar dependências

```bash
# ORM e banco
npm install prisma @prisma/client

# Autenticação
npm install next-auth bcryptjs
npm install -D @types/bcryptjs

# Utilitários
npm install clsx
```

### 1.3 Criar o arquivo `.env.local`

```env
# Banco de dados
DATABASE_URL="postgresql://DATABASE_USERNAME:DATABASE_PASSWORD@localhost:5432/feche_seu_time"

# NextAuth
NEXTAUTH_SECRET="seu_secret_aqui_troque_em_producao"
NEXTAUTH_URL="http://localhost:3000"
```

### 1.4 Criar `.env.example` (para versionamento)

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/feche_seu_time"
NEXTAUTH_SECRET="troque_por_um_secret_seguro"
NEXTAUTH_URL="https://seu-dominio.com"
```

### 1.5 Inicializar o Prisma

```bash
npx prisma init
```

---

## ETAPA 2 — Banco de Dados com Prisma

### 2.1 Definir o Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum Lane {
  TOP
  JUNGLE
  MID
  ADC
  SUPPORT
  FILL
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  freeAgents FreeAgent[]
  equipes    Equipe[]
}

model FreeAgent {
  id           String   @id @default(cuid())
  nickname     String
  lanePrincipal Lane
  laneSecundaria Lane
  contato      String
  createdAt    DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Equipe {
  id          String   @id @default(cuid())
  nome        String
  contatoCapitao String
  laneCapitao Lane
  vagasLanes  Lane[]
  createdAt   DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

> **Nota sobre `vagasLanes`:** O array de `Lane[]` representa as lanes que a equipe ainda precisa preencher. O Prisma com PostgreSQL suporta arrays nativamente.

### 2.2 Criar o Seed (`prisma/seed.ts`)

Este seed cria o usuário ADMIN inicial. A senha deve ser alterada após o primeiro acesso.

```typescript
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('123Admin321', 12);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: senhaHash,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Usuário ADMIN criado: ${admin.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Adicionar ao `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

### 2.3 Rodar as migrations e o seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

---

## ETAPA 3 — Constantes e Tipos

### 3.1 Tipos globais (`src/types/index.ts`)

```typescript
export type Lane = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT' | 'FILL';
export type Role = 'USER' | 'ADMIN';

export interface LaneOption {
  key: Lane;
  label: string;
  icon: string;
}

export interface FreeAgentData {
  id: string;
  nickname: string;
  lanePrincipal: Lane;
  laneSecundaria: Lane;
  contato: string;
  createdAt: string;
  userId: string;
}

export interface EquipeData {
  id: string;
  nome: string;
  contatoCapitao: string;
  laneCapitao: Lane;
  vagasLanes: Lane[];
  createdAt: string;
  userId: string;
}

export interface SessionUser {
  id: string;
  username: string;
  role: Role;
}
```

### 3.2 Constantes de Lanes (`src/constants/positions.ts`)

> Baseado nos arquivos `icons.js` e `PositionSelector.tsx` existentes. Os ícones ficam em `public/assets/icons/`.
>
> A lane `FILL` representa um jogador que aceita jogar em qualquer posição. Ela deve aparecer como opção válida em todos os seletores, incluindo lane principal e secundária de free agents e lanes de vaga em equipes.

```typescript
import { LaneOption } from '@/types';

export const PLAYER_POSITIONS: LaneOption[] = [
  {
    key: 'TOP',
    label: 'Top',
    icon: '/assets/icons/Position-Top.png',
  },
  {
    key: 'JUNGLE',
    label: 'Jungle',
    icon: '/assets/icons/Position-Jungle.png',
  },
  {
    key: 'MID',
    label: 'Mid',
    icon: '/assets/icons/Position-Mid.png',
  },
  {
    key: 'ADC',
    label: 'ADC',
    icon: '/assets/icons/Position-Bot.png',
  },
  {
    key: 'SUPPORT',
    label: 'Support',
    icon: '/assets/icons/Position-Support.png',
  },
  {
    key: 'FILL',
    label: 'Fill',
    icon: '/assets/icons/Position-Fill.png',
  },
];

export const DEFAULT_POSITION_ICON = '/assets/icons/DefaultIcon.svg';
```

> **Nota sobre FILL:** A opção Fill indica disponibilidade para qualquer lane. No modal `CadastroEquipeVaga`, se o capitão escolher Fill como sua lane, ela deve entrar normalmente no conjunto de lanes a serem bloqueadas no seletor de vagas. No modal `CadastroFreeAgent`, a validação de lane principal ≠ lane secundária continua valendo — o jogador não pode selecionar Fill nas duas ao mesmo tempo.

---

## ETAPA 4 — Autenticação com NextAuth.js

### 4.1 Configurar o cliente Prisma (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4.2 Configurar NextAuth (`src/lib/auth.ts`)

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        const senhaCorreta = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!senhaCorreta) return null;

        return {
          id: user.id,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### 4.3 Criar a route handler do NextAuth (`src/app/api/auth/[...nextauth]/route.ts`)

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 4.4 Declaração de tipos do NextAuth (`src/types/next-auth.d.ts`)

```typescript
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
    };
  }

  interface User {
    id: string;
    username: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    role: string;
  }
}
```

---

## ETAPA 5 — API Routes (Backend)

### 5.1 Utilitário de autorização

Antes de criar as rotas, criar um helper para verificar permissões:

```typescript
// src/lib/apiAuth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';

export async function getSessionOrUnauthorized() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ erro: 'Não autenticado' }, { status: 401 }),
    };
  }
  return { session, error: null };
}
```

### 5.2 Rota de Registro de Usuário (`src/app/api/usuarios/registro/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { erro: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { erro: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    const existe = await prisma.user.findUnique({ where: { username } });
    if (existe) {
      return NextResponse.json(
        { erro: 'Nome de usuário já está em uso' },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, password: hash },
    });

    return NextResponse.json(
      { mensagem: 'Usuário criado com sucesso', id: user.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
```

### 5.3 Rota de Mudar Senha (`src/app/api/usuarios/mudar-senha/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

export async function PATCH(req: NextRequest) {
  const { session, error } = await getSessionOrUnauthorized();
  if (error) return error;

  try {
    const { senhaAtual, novaSenha } = await req.json();

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    if (novaSenha.length < 6) {
      return NextResponse.json(
        { erro: 'A nova senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
    });

    if (!user) {
      return NextResponse.json({ erro: 'Usuário não encontrado' }, { status: 404 });
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, user.password);
    if (!senhaCorreta) {
      return NextResponse.json({ erro: 'Senha atual incorreta' }, { status: 403 });
    }

    const novoHash = await bcrypt.hash(novaSenha, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: novoHash },
    });

    return NextResponse.json({ mensagem: 'Senha alterada com sucesso' });
  } catch {
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
```

### 5.4 Rotas de Free Agents

**`src/app/api/free-agents/route.ts`** — Listar e cadastrar:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

// GET /api/free-agents — público
export async function GET() {
  const freeAgents = await prisma.freeAgent.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nickname: true,
      lanePrincipal: true,
      laneSecundaria: true,
      contato: true,
      createdAt: true,
      userId: true,
    },
  });

  return NextResponse.json(freeAgents);
}

// POST /api/free-agents — autenticado
export async function POST(req: NextRequest) {
  const { session, error } = await getSessionOrUnauthorized();
  if (error) return error;

  try {
    const { nickname, lanePrincipal, laneSecundaria, contato } = await req.json();

    if (!nickname || !lanePrincipal || !laneSecundaria || !contato) {
      return NextResponse.json(
        { erro: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const freeAgent = await prisma.freeAgent.create({
      data: {
        nickname,
        lanePrincipal,
        laneSecundaria,
        contato,
        userId: session!.user.id,
      },
    });

    return NextResponse.json(freeAgent, { status: 201 });
  } catch {
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
```

**`src/app/api/free-agents/[id]/route.ts`** — Deletar:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await getSessionOrUnauthorized();
  if (error) return error;

  const freeAgent = await prisma.freeAgent.findUnique({
    where: { id: params.id },
  });

  if (!freeAgent) {
    return NextResponse.json({ erro: 'Free agent não encontrado' }, { status: 404 });
  }

  const isAdmin = session!.user.role === 'ADMIN';
  const isOwner = freeAgent.userId === session!.user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ erro: 'Sem permissão' }, { status: 403 });
  }

  await prisma.freeAgent.delete({ where: { id: params.id } });
  return NextResponse.json({ mensagem: 'Free agent removido com sucesso' });
}
```

### 5.5 Rotas de Equipes

**`src/app/api/equipes/route.ts`** — Listar e cadastrar:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

// GET /api/equipes — público
export async function GET() {
  const equipes = await prisma.equipe.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(equipes);
}

// POST /api/equipes — autenticado
export async function POST(req: NextRequest) {
  const { session, error } = await getSessionOrUnauthorized();
  if (error) return error;

  try {
    const { nome, contatoCapitao, laneCapitao, vagasLanes } = await req.json();

    if (!nome || !contatoCapitao || !laneCapitao) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    const equipe = await prisma.equipe.create({
      data: {
        nome,
        contatoCapitao,
        laneCapitao,
        vagasLanes: vagasLanes ?? [],
        userId: session!.user.id,
      },
    });

    return NextResponse.json(equipe, { status: 201 });
  } catch {
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
```

**`src/app/api/equipes/[id]/route.ts`** — Deletar:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await getSessionOrUnauthorized();
  if (error) return error;

  const equipe = await prisma.equipe.findUnique({ where: { id: params.id } });

  if (!equipe) {
    return NextResponse.json({ erro: 'Equipe não encontrada' }, { status: 404 });
  }

  const isAdmin = session!.user.role === 'ADMIN';
  const isOwner = equipe.userId === session!.user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ erro: 'Sem permissão' }, { status: 403 });
  }

  await prisma.equipe.delete({ where: { id: params.id } });
  return NextResponse.json({ mensagem: 'Equipe removida com sucesso' });
}
```

---

## ETAPA 6 — Componentes Reutilizáveis

### 6.1 PositionSelector (`src/components/PositionSelector.tsx`)

> Adaptação do `PositionSelector.tsx` original para Tailwind CSS e sem dependência do Material UI. A lógica de teclado (ArrowRight/Left, Enter) deve ser mantida idêntica ao componente original.

```typescript
'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import Image from 'next/image';
import { Lane, LaneOption } from '@/types';
import { PLAYER_POSITIONS, DEFAULT_POSITION_ICON } from '@/constants/positions';

interface PositionSelectorProps {
  value: Lane | null;
  onChange: (position: Lane) => void;
  onKeyboardConfirm?: () => void;
  disabled?: boolean;
  disabledLanes?: Lane[];   // para CadastroEquipeVaga: lanes já selecionadas ficam escurecidas
  size?: 'small' | 'medium' | 'large';
}

export function PositionSelector({
  value,
  onChange,
  onKeyboardConfirm,
  disabled = false,
  disabledLanes = [],
  size = 'medium',
}: PositionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);
  const positionItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const iconSize = size === 'small' ? 32 : size === 'large' ? 56 : 40;

  const currentPosition = PLAYER_POSITIONS.find((p) => p.key === value);
  const iconSrc = currentPosition?.icon || DEFAULT_POSITION_ICON;

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    setAnchorRef(event.currentTarget);
    setOpen(true);
  };

  const handleCloseMenu = () => {
    setOpen(false);
    setAnchorRef(null);
  };

  const handleSelectPosition = (position: Lane) => {
    onChange(position);
    handleCloseMenu();
  };

  const focusPositionAtIndex = (index: number) => {
    positionItemRefs.current[index]?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const selectedIndex = Math.max(
      0,
      PLAYER_POSITIONS.findIndex((p) => p.key === value)
    );
    const id = window.requestAnimationFrame(() => focusPositionAtIndex(selectedIndex));
    return () => window.cancelAnimationFrame(id);
  }, [open, value]);

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleCloseMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handlePositionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const total = PLAYER_POSITIONS.length;
    let nextIndex = index;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % total;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + total) % total;
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        event.stopPropagation();
        handleSelectPosition(PLAYER_POSITIONS[index].key);
        if (event.key === 'Enter') onKeyboardConfirm?.();
        return;
      }
      case 'Escape':
        handleCloseMenu();
        return;
      default:
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    focusPositionAtIndex(nextIndex);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Botão principal */}
      <button
        type="button"
        onClick={handleOpenMenu}
        disabled={disabled}
        title={disabled ? 'Desabilitado' : 'Selecionar posição'}
        className={`
          rounded-full p-2 border-2 transition-all duration-200
          bg-zinc-800 border-zinc-600
          hover:bg-blue-600 hover:border-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
      >
        <div style={{ width: iconSize, height: iconSize }} className="relative">
          <Image src={iconSrc} alt={`Posição: ${value ?? 'nenhuma'}`} fill style={{ objectFit: 'contain' }} />
        </div>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-xl">
          <div className="flex flex-row gap-1">
            {PLAYER_POSITIONS.map((position, index) => {
              const isLaneDisabled = disabledLanes.includes(position.key);
              const isSelected = value === position.key;
              return (
                <button
                  key={position.key}
                  ref={(el) => { positionItemRefs.current[index] = el; }}
                  type="button"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => !isLaneDisabled && handleSelectPosition(position.key)}
                  onKeyDown={(e) => handlePositionKeyDown(e, index)}
                  title={position.label}
                  disabled={isLaneDisabled}
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-200
                    ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-zinc-600'}
                    ${isLaneDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-600 hover:border-blue-600 cursor-pointer'}
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-white
                  `}
                >
                  <div className="relative w-8 h-8">
                    <Image
                      src={position.icon}
                      alt={position.label}
                      fill
                      style={{ objectFit: 'contain', filter: isLaneDisabled ? 'grayscale(100%)' : 'none' }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

> **Detalhe importante da prop `disabledLanes`:** No modal `CadastroEquipeVaga`, as lanes já adicionadas à lista de vagas devem ser passadas nessa prop. O ícone aparecerá escurecido (via `grayscale(100%)`) e o botão ficará desabilitado, impedindo seleção duplicada.

---

## ETAPA 7 — Módulo de Autenticação (Páginas)

### 7.1 Página de Login (`src/app/auth/login/page.tsx`)

Criar um formulário com campos `username` e `password`. Ao submeter, chamar `signIn('credentials', { username, password, redirect: false })` do NextAuth.

- Se sucesso: redirecionar para `/inicio`
- Se erro: exibir mensagem "Usuário ou senha incorretos"
- Incluir link "Não tem conta? Criar conta" apontando para `/auth/registro`

### 7.2 Página de Registro (`src/app/auth/registro/page.tsx`)

Criar um formulário com campos `username`, `password` e `confirmarSenha`.

Validações client-side:
- `password === confirmarSenha` (se não bater, exibir "As senhas não coincidem")
- `password.length >= 6`

Ao submeter, fazer `POST /api/usuarios/registro`. Se sucesso, redirecionar para `/auth/login`.

### 7.3 Página de Mudar Senha (`src/app/conta/mudar-senha/page.tsx`)

> Rota protegida: redirecionar para `/auth/login` se não autenticado.

Formulário com campos `senhaAtual`, `novaSenha` e `confirmarNovaSenha`.

Ao submeter, fazer `PATCH /api/usuarios/mudar-senha` com `{ senhaAtual, novaSenha }`.

- Exibir mensagem de sucesso ou erro retornada pela API.
- Botão "Voltar" para `/inicio`.

### 7.4 Navbar (`src/components/Navbar.tsx`)

Exibir no topo de todas as páginas autenticadas:
- Nome do usuário logado
- Link "Minha Conta" → `/conta/mudar-senha`
- Botão "Sair" → chama `signOut()` do NextAuth

---

## ETAPA 8 — Modais de Cadastro

### 8.1 Modal CadastroFreeAgent (`src/components/modals/CadastroFreeAgent.tsx`)

**Props:**
```typescript
interface CadastroFreeAgentProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Layout do modal:**
- `X` no topo direito para fechar
- Título: "Cadastrar-se como Free Agent"
- Campo texto: **Nickname** (obrigatório)
- `PositionSelector` para **Lane Principal** (obrigatório)
- `PositionSelector` para **Lane Secundária** (obrigatório)
- Campo texto: **Número WhatsApp** (obrigatório, apenas números)
- Botão "Confirmar" — faz `POST /api/free-agents`
- Em caso de sucesso: fechar modal e chamar `onSuccess()`
- Em caso de erro: exibir mensagem de erro inline

**Validações client-side:**
- Todos os campos obrigatórios
- Lane principal ≠ Lane secundária

### 8.2 Modal CadastroEquipeVaga (`src/components/modals/CadastroEquipeVaga.tsx`)

**Props:**
```typescript
interface CadastroEquipeVagaProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Layout do modal:**
- `X` no topo direito para fechar
- Título: "Cadastrar Equipe com Vagas"
- Campo texto: **Nome da Equipe** (obrigatório)
- Campo texto: **WhatsApp do Capitão** (obrigatório)
- `PositionSelector` para **Lane do Capitão** (obrigatório)
- Separador visual "Vagas abertas"
- **Lista de vagas:** renderiza uma `PositionSelector` por lane já adicionada
  - Cada lane adicionada exibe seu ícone + botão `×` para remover
  - O botão `+` aparece sempre abaixo da última vaga (se total < 4 vagas, pois o capitão já ocupa 1 das 5)
  - Ao clicar `+`, abre um `PositionSelector` para escolha
  - As lanes já selecionadas (incluindo a lane do capitão) ficam escurecidas via `disabledLanes`
- Botão "Confirmar" — faz `POST /api/equipes`
- Em caso de sucesso: fechar modal e chamar `onSuccess()`

**Regras de negócio:**
- Máximo de 4 vagas abertas (pois o capitão é o 5º jogador)
- A lane do capitão não pode ser adicionada à lista de vagas
- Lanes já escolhidas ficam `disabled` e visualmente escurecidas no seletor

---

## ETAPA 9 — Páginas Principais

### 9.1 Layout raiz (`src/app/layout.tsx`)

Configurar o `SessionProvider` do NextAuth para que toda a aplicação acesse a sessão:

```typescript
import { SessionProvider } from 'next-auth/react';
// Envolver {children} com <SessionProvider>
```

### 9.2 Página raiz (`src/app/page.tsx`)

Redirecionar automaticamente para `/inicio`:

```typescript
import { redirect } from 'next/navigation';
export default function Home() {
  redirect('/inicio');
}
```

### 9.3 Página `/inicio` (`src/app/inicio/page.tsx`)

Esta é a página principal da aplicação. Estrutura:

**Header:**
- Logo/título "Feche seu Time"
- Navbar com dados do usuário logado (se autenticado) ou botões "Entrar" / "Criar Conta"

**Seção central com 4 botões de ação:**

| Botão | Ação |
|-------|------|
| "Me cadastrar como free agent" | Abre modal `CadastroFreeAgent` (exige login) |
| "Cadastrar equipe precisando de free agents" | Abre modal `CadastroEquipeVaga` (exige login) |
| "Buscar free agents" | Navega para `/freeagents` |
| "Entrar no grupo do WhatsApp" | Abre link externo do grupo da Rinha do Campus IV |

> **Fluxo de autenticação:** Se o usuário não estiver logado e tentar abrir os modais de cadastro, redirecionar para `/auth/login` com um parâmetro `?redirect=/inicio`.

### 9.4 Página `/freeagents` (`src/app/freeagents/page.tsx`)

Buscar lista de free agents via `GET /api/free-agents` e renderizar a lista de `FreeAgentInfoResume`.

- Exibir mensagem "Nenhum free agent disponível no momento" se a lista estiver vazia.
- Botão "Voltar" para `/inicio`.

---

## ETAPA 10 — Componente FreeAgentInfoResume

**`src/components/FreeAgentInfoResume.tsx`**

```typescript
interface FreeAgentInfoResumeProps {
  id: string;
  nickname: string;
  lanePrincipal: Lane;
  laneSecundaria: Lane;
  contato: string;
  userId: string;
  onDelete?: () => void;  // Callback para atualizar lista após deleção
}
```

**Layout do card:**
- Linha com **2 ícones de lane** (principal e secundária) usando `Image` do Next.js, buscando o ícone de `PLAYER_POSITIONS` por `key`
- **Nickname** do jogador em destaque
- Botão de **copiar número** para WhatsApp (usa `navigator.clipboard.writeText(contato)`) com ícone de cópia e feedback visual "Copiado!" por 2 segundos
- **Botão de excluir** (visível apenas para o dono do registro ou ADMIN): chama `DELETE /api/free-agents/:id`

---

## ETAPA 11 — Dockerização

### 11.1 `Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Instalar dependências
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Produção
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Adicionar ao `next.config.ts`:

```typescript
const nextConfig = {
  output: 'standalone',
};
```

### 11.2 `docker-compose.yml` (para desenvolvimento local)

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: feche_seu_time
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@db:5432/feche_seu_time
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
    depends_on:
      - db

volumes:
  postgres_data:
```

---

## ETAPA 12 — CI/CD com GitHub Actions

### 12.1 Segredos necessários no repositório GitHub

Adicionar em **Settings → Secrets and variables → Actions**:

| Secret | Valor |
|--------|-------|
| `SSH_USERNAME` | Usuário SSH do servidor |
| `SSH_DEPLOY_KEY` | Chave SSH privada para deploy |
| `DATABASE_USERNAME` | Usuário do banco PostgreSQL |
| `DATABASE_PASSWORD` | Senha do banco PostgreSQL |
| `NEXTAUTH_SECRET` | Secret do NextAuth |

### 12.2 `deploy.yml` (`.github/workflows/deploy.yml`)

> Baseado no `deploy.yml` existente, com adição das variáveis de ambiente necessárias para o build.

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    name: Build, push e deploy
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Prepara nome da imagem (lowercase)
        run: echo "IMAGE=ghcr.io/$(echo '${{ github.repository }}' | tr '[:upper:]' '[:lower:]'):latest" >> $GITHUB_ENV

      - name: Login no GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build e push da imagem
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.IMAGE }}
          build-args: |
            DATABASE_USERNAME=${{ secrets.DATABASE_USERNAME }}
            DATABASE_PASSWORD=${{ secrets.DATABASE_PASSWORD }}

      - name: Deploy no servidor
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: dsc.rodrigor.com
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_DEPLOY_KEY }}
          script: |
            docker pull ${{ env.IMAGE }}
            docker stop feche-seu-time || true
            docker rm feche-seu-time || true
            docker run -d \
              --name feche-seu-time \
              --restart unless-stopped \
              -p 3000:3000 \
              -e DATABASE_URL="postgresql://${{ secrets.DATABASE_USERNAME }}:${{ secrets.DATABASE_PASSWORD }}@localhost:5432/feche_seu_time" \
              -e NEXTAUTH_SECRET="${{ secrets.NEXTAUTH_SECRET }}" \
              -e NEXTAUTH_URL="https://dsc.rodrigor.com" \
              ${{ env.IMAGE }}
            docker exec feche-seu-time npx prisma migrate deploy
            docker exec feche-seu-time npx prisma db seed
```

---

## ETAPA 13 — Checklist Final de Implementação

Antes de considerar a aplicação pronta, verificar:

### Banco de dados
- [ ] Schema com `User`, `FreeAgent`, `Equipe` e enums `Role`, `Lane`
- [ ] Migration rodando sem erros
- [ ] Seed cria o usuário `admin` com senha `123Admin321`

### Autenticação
- [ ] Login com `username` + `password`
- [ ] Registro de novo usuário com validação de senha
- [ ] Sessão JWT com `id`, `username`, `role`
- [ ] Troca de senha validando senha atual
- [ ] Rotas protegidas redirecionam para `/auth/login`

### Permissões
- [ ] `USER` pode excluir apenas seus próprios registros
- [ ] `ADMIN` pode excluir qualquer registro
- [ ] API retorna `403` quando permissão negada

### Componentes
- [ ] `PositionSelector` com navegação por teclado (igual ao original)
- [ ] `PositionSelector` com `disabledLanes` escurecendo ícones e bloqueando clique
- [ ] Lane `FILL` aparece no seletor para todas as telas que usam `PositionSelector`
- [ ] `CadastroFreeAgent` valida lane principal ≠ lane secundária (vale para FILL também)
- [ ] `CadastroEquipeVaga` limita a 4 vagas abertas
- [ ] `FreeAgentInfoResume` copia contato para clipboard com feedback visual

### Rotas
- [ ] `/` → redireciona para `/inicio`
- [ ] `/inicio` — página principal com os 4 botões
- [ ] `/freeagents` — lista de free agents
- [ ] `/auth/login` — login
- [ ] `/auth/registro` — registro
- [ ] `/conta/mudar-senha` — troca de senha (protegida)

### Deploy
- [ ] `Dockerfile` com build multi-stage e `output: standalone`
- [ ] `deploy.yml` publica imagem no GHCR e executa deploy via SSH
- [ ] Secrets configurados no repositório GitHub
- [ ] `prisma migrate deploy` executado automaticamente no deploy

---

## Observações Finais

- **Ícones das lanes:** Copiar os arquivos `Position-Top.png`, `Position-Jungle.png`, `Position-Mid.png`, `Position-Bot.png`, `Position-Support.png`, `Position-Fill.png` e `DefaultIcon.svg` para `public/assets/icons/`. Os nomes devem coincidir exatamente com as constantes em `src/constants/positions.ts`.

- **Link do WhatsApp:** O link do grupo da Rinha do Campus IV deve ser substituído pela URL real do grupo. Enquanto não disponível, usar um placeholder visualmente indicativo.

- **Senha do ADMIN:** A senha `123Admin321` é temporária e deve ser alterada imediatamente após o primeiro acesso através da rota `/conta/mudar-senha`.

- **Variáveis de ambiente em produção:** Nunca versionar o `.env.local`. Usar apenas o `.env.example` no repositório.
