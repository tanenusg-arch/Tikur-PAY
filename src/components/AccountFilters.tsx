import React from 'react';
import { FilterState } from '../types/account';
import { Search, RotateCcw, X, ChevronDown } from 'lucide-react';

interface AccountFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  totalResults: number;
}

export const AccountFilters: React.FC<AccountFiltersProps> = ({
  filters,
  onChange,
  totalResults,
}) => {
  const handleReset = () => {
    onChange({
      search: '',
      platform: 'Mobile',
      minStrength: 0,
      maxPriceETB: 100000,
      sortBy: 'featured',
      konamiStatus: 'All',
      keyPlayer: 'All',
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.minStrength > 0 ||
    filters.maxPriceETB < 100000 ||
    filters.sortBy !== 'featured' ||
    filters.keyPlayer !== 'All';

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Top Filter Bar: Search + Sort + Reset */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search squad by player (Messi, Vieira, Cruyff) or formation..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full bg-black/60 border border-white/[0.08] focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-4 flex items-center gap-2">
          <label className="text-xs text-zinc-400 shrink-0 font-medium">Sort:</label>
          <div className="relative w-full">
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
              aria-label="Sort accounts"
              className="w-full bg-black/60 border border-white/[0.08] focus:border-amber-400/80 rounded-xl px-3 py-2.5 text-xs text-zinc-200 transition-colors cursor-pointer appearance-none pr-8"
            >
              <option value="featured">Featured / Curated Top Value</option>
              <option value="strength-desc">Highest Team Strength (3,180+ PTS)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="coins-desc">Most eFootball Coins</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Results Count & Reset */}
        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3 text-xs">
          <span className="text-zinc-400 font-mono-num font-medium whitespace-nowrap">
            <span className="text-amber-400 font-bold">{totalResults}</span> {totalResults === 1 ? 'account' : 'accounts'}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-zinc-300 hover:text-white px-2.5 py-1 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Strength & Legend Quick Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
        {/* Min Strength */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Strength:</span>
          <div className="flex items-center gap-1 p-0.5 bg-black/50 border border-white/[0.08] rounded-xl">
            {[0, 3150, 3175].map((rating) => {
              const active = filters.minStrength === rating;
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onChange({ ...filters, minStrength: rating })}
                  className={`px-3 py-1 text-xs font-mono-num rounded-lg transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                  }`}
                >
                  {rating === 0 ? 'All Ratings' : `${rating}+`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Legend tag filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Player:</span>
          <div className="flex items-center gap-1 p-0.5 bg-black/50 border border-white/[0.08] rounded-xl overflow-x-auto">
            {['All', 'Messi', 'Vieira', 'Cruyff', 'Gullit', 'Maldini'].map((star) => {
              const active = filters.keyPlayer === star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => onChange({ ...filters, keyPlayer: star })}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                  }`}
                >
                  {star}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
