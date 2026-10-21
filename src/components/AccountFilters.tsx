import React from 'react';
import { FilterState } from '../types/account';
import { RotateCcw, ChevronDown, SlidersHorizontal } from 'lucide-react';

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

  const isFiltered = filters.sortBy !== 'featured';

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'strength-desc', label: 'Highest Strength' },
    { id: 'price-asc', label: 'Price: Low → High' },
    { id: 'price-desc', label: 'Price: High → Low' },
    { id: 'coins-desc', label: 'Most Coins' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-3 sm:p-4 shadow-xl space-y-2.5">
      {/* Sort & Filter Controls Bar (Search Input Removed) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Quick Sort Options */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sort:</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            {sortOptions.map((opt) => {
              const active = filters.sortBy === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ ...filters, sortBy: opt.id as FilterState['sortBy'] })}
                  className={`glass-btn px-2.5 sm:px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'glass-btn-primary font-bold shadow-md'
                      : 'glass-btn-secondary text-zinc-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Reset Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
          <span className="text-zinc-400 font-mono-num font-medium whitespace-nowrap text-[11px] sm:text-xs">
            <span className="text-cyan-400 font-bold">{totalResults}</span> {totalResults === 1 ? 'squad' : 'squads'} listed
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleReset}
              className="glass-btn glass-btn-secondary px-2.5 py-1 text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-cyan-300" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
