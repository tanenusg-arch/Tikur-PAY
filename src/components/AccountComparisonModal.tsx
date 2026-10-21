import React, { useEffect } from 'react';
import { EfootballAccount } from '../types/account';
import { setupTelegramBackButton } from '../lib/telegram';
import { X, Sparkles, ShoppingCart } from 'lucide-react';

interface AccountComparisonModalProps {
  accounts: EfootballAccount[];
  isOpen: boolean;
  onClose: () => void;
  onSelectBuy: (account: EfootballAccount) => void;
}

export const AccountComparisonModal: React.FC<AccountComparisonModalProps> = ({
  accounts,
  isOpen,
  onClose,
  onSelectBuy,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const cleanup = setupTelegramBackButton(onClose);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cleanup();
    };
  }, [isOpen, onClose]);

  if (!isOpen || accounts.length < 2) return null;

  const [accA, accB] = accounts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Side-by-Side Squad Comparison</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="glass-btn glass-btn-secondary p-1.5 rounded-full"
          >
            <X className="w-4 h-4 text-zinc-300" />
          </button>
        </div>

        {/* Comparison Matrix */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Account Title Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[accA, accB].map((acc, index) => (
              <div key={acc.id} className="p-4 bg-zinc-900/80 rounded-2xl border border-white/[0.08] space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Option {index === 0 ? 'A' : 'B'} · {acc.platform}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-2">{acc.title}</h4>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xl font-black text-cyan-300 font-mono-num">
                    {(acc.priceETB || (acc.price ? acc.price * 145 : 15000)).toLocaleString()} ETB
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectBuy(acc);
                    }}
                    className="glass-btn glass-btn-emerald px-3 py-1.5 text-xs font-bold"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Select</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Metric Comparison Table */}
          <div className="bg-zinc-900/80 rounded-2xl border border-white/[0.08] overflow-hidden divide-y divide-white/[0.06] text-xs">
            {/* Team Strength */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className={`font-mono-num font-bold text-sm ${accA.collectiveStrength >= accB.collectiveStrength ? 'text-amber-400 font-black' : 'text-zinc-300'}`}>
                {accA.collectiveStrength} PTS
              </span>
              <span className="text-zinc-400 font-semibold text-[11px] uppercase">Team Strength</span>
              <span className={`font-mono-num font-bold text-sm ${accB.collectiveStrength >= accA.collectiveStrength ? 'text-amber-400 font-black' : 'text-zinc-300'}`}>
                {accB.collectiveStrength} PTS
              </span>
            </div>

            {/* Division Peak */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="text-zinc-200 font-medium truncate">{accA.divisionPeak}</span>
              <span className="text-zinc-400 font-semibold text-[11px] uppercase">Peak Division</span>
              <span className="text-zinc-200 font-medium truncate">{accB.divisionPeak}</span>
            </div>

            {/* Coins Balance */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="font-mono-num font-bold text-amber-300">{accA.coins.toLocaleString()}</span>
              <span className="text-zinc-400 font-semibold text-[11px] uppercase">Coins Balance</span>
              <span className="font-mono-num font-bold text-amber-300">{accB.coins.toLocaleString()}</span>
            </div>

            {/* GP Balance */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="font-mono-num text-zinc-300">{(accA.gp / 1000000).toFixed(1)}M GP</span>
              <span className="text-zinc-400 font-semibold text-[11px] uppercase">GP Balance</span>
              <span className="font-mono-num text-zinc-300">{(accB.gp / 1000000).toFixed(1)}M GP</span>
            </div>

            {/* Epic Boosters */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="font-mono-num font-bold text-zinc-200">{accA.epicBoosterCount} Epics</span>
              <span className="text-zinc-400 font-semibold text-[11px] uppercase">Epic Boosters</span>
              <span className="font-mono-num font-bold text-zinc-200">{accB.epicBoosterCount} Epics</span>
            </div>

            {/* Formation */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="font-bold text-zinc-200">{accA.formation}</span>
              <span className="text-zinc-400 font-semibold text-[11px] uppercase">Default Formation</span>
              <span className="font-bold text-zinc-200">{accB.formation}</span>
            </div>

            {/* Konami ID Status */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="text-emerald-400 font-medium">{accA.konamiIdStatus}</span>
              <span className="text-zinc-400 font-semibold text-[11px] uppercase">Transfer Type</span>
              <span className="text-emerald-400 font-medium">{accB.konamiIdStatus}</span>
            </div>

            {/* Manager */}
            <div className="grid grid-cols-3 p-3 items-center text-center">
              <span className="text-zinc-300 truncate">{accA.manager.name} ({accA.manager.proficiency})</span>
              <span className="text-zinc-400 font-semibold text-[11px] uppercase">Manager</span>
              <span className="text-zinc-300 truncate">{accB.manager.name} ({accB.manager.proficiency})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
