import React, { useState } from 'react';
import { PurchasedOrder } from '../../types/account';
import {
  ShieldCheck,
  Download,
  Copy,
  Check,
  Lock,
  ShoppingBag,
  Clock,
  Send,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface OrdersPageProps {
  orders: PurchasedOrder[];
  onNavigateToShop: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onNavigateToShop,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (order: PurchasedOrder) => {
    if (!order.credentials) return;

    const content = `=========================================
EFOOTBALL ACCOUNT TRANSFER CERTIFICATE
=========================================
Order ID: ${order.orderId}
Account: ${order.accountTitle}
Platform: ${order.platform}
Team Strength: ${order.collectiveStrength} PTS
Total Paid: ${(order.priceETB || 0).toLocaleString()} ETB
Payment Method: ${order.paymentMethod}
Transaction Ref: ${order.transactionRef}
Date: ${order.timestamp}

--- CREDENTIALS ---
KONAMI ID: ${order.credentials.konamiId}
TEMP PASSWORD: ${order.credentials.tempPass}
TRANSFER PIN: ${order.credentials.transferCode}

--- NEXT STEPS ---
1. Login to my.konami.net with credentials above.
2. Update the email to your personal address.
3. Open eFootball on your device -> Title Screen -> Support -> Data Transfer -> Konami ID.
4. Complete sync!

Escrow Verification: Confirmed by Store Admin
=========================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.orderId}-eFootball-Vault.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> Escrow Handover Vault
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Your Purchased Accounts & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Access your Konami ID logins, temporary passwords, and transfer PINs anytime.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-white/[0.08] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h3 className="text-xl font-bold text-white">No Unlocked Accounts Yet</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            When you purchase an account using Telebirr or CBE, submit your payment screenshot. Once approved by our store admins, your Konami ID credentials appear here instantly.
          </p>
          <button
            type="button"
            onClick={onNavigateToShop}
            className="px-6 py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all inline-flex items-center gap-2 shadow-md shadow-amber-400/20 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Available Squads</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPending = order.status === 'pending_verification';
            const isCompleted = order.status === 'completed' || !order.status;

            return (
              <div
                key={order.orderId}
                className="bg-zinc-900/90 border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-num font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                      {order.orderId}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">via {order.paymentMethod}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPending
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isPending
                        ? 'Payment Under Review'
                        : isCompleted
                        ? 'Credentials Unlocked'
                        : 'Payment Rejected'}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono-num">{order.timestamp}</span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{order.accountTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-medium">
                    <span>{order.platform}</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span className="text-amber-400 font-bold font-mono-num">{order.collectiveStrength} PTS</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>TX Ref: {order.transactionRef}</span>
                  </div>
                </div>

                {/* If Pending: Verification Callout */}
                {isPending && (
                  <div className="p-4 bg-zinc-900 border border-amber-400/30 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-400 animate-pulse shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-white">Payment Screenshot Under Admin Review</div>
                        <p className="text-zinc-400 leading-relaxed">
                          Your Telebirr / CBE payment proof was received. Admins{' '}
                          <strong className="text-sky-400">@Dev_LecteR</strong> and{' '}
                          <strong className="text-sky-400">@el_bicho14</strong> verify transactions in 5-15 minutes. Credentials will automatically unlock below once confirmed.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Verification in progress</span>
                      <span className="text-amber-400 font-mono font-semibold">Support: @Dev_LecteR</span>
                    </div>
                  </div>
                )}

                {/* If Completed: Credential Vault Box */}
                {isCompleted && order.credentials && (
                  <div className="p-4 bg-black/70 rounded-xl border border-white/[0.08] space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-zinc-400 font-medium">Konami ID Login Email:</span>
                      <div className="flex items-center gap-2 font-mono-num text-zinc-200">
                        <span className="select-all font-semibold">{order.credentials.konamiId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.credentials?.konamiId || '', `${order.orderId}-email`)}
                          className="p-1 hover:text-white text-zinc-400 cursor-pointer"
                        >
                          {copiedKey === `${order.orderId}-email` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-zinc-400 font-medium">Temporary Master Password:</span>
                      <div className="flex items-center gap-2 font-mono-num text-amber-300 font-bold">
                        <span className="select-all">{order.credentials.tempPass}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.credentials?.tempPass || '', `${order.orderId}-pass`)}
                          className="p-1 hover:text-white text-zinc-400 cursor-pointer"
                        >
                          {copiedKey === `${order.orderId}-pass` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-zinc-400 font-medium">In-Game Link Verification PIN:</span>
                      <span className="font-mono-num text-zinc-200 font-bold text-sm tracking-wider">
                        {order.credentials.transferCode}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-zinc-400">
                    Total Paid:{' '}
                    <span className="font-mono-num text-amber-400 font-bold">
                      {(order.priceETB || 0).toLocaleString()} ETB
                    </span>
                  </span>

                  {isCompleted && order.credentials && (
                    <button
                      type="button"
                      onClick={() => handleDownload(order)}
                      className="px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Transfer Certificate (.txt)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
