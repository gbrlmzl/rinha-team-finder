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
