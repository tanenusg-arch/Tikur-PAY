import React, { useState } from 'react';
import { EfootballAccount, FilterState } from '../../types/account';
import { AccountCard } from '../AccountCard';
import { AccountFilters } from '../AccountFilters';
import {
  Search,
  RotateCcw,
  Plus,
  ShoppingBag,
  LayoutGrid,
  List,
  ShieldCheck,
  Eye,
  Coins,
  Award,
} from 'lucide-react';

interface ShopPageProps {
  accounts: EfootballAccount[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onInspect: (account: EfootballAccount) => void;
  onQuickBuy: (account: EfootballAccount) => void;
  onOpenSellModal: () => void;
  comparedAccountIds: string[];
  onToggleCompare: (account: EfootballAccount) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  accounts,
  filters,
  onFilterChange,
  onInspect,
  onQuickBuy,
  onOpenSellModal,
  comparedAccountIds,
  onToggleCompare,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Marketplace Catalog
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            BICHO ACCOUNTS SHOP Catalog
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Browse competition-ready rosters with maxed Epic Boosters and clean Konami ID handover. Instant Telebirr &amp; CBE verification.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              title="Compact List View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSellModal}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sell Account</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <AccountFilters
        filters={filters}
        onChange={onFilterChange}
        totalResults={accounts.length}
      />

      {/* Grid or Compact List View */}
      {accounts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto text-amber-400">
            <Search className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-lg font-bold text-white">No eFootball Accounts Match Your Filter</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Try widening your team strength range or clearing your search query.
          </p>
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                search: '',
                platform: 'Mobile',
                minStrength: 0,
                maxPriceETB: 100000,
                sortBy: 'featured',
                konamiStatus: 'All',
                keyPlayer: 'All',
              })
            }
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-amber-400/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {accounts.map((account) => (
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
      ) : (
        /* Compact List View for Power Users & Traders */
        <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
          {accounts.map((account) => {
            const priceETB = account.priceETB || 0;
            return (
              <div
                key={account.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center font-black text-amber-400 font-mono-num text-sm shrink-0">
                    {account.collectiveStrength}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{account.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span className="font-semibold text-zinc-300">{account.platform}</span>
                      <span>·</span>
                      <span>{account.formation}</span>
                      <span>·</span>
                      <span>{account.epicBoosterCount} Boosters</span>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {account.konamiIdStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-white font-mono-num tabular-nums">
                      {priceETB.toLocaleString()}{' '}
                      <span className="text-xs text-amber-400 font-bold font-sans">ETB</span>
                    </span>
                    <span className="text-[11px] text-zinc-400 block font-mono-num">
                      {account.coins.toLocaleString()} Coins
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onInspect(account)}
                      className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-lg transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickBuy(account)}
                      className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
