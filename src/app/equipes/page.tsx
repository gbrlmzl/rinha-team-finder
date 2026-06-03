'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EquipeData } from '@/types';
import { EquipeInfoResume } from '@/components/EquipeInfoResume';

export default function EquipesPage() {
  const [equipes, setEquipes] = useState<EquipeData[]>([]);
  const [carregando, setCarregando] = useState(true);

  const fetchEquipes = async () => {
    try {
      const res = await fetch('/api/equipes');
      const data = await res.json();
      setEquipes(data);
    } catch {
      setEquipes([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchEquipes();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 pt-16 sm:pt-20">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Equipes com vagas</h1>
          <p className="mt-2 text-sm text-zinc-400">Veja times procurando jogadores e entre em contato com o capitão.</p>
        </div>

        <Link href="/inicio" className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-900">
          Voltar
        </Link>
      </div>

      {carregando ? (
        <div className="py-12 text-center text-zinc-400">Carregando...</div>
      ) : equipes.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 py-12 text-center">
          <p className="text-lg text-zinc-200">Nenhuma equipe disponível no momento</p>
          <p className="mt-2 text-sm text-zinc-500">Quando algum time abrir vagas, ele aparecerá aqui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {equipes.map((equipe) => (
            <EquipeInfoResume
              key={equipe.id}
              id={equipe.id}
              nome={equipe.nome}
              contatoCapitao={equipe.contatoCapitao}
              laneCapitao={equipe.laneCapitao}
              vagasLanes={equipe.vagasLanes}
              createdAt={equipe.createdAt}
              userId={equipe.userId}
              onDelete={fetchEquipes}
            />
          ))}
        </div>
      )}
    </main>
  );
}