'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Lane } from '@/types';
import { PLAYER_POSITIONS } from '@/constants/positions';
import { buildLeagueOfGraphsUrl } from '@/constants/links';
import { useSession } from 'next-auth/react';
import { ModalConfirmacao } from '@/components/modals/ModalConfirmacao';

interface FreeAgentInfoResumeProps {
  id: string;
  nickname: string;
  lanePrincipal: Lane;
  laneSecundaria: Lane | null;
  discord: string;
  userId: string;
  onDelete?: () => void;
}

export function FreeAgentInfoResume({
  id,
  nickname,
  lanePrincipal,
  laneSecundaria,
  discord,
  userId,
  onDelete,
}: FreeAgentInfoResumeProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [deletando, setDeletando] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);

  const iconPrincipal = PLAYER_POSITIONS.find((p) => p.key === lanePrincipal);
  const iconSecundaria = PLAYER_POSITIONS.find((p) => p.key === laneSecundaria);
  const nicknameUrl = buildLeagueOfGraphsUrl(nickname);

  const isLoggedIn = !!session?.user;
  const isOwner = session?.user?.id === userId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canDelete = isOwner || isAdmin;

  const irParaLogin = () => router.push(`/auth/login?redirect=${pathname}`);

  const handleDelete = async () => {
    setDeletando(true);
    try {
      const res = await fetch(`/api/free-agents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setModalConfirmar(false);
        onDelete?.();
      }
    } catch {
      // erro silencioso
    } finally {
      setDeletando(false);
    }
  };

  return (
    <>
      <div className="group flex items-start gap-4 rounded-xl border border-cyan/10 bg-navy-light p-4 transition-colors duration-200 hover:border-cyan/30">
        <div className="min-w-0 flex-1">
          {/* Nickname (clicável -> League of Graphs) */}
          {nicknameUrl ? (
            <a
              href={nicknameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display block truncate text-lg font-bold tracking-wide text-text-main transition-colors hover:text-cyan"
              title="Ver perfil no League of Graphs"
            >
              {nickname}
            </a>
          ) : (
            <p className="font-display truncate text-lg font-bold tracking-wide text-text-main">{nickname}</p>
          )}

          {/* Chips: rotas (ciano) + Discord (blurple) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {iconPrincipal && (
              <span
                className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan-dim px-3 py-1.5 text-xs font-bold text-cyan"
                title={`Principal: ${iconPrincipal.label}`}
              >
                <span className="relative h-4 w-4 shrink-0">
                  <Image src={iconPrincipal.icon} alt={iconPrincipal.label} fill style={{ objectFit: 'contain' }} />
                </span>
                {iconPrincipal.label}
              </span>
            )}
            {iconSecundaria && (
              <span
                className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan-dim px-3 py-1.5 text-xs font-bold text-cyan"
                title={`Secundária: ${iconSecundaria.label}`}
              >
                <span className="relative h-4 w-4 shrink-0">
                  <Image src={iconSecundaria.icon} alt={iconSecundaria.label} fill style={{ objectFit: 'contain' }} />
                </span>
                {iconSecundaria.label}
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
        </div>

        {canDelete && (
          <button
            onClick={() => setModalConfirmar(true)}
            disabled={deletando}
            className="shrink-0 rounded-lg p-1.5 text-pink-subtle transition-all hover:bg-pink-subtle/10 disabled:opacity-50"
            title="Remover"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        )}
      </div>

      <ModalConfirmacao
        open={modalConfirmar}
        onClose={() => setModalConfirmar(false)}
        onConfirm={handleDelete}
        titulo="Remover Free Agent"
        mensagem={`Tem certeza que deseja remover "${nickname}"? Esta ação não pode ser desfeita.`}
        textoBotaoConfirmar="Remover"
        loading={deletando}
      />
    </>
  );
}
