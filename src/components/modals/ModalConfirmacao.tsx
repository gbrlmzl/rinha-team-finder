'use client';

interface ModalConfirmacaoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo?: string;
  mensagem?: string;
  textoBotaoConfirmar?: string;
  textoBotaoCancelar?: string;
  loading?: boolean;
}

export function ModalConfirmacao({
  open,
  onClose,
  onConfirm,
  titulo = 'Confirmar ação',
  mensagem = 'Tem certeza que deseja continuar?',
  textoBotaoConfirmar = 'Confirmar',
  textoBotaoCancelar = 'Cancelar',
  loading = false,
}: ModalConfirmacaoProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm font-sans">
      <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-cyan/10 bg-navy p-8 text-center shadow-2xl">
        {/* Warning icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pink-subtle/10 border border-pink-subtle/20">
          <svg
            className="h-8 w-8 text-pink-subtle"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h3 className="font-display mb-2 text-xl font-extrabold uppercase tracking-[-0.04em] text-text-main">{titulo}</h3>
        <p className="mb-6 text-sm text-text-muted font-light">{mensagem}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-cyan/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-text-main transition-colors hover:bg-cyan-dim disabled:opacity-50"
          >
            {textoBotaoCancelar}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-pink-subtle px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-pink-subtle/80 disabled:opacity-50"
          >
            {loading ? 'Processando...' : textoBotaoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
