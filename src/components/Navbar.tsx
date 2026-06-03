'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Navbar() {
  const { data: session } = useSession();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleSair = () => {
    setMenuAberto(false);
    signOut({ callbackUrl: '/inicio' });
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/inicio"
          className="shrink-0 text-lg font-black uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-80 sm:text-xl"
        >
          Feche seu Time
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-3 py-2 text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900 md:hidden"
          aria-label="Abrir menu de navegação"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((value) => !value)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
          <Link href="/inicio" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white">INICIO</Link>
          <Link href="/equipes" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white">EQUIPES</Link>
          <Link href="/freeagents" className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white">AGENTES</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Conectado como</p>
                <p className="text-sm font-semibold text-white">{session.user.username}</p>
              </div>
              <Link href="/conta/mudar-senha" className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-zinc-500 hover:bg-zinc-900">Minha Conta</Link>
              <button onClick={handleSair} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200">Sair</button>
            </>
          ) : (
            <Link href="/auth/login" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200">Entrar</Link>
          )}
        </div>
      </div>

      <div className={`${menuAberto ? 'max-h-96 border-t border-zinc-800/80' : 'max-h-0'} overflow-hidden transition-all duration-200 md:hidden`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Link href="/inicio" onClick={() => setMenuAberto(false)} className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-900">INICIO</Link>
            <Link href="/equipes" onClick={() => setMenuAberto(false)} className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-900">EQUIPES</Link>
            <Link href="/freeagents" onClick={() => setMenuAberto(false)} className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-900">AGENTES</Link>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
            {session?.user ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-zinc-300">Olá, <strong className="text-white">{session.user.username}</strong></p>
                <Link href="/conta/mudar-senha" onClick={() => setMenuAberto(false)} className="rounded-xl border border-zinc-700 px-4 py-2 text-center text-sm text-zinc-200 transition-colors hover:bg-zinc-800">Minha Conta</Link>
                <button onClick={handleSair} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200">Sair</button>
              </div>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuAberto(false)} className="block rounded-xl bg-white px-4 py-2 text-center text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200">Entrar</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
