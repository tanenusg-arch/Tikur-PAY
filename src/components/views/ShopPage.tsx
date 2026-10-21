import React, { useState, useMemo } from 'react';
import { EfootballAccount, FilterState } from '../../types/account';
import { AccountCard } from '../AccountCard';
import { AccountFilters } from '../AccountFilters';
import {
  RotateCcw,
  Plus,
  LayoutGrid,
  List,
  ShieldCheck,
  Sparkles,
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

  // Filter and sort accounts dynamically based on search and sort option
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter((acc) => {
        const titleMatch = acc.title.toLowerCase().includes(q);
        const descMatch = acc.description?.toLowerCase().includes(q);
        const formMatch = acc.formation?.toLowerCase().includes(q);
        const managerMatch = acc.manager?.name?.toLowerCase().includes(q);
        const starsMatch = acc.topStars?.some((s) => s.name.toLowerCase().includes(q));
        const xiMatch = acc.startingXI?.some((s) => s.name.toLowerCase().includes(q));
        return titleMatch || descMatch || formMatch || managerMatch || starsMatch || xiMatch;
      });
    }

    // Sort order
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => (a.priceETB || 0) - (b.priceETB || 0));
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => (b.priceETB || 0) - (a.priceETB || 0));
    } else if (filters.sortBy === 'strength-desc') {
      result.sort((a, b) => (b.collectiveStrength || 0) - (a.collectiveStrength || 0));
    } else if (filters.sortBy === 'coins-desc') {
      result.sort((a, b) => (b.coins || 0) - (a.coins || 0));
    }

    return result;
  }, [accounts, filters.search, filters.sortBy]);

  return (
    <div className="py-4 sm:py-8 max-w-7xl mx-auto px-3.5 sm:px-6 space-y-5 sm:space-y-7 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <div className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Marketplace Catalog
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 sm:mt-1">
            BICHO ACCOUNTS SHOP
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 sm:mt-1 max-w-2xl">
            Verified eFootball accounts with instant Konami ID email handover. Protected by Telebirr &amp; CBE escrow.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Glass Toggle */}
          <div className="flex items-center p-1 bg-white/[0.04] border border-white/[0.1] rounded-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'glass-btn-primary font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              title="Compact List View"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'compact'
                  ? 'glass-btn-primary font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSellModal}
            className="glass-btn glass-btn-emerald px-3.5 py-1.5 sm:py-2 text-xs font-bold whitespace-nowrap"
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
        totalResults={filteredAccounts.length}
      />

      {/* Grid or Compact List View */}
      {filteredAccounts.length === 0 ? (
        <div className="text-center py-12 sm:py-16 glass-panel rounded-3xl space-y-3.5 px-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto text-cyan-400">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">No eFootball Accounts Available</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            No accounts currently match the selected criteria.
          </p>
          {filters.sortBy !== 'featured' && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, sortBy: 'featured' })}
              className="glass-btn glass-btn-primary px-4 py-2 text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {filteredAccounts.map((account) => (
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
        /* Compact List View with 100% Glass Buttons */
        <div className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden divide-y divide-white/[0.08]">
          {filteredAccounts.map((account) => {
            const priceETB = account.priceETB || 0;
            return (
              <div
                key={account.id}
                className="p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#090d1e] border border-cyan-500/30 flex items-center justify-center font-black text-cyan-300 font-mono-num text-xs sm:text-sm shrink-0 shadow-inner">
                    {account.collectiveStrength}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{account.title}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                      <span className="font-semibold text-zinc-300">{account.platform}</span>
                      <span>·</span>
                      <span>{account.formation}</span>
                      <span>·</span>
                      <span className="text-purple-300 font-semibold">{account.epicBoosterCount} Boosters</span>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <ShieldCheck className="w-3 h-3" /> {account.konamiIdStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                  <div className="text-left sm:text-right">
                    <span className="text-sm sm:text-lg font-black text-white font-mono-num tabular-nums">
                      {priceETB.toLocaleString()}{' '}
                      <span className="text-xs text-cyan-400 font-bold font-sans">ETB</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-zinc-400 block font-mono-num">
                      {account.coins.toLocaleString()} Coins
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => onInspect(account)}
                      className="glass-btn glass-btn-secondary px-2.5 sm:px-3 py-1.5 text-xs font-semibold"
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickBuy(account)}
                      className="glass-btn glass-btn-emerald px-3.5 sm:px-4 py-1.5 text-xs font-bold shadow-md"
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
