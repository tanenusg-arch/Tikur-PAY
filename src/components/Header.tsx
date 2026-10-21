import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Menu,
  X,
  Home,
  ShoppingBag,
  FileCheck,
  User,
} from 'lucide-react';
import { TelegramUser } from '../types/account';
import { BRAND } from '../constants/branding';

export type NavTab = 'home' | 'shop' | 'orders' | 'profile' | 'admin';

interface HeaderProps {
  currentUser: TelegramUser;
  activePage: NavTab;
  onOpenSellModal: () => void;
  onNavigatePage: (page: NavTab) => void;
  ordersCount: number;
  adminBadgeCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activePage,
  onOpenSellModal,
  onNavigatePage,
  ordersCount,
  adminBadgeCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: NavTab) => {
    onNavigatePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#04060b]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 py-3">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0 bg-transparent border-0 p-0 text-left"
        >
          <img
            src={BRAND.logoUrl}
            alt={BRAND.name}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-amber-400/40 group-hover:scale-105 transition-all duration-200 shadow-md shadow-amber-500/20"
          />
          <span className="font-display font-black tracking-wider text-white text-base sm:text-lg whitespace-nowrap">
            BICHO <span className="text-amber-400">ACCOUNTS</span>
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Links (Glass Buttons) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'shop', label: 'Marketplace', icon: ShoppingBag },
            { id: 'orders', label: 'Orders', icon: FileCheck, badge: ordersCount },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const isActive = activePage === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleNavClick(tab.id as NavTab)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'glass-button-primary text-amber-300 font-bold'
                    : 'glass-button text-zinc-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-mono-num font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {currentUser.isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activePage === 'admin'
                  ? 'bg-rose-500/30 border border-rose-500/60 text-white shadow-lg shadow-rose-500/20'
                  : 'glass-button text-rose-300 hover:text-rose-200 border-rose-500/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Desk</span>
              {adminBadgeCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono-num font-bold">
                  {adminBadgeCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: Profile & Actions (Glass Buttons) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* User Pill Button */}
          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className="glass-button flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer group"
          >
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.firstName}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400/50"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                <User className="w-3 h-3" />
              </div>
            )}
            <span className="font-semibold text-zinc-200 hidden sm:inline max-w-[100px] truncate group-hover:text-white">
              {currentUser.username ? `@${currentUser.username}` : currentUser.firstName}
            </span>
          </button>

          {/* Sell Account Glass Button */}
          <button
            type="button"
            onClick={onOpenSellModal}
            className="glass-button-primary px-4 py-2 text-xs font-bold text-amber-300 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Sell Account</span>
          </button>

          {/* Mobile Menu Toggle Glass Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="glass-button p-2 rounded-xl text-zinc-300 hover:text-white md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#04060b]/98 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'shop', label: 'Marketplace Catalog', icon: ShoppingBag },
            { id: 'orders', label: 'Orders Vault', icon: FileCheck, badge: ordersCount },
            { id: 'profile', label: 'Player Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activePage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleNavClick(tab.id as NavTab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive ? 'glass-button-primary text-amber-300 font-bold' : 'glass-button text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {currentUser.isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activePage === 'admin'
                  ? 'bg-rose-500/30 border border-rose-500/60 text-white'
                  : 'glass-button text-rose-300 hover:text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Admin Desk</span>
              </div>
              {adminBadgeCount > 0 && (
                <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                  {adminBadgeCount}
                </span>
              )}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
