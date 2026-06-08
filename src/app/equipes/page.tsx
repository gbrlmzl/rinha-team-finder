'use client';

import { useEffect, useState } from 'react';
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
      <div className="mb-8">
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-[-0.02em] text-text-main sm:text-3xl">Equipes com vagas</h1>
        <p className="mt-2 text-sm text-text-muted font-light">Veja times procurando jogadores e entre em contato com o capitão.</p>
      </div>

      {carregando ? (
        <div className="py-12 text-center text-text-muted">Carregando...</div>
      ) : equipes.length === 0 ? (
        <div className="rounded-2xl border border-cyan/10 bg-navy-light/50 py-12 text-center">
          <p className="text-lg text-text-main">Nenhuma equipe disponível no momento</p>
          <p className="mt-2 text-sm text-text-muted">Quando algum time abrir vagas, ele aparecerá aqui.</p>
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
              onUpdate={fetchEquipes}
            />
          ))}
        </div>
      )}
    </main>
  );
}