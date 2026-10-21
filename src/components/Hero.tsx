import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Lock,
} from 'lucide-react';
import { BRAND } from '../constants/branding';

interface HeroProps {
  onExplore: (searchQuery?: string) => void;
  onValuate: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onValuate }) => {
  const [heroSearch, setHeroSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExplore(heroSearch.trim() || undefined);
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-18 border-b border-white/[0.08] bg-grid-subtle">
      {/* Dynamic ambient radial lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8 text-center">
        {/* Brand Badge with Official Logo */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-white/[0.04] border border-amber-400/30 backdrop-blur-xl shadow-lg shadow-amber-500/5">
            <img
              src={BRAND.logoUrl}
              alt={BRAND.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-lg object-cover ring-1 ring-amber-400/40"
            />
            <span className="text-xs sm:text-sm font-black text-white tracking-wider uppercase font-display">
              {BRAND.name}
            </span>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] [text-wrap:balance]">
            Tournament-Grade Squads.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
              Instant Escrow Delivery.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto [text-wrap:balance]">
            Acquire Division 1 competitive rosters loaded with Big Time legends, Epic Boosters, and untouched coins. Safe Konami ID email handover with zero ban risk and instant Telebirr &amp; CBE verification.
          </p>
        </div>

        {/* Central Search Box */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative shadow-2xl">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search squad by player, formation, rating..."
              className="w-full bg-[#0d1117]/95 border border-white/10 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 rounded-2xl pl-11 pr-24 py-3.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 glass-button-primary text-amber-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onExplore()}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-amber-300 glass-button-primary rounded-xl flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onValuate}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-zinc-200 glass-button rounded-xl text-center cursor-pointer"
          >
            Sell Your Account
          </button>
        </div>

        {/* Trust Highlights Strip with Verified Telebirr & CBE SVGs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-2 text-zinc-300">
            <img
              src={BRAND.telebirrSvgUrl}
              alt="Telebirr"
              referrerPolicy="no-referrer"
              className="w-4 h-4 rounded object-contain"
            />
            <img
              src={BRAND.cbeSvgUrl}
              alt="CBE"
              referrerPolicy="no-referrer"
              className="w-4 h-4 rounded object-contain"
            />
            <span>Telebirr &amp; CBE Verified Escrow</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>15-Minute Reservation Lock</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">·</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>100% Primary Email Handover</span>
          </div>
        </div>

        {/* 4-Column KPI Trust Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/[0.08] text-left">
          <div className="glass-panel p-4 rounded-2xl space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-num">3,185+</div>
            <div className="text-xs font-semibold text-zinc-200">Peak Collective Strength</div>
            <div className="text-[11px] text-zinc-400">Division 1 championship rosters</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono-num">100%</div>
            <div className="text-xs font-semibold text-zinc-200">Konami ID Handover</div>
            <div className="text-[11px] text-zinc-400">Full ownership with primary email re-link</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-num">&lt; 3 Mins</div>
            <div className="text-xs font-semibold text-zinc-200">Automated Delivery</div>
            <div className="text-[11px] text-zinc-400">Credentials released into secure vault</div>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono-num">2,480+</div>
            <div className="text-xs font-semibold text-zinc-200">Verified Accounts Sold</div>
            <div className="text-[11px] text-zinc-400">4.96 / 5.0 buyer satisfaction score</div>
          </div>
        </div>
      </div>
    </section>
  );
};
