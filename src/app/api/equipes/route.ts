import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';
import { isNicknameValido } from '@/constants/links';

const MAX_VAGAS = 5;

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
    const { nome, nicknameCapitao, discord, vagasLanes } = await req.json();

    if (!nome || !nicknameCapitao || !discord) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    if (!isNicknameValido(nicknameCapitao)) {
      return NextResponse.json(
        { erro: 'Nickname do capitão inválido. Use o formato Nome#TAG.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(vagasLanes) || vagasLanes.length === 0) {
      return NextResponse.json(
        { erro: 'Selecione ao menos uma vaga aberta.' },
        { status: 400 }
      );
    }

    if (vagasLanes.length > MAX_VAGAS) {
      return NextResponse.json(
        { erro: `Máximo de ${MAX_VAGAS} vagas por equipe.` },
        { status: 400 }
      );
    }

    const equipe = await prisma.equipe.create({
      data: {
        nome,
        nicknameCapitao,
        discord,
        vagasLanes: vagasLanes ?? [],
        userId: session!.user.id,
      },
    });

    return NextResponse.json(equipe, { status: 201 });
  } catch {
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}
