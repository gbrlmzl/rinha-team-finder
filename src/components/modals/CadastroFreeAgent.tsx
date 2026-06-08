'use client';

import { useState } from 'react';
import { Lane } from '@/types';
import { PositionSelector } from '@/components/PositionSelector';
import { ModalSucesso } from '@/components/modals/ModalSucesso';

interface CadastroFreeAgentProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CadastroFreeAgent({ open, onClose, onSuccess }: CadastroFreeAgentProps) {
  const [nickname, setNickname] = useState('');
  const [lanePrincipal, setLanePrincipal] = useState<Lane | null>(null);
  const [laneSecundaria, setLaneSecundaria] = useState<Lane | null>(null);
  const [contato, setContato] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  const formatarTelefone = (valor: string) => {
    const v = valor.replace(/\D/g, '');
    if (v.length <= 2) return v;
    if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
  };

  if (!open && !mostrarSucesso) return null;

  const handleSubmit = async () => {
    setErro('');

    if (!nickname.trim() || !lanePrincipal || !laneSecundaria || !contato.trim()) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    if (lanePrincipal === laneSecundaria) {
      setErro('A lane principal deve ser diferente da lane secundária.');
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('/api/free-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), lanePrincipal, laneSecundaria, contato: contato.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.erro || 'Erro ao cadastrar.');
        return;
      }

      setNickname('');
      setLanePrincipal(null);
      setLaneSecundaria(null);
      setContato('');
      onSuccess();
      onClose();
      setMostrarSucesso(true);
    } catch {
      setErro('Erro de conexão.');
    } finally {
      setEnviando(false);
    }
  };

  if (mostrarSucesso) {
    return (
      <ModalSucesso
        open={mostrarSucesso}
        onClose={() => setMostrarSucesso(false)}
        titulo="Free Agent cadastrado!"
        mensagem="Você agora está visível para equipes que buscam jogadores."
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm font-sans">
      <div className="bg-navy-light border border-cyan/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl relative overflow-visible">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="font-display text-2xl font-extrabold uppercase tracking-[-0.04em] text-text-main mb-6">Cadastrar-se como Free Agent</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-1.5">Nickname</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nickname"
              className="w-full px-4 py-2.5 rounded-lg bg-input-bg border border-input-border text-text-main placeholder-text-muted/50 focus:outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-3 text-center">Lanes</label>
            <div className="flex justify-center items-start gap-10">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Principal</span>
                <PositionSelector value={lanePrincipal} onChange={setLanePrincipal} disabledLanes={laneSecundaria ? [laneSecundaria] : []} variant="radial" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Secundária</span>
                <PositionSelector value={laneSecundaria} onChange={setLaneSecundaria} disabledLanes={lanePrincipal ? [lanePrincipal] : []} variant="radial" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-1.5">Número WhatsApp</label>
            <input type="text" value={contato} onChange={(e) => setContato(formatarTelefone(e.target.value))} maxLength={15} placeholder="(83) 99999-9999"
              className="w-full px-4 py-2.5 rounded-lg bg-input-bg border border-input-border text-text-main placeholder-text-muted/50 focus:outline-none transition-colors" />
          </div>

          {erro && <p className="text-pink-subtle text-sm bg-pink-subtle/10 border border-pink-subtle/20 rounded-lg px-3 py-2">{erro}</p>}

          <button onClick={handleSubmit} disabled={enviando}
            className="w-full py-3 rounded-lg bg-cyan hover:bg-cyan-hover text-navy font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {enviando ? 'CADASTRANDO...' : 'CONFIRMAR'}
          </button>
        </div>
      </div>
    </div>
  );
}
