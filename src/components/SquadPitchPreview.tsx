import React, { useState } from 'react';
import { PlayerCard } from '../types/account';
import { Sparkles, User, Shield } from 'lucide-react';

interface SquadPitchPreviewProps {
  startingXI: PlayerCard[];
  bench?: PlayerCard[];
  formation: string;
  manager?: {
    name: string;
    style: string;
    proficiency: number;
    booster?: string;
  };
  collectiveStrength: number;
}

export const SquadPitchPreview: React.FC<SquadPitchPreviewProps> = ({
  startingXI,
  bench,
  formation,
  manager,
  collectiveStrength,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerCard | null>(null);

  // Modern card styling helper
  const getCardStyle = (cardType: PlayerCard['cardType']) => {
    switch (cardType) {
      case 'Big Time':
        return {
          bg: 'bg-gradient-to-b from-sky-500/90 via-indigo-900 to-black',
          border: 'border-sky-400/70 ring-1 ring-sky-400/40',
          ratingBg: 'bg-sky-400 text-slate-950',
          glow: 'shadow-[0_0_12px_rgba(56,189,248,0.4)]',
        };
      case 'Epic Booster':
        return {
          bg: 'bg-gradient-to-b from-amber-400/90 via-amber-800 to-black',
          border: 'border-amber-300/80 ring-1 ring-amber-400/40',
          ratingBg: 'bg-amber-400 text-slate-950',
          glow: 'shadow-[0_0_12px_rgba(251,191,36,0.4)]',
        };
      case 'Showtime':
        return {
          bg: 'bg-gradient-to-b from-purple-500/90 via-purple-900 to-black',
          border: 'border-purple-300/70 ring-1 ring-purple-400/40',
          ratingBg: 'bg-purple-300 text-slate-950',
          glow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]',
        };
      default:
        return {
          bg: 'bg-gradient-to-b from-emerald-500/80 via-teal-900 to-black',
          border: 'border-emerald-300/60 ring-1 ring-emerald-400/30',
          ratingBg: 'bg-emerald-400 text-slate-950',
          glow: 'shadow-[0_0_10px_rgba(52,211,153,0.3)]',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Squad Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Tactical Formation</span>
            <span className="text-sm font-bold text-white tracking-wide">{formation}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-400">Team Strength</span>
            <span className="text-sm font-black text-amber-400 font-mono-num">{collectiveStrength} PTS</span>
          </div>
        </div>

        {manager && (
          <div className="flex items-center gap-2 text-xs bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.08]">
            <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-200 font-semibold">{manager.name}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-amber-300 font-medium">{manager.style} ({manager.proficiency})</span>
          </div>
        )}
      </div>

      {/* Modern Pitch View */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/4.8] max-h-[520px] rounded-3xl overflow-hidden border border-emerald-900/40 shadow-2xl bg-[#06180e]">
        {/* Striped mowing pattern */}
        <div className="absolute inset-0 grid grid-rows-6 opacity-30 pointer-events-none">
          <div className="bg-emerald-600/15" />
          <div className="bg-emerald-950/20" />
          <div className="bg-emerald-600/15" />
          <div className="bg-emerald-950/20" />
          <div className="bg-emerald-600/15" />
          <div className="bg-emerald-950/20" />
        </div>

        {/* Pitch boundary lines */}
        <div className="absolute inset-3 border border-white/25 rounded-xl pointer-events-none">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 border-t border-white/25" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/25 rounded-full" />
          {/* Center spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full" />

          {/* Top Penalty Box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-x border-white/25 rounded-b-md">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-b border-x border-white/20" />
          </div>

          {/* Bottom Penalty Box */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-x border-white/25 rounded-t-md">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-t border-x border-white/20" />
          </div>
        </div>

        {/* Starting XI Player Pins */}
        <div className="absolute inset-0 p-4">
          {startingXI.map((player) => {
            const style = getCardStyle(player.cardType);
            const isSelected = selectedPlayer?.id === player.id;

            return (
              <button
                key={player.id}
                type="button"
                onClick={() => setSelectedPlayer(isSelected ? null : player)}
                style={{
                  left: `${player.x ?? 50}%`,
                  top: `${player.y ?? 50}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-200 z-10 ${
                  isSelected ? 'scale-115 z-30' : 'hover:scale-110 hover:z-20'
                }`}
              >
                {/* Modern Tactical Card Badge */}
                <div
                  className={`w-11 h-13 sm:w-13 sm:h-16 rounded-lg p-0.5 border ${style.border} ${style.bg} ${style.glow} flex flex-col justify-between items-center transition-shadow`}
                >
                  {/* Position & Rating Header */}
                  <div className="w-full flex items-center justify-between px-1 pt-0.5">
                    <span className="text-[9px] sm:text-[10px] font-black text-white/90">
                      {player.position}
                    </span>
                    <span
                      className={`text-[9px] sm:text-[10px] font-black px-1 rounded-sm font-mono-num ${style.ratingBg}`}
                    >
                      {player.rating}
                    </span>
                  </div>

                  {/* Player Silhouette / Mini Emblem */}
                  <div className="relative w-full flex-1 flex items-center justify-center my-0.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>

                  {/* Card Type indicator */}
                  <div className="w-full text-center pb-0.5">
                    <span className="text-[7px] sm:text-[8px] font-semibold tracking-tighter text-white/80 block truncate px-0.5">
                      {player.cardType === 'Epic Booster' ? 'EPIC' : player.cardType.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Player Name Tag */}
                <div className="mt-1 px-1.5 py-0.5 bg-black/90 border border-white/15 rounded text-[10px] sm:text-xs font-semibold text-zinc-100 whitespace-nowrap shadow-md max-w-[90px] truncate text-center">
                  {player.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Player Floating Inspector */}
        {selectedPlayer && (
          <div className="absolute bottom-3 left-3 right-3 p-3.5 glass-panel rounded-2xl shadow-2xl flex items-center justify-between gap-3 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg font-mono-num shadow-md ${
                  getCardStyle(selectedPlayer.cardType).ratingBg
                }`}
              >
                {selectedPlayer.rating}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{selectedPlayer.name}</h4>
                  <span className="text-xs text-zinc-400 font-semibold">({selectedPlayer.position})</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-medium">
                  <span className="text-amber-400">{selectedPlayer.cardType}</span>
                  {selectedPlayer.club && (
                    <>
                      <span>·</span>
                      <span>{selectedPlayer.club}</span>
                    </>
                  )}
                  {selectedPlayer.boosterSkill && (
                    <>
                      <span>·</span>
                      <span className="text-sky-300 flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3 h-3 inline" /> {selectedPlayer.boosterSkill}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlayer(null)}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Bench Substitutes Section */}
      {bench && bench.length > 0 && (
        <div className="glass-panel rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Substitutes & Reserves ({bench.length})</span>
            <span className="text-[11px] text-zinc-500">Bench options</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {bench.map((sub) => {
              const style = getCardStyle(sub.cardType);
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 bg-black/60 border border-white/[0.08] px-3 py-1.5 rounded-xl shrink-0 transition-colors"
                >
                  <span className="text-[10px] font-bold text-zinc-400">{sub.position}</span>
                  <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded font-mono-num ${style.ratingBg}`}>
                    {sub.rating}
                  </span>
                  <span className="text-xs font-medium text-zinc-200 whitespace-nowrap">{sub.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
