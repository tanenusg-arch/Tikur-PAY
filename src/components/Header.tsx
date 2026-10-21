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
  Sparkles,
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
    <header className="shrink-0 z-30 bg-[#060813]/90 backdrop-blur-2xl border-b border-white/[0.1] shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0 bg-transparent border-0 p-0 text-left"
        >
          <div className="relative">
            <img
              src={BRAND.logoUrl}
              alt={BRAND.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-1 ring-cyan-400/50 group-hover:scale-105 transition-all duration-200 shadow-md shadow-cyan-500/20"
            />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black tracking-wider text-white text-sm sm:text-base whitespace-nowrap leading-tight">
              BICHO <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">ACCOUNTS</span>
            </span>
            <span className="text-[9px] text-cyan-300/70 font-bold uppercase tracking-widest hidden sm:block">
              eFootball Marketplace
            </span>
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links (Glass Buttons) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-xl">
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
                className={`glass-btn px-3.5 py-1.5 text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'glass-btn-primary font-extrabold text-white'
                    : 'glass-btn-secondary text-zinc-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-mono-num font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-cyan-400 text-slate-950 shadow-sm' : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
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
              className={`glass-btn px-3.5 py-1.5 text-xs transition-all whitespace-nowrap ${
                activePage === 'admin'
                  ? 'glass-btn-danger font-extrabold'
                  : 'glass-btn-secondary border-rose-500/30 text-rose-300 hover:text-rose-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin Desk</span>
              {adminBadgeCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono-num font-bold shadow-sm">
                  {adminBadgeCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: Profile & Actions (Glass Buttons) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Profile Glass Pill Button */}
          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className="glass-btn glass-btn-secondary px-2.5 sm:px-3 py-1.5 text-xs group"
          >
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.firstName}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-400/50"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                {currentUser.firstName.slice(0, 1).toUpperCase()}
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
            className="glass-btn glass-btn-emerald px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Sell Account</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="glass-btn glass-btn-secondary p-2 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-400" /> : <Menu className="w-4 h-4 text-zinc-300" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.1] bg-[#060814]/98 backdrop-blur-2xl px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
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
                className={`w-full glass-btn justify-between px-4 py-2.5 text-xs font-semibold ${
                  isActive ? 'glass-btn-primary font-bold' : 'glass-btn-secondary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950">
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
              className={`w-full glass-btn justify-between px-4 py-2.5 text-xs font-bold ${
                activePage === 'admin' ? 'glass-btn-danger font-extrabold' : 'glass-btn-secondary border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
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
