import React, { useState } from 'react';
import { Platform, PendingAccountSubmission, TelegramUser } from '../types/account';
import {
  X,
  Upload,
  CheckCircle2,
  Send,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Smartphone,
  Tablet,
  Monitor,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-zinc-900 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Submit Account to Admins for Sale
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Admin Escrow & Marketplace Listing Request
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-white">Submission Received by Store Admins</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your eFootball account details and squad proof have been submitted to store admins. After approval, it will be published to the live marketplace catalog.
                </p>
              </div>

              <div className="p-4 bg-zinc-900 rounded-2xl border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Squad Title:</span>
                  <span className="text-white font-semibold truncate max-w-[200px]">{title}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Asking Price:</span>
                  <span className="text-amber-400 font-bold font-mono-num">{priceETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Status:</span>
                  <span className="text-amber-400 font-medium">Pending Admin Review</span>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  Done & Back to App
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Telegram Seller Info */}
              <div className="p-4 bg-zinc-900/90 border border-white/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block font-semibold">Seller Telegram Account</span>
                    <span className="text-xs text-white font-bold font-mono">
                      @{currentUser.username || currentUser.firstName}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Auto-Verified
                </span>
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1">Squad Title / Headline</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Div 1 Rank 120 Championship Squad · 2015 Big Time Messi, Booster Rummenigge & Cech"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">Account Sync</label>
                    <div className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Universal Cross-Save</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">Collective Strength</label>
                    <input
                      type="number"
                      required
                      value={collectiveStrength}
                      onChange={(e) => setCollectiveStrength(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">Asking Price (ETB Only)</label>
                    <input
                      type="number"
                      required
                      value={priceETB}
                      onChange={(e) => setPriceETB(Number(e.target.value))}
                      placeholder="e.g. 15000"
                      className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold font-mono-num"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-zinc-300 font-semibold block mb-1">Coins</label>
                    <input
                      type="number"
                      value={coins}
                      onChange={(e) => setCoins(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
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
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
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
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1">
                    Upload Squad Screenshot / Roster Proof
                  </label>
                  <label className="p-4 border-2 border-dashed border-white/10 hover:border-amber-400/50 rounded-2xl bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-xs font-semibold text-zinc-300">Click to Upload Roster Proof Image</span>
                    <span className="text-[10px] text-zinc-500">eFootball Game Squad Screenshot</span>
                    <input type="file" accept="image/*" onChange={handleProofChange} className="hidden" />
                  </label>

                  {proofPreview && (
                    <div className="mt-3 relative rounded-2xl overflow-hidden border border-white/10 max-h-48 bg-black">
                      <img src={proofPreview} alt="Proof preview" className="w-full h-full object-contain" />
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
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2 cursor-pointer"
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
