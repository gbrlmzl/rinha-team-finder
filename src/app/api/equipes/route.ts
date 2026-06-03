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
