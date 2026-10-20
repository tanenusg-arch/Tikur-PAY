import React, { useState } from 'react';
import { EfootballAccount } from '../types/account';
import { SquadPitchPreview } from './SquadPitchPreview';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Coins,
  ShoppingCart,
  Lock,
  Star,
  Image as ImageIcon,
  Maximize2,
  ExternalLink,
  ShieldAlert,
  Award,
  Zap,
} from 'lucide-react';

interface AccountDetailModalProps {
  account: EfootballAccount | null;
  onClose: () => void;
  onBuyNow: (account: EfootballAccount) => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  onClose,
  onBuyNow,
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'pitch' | 'inventory' | 'transfer'>('gallery');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!account) return null;

  const priceETB = account.priceETB || (account.price ? account.price * 145 : 15000);

  // Combine coverImage and images array into a clean gallery list
  const galleryImages: string[] = [];
  if (account.coverImage) galleryImages.push(account.coverImage);
  if (account.images && account.images.length > 0) {
    account.images.forEach((img) => {
      if (!galleryImages.includes(img)) galleryImages.push(img);
    });
  }
  // Fallback high-res stadium squad screenshot if none provided
  if (galleryImages.length === 0) {
    galleryImages.push('/src/assets/images/efootball_stadium_showcase_1792504262203.jpg');
  }

  const activeImage = selectedImage || galleryImages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] bg-zinc-900/80 backdrop-blur-md flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-400">
              <span className="text-amber-400 font-bold font-mono-num flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>{account.collectiveStrength} PTS</span>
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-300 font-medium">{account.divisionPeak}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {account.konamiIdStatus}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
              {account.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-white/[0.08] bg-black/60 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'gallery', label: 'Screenshots & Proof', icon: <ImageIcon className="w-3.5 h-3.5" /> },
            { id: 'pitch', label: 'Tactical Pitch & Lineup', icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'inventory', label: 'Inventory & Coins', icon: <Coins className="w-3.5 h-3.5" /> },
            { id: 'transfer', label: 'Transfer Guarantee', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-zinc-900/80'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: Full Account Image Inspection Gallery */}
          {activeTab === 'gallery' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" /> Full Squad Proof Screenshot Inspection
                </span>
                <span>Click image to view in full resolution</span>
              </div>

              {/* Main High-Res Squad Image Showcase */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black group shadow-2xl">
                <img
                  src={activeImage}
                  alt={account.title}
                  className="w-full max-h-[50vh] sm:max-h-[55vh] object-contain mx-auto bg-black/90 cursor-pointer"
                  onClick={() => setIsExpanded(true)}
                />

                {/* Overlay Action Badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="px-3 py-1.5 bg-black/80 hover:bg-black text-white text-xs font-bold rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expand Full Resolution</span>
                  </button>

                  <a
                    href={activeImage}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-black/80 hover:bg-black text-white rounded-xl border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Thumbnails row if multiple images exist */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImage === img
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Account Quick Highlights summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Team Strength</span>
                  <span className="text-xl font-black text-amber-400 font-mono-num">{account.collectiveStrength} PTS</span>
                </div>

                <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Coins Balance</span>
                  <span className="text-xl font-black text-amber-400 font-mono-num">{account.coins.toLocaleString()}</span>
                </div>

                <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Epic Boosters</span>
                  <span className="text-xl font-black text-white font-mono-num">{account.epicBoosterCount} Boosters</span>
                </div>

                <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-white/[0.08] space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Konami Access</span>
                  <span className="text-xs font-bold text-emerald-400">{account.konamiIdStatus}</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-zinc-900/80 rounded-2xl border border-white/[0.08] space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Squad Description & History</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{account.description}</p>
              </div>
            </div>
          )}

          {/* TAB 2: Tactical Pitch & Lineup */}
          {activeTab === 'pitch' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <SquadPitchPreview
                startingXI={account.startingXI}
                bench={account.bench}
                formation={account.formation}
                manager={account.manager}
                collectiveStrength={account.collectiveStrength}
              />

              {/* Star Players Spotlight */}
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Key Boosters &amp; Phenomenal Skills
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {account.topStars.map((star) => (
                    <div
                      key={star.id}
                      className="bg-zinc-900/80 border border-white/[0.08] p-3.5 rounded-xl flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{star.name}</span>
                          <span className="text-xs font-semibold text-zinc-400">({star.position})</span>
                        </div>
                        <div className="text-xs text-amber-400 font-medium">
                          {star.cardType} {star.boosterSkill && `· ${star.boosterSkill}`}
                        </div>
                      </div>
                      <span className="text-lg font-black font-mono-num text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-lg">
                        {star.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Currencies & Resources */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-900/80 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" /> eFootball Coins
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono-num mt-1">
                    {account.coins.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Ready for upcoming epic packs</div>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-xs text-zinc-400 font-medium">GP Balance</div>
                  <div className="text-2xl font-black text-zinc-200 font-mono-num mt-1">
                    {(account.gp / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">{account.gp.toLocaleString()} total GP</div>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-xs text-zinc-400 font-medium">Skill Programs</div>
                  <div className="text-2xl font-black text-sky-400 font-mono-num mt-1">
                    {account.skillPrograms}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Extra skill trainers</div>
                </div>

                <div className="bg-zinc-900/80 p-4 rounded-xl border border-white/[0.08]">
                  <div className="text-xs text-zinc-400 font-medium">Position Programs</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono-num mt-1">
                    {account.positionPrograms}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Position proficiency tokens</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Konami ID & Escrow Guarantee */}
          {activeTab === 'transfer' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 bg-zinc-900/90 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Escrow Verification & Handover Assurance</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  All accounts are verified by store admins (@Dev_LecteR & @el_bicho14). Credentials are released directly into your secure Order Vault upon Telebirr / CBE payment screenshot approval.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom CTA Footer Bar */}
        <div className="p-4 sm:p-6 border-t border-white/[0.08] bg-zinc-900/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-zinc-400 uppercase font-bold">Total Price:</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-num">
              {priceETB.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-white">ETB</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onBuyNow(account)}
              className="px-6 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Reserve & Buy Now (15m Lock)</span>
            </button>
          </div>
        </div>
      </div>

      {/* High Resolution Full Screen Zoom Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center cursor-pointer shadow-2xl hover:bg-zinc-700 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt="Full resolution preview"
            className="max-w-full max-h-[92vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
