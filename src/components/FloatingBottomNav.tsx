import React from 'react';
import { Home, ShoppingBag, ShieldCheck, User, ShieldAlert, Sparkles } from 'lucide-react';
import { NavTab } from './Header';

interface FloatingBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  ordersCount: number;
  isAdmin?: boolean;
  adminBadgeCount?: number;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  onTabChange,
  ordersCount,
  isAdmin = false,
  adminBadgeCount = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home, accentColor: 'cyan' },
    { id: 'shop' as NavTab, label: 'Market', icon: ShoppingBag, accentColor: 'emerald' },
    { id: 'orders' as NavTab, label: 'Orders', icon: ShieldCheck, badge: ordersCount, accentColor: 'amber' },
    { id: 'profile' as NavTab, label: 'Profile', icon: User, accentColor: 'violet' },
  ];

  if (isAdmin) {
    tabs.push({
      id: 'admin' as NavTab,
      label: 'Admin',
      icon: ShieldAlert,
      badge: adminBadgeCount,
      accentColor: 'rose',
    });
  }

  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
      }
    } catch {
      // Ignore
    }
  };

  const handleSelectTab = (tabId: NavTab) => {
    triggerHaptic();
    onTabChange(tabId);
  };

  return (
    <nav
      aria-label="Mobile Telegram Mini App Navigation Bar"
      className="shrink-0 z-40 w-full bg-[#060813]/95 backdrop-blur-2xl border-t border-white/[0.12] shadow-[0_-10px_35px_rgba(0,0,0,0.85)] pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-1.5 transition-all select-none"
    >
      <div
        className={`grid ${
          isAdmin ? 'grid-cols-5' : 'grid-cols-4'
        } max-w-lg mx-auto items-center px-1.5 sm:px-3 gap-1`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // Theme glass styling depending on active tab
          let activeStyles = 'text-cyan-300 bg-cyan-500/15 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]';
          let iconColor = 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]';
          let dotColor = 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]';

          if (tab.accentColor === 'emerald') {
            activeStyles = 'text-emerald-300 bg-emerald-500/15 border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
            iconColor = 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]';
            dotColor = 'bg-emerald-400 shadow-[0_0_6px_#34d399]';
          } else if (tab.accentColor === 'amber') {
            activeStyles = 'text-amber-300 bg-amber-500/15 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]';
            iconColor = 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]';
            dotColor = 'bg-amber-400 shadow-[0_0_6px_#fbbf24]';
          } else if (tab.accentColor === 'violet') {
            activeStyles = 'text-purple-300 bg-purple-500/15 border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]';
            iconColor = 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]';
            dotColor = 'bg-purple-400 shadow-[0_0_6px_#c084fc]';
          } else if (tab.accentColor === 'rose') {
            activeStyles = 'text-rose-300 bg-rose-500/15 border-rose-400/40 shadow-[0_0_15px_rgba(244,63,94,0.25)]';
            iconColor = 'text-rose-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]';
            dotColor = 'bg-rose-400 shadow-[0_0_6px_#fb7185]';
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-1 rounded-2xl transition-all duration-200 min-h-[50px] cursor-pointer group border active:scale-95 ${
                isActive
                  ? `${activeStyles} font-bold backdrop-blur-xl`
                  : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  } ${isActive ? iconColor : 'text-zinc-400'}`}
                />

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-mono-num font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-lg ${
                      tab.id === 'admin'
                        ? 'bg-rose-500 text-white ring-1 ring-rose-400'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 ring-1 ring-white/30'
                    }`}
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight mt-1 truncate max-w-full ${
                  isActive ? 'font-extrabold' : 'font-medium text-zinc-400'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Indicator dot */}
              {isActive && (
                <span className={`w-1 h-1 rounded-full mt-0.5 ${dotColor}`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
