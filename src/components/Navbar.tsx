'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700/50 px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/inicio" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Feche seu Time
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-zinc-300 text-sm hidden sm:inline">
                Olá, <strong className="text-white">{session.user.username}</strong>
              </span>
              <Link
                href="/conta/mudar-senha"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Minha Conta
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/inicio' })}
                className="text-sm px-4 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth/registro"
                className="text-sm px-4 py-1.5 rounded-lg border border-zinc-600 hover:border-zinc-500 text-zinc-300 transition-colors"
              >
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
