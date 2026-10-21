import React from 'react';
import { EfootballAccount } from '../types/account';
import {
  ShieldCheck,
  Coins,
  Award,
  Eye,
  ShoppingCart,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AccountCardProps {
  account: EfootballAccount;
  currentUserId?: string | number;
  onInspect: (account: EfootballAccount) => void;
  onQuickBuy: (account: EfootballAccount) => void;
  isCompared?: boolean;
  onToggleCompare?: (account: EfootballAccount) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  currentUserId,
  onInspect,
  onQuickBuy,
  isCompared,
  onToggleCompare,
}) => {
  const isLocked = Boolean(account.lockedUntil && account.lockedUntil > Date.now());
  const isLockedByMe = isLocked && account.lockedBy && String(account.lockedBy.id) === String(currentUserId);
  const isPaymentReview = account.status === 'payment_review';
  const isSold = account.status === 'sold';

  const remainingMinutes = isLocked
    ? Math.max(1, Math.ceil(((account.lockedUntil || 0) - Date.now()) / (60 * 1000)))
    : 0;

  const priceETB = account.priceETB || 0;

  return (
    <div
      className={`group relative glass-panel glass-panel-hover rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
        isPaymentReview
          ? 'border-amber-400/50 bg-amber-950/20 shadow-amber-500/10'
          : isLocked
          ? isLockedByMe
            ? 'border-cyan-400/60 shadow-cyan-500/20'
            : 'border-rose-500/40 opacity-90'
          : 'hover:border-cyan-400/50 hover:shadow-cyan-500/10'
      }`}
    >
      {/* Top Image Showcase */}
      <div className="relative h-44 sm:h-52 bg-zinc-950 p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
        {account.coverImage ? (
          <div className="absolute inset-0">
            <img
              src={account.coverImage}
              alt={account.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060814] via-[#060814]/50 to-black/30" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1226] via-[#070914] to-black flex items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        )}

        {/* Top Header Row: Verified Tag & Status Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-500/30 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] sm:text-[11px] font-bold text-zinc-100">Verified</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isPaymentReview && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-extrabold bg-amber-400 text-slate-950 shadow-lg border border-amber-300">
                <Clock className="w-3 h-3 animate-pulse" />
                <span>Under Review</span>
              </div>
            )}

            {!isPaymentReview && isLocked && (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold border backdrop-blur-md shadow-sm ${
                  isLockedByMe
                    ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400/50'
                    : 'bg-rose-500/25 text-rose-200 border-rose-500/40'
                }`}
              >
                <Clock className="w-3 h-3 animate-pulse" />
                <span>{isLockedByMe ? `Reserved (${remainingMinutes}m)` : `Locked (${remainingMinutes}m)`}</span>
              </div>
            )}

            {onToggleCompare && !isPaymentReview && !isSold && (
              <label className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white cursor-pointer bg-black/75 backdrop-blur-md px-2 py-1 rounded-xl border border-white/15 transition-colors">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={() => onToggleCompare(account)}
                  className="w-3.5 h-3.5 rounded border-zinc-700 text-cyan-400 focus:ring-0 focus:ring-offset-0 bg-zinc-900 cursor-pointer"
                />
                <span className="text-[10px] font-medium hidden sm:inline">Compare</span>
              </label>
            )}
          </div>
        </div>

        {/* Center Collective Strength & Division Display */}
        <div className="relative z-10 flex items-end justify-between mt-auto">
          <div>
            <div className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-cyan-300/80">
              Team Strength
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono-num tracking-tight flex items-baseline gap-1.5 drop-shadow-md">
              {account.collectiveStrength}
              <span className="text-[10px] sm:text-xs font-bold text-zinc-300 font-sans">PTS</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] sm:text-[11px] font-semibold text-zinc-100 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 flex items-center gap-1 shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{account.divisionPeak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        {/* Title and Metadata */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            {account.title}
          </h3>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400 mt-2 font-medium">
            <span className="text-zinc-300">{account.formation}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-purple-300 font-semibold">{account.epicBoosterCount} Epic Boosters</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 inline" /> {account.konamiIdStatus}
            </span>
          </div>

          {/* Key Stars Preview with Multi-Color Glass Chips */}
          {account.topStars && account.topStars.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {account.topStars.slice(0, 3).map((star) => {
                const isBigTime = star.cardType === 'Big Time';
                const isEpic = star.cardType === 'Epic Booster';
                return (
                  <span
                    key={star.id}
                    className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg border flex items-center gap-1 backdrop-blur-md ${
                      isBigTime
                        ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200'
                        : isEpic
                        ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                        : 'bg-purple-500/15 border-purple-400/40 text-purple-200'
                    }`}
                  >
                    <span className="font-mono-num font-bold text-amber-300">{star.rating}</span>
                    <span className="truncate max-w-[80px] sm:max-w-[100px]">{star.name}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Currencies & Resources */}
        <div className="flex items-center justify-between text-xs py-2 px-3 bg-black/60 rounded-xl border border-white/[0.08] font-mono-num">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold">{account.coins.toLocaleString()}</span>
            <span className="text-[10px] text-zinc-400 font-sans">Coins</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="text-zinc-300">
            <span className="font-bold text-cyan-200">{(account.gp / 1000000).toFixed(1)}M</span>
            <span className="text-[10px] text-zinc-400 ml-1 font-sans">GP</span>
          </div>
        </div>

        {/* Pricing & CTA Controls with 100% Glass Buttons */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2.5">
          <div>
            <div className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-bold">Total Price</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-white font-mono-num tabular-nums">
                {priceETB.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-cyan-400">ETB</span>
              {account.originalPriceETB && account.originalPriceETB > priceETB && (
                <span className="text-[10px] text-zinc-500 line-through font-mono-num tabular-nums ml-1">
                  {account.originalPriceETB.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onInspect(account)}
              className="glass-btn glass-btn-secondary px-2.5 sm:px-3 py-1.5 text-xs font-semibold"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-300" />
              <span>Inspect</span>
            </button>

            {isSold ? (
              <button
                type="button"
                disabled
                className="glass-btn glass-btn-secondary px-3 py-1.5 text-xs font-bold text-zinc-500 cursor-not-allowed opacity-60"
              >
                Sold Out
              </button>
            ) : isPaymentReview ? (
              <button
                type="button"
                disabled
                className="glass-btn glass-btn-amber px-3 py-1.5 text-xs font-bold cursor-not-allowed flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Review</span>
              </button>
            ) : isLocked && !isLockedByMe ? (
              <button
                type="button"
                disabled
                className="glass-btn glass-btn-secondary px-3 py-1.5 text-xs font-semibold text-zinc-400 cursor-not-allowed flex items-center gap-1 opacity-70"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Locked</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onQuickBuy(account)}
                className="glass-btn glass-btn-emerald px-3.5 sm:px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{isLockedByMe ? 'Resume' : 'Buy Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
