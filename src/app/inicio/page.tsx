'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CadastroFreeAgent } from '@/components/modals/CadastroFreeAgent';
import { CadastroEquipeVaga } from '@/components/modals/CadastroEquipeVaga';

export default function InicioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [modalFreeAgent, setModalFreeAgent] = useState(false);
  const [modalEquipe, setModalEquipe] = useState(false);

  const handleAbrirModal = (tipo: 'freeagent' | 'equipe') => {
    if (!session?.user) {
      router.push('/auth/login?redirect=/inicio');
      return;
    }
    if (tipo === 'freeagent') setModalFreeAgent(true);
    else setModalEquipe(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Feche seu Time
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            Encontre jogadores ou equipes para a <strong className="text-zinc-200">Rinha do Campus IV — Edição II</strong>
          </p>
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <button
            id="btn-cadastrar-free-agent"
            onClick={() => handleAbrirModal('freeagent')}
            className="group relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-left transition-all hover:border-blue-500/50 hover:bg-zinc-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="text-white font-semibold mb-1">Me cadastrar como free agent</h3>
              <p className="text-zinc-400 text-sm">Mostre que você está disponível para jogar</p>
            </div>
          </button>

          <button
            id="btn-cadastrar-equipe"
            onClick={() => handleAbrirModal('equipe')}
            className="group relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-left transition-all hover:border-purple-500/50 hover:bg-zinc-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="text-white font-semibold mb-1">Cadastrar equipe com vagas</h3>
              <p className="text-zinc-400 text-sm">Procure jogadores para completar seu time</p>
            </div>
          </button>

          <button
            id="btn-buscar-free-agents"
            onClick={() => router.push('/freeagents')}
            className="group relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-left transition-all hover:border-green-500/50 hover:bg-zinc-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="text-white font-semibold mb-1">Buscar free agents</h3>
              <p className="text-zinc-400 text-sm">Veja os jogadores disponíveis</p>
            </div>
          </button>

          <a
            id="btn-grupo-whatsapp"
            href="https://chat.whatsapp.com/LRSVVOsbRae3i1uRHC2xpl"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-left transition-all hover:border-emerald-500/50 hover:bg-zinc-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="text-white font-semibold mb-1">Grupo do WhatsApp</h3>
              <p className="text-zinc-400 text-sm">Entre no grupo da Rinha do Campus IV</p>
            </div>
          </a>
        </div>
      </main>

      {/* Modais */}
      <CadastroFreeAgent
        open={modalFreeAgent}
        onClose={() => setModalFreeAgent(false)}
        onSuccess={() => {/* feedback pode ser adicionado aqui */}}
      />
      <CadastroEquipeVaga
        open={modalEquipe}
        onClose={() => setModalEquipe(false)}
        onSuccess={() => {/* feedback pode ser adicionado aqui */}}
      />
    </div>
  );
}
