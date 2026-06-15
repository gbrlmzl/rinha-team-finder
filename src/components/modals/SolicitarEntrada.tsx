'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Lane } from '@/types';
import { PLAYER_POSITIONS } from '@/constants/positions';

interface SolicitarEntradaProps {
  open: boolean;
  onClose: () => void;
  equipe: {
    id: string;
    nome: string;
    vagasLanes: Lane[];
  };
}

export function SolicitarEntrada({ open, onClose, equipe }: SolicitarEntradaProps) {
  const [solicitadas, setSolicitadas] = useState<Lane[]>([]);
  const [enviando, setEnviando] = useState<Lane | null>(null);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Ao abrir, busca quais lanes o usuário já solicitou nesta equipe.
  useEffect(() => {
    if (!open) return;
    let ativo = true;
    fetch(`/api/equipes/${equipe.id}/solicitar`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ativo) return;
        setSolicitadas(data?.lanesSolicitadas ?? []);
        setErro('');
        setMensagem('');
      })
      .catch(() => {
        if (ativo) setSolicitadas([]);
      });
    return () => {
      ativo = false;
    };
  }, [open, equipe.id]);

  if (!open) return null;

  const solicitar = async (lane: Lane) => {
    setErro('');
    setMensagem('');
    setEnviando(lane);
    try {
      const res = await fetch(`/api/equipes/${equipe.id}/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lane }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro || 'Erro ao solicitar entrada.');
        return;
      }
      setSolicitadas((prev) => (prev.includes(lane) ? prev : [...prev, lane]));
      setMensagem(data.mensagem);
    } catch {
      setErro('Erro de conexão.');
    } finally {
      setEnviando(null);
    }
  };

  // Vagas únicas (a equipe pode ter cadastrado a mesma lane mais de uma vez).
  const vagas = Array.from(new Set(equipe.vagasLanes))
    .map((lane) => PLAYER_POSITIONS.find((p) => p.key === lane))
    .filter((p): p is (typeof PLAYER_POSITIONS)[number] => Boolean(p));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-pink-subtle/20 bg-navy-light p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-text-muted transition-colors hover:text-text-main">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-display text-2xl font-extrabold uppercase tracking-[-0.04em] text-text-main">Solicitar entrada</h2>
        <p className="mt-1 text-sm font-light text-text-muted">
          Equipe <span className="font-semibold text-text-main">{equipe.nome}</span>. Escolha a vaga que você quer disputar — o bot te leva pro canal da equipe no Discord.
        </p>

        <div className="mt-5 space-y-2">
          {vagas.map((pos) => {
            const jaSolicitou = solicitadas.includes(pos.key);
            return (
              <button
                key={pos.key}
                onClick={() => solicitar(pos.key)}
                disabled={jaSolicitou || enviando !== null}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                  jaSolicitou
                    ? 'cursor-not-allowed border-cyan/10 bg-navy/40 opacity-50'
                    : 'border-pink-subtle/20 bg-navy hover:border-pink-subtle/50 hover:bg-pink-subtle/10 disabled:opacity-50'
                }`}
              >
                <span className="relative h-6 w-6 shrink-0">
                  <Image src={pos.icon} alt={pos.label} fill style={{ objectFit: 'contain' }} />
                </span>
                <span className="flex-1 text-sm font-bold uppercase tracking-wide text-text-main">{pos.label}</span>
                {jaSolicitou ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-cyan">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Já solicitado
                  </span>
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-widest text-pink-subtle">
                    {enviando === pos.key ? 'Enviando...' : 'Solicitar'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {mensagem && (
          <p className="mt-4 rounded-lg border border-cyan/20 bg-cyan-dim px-3 py-2 text-sm text-cyan">{mensagem}</p>
        )}
        {erro && (
          <p className="mt-4 rounded-lg border border-pink-subtle/20 bg-pink-subtle/10 px-3 py-2 text-sm text-pink-subtle">{erro}</p>
        )}
      </div>
    </div>
  );
}
