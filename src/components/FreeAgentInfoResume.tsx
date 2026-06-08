'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lane } from '@/types';
import { PLAYER_POSITIONS } from '@/constants/positions';
import { useSession } from 'next-auth/react';
import { ModalConfirmacao } from '@/components/modals/ModalConfirmacao';

interface FreeAgentInfoResumeProps {
  id: string;
  nickname: string;
  lanePrincipal: Lane;
  laneSecundaria: Lane;
  contato: string;
  userId: string;
  onDelete?: () => void;
}

export function FreeAgentInfoResume({
  id,
  nickname,
  lanePrincipal,
  laneSecundaria,
  contato,
  userId,
  onDelete,
}: FreeAgentInfoResumeProps) {
  const { data: session } = useSession();
  const [copiado, setCopiado] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [modalConfirmar, setModalConfirmar] = useState(false);

  const iconPrincipal = PLAYER_POSITIONS.find((p) => p.key === lanePrincipal);
  const iconSecundaria = PLAYER_POSITIONS.find((p) => p.key === laneSecundaria);

  const isOwner = session?.user?.id === userId;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canDelete = isOwner || isAdmin;

  const handleCopiarContato = async () => {
    try {
      await navigator.clipboard.writeText(contato);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Fallback silencioso
    }
  };

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
      <div className="bg-navy-light border border-cyan/10 rounded-xl p-4 flex items-center gap-4 hover:border-cyan/30 transition-all duration-200 group">
        {/* Ícones de lanes */}
        <div className="flex items-center gap-2 shrink-0">
          {iconPrincipal && (
            <div className="relative w-10 h-10" title={`Principal: ${iconPrincipal.label}`}>
              <Image src={iconPrincipal.icon} alt={iconPrincipal.label} fill style={{ objectFit: 'contain' }} />
            </div>
          )}
          {iconSecundaria && (
            <div className="relative w-10 h-10 opacity-60" title={`Secundária: ${iconSecundaria.label}`}>
              <Image src={iconSecundaria.icon} alt={iconSecundaria.label} fill style={{ objectFit: 'contain' }} />
            </div>
          )}
        </div>

        {/* Nickname */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-text-main font-bold text-lg truncate uppercase tracking-wide">{nickname}</p>
          <p className="text-text-muted text-xs font-medium">
            {iconPrincipal?.label} / {iconSecundaria?.label}
          </p>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopiarContato}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-dim text-cyan hover:bg-cyan/20 border border-cyan/20 transition-all text-sm font-semibold"
            title="Copiar contato"
          >
            {copiado ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Copiado!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                WhatsApp
              </>
            )}
          </button>

          {canDelete && (
            <button
              onClick={() => setModalConfirmar(true)}
              disabled={deletando}
              className="p-1.5 rounded-lg text-pink-subtle hover:bg-pink-subtle/10 transition-all disabled:opacity-50"
              title="Remover"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
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
