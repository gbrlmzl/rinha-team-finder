'use client';

import { useEffect, useState } from 'react';
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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 pt-16 sm:pt-20">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-[-0.02em] text-text-main sm:text-3xl">Free Agents Disponíveis</h1>
        <p className="mt-2 text-sm text-text-muted font-light">Veja os jogadores disponíveis e entre em contato.</p>
      </div>

      {carregando ? (
        <div className="py-12 text-center text-text-muted">Carregando...</div>
      ) : freeAgents.length === 0 ? (
        <div className="rounded-2xl border border-cyan/10 bg-navy-light/50 py-12 text-center">
          <p className="text-lg text-text-main">Nenhum free agent disponível no momento</p>
          <p className="mt-2 text-sm text-text-muted">Seja o primeiro a se cadastrar!</p>
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
  );
}
