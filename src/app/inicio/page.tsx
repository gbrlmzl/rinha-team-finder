'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CadastroFreeAgent } from '@/components/modals/CadastroFreeAgent';
import { CadastroEquipeVaga } from '@/components/modals/CadastroEquipeVaga';

// SVG Icon components
function GamepadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <circle cx="8.5" cy="12" r="1.5" />
      <circle cx="15.5" cy="12" r="1.5" />
      <path d="M6 9v6M3 12h6" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isFirst?: boolean;
}

function MenuItem({ icon, title, description, onClick, isFirst }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-5 px-5 py-5 text-left transition-all duration-200 hover:bg-cyan-dim ${
        !isFirst ? 'border-t border-cyan/10' : ''
      }`}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-cyan transition-colors group-hover:text-cyan-hover">
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-text-main transition-colors group-hover:text-cyan sm:text-base">
          {title}
        </h3>
        <p className="font-sans mt-0.5 text-xs text-text-muted transition-colors group-hover:text-text-main/80 sm:text-sm">
          {description}
        </p>
      </div>

      {/* Arrow (Usa o pink-subtle que é super discreto e pedido como aceitável para setas) */}
      <ArrowRightIcon className="h-5 w-5 shrink-0 text-cyan transition-all duration-200 group-hover:translate-x-1 group-hover:text-pink-subtle" />
    </button>
  );
}

export default function InicioPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [modalFreeAgent, setModalFreeAgent] = useState(false);
  const [modalEquipe, setModalEquipe] = useState(false);

  const handleAbrirModal = (tipo: 'freeagent' | 'equipe') => {
    if (!session?.user) {
      router.push('/auth/login?redirect=/inicio');
      return;
    }
    if (tipo === 'freeagent') setModalFreeAgent(true);
    else setModalEquipe(true);
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 pt-16 sm:pt-20">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold uppercase tracking-[-0.04em] text-text-main leading-[0.85]">
          Rinha Team Finder
        </h1>
        <p className="font-sans text-text-muted text-sm mt-4 max-w-md mx-auto tracking-wide font-light">
          Encontre jogadores ou equipes para a <strong className="font-medium text-cyan">Rinha do Campus IV — Edição II</strong>
        </p>
      </div>

      {/* Menu — full-width rows */}
      <div className="w-full max-w-3xl rounded-xl border border-cyan/10 bg-navy-light/50 overflow-hidden shadow-2xl shadow-cyan/5">
        <MenuItem
          icon={<GamepadIcon className="h-7 w-7" />}
          title="Me cadastrar como free agent"
          description="Mostre que você está disponível para jogar"
          onClick={() => handleAbrirModal('freeagent')}
          isFirst
        />
        <MenuItem
          icon={<UsersIcon className="h-7 w-7" />}
          title="Cadastrar equipe com vagas"
          description="Procure jogadores para completar seu time"
          onClick={() => handleAbrirModal('equipe')}
        />
        <MenuItem
          icon={<SearchIcon className="h-7 w-7" />}
          title="Buscar free agents"
          description="Veja os jogadores disponíveis"
          onClick={() => router.push('/freeagents')}
        />
        <MenuItem
          icon={<SearchIcon className="h-7 w-7" />}
          title="Buscar equipes"
          description="Veja times com vagas abertas"
          onClick={() => router.push('/equipes')}
        />
        <a
          href="https://chat.whatsapp.com/LRSVVOsbRae3i1uRHC2xpl"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center gap-5 border-t border-cyan/10 px-5 py-5 text-left transition-all duration-200 hover:bg-cyan-dim"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center text-cyan transition-colors group-hover:text-cyan-hover">
            <ChatIcon className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-text-main transition-colors group-hover:text-cyan sm:text-base">
              Grupo do WhatsApp
            </h3>
            <p className="font-sans mt-0.5 text-xs text-text-muted transition-colors group-hover:text-text-main/80 sm:text-sm">
              Entre no grupo da Rinha do Campus IV
            </p>
          </div>
          <ArrowRightIcon className="h-5 w-5 shrink-0 text-cyan transition-all duration-200 group-hover:translate-x-1 group-hover:text-pink-subtle" />
        </a>
      </div>

      {/* Modais */}
      <CadastroFreeAgent
        open={modalFreeAgent}
        onClose={() => setModalFreeAgent(false)}
        onSuccess={() => {}}
      />
      <CadastroEquipeVaga
        open={modalEquipe}
        onClose={() => setModalEquipe(false)}
        onSuccess={() => {}}
      />
    </main>
  );
}
