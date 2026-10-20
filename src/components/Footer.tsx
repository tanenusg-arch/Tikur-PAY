import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { BRAND } from '../constants/branding';

interface FooterProps {
  onNavigatePage?: (page: 'home' | 'shop' | 'orders' | 'profile') => void;
  onOpenSellModal?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-[#06080d] border-t border-white/[0.08] pt-10 pb-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand & Purpose */}
          <div className="space-y-2.5 max-w-lg">
            <div className="flex items-center gap-2.5 text-white font-extrabold text-base">
              <img
                src={BRAND.logoUrl}
                alt={BRAND.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-400/40 shadow-sm shadow-amber-400/20"
              />
              <span className="font-display font-black tracking-tight">{BRAND.name}</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              The premier marketplace for verified eFootball accounts. Guaranteed Konami ID email handover, Division 1 God Squads, and anti-rollback escrow protection.
            </p>
          </div>

          {/* Trust & Escrow Guarantee */}
          <div className="glass-panel p-4 rounded-2xl space-y-1.5 max-w-sm w-full">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Anti-Rollback Protected</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Funds are held in escrow until you verify full access to the Konami ID and complete email migration.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>
            &copy; 2026 {BRAND.name}. All rights reserved. Disclaimer: eFootball and PES are registered trademarks of Konami Digital Entertainment Inc. This independent marketplace is not endorsed by or affiliated with Konami.
          </p>
          <div className="flex items-center gap-4 text-zinc-400 whitespace-nowrap">
            <span>SSL 256-Bit Encrypted</span>
            <span>·</span>
            <span>Instant Automated Vault</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
