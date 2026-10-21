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
  Sparkles,
} from 'lucide-react';
import { TelegramUser, PendingAccountSubmission } from '../../types/account';
import { isStealthAdmin } from '../../lib/telegram';

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
    <div className="py-4 sm:py-8 max-w-4xl mx-auto px-3.5 sm:px-6 space-y-5 sm:space-y-7 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Telegram Profile
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 sm:mt-1">
          Player Profile &amp; Account Hub
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
          Manage your purchases, credentials vault, and account sale submissions.
        </p>
      </div>

      {/* User Overview Card */}
      <div className="p-4 sm:p-6 glass-panel rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
        <div className="flex items-center gap-3.5 sm:gap-4">
          {currentUser.photoUrl ? (
            <img
              src={currentUser.photoUrl}
              alt={currentUser.firstName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-cyan-400/30 shadow-lg"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-blue-500 flex items-center justify-center text-slate-950 font-black text-xl sm:text-2xl shadow-lg shadow-cyan-500/20">
              {currentUser.firstName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {currentUser.firstName} {currentUser.lastName || ''}
              </h2>

              {currentUser.isAdmin && !isStealthAdmin(currentUser.username) && (
                <span className="text-[9px] sm:text-[10px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> Store Administrator
                </span>
              )}
              {(!currentUser.isAdmin || isStealthAdmin(currentUser.username)) && (
                <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Verified Member
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
              <span className="text-cyan-300 font-mono font-medium">
                {currentUser.username ? `@${currentUser.username}` : 'No username set'}
              </span>
              <span>·</span>
              <span className="font-mono-num text-zinc-500">ID: {currentUser.id}</span>
            </div>
          </div>
        </div>

        {/* Right side: Orders vault & Admin Action */}
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Purchased Orders</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-300 font-mono-num">{ordersCount}</span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onNavigateToOrders}
              className="glass-btn glass-btn-secondary px-3.5 py-1.5 text-xs font-semibold"
            >
              <span>View Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {currentUser.isAdmin && onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="glass-btn glass-btn-danger px-3.5 py-1.5 text-xs font-bold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Desk</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User's Account Submissions to Sell */}
      <div className="p-4 sm:p-6 glass-panel rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Your Account Sale Submissions</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
              Accounts submitted to store admins for marketplace approval.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSellModal}
            className="glass-btn glass-btn-emerald px-3 py-1.5 text-xs font-bold shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Account</span>
          </button>
        </div>

        {userSubmissions.length === 0 ? (
          <div className="p-5 sm:p-6 bg-black/40 rounded-2xl border border-white/[0.06] text-center space-y-2.5">
            <p className="text-xs text-zinc-400">You haven't submitted any accounts for sale yet.</p>
            <button
              type="button"
              onClick={onOpenSellModal}
              className="glass-btn glass-btn-primary px-4 py-2 text-xs font-bold"
            >
              Submit Your eFootball Account
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {userSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 bg-black/50 border border-white/[0.08] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
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
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
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
                    <strong className="text-cyan-300 font-mono-num">{sub.priceETB.toLocaleString()} ETB</strong>
                  </div>
                </div>

                <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
                  <span>Pending Store Admin Review</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shortcuts Grid with Glass Panels and Glass Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 sm:p-5 glass-panel glass-panel-cyan rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Submit Account to Admins</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Submit your eFootball account with squad images and asking price in ETB for admin inspection and approval.
          </p>
          <button
            type="button"
            onClick={onOpenSellModal}
            className="glass-btn glass-btn-emerald px-4 py-2 text-xs font-bold"
          >
            Start Account Submission
          </button>
        </div>

        <div className="p-4 sm:p-5 glass-panel glass-panel-violet rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShoppingBag className="w-4 h-4 text-purple-400" />
            <span>Marketplace Inventory</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Browse verified eFootball accounts, filter by platform and legend boosters, and unlock credentials via Telebirr or CBE.
          </p>
          <button
            type="button"
            onClick={onNavigateToShop}
            className="glass-btn glass-btn-primary px-4 py-2 text-xs font-semibold"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
