'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import Image from 'next/image';
import { Lane } from '@/types';
import { PLAYER_POSITIONS, DEFAULT_POSITION_ICON } from '@/constants/positions';

interface PositionSelectorProps {
  value: Lane | null;
  onChange: (position: Lane) => void;
  onKeyboardConfirm?: () => void;
  disabled?: boolean;
  disabledLanes?: Lane[];
  size?: 'small' | 'medium' | 'large';
}

export function PositionSelector({
  value,
  onChange,
  onKeyboardConfirm,
  disabled = false,
  disabledLanes = [],
  size = 'medium',
}: PositionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [, setAnchorRef] = useState<HTMLElement | null>(null);
  const positionItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const iconSize = size === 'small' ? 32 : size === 'large' ? 56 : 40;

  const currentPosition = PLAYER_POSITIONS.find((p) => p.key === value);
  const iconSrc = currentPosition?.icon || DEFAULT_POSITION_ICON;

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    setAnchorRef(event.currentTarget);
    setOpen(true);
  };

  const handleCloseMenu = () => {
    setOpen(false);
    setAnchorRef(null);
  };

  const handleSelectPosition = (position: Lane) => {
    onChange(position);
    handleCloseMenu();
  };

  const focusPositionAtIndex = (index: number) => {
    positionItemRefs.current[index]?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const selectedIndex = Math.max(
      0,
      PLAYER_POSITIONS.findIndex((p) => p.key === value)
    );
    const id = window.requestAnimationFrame(() => focusPositionAtIndex(selectedIndex));
    return () => window.cancelAnimationFrame(id);
  }, [open, value]);

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleCloseMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handlePositionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const total = PLAYER_POSITIONS.length;
    let nextIndex = index;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % total;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + total) % total;
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        event.stopPropagation();
        handleSelectPosition(PLAYER_POSITIONS[index].key);
        if (event.key === 'Enter') onKeyboardConfirm?.();
        return;
      }
      case 'Escape':
        handleCloseMenu();
        return;
      default:
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    focusPositionAtIndex(nextIndex);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Botão principal */}
      <button
        type="button"
        onClick={handleOpenMenu}
        disabled={disabled}
        title={disabled ? 'Desabilitado' : 'Selecionar posição'}
        className={`
          rounded-full p-2 border-2 transition-all duration-200
          bg-zinc-800 border-zinc-600
          hover:bg-blue-600 hover:border-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
      >
        <div style={{ width: iconSize, height: iconSize }} className="relative">
          <Image src={iconSrc} alt={`Posição: ${value ?? 'nenhuma'}`} fill style={{ objectFit: 'contain' }} />
        </div>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-2rem)] bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-xl">
          <div className="grid grid-cols-2 gap-1 min-[400px]:grid-cols-3 sm:grid-cols-6">
            {PLAYER_POSITIONS.map((position, index) => {
              const isLaneDisabled = disabledLanes.includes(position.key);
              const isSelected = value === position.key;
              return (
                <button
                  key={position.key}
                  ref={(el) => { positionItemRefs.current[index] = el; }}
                  type="button"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => !isLaneDisabled && handleSelectPosition(position.key)}
                  onKeyDown={(e) => handlePositionKeyDown(e, index)}
                  title={position.label}
                  disabled={isLaneDisabled}
                  className={`
                    flex flex-col items-center justify-center gap-1 rounded-lg border-2 px-3 py-2 transition-all duration-200
                    ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-zinc-600'}
                    ${isLaneDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-600 hover:border-blue-600 cursor-pointer'}
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-white
                  `}
                >
                  <div className="relative w-8 h-8">
                    <Image
                      src={position.icon}
                      alt={position.label}
                      fill
                      style={{ objectFit: 'contain', filter: isLaneDisabled ? 'grayscale(100%)' : 'none' }}
                    />
                  </div>
                  <span className={`text-xs font-medium leading-none ${isSelected ? 'text-white' : isLaneDisabled ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    {position.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
