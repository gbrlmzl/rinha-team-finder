'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { EquipeData, Lane } from '@/types';
import { PLAYER_POSITIONS } from '@/constants/positions';
import { buildLeagueOfGraphsUrl } from '@/constants/links';
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
  nicknameCapitao,
  discord,
  vagasLanes,
  userId,
  onDelete,
  onUpdate,
}: EquipeInfoResumeProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [deletando, setDeletando] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const vagasVisiveis = vagasLanes.map(getPosition).filter(Boolean);
  const capitaoUrl = buildLeagueOfGraphsUrl(nicknameCapitao);

  const isLoggedIn = !!session?.user;
  const isOwner = session?.user?.id === userId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canDelete = isOwner || isAdmin;
  const canEdit = isOwner;

  const irParaLogin = () => router.push(`/auth/login?redirect=${pathname}`);

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
      <div className="rounded-2xl border border-pink-subtle/10 bg-navy-light p-4 shadow-lg transition-colors hover:border-pink-subtle/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="font-display mb-2 truncate text-xl font-bold uppercase tracking-wide text-text-main">{nome}</p>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              {/* Chip do capitão — clicável (League of Graphs) */}
              {capitaoUrl ? (
                <a
                  href={capitaoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-purple-light/30 bg-purple-dim px-2.5 py-1 text-xs font-semibold text-purple-light transition-colors hover:border-purple-light/60 hover:text-white"
                  title="Ver perfil no League of Graphs"
                >
                  Capitão: {nicknameCapitao}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-purple-light/30 bg-purple-dim px-2.5 py-1 text-xs font-semibold text-purple-light">
                  Capitão: {nicknameCapitao}
                </span>
              )}

              {/* Chip do Discord — cor do Discord, não clicável (só exibe o usuário) */}
              {isLoggedIn ? (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#5865F2]/40 bg-[#5865F2]/15 px-2.5 py-1 text-xs font-semibold text-[#a5abf5]">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                  Discord: {discord}
                </span>
              ) : (
                <button
                  onClick={irParaLogin}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#5865F2]/40 bg-[#5865F2]/15 px-2.5 py-1 text-xs font-semibold text-[#a5abf5] transition-colors hover:bg-[#5865F2]/25"
                  title="Faça login para ver o contato"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Discord: entre para ver
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Vagas Disponíveis:</span>
              {vagasVisiveis.length === 0 ? (
                <span className="rounded-lg border border-cyan/10 bg-navy px-3 py-1.5 text-xs font-medium text-text-muted">
                  Sem vagas abertas
                </span>
              ) : (
                vagasVisiveis.map((posicao, index) => {
                  if (!posicao) return null;
                  return (
                    <span key={`${posicao.key}-${index}`} className="inline-flex items-center gap-2 rounded-lg border border-pink-subtle/30 bg-pink-subtle/10 px-3 py-1.5 text-xs font-bold text-pink-subtle">
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

          {(canEdit || canDelete) && (
            <div className="flex gap-2 sm:flex-col sm:items-end">
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
          )}
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
        equipe={{ id, nome, nicknameCapitao, discord, vagasLanes }}
      />
    </>
  );
}
