import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { BRAND } from '../constants/branding';

interface HeroProps {
  onExplore: (searchQuery?: string) => void;
  onValuate: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onValuate }) => {

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:pt-10 sm:pb-14 border-b border-white/[0.08] bg-grid-subtle">
      {/* Dynamic ambient radial lighting with vibrant multi-colors */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/[0.12] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-emerald-500/[0.08] rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[200px] bg-purple-500/[0.08] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-7 text-center">
        {/* Brand Badge with Official Logo (Glass Pill) */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/[0.06] border border-cyan-400/30 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
            <img
              src={BRAND.logoUrl}
              alt={BRAND.name}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-lg object-cover ring-1 ring-cyan-400/50"
            />
            <span className="text-[11px] sm:text-xs font-black text-cyan-200 tracking-wider uppercase font-display flex items-center gap-1.5">
              <span>{BRAND.name}</span>
              <span className="text-cyan-400">·</span>
              <span className="text-emerald-300 font-semibold lowercase text-[10px]">escrow verified</span>
            </span>
          </div>
        </div>

        {/* Headline & Description with Vibrant Gradient Text */}
        <div className="space-y-2.5 sm:space-y-3.5 max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] [text-wrap:balance]">
            Tournament-Grade Squads.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Instant Escrow Delivery.
            </span>
          </h1>

          <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto [text-wrap:balance]">
            Acquire Division 1 competitive rosters loaded with Big Time legends, Epic Boosters, and untouched coins. Safe Konami ID email handover with zero ban risk and instant Telebirr &amp; CBE verification.
          </p>
        </div>

        {/* Action Buttons (100% Glass Buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
          <button
            type="button"
            onClick={() => onExplore()}
            className="w-full sm:w-auto glass-btn glass-btn-primary px-6 py-3 text-xs sm:text-sm font-bold group"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Explore Marketplace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onValuate}
            className="w-full sm:w-auto glass-btn glass-btn-secondary px-5 py-3 text-xs sm:text-sm font-semibold"
          >
            <span>Sell Your Account</span>
          </button>
        </div>

        {/* Trust Highlights Strip with Verified Telebirr & CBE SVGs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-5 pt-1 text-[11px] sm:text-xs text-zinc-300 font-medium">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <img
              src={BRAND.telebirrSvgUrl}
              alt="Telebirr"
              referrerPolicy="no-referrer"
              className="w-3.5 h-3.5 rounded object-contain"
            />
            <img
              src={BRAND.cbeSvgUrl}
              alt="CBE"
              referrerPolicy="no-referrer"
              className="w-3.5 h-3.5 rounded object-contain"
            />
            <span className="text-zinc-200">Telebirr &amp; CBE Escrow</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>15-Min Reservation Lock</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>100% Primary Email Handover</span>
          </div>
        </div>

        {/* 4-Column KPI Trust Bar with Multi-Color Glass Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-4 sm:pt-6 border-t border-white/[0.08] text-left">
          <div className="glass-panel glass-panel-cyan p-3 sm:p-4 rounded-2xl space-y-0.5 sm:space-y-1">
            <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono-num">3,185+</div>
            <div className="text-[11px] sm:text-xs font-semibold text-zinc-100">Peak Team Strength</div>
            <div className="text-[10px] text-zinc-400">Division 1 championship squads</div>
          </div>

          <div className="glass-panel glass-panel-violet p-3 sm:p-4 rounded-2xl space-y-0.5 sm:space-y-1">
            <div className="text-xl sm:text-2xl font-black text-purple-300 font-mono-num">100%</div>
            <div className="text-[11px] sm:text-xs font-semibold text-zinc-100">Konami ID Handover</div>
            <div className="text-[10px] text-zinc-400">Primary email ownership re-link</div>
          </div>

          <div className="glass-panel glass-panel-emerald p-3 sm:p-4 rounded-2xl space-y-0.5 sm:space-y-1">
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono-num">&lt; 3 Mins</div>
            <div className="text-[11px] sm:text-xs font-semibold text-zinc-100">Automated Delivery</div>
            <div className="text-[10px] text-zinc-400">Released into orders vault</div>
          </div>

          <div className="glass-panel glass-panel-amber p-3 sm:p-4 rounded-2xl space-y-0.5 sm:space-y-1">
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono-num">2,480+</div>
            <div className="text-[11px] sm:text-xs font-semibold text-zinc-100">Accounts Verified</div>
            <div className="text-[10px] text-zinc-400">4.96/5 buyer satisfaction score</div>
          </div>
        </div>
      </div>
    </section>
  );
};
