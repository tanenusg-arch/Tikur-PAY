import React, { useState } from 'react';
import { X, User, Phone, Landmark, ShieldCheck, ShoppingBag, Plus, Save, Check } from 'lucide-react';
import { BRAND } from '../constants/branding';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordersCount: number;
  onOpenOrders: () => void;
  onOpenSellModal: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  ordersCount,
  onOpenOrders,
  onOpenSellModal,
}) => {
  const [gamerTag, setGamerTag] = useState(() => localStorage.getItem('efb_profile_tag') || 'eFootball_Pro_ET');
  const [telebirrPhone, setTelebirrPhone] = useState(() => localStorage.getItem('efb_profile_telebirr') || '0912345678');
  const [cbeAccount, setCbeAccount] = useState(() => localStorage.getItem('efb_profile_cbe') || '1000293847192');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('efb_profile_tag', gamerTag);
    localStorage.setItem('efb_profile_telebirr', telebirrPhone);
    localStorage.setItem('efb_profile_cbe', cbeAccount);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Player Profile & Payment Accounts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* User Identity Card */}
          <div className="p-4 bg-zinc-900/80 rounded-2xl border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-black text-lg">
                {gamerTag.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{gamerTag}</h4>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                  <span className="text-emerald-400 font-medium">Verified Buyer</span>
                  <span>·</span>
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-zinc-400 block">Orders</span>
              <span className="text-xl font-black text-amber-400 font-mono-num">{ordersCount}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="p-3.5 bg-black/60 hover:bg-zinc-900 border border-white/[0.08] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>View Order Vault ({ordersCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSellModal();
              }}
              className="p-3.5 bg-black/60 hover:bg-zinc-900 border border-white/[0.08] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>List Squad for Sale</span>
            </button>
          </div>

          {/* Payment Account Settings (Telebirr & CBE) */}
          <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-white/[0.08]">
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Linked Ethiopian Payment Accounts
              </h5>
              <p className="text-[11px] text-zinc-400">
                Pre-fill your payment details for instant Telebirr & CBE transaction verification.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-medium flex items-center gap-2">
                  <img
                    src={BRAND.telebirrSvgUrl}
                    alt="Telebirr"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded object-contain"
                  />
                  <span>Telebirr Phone Number</span>
                </label>
                <input
                  type="text"
                  value={telebirrPhone}
                  onChange={(e) => setTelebirrPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full bg-black/60 border border-white/[0.08] focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white font-mono-num"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-medium flex items-center gap-2">
                  <img
                    src={BRAND.cbeSvgUrl}
                    alt="CBE"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded object-contain"
                  />
                  <span>Commercial Bank of Ethiopia (CBE) Account</span>
                </label>
                <input
                  type="text"
                  value={cbeAccount}
                  onChange={(e) => setCbeAccount(e.target.value)}
                  placeholder="1000 2938 4719 2"
                  className="w-full bg-black/60 border border-white/[0.08] focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white font-mono-num"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-medium">Gamer Handle / Display Tag</label>
                <input
                  type="text"
                  value={gamerTag}
                  onChange={(e) => setGamerTag(e.target.value)}
                  placeholder="eFootball_Pro"
                  className="w-full bg-black/60 border border-white/[0.08] focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved Successfully</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Account Details</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
