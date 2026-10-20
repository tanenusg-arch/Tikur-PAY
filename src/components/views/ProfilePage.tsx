import React from 'react';
import {
  User,
  ShieldCheck,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { TelegramUser, PendingAccountSubmission } from '../../types/account';

interface ProfilePageProps {
  currentUser: TelegramUser;
  ordersCount: number;
  userSubmissions: PendingAccountSubmission[];
  onNavigateToOrders: () => void;
  onOpenSellModal: () => void;
  onNavigateToShop: () => void;
  onNavigateToAdmin?: () => void;
  onUpdateCurrentUser?: (user: TelegramUser) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  ordersCount,
  userSubmissions,
  onNavigateToOrders,
  onOpenSellModal,
  onNavigateToShop,
  onNavigateToAdmin,
}) => {
  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Telegram Profile
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Player Profile &amp; Account Hub
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Manage your purchases, credentials vault, and account sale submissions.
        </p>
      </div>

      {/* User Overview Card */}
      <div className="p-6 bg-zinc-900/90 border border-white/[0.08] rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {currentUser.photoUrl ? (
            <img
              src={currentUser.photoUrl}
              alt={currentUser.firstName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
              {currentUser.firstName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {currentUser.firstName} {currentUser.lastName || ''}
              </h2>

              {currentUser.isAdmin ? (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Store Administrator
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Verified Member
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
              <span className="text-amber-400 font-mono font-medium">
                {currentUser.username ? `@${currentUser.username}` : 'No username set'}
              </span>
              <span>·</span>
              <span className="font-mono-num text-zinc-500">ID: {currentUser.id}</span>
            </div>
          </div>
        </div>

        {/* Right side: Orders vault & Admin Action */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Purchased Orders</span>
            <span className="text-2xl font-black text-amber-400 font-mono-num">{ordersCount}</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onNavigateToOrders}
              className="px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {currentUser.isAdmin && onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Desk</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User's Account Submissions to Sell */}
      <div className="p-6 bg-zinc-900/90 border border-white/[0.08] rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Your Account Sale Submissions</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Accounts submitted to store admins for marketplace approval.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSellModal}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Account</span>
          </button>
        </div>

        {userSubmissions.length === 0 ? (
          <div className="p-6 bg-black/40 rounded-2xl border border-white/[0.06] text-center space-y-2">
            <p className="text-xs text-zinc-400">You haven't submitted any accounts for sale yet.</p>
            <button
              type="button"
              onClick={onOpenSellModal}
              className="px-4 py-2 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl hover:bg-amber-400/20 transition-colors cursor-pointer"
            >
              Submit Your eFootball Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 bg-black/50 border border-white/[0.06] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{sub.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        sub.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sub.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      {sub.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved &amp; Posted</span>
                        </>
                      ) : sub.status === 'rejected' ? (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Rejected</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Awaiting Admin Review</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {sub.platform} · {sub.collectiveStrength} PTS · Asking{' '}
                    <strong className="text-amber-400 font-mono-num">{sub.priceETB.toLocaleString()} ETB</strong>
                  </div>
                </div>

                <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <span>Pending Store Admin Review</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-zinc-900/80 border border-white/[0.08] rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Submit Account to Admins</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Submit your eFootball account with squad images and asking price in ETB for admin inspection and approval.
          </p>
          <button
            type="button"
            onClick={onOpenSellModal}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
          >
            Start Account Submission
          </button>
        </div>

        <div className="p-5 bg-zinc-900/80 border border-white/[0.08] rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Marketplace Inventory</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Browse verified eFootball accounts, filter by platform and legend boosters, and unlock credentials via Telebirr or CBE.
          </p>
          <button
            type="button"
            onClick={onNavigateToShop}
            className="px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-xl transition-colors cursor-pointer"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
