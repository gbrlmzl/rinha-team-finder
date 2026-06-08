'use client';

import { useEffect } from 'react';

interface ModalSucessoProps {
  open: boolean;
  onClose: () => void;
  titulo?: string;
  mensagem?: string;
  autoCloseMs?: number;
}

export function ModalSucesso({
  open,
  onClose,
  titulo = 'Cadastro realizado!',
  mensagem = 'Sua operação foi concluída com sucesso.',
  autoCloseMs = 4000,
}: ModalSucessoProps) {
  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [open, onClose, autoCloseMs]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm font-sans">
      <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-cyan/10 bg-navy p-8 text-center shadow-2xl">
        {/* Animated check icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-dim border border-cyan/30">
          <svg
            className="h-8 w-8 text-cyan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            style={{
              strokeDasharray: 30,
              strokeDashoffset: 0,
              animation: 'checkDraw 0.4s ease-out',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="font-display mb-2 text-xl font-extrabold uppercase tracking-[-0.04em] text-text-main">{titulo}</h3>
        <p className="mb-6 text-sm text-text-muted font-light">{mensagem}</p>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-cyan px-8 py-3 text-xs font-bold uppercase tracking-widest text-navy transition-colors hover:bg-cyan-hover"
        >
          OK
        </button>
      </div>

      <style jsx>{`
        @keyframes checkDraw {
          from {
            stroke-dashoffset: 30;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
