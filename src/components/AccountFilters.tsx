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

  const isFiltered = filters.search !== '' || filters.sortBy !== 'featured';

  return (
    <div className="glass-panel rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-3">
      {/* Search + Sort Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search squad by player, formation, or manager..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full bg-black/60 border border-white/[0.08] focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/30 rounded-xl pl-10 pr-9 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-3 flex items-center gap-2">
          <label className="text-xs text-zinc-400 shrink-0 font-medium">Sort:</label>
          <div className="relative w-full">
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
              aria-label="Sort accounts"
              className="w-full bg-black/60 border border-white/[0.08] focus:border-amber-400/80 rounded-xl px-3 py-2.5 text-xs text-zinc-200 transition-colors cursor-pointer appearance-none pr-8"
            >
              <option value="featured">Featured / Curated Top Value</option>
              <option value="strength-desc">Highest Team Strength</option>
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
            <span className="text-amber-400 font-bold">{totalResults}</span> {totalResults === 1 ? 'squad' : 'squads'}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-zinc-300 hover:text-white px-2.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors cursor-pointer whitespace-nowrap text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
