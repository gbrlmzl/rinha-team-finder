'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { EquipeData, Lane } from '@/types';
import { PLAYER_POSITIONS } from '@/constants/positions';
import { ModalConfirmacao } from '@/components/modals/ModalConfirmacao';
import { EditarEquipe } from '@/components/modals/EditarEquipe';

interface EquipeInfoResumeProps extends EquipeData {
  onDelete?: () => void;
  onUpdate?: () => void;
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
  onUpdate,
}: EquipeInfoResumeProps) {
  const { data: session } = useSession();
  const [copiado, setCopiado] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const posicaoCapitao = getPosition(laneCapitao);
  const vagasVisiveis = vagasLanes.map(getPosition).filter(Boolean);

  const isOwner = session?.user?.id === userId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canDelete = isOwner || isAdmin;
  const canEdit = isOwner;

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
    setDeletando(true);
    try {
      const res = await fetch(`/api/equipes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setModalConfirmar(false);
        onDelete?.();
      }
    } finally {
      setDeletando(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-cyan/10 bg-navy-light p-4 shadow-lg transition-colors hover:border-cyan/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="inline-flex rounded-md border border-purple-light/20 bg-purple-dim px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-light">
                Equipe
              </div>
              <p className="font-display truncate text-xl font-bold uppercase tracking-wide text-text-main">{nome}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {posicaoCapitao && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-cyan/10 bg-navy px-3 py-1.5 text-xs font-semibold text-text-main">
                  <span className="relative h-4 w-4 shrink-0">
                    <Image src={posicaoCapitao.icon} alt={posicaoCapitao.label} fill style={{ objectFit: 'contain' }} />
                  </span>
                  Capitão: {posicaoCapitao.label}
                </span>
              )}

              {vagasVisiveis.length === 0 ? (
                <span className="rounded-lg border border-cyan/10 bg-navy px-3 py-1.5 text-xs font-medium text-text-muted">
                  Sem vagas abertas
                </span>
              ) : (
                vagasVisiveis.map((posicao, index) => {
                  if (!posicao) return null;
                  return (
                    <span key={`${posicao.key}-${index}`} className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan-dim px-3 py-1.5 text-xs font-bold text-cyan">
                      <span className="relative h-4 w-4 shrink-0">
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
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan/20 bg-cyan-dim px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan transition-colors hover:bg-cyan/20"
            >
              {copiado ? 'Copiado!' : 'WhatsApp do Capitão'}
            </button>

            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={() => setModalEditar(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan/20 bg-cyan-dim px-3 py-2 text-xs font-bold uppercase tracking-wider text-cyan transition-colors hover:bg-cyan/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Editar
                </button>
              )}

              {canDelete && (
                <button
                  onClick={() => setModalConfirmar(true)}
                  disabled={deletando}
                  className="inline-flex items-center justify-center rounded-lg border border-pink-subtle/20 bg-pink-subtle/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-pink-subtle transition-colors hover:bg-pink-subtle/20 disabled:opacity-50"
                >
                  {deletando ? '...' : 'Excluir'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmacao
        open={modalConfirmar}
        onClose={() => setModalConfirmar(false)}
        onConfirm={handleDelete}
        titulo="Remover Equipe"
        mensagem={`Tem certeza que deseja remover a equipe "${nome}"? Esta ação não pode ser desfeita.`}
        textoBotaoConfirmar="Remover"
        loading={deletando}
      />

      <EditarEquipe
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        onSuccess={() => {
          setModalEditar(false);
          onUpdate?.();
        }}
        equipe={{ id, nome, contatoCapitao, laneCapitao, vagasLanes }}
      />
    </>
  );
}