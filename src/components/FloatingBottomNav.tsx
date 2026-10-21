import React from 'react';
import { Home, ShoppingBag, ShieldCheck, User, ShieldAlert } from 'lucide-react';
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
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'shop' as NavTab, label: 'Shop', icon: ShoppingBag },
    { id: 'orders' as NavTab, label: 'Orders', icon: ShieldCheck, badge: ordersCount },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  if (isAdmin) {
    tabs.push({
      id: 'admin' as NavTab,
      label: 'Admin',
      icon: ShieldAlert,
      badge: adminBadgeCount,
    });
  }

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto w-auto max-w-[96vw] animate-in slide-in-from-bottom duration-200">
      <nav
        aria-label="Bottom Navigation"
        className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2.5 glass-panel rounded-2xl shadow-2xl"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? tab.id === 'admin'
                    ? 'bg-rose-500/30 border border-rose-500/60 text-white font-bold shadow-lg'
                    : 'glass-button-primary text-amber-300 font-bold'
                  : 'glass-button text-zinc-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="text-[11px] sm:text-xs">{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[9px] sm:text-[10px] font-mono-num font-black px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : tab.id === 'admin'
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
