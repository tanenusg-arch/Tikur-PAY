import React, { useState, useEffect } from 'react';
import { Platform, PendingAccountSubmission, TelegramUser } from '../types/account';
import { setupTelegramBackButton } from '../lib/telegram';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface SellAccountModalProps {
  currentUser: TelegramUser;
  onClose: () => void;
  onSubmitForApproval: (submission: PendingAccountSubmission) => void;
}

export const SellAccountModal: React.FC<SellAccountModalProps> = ({
  currentUser,
  onClose,
  onSubmitForApproval,
}) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('Mobile');
  const [collectiveStrength, setCollectiveStrength] = useState<number>(3120);
  const [divisionPeak, setDivisionPeak] = useState('Division 1');
  const [priceETB, setPriceETB] = useState<number>(12000);
  const [coins, setCoins] = useState<number>(1000);
  const [gp, setGp] = useState<number>(3000000);
  const [epicBoosterCount, setEpicBoosterCount] = useState<number>(8);
  const [konamiIdStatus, setKonamiIdStatus] = useState<
    'Unlinked / Clean' | 'Email Changeable' | 'Full Access Handover'
  >('Email Changeable');
  const [formation, setFormation] = useState('4-2-1-3');
  const [keyPlayers, setKeyPlayers] = useState('');
  const [description, setDescription] = useState('');
  const [sellerContact, setSellerContact] = useState('');
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !priceETB) {
      setErrorMsg('Please enter squad title and your asking price in ETB.');
      return;
    }

    if (!proofPreview) {
      setErrorMsg('A clear squad screenshot / proof image is required for admin inspection.');
      return;
    }

    const newSubmission: PendingAccountSubmission = {
      id: `EFB-SUB-${Date.now()}`,
      title: title.trim(),
      platform,
      collectiveStrength,
      divisionPeak,
      priceETB,
      coins,
      gp,
      epicBoosterCount,
      konamiIdStatus,
      formation,
      description: description.trim(),
      keyPlayers: keyPlayers.trim(),
      proofImage: proofPreview,
      sellerTelegram: {
        id: currentUser.id,
        username: currentUser.username,
        firstName: currentUser.firstName,
      },
      sellerContact: sellerContact.trim() || 'Via Telegram',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    onSubmitForApproval(newSubmission);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#080c1d] border border-white/15 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0a0f26] border-b border-white/[0.1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Submit Account to Admins for Sale
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                Admin Escrow &amp; Marketplace Listing Request
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="glass-btn glass-btn-secondary p-1.5 rounded-full"
          >
            <X className="w-4 h-4 text-zinc-300" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 overscroll-contain">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Submission Sent for Review</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                Your eFootball squad has been received by our store administrators. We will review your account details, verify credentials status, and list it in the active marketplace catalog.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="glass-btn glass-btn-primary px-6 py-2.5 text-xs font-bold"
              >
                Close &amp; Check Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1">
                    Squad Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., 3190 Div 1 Beast Squad w/ Big Time Messi &amp; Vieira"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">
                      Asking Price (ETB) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={priceETB}
                      onChange={(e) => setPriceETB(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono-num font-bold focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">Team Strength</label>
                    <input
                      type="number"
                      value={collectiveStrength}
                      onChange={(e) => setCollectiveStrength(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">Coins</label>
                    <input
                      type="number"
                      value={coins}
                      onChange={(e) => setCoins(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">GP</label>
                    <input
                      type="number"
                      value={gp}
                      onChange={(e) => setGp(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">Epic Boosters</label>
                    <input
                      type="number"
                      value={epicBoosterCount}
                      onChange={(e) => setEpicBoosterCount(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono-num font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={sellerContact}
                      onChange={(e) => setSellerContact(e.target.value)}
                      placeholder="0911..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1">Key Players / Legend Boosters</label>
                  <input
                    type="text"
                    value={keyPlayers}
                    onChange={(e) => setKeyPlayers(e.target.value)}
                    placeholder="Big Time Messi, Booster Rummenigge, Epic Vieira, Cech"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1">
                    Upload Squad Screenshot / Roster Proof <span className="text-rose-400">*</span>
                  </label>
                  <label className="p-3.5 border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-colors active:bg-cyan-400/5">
                    <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-300">Click to Upload Roster Proof Image</span>
                    <span className="text-[10px] text-zinc-500">eFootball Game Squad Screenshot</span>
                    <input type="file" accept="image/*" onChange={handleProofChange} className="hidden" />
                  </label>

                  {proofPreview && (
                    <div className="mt-2.5 relative rounded-2xl overflow-hidden border border-white/15 max-h-44 bg-black">
                      <img src={proofPreview} alt="Proof preview" className="w-full h-full object-contain max-h-44" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1">Additional Notes for Admin</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about Konami ID status or login access details..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Buttons with 100% Glass Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-btn glass-btn-secondary px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="glass-btn glass-btn-emerald px-5 py-2.5 text-xs font-bold shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit to Admins for Approval</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
