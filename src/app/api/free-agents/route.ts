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
