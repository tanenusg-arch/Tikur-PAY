import React, { useState } from 'react';
import { EfootballAccount } from '../../types/account';
import { Hero } from '../Hero';
import { AccountCard } from '../AccountCard';
import { TransferGuideSection } from '../TransferGuideSection';
import { CustomerReviews } from '../CustomerReviews';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';

interface HomePageProps {
  featuredAccounts: EfootballAccount[];
  onNavigateToShop: (search?: string) => void;
  onOpenValuation: () => void;
  onInspect: (account: EfootballAccount) => void;
  onQuickBuy: (account: EfootballAccount) => void;
  comparedAccountIds: string[];
  onToggleCompare: (account: EfootballAccount) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  featuredAccounts,
  onNavigateToShop,
  onOpenValuation,
  onInspect,
  onQuickBuy,
  comparedAccountIds,
  onToggleCompare,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'strength' | 'boosters' | 'coins'>('all');

  const filteredPreview = featuredAccounts.filter((account) => {
    if (activeCategory === 'strength') return account.collectiveStrength >= 3175;
    if (activeCategory === 'boosters') return account.epicBoosterCount >= 10;
    if (activeCategory === 'coins') return account.coins >= 2000;
    return true;
  });

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <Hero
        onExplore={() => onNavigateToShop()}
        onValuate={onOpenValuation}
      />

      {/* Featured Squads Section */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Curated Division 1 Accounts
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 sm:mt-1">
              Featured Championship Squads
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1 max-w-xl">
              Hand-picked Division 1 rosters with maxed Epic Boosters, clean Konami IDs, and 15-minute escrow protection.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToShop()}
            className="self-start sm:self-auto glass-btn glass-btn-primary px-4 py-2 text-xs font-bold"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Segmented Category Filter Bar with Glass Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-x-auto w-fit max-w-full backdrop-blur-xl">
          {[
            { id: 'all' as const, label: 'All Squads' },
            { id: 'strength' as const, label: '3,175+ PTS' },
            { id: 'boosters' as const, label: '10+ Boosters' },
            { id: 'coins' as const, label: '2,000+ Coins' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`glass-btn px-3.5 py-1.5 text-xs transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'glass-btn-primary font-bold'
                  : 'glass-btn-secondary text-zinc-300 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Account Cards Grid: 1 col on mobile phone, 2 col on tablet, 3 col on PC */}
        {featuredAccounts.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-3xl space-y-3 max-w-xl mx-auto px-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto text-cyan-400">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Live Squads Being Verified</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Genuine competition squads submitted by players and verified by BICHO ACCOUNTS SHOP admins will appear here.
            </p>
            <button
              type="button"
              onClick={onOpenValuation}
              className="glass-btn glass-btn-emerald px-5 py-2.5 text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Sell Your Account Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {(filteredPreview.length > 0 ? filteredPreview : featuredAccounts).slice(0, 6).map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onInspect={onInspect}
                onQuickBuy={onQuickBuy}
                isCompared={comparedAccountIds.includes(account.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        )}
      </section>

      {/* Transfer Guide */}
      <TransferGuideSection />

      {/* Reviews */}
      <CustomerReviews />
    </div>
  );
};
