import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionOrUnauthorized } from '@/lib/apiAuth';

// PUT /api/equipes/[id] — atualizar equipe (dono ou admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await getSessionOrUnauthorized();
  if (error) return error;

  const { id } = await params;

  const equipe = await prisma.equipe.findUnique({ where: { id } });

  if (!equipe) {
    return NextResponse.json({ erro: 'Equipe não encontrada' }, { status: 404 });
  }

  const isAdmin = session!.user.role === 'ADMIN';
  const isOwner = equipe.userId === session!.user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ erro: 'Sem permissão' }, { status: 403 });
  }

  try {
    const { nome, contatoCapitao, laneCapitao, vagasLanes } = await req.json();

    if (!nome || !contatoCapitao || !laneCapitao) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    const updated = await prisma.equipe.update({
      where: { id },
      data: {
        nome,
        contatoCapitao,
        laneCapitao,
        vagasLanes: vagasLanes ?? [],
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ erro: 'Erro interno' }, { status: 500 });
  }
}

// DELETE /api/equipes/[id] — remover equipe (dono ou admin)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await getSessionOrUnauthorized();
  if (error) return error;

  const { id } = await params;

  const equipe = await prisma.equipe.findUnique({ where: { id } });

  if (!equipe) {
    return NextResponse.json({ erro: 'Equipe não encontrada' }, { status: 404 });
  }

  const isAdmin = session!.user.role === 'ADMIN';
  const isOwner = equipe.userId === session!.user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ erro: 'Sem permissão' }, { status: 403 });
  }

  await prisma.equipe.delete({ where: { id } });
  return NextResponse.json({ mensagem: 'Equipe removida com sucesso' });
}

