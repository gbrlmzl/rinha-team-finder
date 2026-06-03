'use client';

import { useState } from 'react';
import { Lane } from '@/types';
import { PositionSelector } from '@/components/PositionSelector';

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

  if (!open) return null;

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

      // Reset form
      setNickname('');
      setLanePrincipal(null);
      setLaneSecundaria(null);
      setContato('');
      onSuccess();
      onClose();
    } catch {
      setErro('Erro de conexão.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl relative">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Cadastrar-se como Free Agent</h2>

        <div className="space-y-4">
          {/* Nickname */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Seu nick no LoL"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Lane Principal */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Lane Principal</label>
            <div className="flex justify-center">
              <PositionSelector
                value={lanePrincipal}
                onChange={setLanePrincipal}
              />
            </div>
          </div>

          {/* Lane Secundária */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Lane Secundária</label>
            <div className="flex justify-center">
              <PositionSelector
                value={laneSecundaria}
                onChange={setLaneSecundaria}
              />
            </div>
          </div>

          {/* Contato */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Número WhatsApp</label>
            <input
              type="text"
              value={contato}
              onChange={(e) => setContato(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex: 83999999999"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Erro */}
          {erro && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">{erro}</p>
          )}

          {/* Botão */}
          <button
            onClick={handleSubmit}
            disabled={enviando}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? 'Cadastrando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
