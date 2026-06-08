'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MudarSenhaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center font-sans">
        <p className="text-text-muted">Carregando...</p>
      </div>
    );
  }

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (novaSenha !== confirmarNovaSenha) {
      setErro('As novas senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    setCarregando(true);
    try {
      const res = await fetch('/api/usuarios/mudar-senha', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || 'Erro ao alterar senha');
        return;
      }

      setMensagem(data.mensagem);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
    } catch {
      setErro('Erro de conexão');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full flex-1 bg-navy flex items-center justify-center px-4 font-sans py-12">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-[-0.04em] text-center mb-2 text-text-main">
          Mudar Senha
        </h1>
        <p className="text-text-muted text-center mb-8 text-sm font-light">Altere sua senha de acesso</p>

        <form onSubmit={handleSubmit} className="bg-navy-light border border-cyan/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div>
            <label htmlFor="senha-atual" className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-1.5">Senha Atual</label>
            <input
              id="senha-atual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-input-bg border border-input-border text-text-main placeholder-text-muted/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="nova-senha" className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-1.5">Nova Senha</label>
            <input
              id="nova-senha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-input-bg border border-input-border text-text-main placeholder-text-muted/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="confirmar-nova-senha" className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-1.5">Confirmar Nova Senha</label>
            <input
              id="confirmar-nova-senha"
              type="password"
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-input-bg border border-input-border text-text-main placeholder-text-muted/50 focus:outline-none transition-colors"
            />
          </div>

          {erro && (
            <p className="text-pink-subtle text-sm bg-pink-subtle/10 border border-pink-subtle/20 rounded-lg px-3 py-2">{erro}</p>
          )}

          {mensagem && (
            <p className="text-cyan text-sm bg-cyan-dim border border-cyan/20 rounded-lg px-3 py-2">{mensagem}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 rounded-lg bg-cyan hover:bg-cyan-hover text-navy font-bold uppercase tracking-widest text-sm transition-colors disabled:opacity-50"
          >
            {carregando ? 'ALTERANDO...' : 'ALTERAR SENHA'}
          </button>

          <Link
            href="/inicio"
            className="block text-center text-sm font-semibold text-text-muted hover:text-cyan transition-colors pt-2"
          >
            ← Voltar para o início
          </Link>
        </form>
      </div>
    </div>
  );
}
