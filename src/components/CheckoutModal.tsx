import React, { useState, useEffect } from 'react';
import { EfootballAccount, PurchasedOrder, TelegramUser, AdminPaymentConfig } from '../types/account';
import { BRAND } from '../constants/branding';
import {
  X,
  CheckCircle2,
  Clock,
  Upload,
  Copy,
  Check,
  Smartphone,
  Landmark,
  ShieldCheck,
  ShieldAlert,
  Send,
  AlertCircle,
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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!senderNameOrPhone.trim()) {
      setErrorMessage('Please enter your payment sender name or phone number.');
      return;
    }

    if (!transactionRef.trim()) {
      setErrorMessage('Please enter the Telebirr or CBE transaction reference number.');
      return;
    }

    if (!screenshotPreview) {
      setErrorMessage('A clear screenshot of your payment transfer receipt is required.');
      return;
    }

    setIsSubmitting(true);

    const priceETB = account.priceETB || 0;

    const newOrder: PurchasedOrder = {
      orderId: `EFB-ORD-${Date.now().toString().slice(-6)}`,
      accountId: account.id,
      accountTitle: account.title,
      platform: account.platform,
      priceETB,
      collectiveStrength: account.collectiveStrength,
      buyerEmail: buyerEmail.trim() || undefined,
      buyerTelegram: {
        id: currentUser.id,
        username: currentUser.username,
        firstName: currentUser.firstName,
        photoUrl: currentUser.photoUrl,
      },
      paymentMethod,
      senderNameOrPhone: senderNameOrPhone.trim(),
      transactionRef: transactionRef.trim(),
      paymentScreenshotUrl: screenshotPreview,
      status: 'pending_verification',
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);
      onOrderSuccess(newOrder);
    }, 1200);
  };

  const handleCloseModal = () => {
    if (!isCompleted) {
      onReleaseLock(account.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-zinc-900 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <span>15-Minute Lock Reserved</span>
                <span className="font-mono bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-md font-extrabold text-[11px]">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1 mt-0.5">
                {account.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {isCompleted ? (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-black text-white">Payment Under Escrow Review</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your transfer screenshot and transaction reference have been submitted to store admins for instant verification.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/90 rounded-2xl border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Squad:</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">{account.title}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Price Paid:</span>
                  <span className="text-amber-400 font-bold font-mono-num">{account.priceETB?.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Payment Channel:</span>
                  <span className="text-white font-semibold">{paymentMethod}</span>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close & View in Orders
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Total Price Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/20 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">Total Amount to Pay</span>
                  <span className="text-2xl font-black text-amber-400 font-mono-num">
                    {(account.priceETB || 0).toLocaleString()} ETB
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Escrow Security</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Protected
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Select Ethiopian Payment Channel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('TELEBIRR')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      paymentMethod === 'TELEBIRR'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <img
                      src={BRAND.telebirrSvgUrl}
                      alt="Telebirr"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-xl object-contain bg-white/5 p-1 shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">Telebirr</div>
                      <div className="text-[10px] text-zinc-400">Mobile Transfer</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CBE')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      paymentMethod === 'CBE'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/10'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <img
                      src={BRAND.cbeSvgUrl}
                      alt="CBE"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-xl object-contain bg-white/5 p-1 shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">CBE Bank</div>
                      <div className="text-[10px] text-zinc-400">Bank Transfer</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Admin Configured Transfer Details */}
              <div className="p-4 bg-zinc-900/90 border border-white/10 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Admin Receiving Account Details ({paymentMethod})</span>
                </div>

                {paymentMethod === 'TELEBIRR' ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-white/[0.06]">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Telebirr Number:</span>
                        <span className="text-amber-400 font-mono font-bold text-sm">
                          {paymentConfig.telebirrNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentConfig.telebirrNumber, 'telebirr')}
                        className="px-2.5 py-1 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'telebirr' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'telebirr' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-white/[0.06]">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Receiver Account Name:</span>
                        <span className="text-white font-medium">{paymentConfig.telebirrAccountName}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-white/[0.06]">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">CBE Account Number:</span>
                        <span className="text-sky-400 font-mono font-bold text-sm">
                          {paymentConfig.cbeAccountNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentConfig.cbeAccountNumber, 'cbe')}
                        className="px-2.5 py-1 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'cbe' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'cbe' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-white/[0.06]">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Beneficiary Name:</span>
                        <span className="text-white font-medium">{paymentConfig.cbeAccountName}</span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-zinc-400 italic">
                  {paymentConfig.instructions}
                </p>
              </div>

              {/* Form Fields: Sender Info & Screenshot Upload */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">
                      Sender Name / Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={senderNameOrPhone}
                      onChange={(e) => setSenderNameOrPhone(e.target.value)}
                      placeholder="e.g., Abebe Kebede (0911...)"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">
                      Transaction Reference Number
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g., FT2428190381"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1">
                    Upload Payment Confirmation Screenshot
                  </label>
                  <label className="p-4 border-2 border-dashed border-white/10 hover:border-amber-400/50 rounded-2xl bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-300">Click to Upload Payment Receipt</span>
                    <span className="text-[10px] text-zinc-500">Telebirr SMS / CBE App Transfer Screenshot</span>
                    <input type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                  </label>

                  {screenshotPreview && (
                    <div className="mt-3 relative rounded-2xl overflow-hidden border border-white/10 max-h-48 bg-black group">
                      <img src={screenshotPreview} alt="Screenshot preview" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setScreenshotPreview(null)}
                        className="absolute top-2 right-2 px-2.5 py-1 bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">
                    Optional Notification Email (For credentials delivery)
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="player@example.com"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Payment Screenshot</span>
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
