import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
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
    <header className="sticky top-0 z-40 bg-[#06080d]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          <img
            src={BRAND.logoUrl}
            alt={BRAND.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-400/40 group-hover:scale-105 transition-all duration-200 shadow-md shadow-amber-500/20"
          />
          <span className="font-display font-black tracking-tight text-white text-base sm:text-lg whitespace-nowrap">
            BICHO <span className="text-amber-400">ACCOUNTS SHOP</span>
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`px-3 lg:px-3.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
              activePage === 'home'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('shop')}
            className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activePage === 'shop'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('orders')}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activePage === 'orders'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span>Orders</span>
            {ordersCount > 0 && (
              <span
                className={`text-[10px] font-mono-num font-bold px-1.5 py-0.2 rounded-full ${
                  activePage === 'orders'
                    ? 'bg-slate-950 text-amber-400'
                    : 'bg-amber-400 text-slate-950'
                }`}
              >
                {ordersCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activePage === 'profile'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Profile
          </button>

          {currentUser.isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activePage === 'admin'
                  ? 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-500/20'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-bold'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Desk</span>
              {adminBadgeCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono-num font-bold">
                  {adminBadgeCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: Profile & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Pill */}
          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs transition-all cursor-pointer group"
          >
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.firstName}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                <User className="w-3 h-3" />
              </div>
            )}
            <span className="font-semibold text-zinc-200 hidden sm:inline max-w-[95px] truncate group-hover:text-white">
              {currentUser.username ? `@${currentUser.username}` : currentUser.firstName}
            </span>
            {currentUser.isAdmin && (
              <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 py-0.2 rounded font-bold uppercase">
                Admin
              </span>
            )}
          </button>

          {/* Sell Account Button */}
          <button
            type="button"
            onClick={onOpenSellModal}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline sm:inline">Sell</span>
            <span className="hidden sm:inline">Account</span>
          </button>

          {/* Mobile Menu Toggle Button (md:hidden) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08] md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#06080d]/95 backdrop-blur-2xl px-4 py-3 space-y-1 animate-in slide-in-from-top duration-150 shadow-2xl">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activePage === 'home'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('shop')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activePage === 'shop'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Accounts</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activePage === 'orders'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4" />
              <span>Orders Vault</span>
            </div>
            {ordersCount > 0 && (
              <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                {ordersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activePage === 'profile'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Player Profile</span>
          </button>

          {currentUser.isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activePage === 'admin'
                  ? 'bg-rose-500 text-white'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Desk</span>
              </div>
              {adminBadgeCount > 0 && (
                <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
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
