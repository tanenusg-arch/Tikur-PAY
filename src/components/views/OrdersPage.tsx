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
  Sparkles,
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
    <div className="py-4 sm:py-8 max-w-5xl mx-auto px-3.5 sm:px-6 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> Escrow Handover Vault
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 sm:mt-1">
          Your Purchased Accounts &amp; Credentials
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
          Access your Konami ID logins, temporary passwords, and transfer PINs anytime.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-14 sm:py-20 glass-panel rounded-3xl space-y-3.5 px-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto text-cyan-400">
            <Lock className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">No Unlocked Accounts Yet</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            When you purchase an account using Telebirr or CBE, submit your payment screenshot. Once approved by our store admins, your Konami ID credentials appear here instantly.
          </p>
          <button
            type="button"
            onClick={onNavigateToShop}
            className="glass-btn glass-btn-primary px-6 py-2.5 text-xs font-bold"
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
                className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-num font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 rounded">
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
                  <h3 className="text-sm sm:text-base font-bold text-white">{order.accountTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-medium">
                    <span>{order.platform}</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span className="text-cyan-300 font-bold font-mono-num">{order.collectiveStrength} PTS</span>
                    {order.buyerEmail && (
                      <>
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                        <span className="text-cyan-200 font-medium">Owner: {order.buyerEmail}</span>
                      </>
                    )}
                    {order.transactionRef && order.transactionRef !== 'Provided in screenshot' && (
                      <>
                        <span aria-hidden="true" className="text-zinc-600">·</span>
                        <span>TX: {order.transactionRef}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* If Pending: Verification Callout */}
                {isPending && (
                  <div className="p-3.5 bg-black/60 border border-amber-400/30 rounded-xl space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-amber-400 animate-pulse shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-white">Payment Screenshot Under Admin Review</div>
                        <p className="text-zinc-400 leading-relaxed">
                          Your Telebirr / CBE payment proof was received. Admin{' '}
                          <strong className="text-cyan-300">@el_bicho14</strong> verifies transactions in 5-15 minutes. Credentials will automatically unlock below once confirmed.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Verification in progress</span>
                      <span className="text-cyan-300 font-mono font-semibold">Support: @el_bicho14</span>
                    </div>
                  </div>
                )}

                {/* If Completed: Credential Vault Box */}
                {isCompleted && order.credentials && (
                  <div className="p-3.5 sm:p-4 bg-black/70 rounded-xl border border-white/[0.08] space-y-2.5 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-zinc-400 font-medium">Konami ID Login Email:</span>
                      <div className="flex items-center gap-2 font-mono-num text-zinc-200">
                        <span className="select-all font-semibold">{order.credentials.konamiId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.credentials?.konamiId || '', `${order.orderId}-email`)}
                          className="glass-btn glass-btn-secondary p-1"
                        >
                          {copiedKey === `${order.orderId}-email` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-zinc-400 font-medium">Temporary Master Password:</span>
                      <div className="flex items-center gap-2 font-mono-num text-cyan-300 font-bold">
                        <span className="select-all">{order.credentials.tempPass}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.credentials?.tempPass || '', `${order.orderId}-pass`)}
                          className="glass-btn glass-btn-secondary p-1"
                        >
                          {copiedKey === `${order.orderId}-pass` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
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

                {/* Actions with Glass Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-zinc-400">
                    Total Paid:{' '}
                    <span className="font-mono-num text-cyan-300 font-bold">
                      {(order.priceETB || 0).toLocaleString()} ETB
                    </span>
                  </span>

                  {isCompleted && order.credentials && (
                    <button
                      type="button"
                      onClick={() => handleDownload(order)}
                      className="glass-btn glass-btn-secondary px-4 py-2 text-xs font-semibold"
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
