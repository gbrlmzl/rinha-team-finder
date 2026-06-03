'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lane } from '@/types';
import { PositionSelector } from '@/components/PositionSelector';
import { PLAYER_POSITIONS } from '@/constants/positions';

interface CadastroEquipeVagaProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CadastroEquipeVaga({ open, onClose, onSuccess }: CadastroEquipeVagaProps) {
  const [nome, setNome] = useState('');
  const [contatoCapitao, setContatoCapitao] = useState('');
  const [laneCapitao, setLaneCapitao] = useState<Lane | null>(null);
  const [vagasLanes, setVagasLanes] = useState<Lane[]>([]);
  const [adicionandoVaga, setAdicionandoVaga] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!open) return null;

  // Lanes já ocupadas: capitão + vagas adicionadas
  const lanesOcupadas: Lane[] = [
    ...(laneCapitao ? [laneCapitao] : []),
    ...vagasLanes,
  ];

  const handleAdicionarVaga = (lane: Lane) => {
    setVagasLanes((prev) => [...prev, lane]);
    setAdicionandoVaga(false);
  };

  const handleRemoverVaga = (index: number) => {
    setVagasLanes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErro('');

    if (!nome.trim() || !contatoCapitao.trim() || !laneCapitao) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('/api/equipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          contatoCapitao: contatoCapitao.trim(),
          laneCapitao,
          vagasLanes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.erro || 'Erro ao cadastrar.');
        return;
      }

      // Reset
      setNome('');
      setContatoCapitao('');
      setLaneCapitao(null);
      setVagasLanes([]);
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
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Cadastrar Equipe com Vagas</h2>

        <div className="space-y-4">
          {/* Nome da equipe */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nome da Equipe</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do time"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* WhatsApp do capitão */}
          <div>
            <label className="block text-sm text-zinc-400 mb-1">WhatsApp do Capitão</label>
            <input
              type="text"
              value={contatoCapitao}
              onChange={(e) => setContatoCapitao(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex: 83999999999"
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Lane do capitão */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Lane do Capitão</label>
            <div className="flex justify-center">
              <PositionSelector
                value={laneCapitao}
                onChange={(lane) => {
                  setLaneCapitao(lane);
                  // Remover vagas que conflitem com nova lane do capitão
                  setVagasLanes((prev) => prev.filter((v) => v !== lane));
                }}
              />
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-zinc-700 pt-4">
            <label className="block text-sm text-zinc-400 mb-3">Vagas Abertas</label>

            {/* Lista de vagas */}
            <div className="space-y-2">
              {vagasLanes.map((lane, index) => {
                const pos = PLAYER_POSITIONS.find((p) => p.key === lane);
                return (
                  <div key={`${lane}-${index}`} className="flex items-center gap-3 bg-zinc-800/50 rounded-lg px-3 py-2">
                    {pos && (
                      <div className="relative w-8 h-8 shrink-0">
                        <Image src={pos.icon} alt={pos.label} fill style={{ objectFit: 'contain' }} />
                      </div>
                    )}
                    <span className="text-white text-sm flex-1">{pos?.label}</span>
                    <button
                      onClick={() => handleRemoverVaga(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Botão + ou seletor de vaga */}
            {vagasLanes.length < 4 && (
              <div className="mt-3">
                {adicionandoVaga ? (
                  <div className="flex justify-center">
                    <PositionSelector
                      value={null}
                      onChange={handleAdicionarVaga}
                      disabledLanes={lanesOcupadas}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setAdicionandoVaga(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Adicionar vaga
                  </button>
                )}
              </div>
            )}
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
