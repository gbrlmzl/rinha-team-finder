'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FreeAgentData } from '@/types';
import { FreeAgentInfoResume } from '@/components/FreeAgentInfoResume';

export default function FreeAgentsPage() {
  const [freeAgents, setFreeAgents] = useState<FreeAgentData[]>([]);
  const [carregando, setCarregando] = useState(true);

  const fetchFreeAgents = async () => {
    try {
      const res = await fetch('/api/free-agents');
      const data = await res.json();
      setFreeAgents(data);
    } catch {
      // erro silencioso
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchFreeAgents();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 pt-16 sm:pt-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Free Agents Disponíveis</h1>
          <Link
            href="/inicio"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            ← Voltar
          </Link>
        </div>

        {carregando ? (
          <div className="text-center py-12">
            <p className="text-zinc-400">Carregando...</p>
          </div>
        ) : freeAgents.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 border border-zinc-700/50 rounded-xl">
            <p className="text-zinc-400 text-lg">Nenhum free agent disponível no momento</p>
            <p className="text-zinc-500 text-sm mt-2">Seja o primeiro a se cadastrar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {freeAgents.map((fa) => (
              <FreeAgentInfoResume
                key={fa.id}
                id={fa.id}
                nickname={fa.nickname}
                lanePrincipal={fa.lanePrincipal}
                laneSecundaria={fa.laneSecundaria}
                contato={fa.contato}
                userId={fa.userId}
                onDelete={fetchFreeAgents}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
