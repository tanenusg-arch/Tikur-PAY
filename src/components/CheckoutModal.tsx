import React, { useState, useEffect } from 'react';
import { EfootballAccount, PurchasedOrder, TelegramUser, AdminPaymentConfig } from '../types/account';
import { BRAND } from '../constants/branding';
import { setupTelegramBackButton } from '../lib/telegram';
import {
  X,
  CheckCircle2,
  Clock,
  Upload,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Mail,
  UserCheck,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  account: EfootballAccount;
  currentUser: TelegramUser;
  paymentConfig: AdminPaymentConfig;
  onClose: () => void;
  onOrderSuccess: (order: PurchasedOrder) => void;
  onReleaseLock: (accountId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  account,
  currentUser,
  paymentConfig,
  onClose,
  onOrderSuccess,
  onReleaseLock,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'TELEBIRR' | 'CBE'>('TELEBIRR');
  const [senderNameOrPhone, setSenderNameOrPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 15-Minute Countdown Timer
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (account.lockedUntil) {
      return Math.max(0, Math.floor((account.lockedUntil - Date.now()) / 1000));
    }
    return 15 * 60;
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onReleaseLock(account.id);
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, account.id, onClose, onReleaseLock]);

  // Sync Telegram native BackButton and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const cleanup = setupTelegramBackButton(onClose);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cleanup();
    };
  }, [onClose]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const triggerTelegramHaptic = (type: 'impact' | 'notification' | 'selection' = 'selection') => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
        if (type === 'notification') {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        } else if (type === 'impact') {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        } else {
          window.Telegram.WebApp.HapticFeedback.selectionChanged();
        }
      }
    } catch {
      // Haptics optional
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    triggerTelegramHaptic('selection');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
        triggerTelegramHaptic('impact');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Always require email address for the new account owner
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!buyerEmail.trim() || !emailRegex.test(buyerEmail.trim())) {
      setErrorMessage('Please enter a valid email address. This will become the official new account owner receiving the Konami ID credentials.');
      return;
    }

    // 2. Require sender name or phone for payment verification
    if (!senderNameOrPhone.trim()) {
      setErrorMessage('Please enter your payment sender name or phone number.');
      return;
    }

    // 3. Require screenshot proof
    if (!screenshotPreview) {
      setErrorMessage('A clear screenshot of your payment transfer receipt is required.');
      return;
    }

    setIsSubmitting(true);
    triggerTelegramHaptic('impact');

    const priceETB = account.priceETB || 0;

    const newOrder: PurchasedOrder = {
      orderId: `EFB-ORD-${Date.now().toString().slice(-6)}`,
      accountId: account.id,
      accountTitle: account.title,
      platform: account.platform,
      priceETB,
      collectiveStrength: account.collectiveStrength,
      buyerEmail: buyerEmail.trim().toLowerCase(),
      buyerTelegram: {
        id: currentUser.id,
        username: currentUser.username,
        firstName: currentUser.firstName,
        photoUrl: currentUser.photoUrl,
      },
      paymentMethod,
      senderNameOrPhone: senderNameOrPhone.trim(),
      transactionRef: transactionRef.trim() || 'Provided in screenshot',
      paymentScreenshotUrl: screenshotPreview,
      status: 'pending_verification',
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      triggerTelegramHaptic('notification');
      onOrderSuccess(newOrder);
    }, 1000);
  };

  const handleCloseModal = () => {
    if (!isCompleted) {
      onReleaseLock(account.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#070a16] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col">
        {/* Mobile handle indicator for TG Mini App */}
        <div className="sm:hidden pt-2 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#0a0f22] border-b border-white/[0.1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                <span>Lock Reserved</span>
                <span className="font-mono bg-cyan-400/15 text-cyan-300 px-1.5 py-0.5 rounded font-extrabold text-[10px] sm:text-[11px] border border-cyan-400/30">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                {account.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="glass-btn glass-btn-secondary p-1.5 rounded-full ml-2"
          >
            <X className="w-4 h-4 text-zinc-300" />
          </button>
        </div>

        {/* Scrollable Content (Touch optimized for Telegram WebApp) */}
        <div className="px-4 py-4 sm:p-5 overflow-y-auto space-y-4 overscroll-contain pb-safe">
          {isCompleted ? (
            <div className="py-6 sm:py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg sm:text-2xl font-black text-white">Payment Proof Submitted</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Store admins are verifying your receipt. The Konami ID login credentials will be transferred directly to your email.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 bg-black/60 rounded-2xl border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-cyan-500/10 border border-cyan-400/30 rounded-xl">
                  <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> New Account Owner:
                  </span>
                  <span className="text-white font-mono font-bold truncate max-w-[200px]">{buyerEmail}</span>
                </div>
                <div className="flex justify-between text-zinc-400 pt-1">
                  <span>Squad:</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">{account.title}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Amount:</span>
                  <span className="text-cyan-300 font-bold font-mono-num">{(account.priceETB || 0).toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Payment Channel:</span>
                  <span className="text-white font-semibold">{paymentMethod}</span>
                </div>
                {transactionRef && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Transaction Ref:</span>
                    <span className="text-zinc-200 font-mono text-[11px]">{transactionRef}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-2 pb-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-btn glass-btn-primary w-full sm:w-auto px-6 py-3 text-xs font-bold"
                >
                  Close & View in Orders
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-3.5 sm:space-y-4.5 pb-4">
              {/* Total Price Banner with Glass Refraction */}
              <div className="p-3.5 sm:p-4 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-400/30 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-xs text-zinc-400 block font-medium">Total Amount to Pay</span>
                  <span className="text-xl sm:text-2xl font-black text-cyan-300 font-mono-num">
                    {(account.priceETB || 0).toLocaleString()} ETB
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Escrow Protected</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center justify-end gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed
                  </span>
                </div>
              </div>

              {/* 1. NEW ACCOUNT OWNER EMAIL (ALWAYS ASKED & REQUIRED) */}
              <div className="p-3.5 bg-gradient-to-br from-cyan-500/10 to-black/60 border border-cyan-400/30 rounded-2xl space-y-1.5 shadow-md">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>New Account Owner Email</span>
                  </label>
                  <span className="text-[9px] bg-cyan-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded uppercase">
                    Required
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  The verified Konami ID and squad credentials will be officially transferred to this email.
                </p>
                <div className="relative pt-1">
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full bg-black/80 border border-cyan-400/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/40"
                  />
                </div>
              </div>

              {/* 2. PAYMENT CHANNEL SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Select Payment Channel
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('TELEBIRR');
                      triggerTelegramHaptic('selection');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      paymentMethod === 'TELEBIRR'
                        ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-md shadow-amber-400/15'
                        : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <img
                      src={BRAND.telebirrSvgUrl}
                      alt="Telebirr"
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-lg object-contain bg-white/5 p-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">Telebirr</div>
                      <div className="text-[10px] text-zinc-400">Mobile Money</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('CBE');
                      triggerTelegramHaptic('selection');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      paymentMethod === 'CBE'
                        ? 'bg-purple-500/15 border-purple-400 text-purple-300 shadow-md shadow-purple-500/15'
                        : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <img
                      src={BRAND.cbeSvgUrl}
                      alt="CBE"
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-lg object-contain bg-white/5 p-0.5 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">CBE Bank</div>
                      <div className="text-[10px] text-zinc-400">Bank Transfer</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. RECEIVING ACCOUNT DETAILS CARD */}
              <div className="p-3 bg-black/60 border border-white/10 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Transfer to Official Escrow ({paymentMethod})</span>
                </div>

                {paymentMethod === 'TELEBIRR' ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-[#0b1020] rounded-xl border border-white/[0.08]">
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-medium">Telebirr Number:</span>
                        <span className="text-amber-300 font-mono font-bold text-sm tracking-wide">
                          {paymentConfig.telebirrNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentConfig.telebirrNumber, 'telebirr')}
                        className="glass-btn glass-btn-secondary px-3 py-1.5 text-xs font-bold"
                      >
                        {copiedField === 'telebirr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'telebirr' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="p-2 bg-black/40 rounded-xl border border-white/[0.04]">
                      <span className="text-[10px] text-zinc-500 block">Receiver Account Name:</span>
                      <span className="text-zinc-200 font-medium text-xs">{paymentConfig.telebirrAccountName}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-[#0b1020] rounded-xl border border-white/[0.08]">
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-medium">CBE Account Number:</span>
                        <span className="text-purple-300 font-mono font-bold text-sm tracking-wide">
                          {paymentConfig.cbeAccountNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentConfig.cbeAccountNumber, 'cbe')}
                        className="glass-btn glass-btn-secondary px-3 py-1.5 text-xs font-bold"
                      >
                        {copiedField === 'cbe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'cbe' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="p-2 bg-black/40 rounded-xl border border-white/[0.04]">
                      <span className="text-[10px] text-zinc-500 block">Beneficiary Name:</span>
                      <span className="text-zinc-200 font-medium text-xs">{paymentConfig.cbeAccountName}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. SENDER INFO & OPTIONAL TRANSACTION REF */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">
                      Sender Name / Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={senderNameOrPhone}
                      onChange={(e) => setSenderNameOrPhone(e.target.value)}
                      placeholder="e.g., Abebe (0911...)"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-zinc-300 font-semibold block">
                        Transaction Reference
                      </label>
                      <span className="text-[10px] text-zinc-400 font-medium italic">
                        Optional
                      </span>
                    </div>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g., FT2428190381 (optional)"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-cyan-300 font-mono focus:border-cyan-400 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                {/* 5. UPLOAD PAYMENT SCREENSHOT PROOF */}
                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1.5 flex items-center justify-between">
                    <span>Payment Screenshot Proof <span className="text-rose-400">*</span></span>
                    <span className="text-[10px] text-cyan-400 font-medium">Telebirr SMS or CBE receipt</span>
                  </label>

                  <label className="p-3 border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-colors active:bg-cyan-400/5">
                    <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-200">
                      {screenshotPreview ? 'Tap to Change Screenshot' : 'Tap to Upload Payment Receipt'}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">Upload image from your phone gallery</span>
                    <input type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                  </label>

                  {screenshotPreview && (
                    <div className="mt-2 relative rounded-xl overflow-hidden border border-white/15 max-h-36 bg-black flex items-center justify-center">
                      <img src={screenshotPreview} alt="Screenshot preview" className="w-full h-full object-contain max-h-36" />
                      <button
                        type="button"
                        onClick={() => setScreenshotPreview(null)}
                        className="glass-btn glass-btn-danger absolute top-2 right-2 px-2.5 py-1 text-[11px] font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message banner */}
              {errorMessage && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-200 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Glass Buttons (Fit for mobile TG Mini App) */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="glass-btn glass-btn-secondary w-full sm:w-auto px-5 py-2.5 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glass-btn glass-btn-emerald w-full sm:w-auto px-6 py-3 text-xs font-bold shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Payment Proof</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
