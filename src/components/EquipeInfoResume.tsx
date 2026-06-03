'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { EquipeData, Lane } from '@/types';
import { PLAYER_POSITIONS } from '@/constants/positions';

interface EquipeInfoResumeProps extends EquipeData {
  onDelete?: () => void;
}

function getPosition(lane: Lane) {
  return PLAYER_POSITIONS.find((position) => position.key === lane);
}

export function EquipeInfoResume({
  id,
  nome,
  contatoCapitao,
  laneCapitao,
  vagasLanes,
  userId,
  onDelete,
}: EquipeInfoResumeProps) {
  const { data: session } = useSession();
  const [copiado, setCopiado] = useState(false);
  const [deletando, setDeletando] = useState(false);

  const posicaoCapitao = getPosition(laneCapitao);
  const vagasVisiveis = vagasLanes.map(getPosition).filter(Boolean);

  const isOwner = session?.user?.id === userId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canDelete = isOwner || isAdmin;

  const handleCopiarContato = async () => {
    try {
      await navigator.clipboard.writeText(contatoCapitao);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // silencioso
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja remover esta equipe?')) return;

    setDeletando(true);
    try {
      const res = await fetch(`/api/equipes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete?.();
      }
    } finally {
      setDeletando(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/20 transition-colors hover:border-zinc-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <div className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
              Equipe
            </div>
            <p className="truncate text-lg font-bold text-white">{nome}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {posicaoCapitao && (
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-200">
                <span className="relative h-5 w-5 shrink-0">
                  <Image src={posicaoCapitao.icon} alt={posicaoCapitao.label} fill style={{ objectFit: 'contain' }} />
                </span>
                Capitão: {posicaoCapitao.label}
              </span>
            )}

            {vagasVisiveis.length === 0 ? (
              <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-400">
                Sem vagas abertas
              </span>
            ) : (
              vagasVisiveis.map((posicao) => {
                if (!posicao) return null;
                return (
                  <span key={posicao.key} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                    <span className="relative h-5 w-5 shrink-0">
                      <Image src={posicao.icon} alt={posicao.label} fill style={{ objectFit: 'contain' }} />
                    </span>
                    {posicao.label}
                  </span>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <button
            onClick={handleCopiarContato}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            {copiado ? 'Copiado!' : 'WhatsApp do Capitão'}
          </button>

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deletando}
              className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              {deletando ? 'Removendo...' : 'Excluir'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}