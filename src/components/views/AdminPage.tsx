import React, { useState } from 'react';
import {
  EfootballAccount,
  PurchasedOrder,
  PendingAccountSubmission,
  TelegramUser,
  AdminPaymentConfig,
  Platform,
} from '../../types/account';
import { BRAND } from '../../constants/branding';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Unlock,
  Eye,
  Send,
  Trash2,
  Plus,
  Settings,
  Upload,
  Phone,
  Landmark,
  Save,
  Check,
  Image as ImageIcon,
  CheckCircle,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sliders,
  Copy,
  Download,
  Smartphone,
  Tablet,
  Monitor,
  Pencil,
  Tag,
  X,
  AlertCircle,
  Coins,
  Award,
} from 'lucide-react';

interface AdminPageProps {
  currentUser: TelegramUser;
  pendingSubmissions: PendingAccountSubmission[];
  orders: PurchasedOrder[];
  accounts: EfootballAccount[];
  paymentConfig: AdminPaymentConfig;
  onApproveSubmission: (submission: PendingAccountSubmission, overridePriceETB?: number) => void;
  onRejectSubmission: (submissionId: string, reason?: string) => void;
  onUpdateSubmissionPrice?: (submissionId: string, newPriceETB: number) => void;
  onApproveOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string, reason?: string) => void;
  onReleaseAccountLock: (accountId: string) => void;
  onDeleteAccount: (accountId: string) => void;
  onUpdateAccount?: (accountId: string, updates: Partial<EfootballAccount>) => void;
  onSavePaymentConfig: (config: AdminPaymentConfig) => void;
  onPostNewAccount: (newAccount: EfootballAccount) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  pendingSubmissions,
  orders,
  accounts,
  paymentConfig,
  onApproveSubmission,
  onRejectSubmission,
  onUpdateSubmissionPrice,
  onApproveOrder,
  onRejectOrder,
  onReleaseAccountLock,
  onDeleteAccount,
  onUpdateAccount,
  onSavePaymentConfig,
  onPostNewAccount,
}) => {
  const [activeTab, setActiveTab] = useState<
    'submissions' | 'orders' | 'post_account' | 'payment_config' | 'locks' | 'inventory'
  >('submissions');

  const [selectedScreenshotUrl, setSelectedScreenshotUrl] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Payment Config Form State
  const [telebirrNumber, setTelebirrNumber] = useState(paymentConfig.telebirrNumber);
  const [telebirrAccountName, setTelebirrAccountName] = useState(paymentConfig.telebirrAccountName);
  const [cbeAccountNumber, setCbeAccountNumber] = useState(paymentConfig.cbeAccountNumber);
  const [cbeAccountName, setCbeAccountName] = useState(paymentConfig.cbeAccountName);
  const [instructions, setInstructions] = useState(paymentConfig.instructions);
  const [configSaved, setConfigSaved] = useState(false);

  // Admin Direct Post Account Form State
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('Mobile');
  const [collectiveStrength, setCollectiveStrength] = useState<number>(3150);
  const [divisionPeak, setDivisionPeak] = useState('Division 1');
  const [priceETB, setPriceETB] = useState<number>(15000);
  const [coins, setCoins] = useState<number>(1500);
  const [gp, setGp] = useState<number>(5000000);
  const [epicBoosterCount, setEpicBoosterCount] = useState<number>(10);
  const [showtimeCount, setShowtimeCount] = useState<number>(5);
  const [formation, setFormation] = useState('4-2-1-3');
  const [konamiIdStatus, setKonamiIdStatus] = useState<
    'Unlinked / Clean' | 'Email Changeable' | 'Full Access Handover'
  >('Email Changeable');
  const [description, setDescription] = useState('');
  const [keyPlayers, setKeyPlayers] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState(false);

  // --- Price Editing for User Submissions ---
  const [editingSubmissionPriceId, setEditingSubmissionPriceId] = useState<string | null>(null);
  const [submissionPrices, setSubmissionPrices] = useState<Record<string, number>>({});
  const [priceSuccessId, setPriceSuccessId] = useState<string | null>(null);

  // --- Account Details Editing for Posted Accounts ---
  const [editingAccount, setEditingAccount] = useState<EfootballAccount | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriceETB, setEditPriceETB] = useState<number>(0);
  const [editOriginalPriceETB, setEditOriginalPriceETB] = useState<number>(0);
  const [editCollectiveStrength, setEditCollectiveStrength] = useState<number>(3150);
  const [editDivisionPeak, setEditDivisionPeak] = useState('Division 1');
  const [editCoins, setEditCoins] = useState<number>(0);
  const [editGp, setEditGp] = useState<number>(0);
  const [editEpicBoosterCount, setEditEpicBoosterCount] = useState<number>(0);
  const [editShowtimeCount, setEditShowtimeCount] = useState<number>(0);
  const [editFormation, setEditFormation] = useState('4-2-1-3');
  const [editKonamiIdStatus, setEditKonamiIdStatus] = useState<
    'Unlinked / Clean' | 'Email Changeable' | 'Full Access Handover'
  >('Unlinked / Clean');
  const [editDescription, setEditDescription] = useState('');
  const [editKeyStars, setEditKeyStars] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

  // Start editing a user submission's price
  const handleStartEditSubmissionPrice = (sub: PendingAccountSubmission) => {
    setEditingSubmissionPriceId(sub.id);
    setSubmissionPrices((prev) => ({
      ...prev,
      [sub.id]: prev[sub.id] !== undefined ? prev[sub.id] : sub.priceETB,
    }));
  };

  // Save the modified price for a user submission
  const handleSaveSubmissionPrice = (submissionId: string) => {
    const newPrice = submissionPrices[submissionId];
    if (newPrice !== undefined && newPrice > 0 && onUpdateSubmissionPrice) {
      onUpdateSubmissionPrice(submissionId, newPrice);
      setPriceSuccessId(submissionId);
      setTimeout(() => setPriceSuccessId(null), 2500);
      setEditingSubmissionPriceId(null);
    }
  };

  // Quick preset discount or markup on user submitted price
  const handleApplyPresetDiscount = (submissionId: string, originalPrice: number, percentage: number) => {
    const discounted = Math.round((originalPrice * (1 + percentage / 100)) / 100) * 100;
    setSubmissionPrices((prev) => ({
      ...prev,
      [submissionId]: discounted,
    }));
  };

  // Start editing an existing posted account
  const handleStartEditAccount = (acc: EfootballAccount) => {
    setEditingAccount(acc);
    setEditTitle(acc.title);
    setEditPriceETB(acc.priceETB || 0);
    setEditOriginalPriceETB(acc.originalPriceETB || 0);
    setEditCollectiveStrength(acc.collectiveStrength);
    setEditDivisionPeak(acc.divisionPeak);
    setEditCoins(acc.coins || 0);
    setEditGp(acc.gp || 0);
    setEditEpicBoosterCount(acc.epicBoosterCount || 0);
    setEditShowtimeCount(acc.showtimeCount || 0);
    setEditFormation(acc.formation || '4-2-1-3');
    setEditKonamiIdStatus(acc.konamiIdStatus || 'Unlinked / Clean');
    setEditDescription(acc.description || '');
    setEditCoverImage(acc.coverImage || '');
    setEditFeatured(Boolean(acc.featured));
    setEditKeyStars(
      acc.topStars && acc.topStars.length > 0
        ? acc.topStars.map((s) => `${s.name} (${s.rating})`).join(', ')
        : ''
    );
    setEditSuccessMsg(null);
  };

  // Save edits to a posted account
  const handleSaveAccountEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount || !onUpdateAccount) return;

    let updatedStars = editingAccount.topStars;
    if (editKeyStars.trim()) {
      const parts = editKeyStars.split(',').map((p) => p.trim()).filter(Boolean);
      if (parts.length > 0) {
        updatedStars = parts.map((part, idx) => {
          const match = part.match(/(.+?)(?:\s*\((\d+)\))?$/);
          const name = match && match[1] ? match[1].trim() : part;
          const rating = match && match[2] ? parseInt(match[2], 10) : 104;
          return {
            id: `star-${idx}-${Date.now()}`,
            name,
            rating,
            position: 'CF' as const,
            cardType: 'Epic Booster' as const,
          };
        });
      }
    }

    const updates: Partial<EfootballAccount> = {
      title: editTitle.trim(),
      priceETB: Number(editPriceETB),
      originalPriceETB: editOriginalPriceETB ? Number(editOriginalPriceETB) : undefined,
      collectiveStrength: Number(editCollectiveStrength),
      divisionPeak: editDivisionPeak.trim(),
      coins: Number(editCoins),
      gp: Number(editGp),
      epicBoosterCount: Number(editEpicBoosterCount),
      showtimeCount: Number(editShowtimeCount),
      formation: editFormation.trim(),
      konamiIdStatus: editKonamiIdStatus,
      description: editDescription.trim(),
      coverImage: editCoverImage.trim() || editingAccount.coverImage,
      featured: editFeatured,
      topStars: updatedStars,
    };

    onUpdateAccount(editingAccount.id, updates);
    setEditSuccessMsg('Account details updated successfully!');
    setTimeout(() => {
      setEditSuccessMsg(null);
      setEditingAccount(null);
    }, 1200);
  };

  // Filter pending items
  const pendingOrders = orders.filter((o) => o.status === 'pending_verification');
  const lockedAccounts = accounts.filter(
    (a) => a.lockedUntil && a.lockedUntil > Date.now()
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(id);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminPaymentConfig = {
      telebirrNumber,
      telebirrAccountName,
      cbeAccountNumber,
      cbeAccountName,
      instructions,
      updatedAt: new Date().toISOString(),
    };
    onSavePaymentConfig(updated);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !priceETB) return;

    const finalImage = imagePreview || imageUrl || '/src/assets/images/efootball_mobile_squad_cover_1792504263258.jpg';

    const newAccount: EfootballAccount = {
      id: `efb-admin-${Date.now()}`,
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      platform,
      collectiveStrength,
      divisionPeak,
      priceETB,
      coins,
      gp,
      efootballPoints: 10000,
      epicBoosterCount,
      showtimeCount,
      firstOwner: true,
      konamiIdStatus,
      formation,
      coverImage: finalImage,
      images: [finalImage],
      manager: {
        name: 'L. A. Román (Pep Guardiola)',
        style: 'Possession Game',
        proficiency: 88,
      },
      skillPrograms: 15,
      positionPrograms: 10,
      seller: {
        name: currentUser.firstName,
        username: currentUser.username || 'EscrowAdmin',
        rating: 5.0,
        completedSales: 50,
        badge: 'Official Escrow Store Admin',
        responseTime: 'Instant',
      },
      description: description.trim() || 'Verified high-strength eFootball account ready for instant handover.',
      featured: true,
      topStars: [
        { id: `ts-${Date.now()}`, name: keyPlayers || 'Epic Boosters & Legends', rating: 104, position: 'CF', cardType: 'Epic Booster' },
      ],
      startingXI: [],
      bench: [],
    };

    onPostNewAccount(newAccount);
    setPostSuccess(true);
    setTitle('');
    setDescription('');
    setKeyPlayers('');
    setImagePreview(null);
    setImageUrl('');
    setTimeout(() => setPostSuccess(false), 3000);
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in duration-200">
      {/* Sleek Modern Header Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/[0.08] rounded-3xl shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Escrow Admin Operations
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {BRAND.name} Admin Console
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Verify buyer payment screenshots, inspect seller account submissions, configure Telebirr and CBE payout channels, and publish verified squad listings.
            </p>
          </div>

          {/* Active Admin Pill */}
          <div className="flex items-center gap-3.5 p-3.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-amber-400/20">
              {currentUser.firstName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{currentUser.firstName}</span>
                {currentUser.username && (
                  <span className="text-sky-400 text-[11px] font-mono">
                    @{currentUser.username}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Authorized Escrow Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => setActiveTab('submissions')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
            activeTab === 'submissions'
              ? 'bg-amber-500/10 border-amber-400/50 shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Submissions</span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono-num">
            {pendingSubmissions.length}
          </div>
          <div className="text-[11px] text-zinc-500">Awaiting squad verification</div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => setActiveTab('orders')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
            activeTab === 'orders'
              ? 'bg-amber-500/10 border-amber-400/50 shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono-num">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-zinc-500">Telebirr / CBE screenshots</div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => setActiveTab('locks')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
            activeTab === 'locks'
              ? 'bg-amber-500/10 border-amber-400/50 shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active 15m Locks</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Unlock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-sky-400 font-mono-num">
            {lockedAccounts.length}
          </div>
          <div className="text-[11px] text-zinc-500">Checkout reservations</div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => setActiveTab('inventory')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 group ${
            activeTab === 'inventory'
              ? 'bg-amber-500/10 border-amber-400/50 shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-white/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Inventory</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono-num">
            {accounts.length}
          </div>
          <div className="text-[11px] text-zinc-500">Marketplace listings</div>
        </div>
      </div>

      {/* Modern Floating Segmented Navigation Bar */}
      <div className="p-1.5 bg-black/50 border border-white/[0.08] rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`glass-btn px-4 py-2 text-xs transition-all shrink-0 ${
            activeTab === 'submissions'
              ? 'glass-btn-primary font-bold'
              : 'glass-btn-secondary text-zinc-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>User Submissions</span>
          {pendingSubmissions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono-num font-extrabold bg-cyan-400 text-slate-950">
              {pendingSubmissions.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`glass-btn px-4 py-2 text-xs transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'glass-btn-primary font-bold'
              : 'glass-btn-secondary text-zinc-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Payment Screenshot Verification</span>
          {pendingOrders.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono-num font-extrabold bg-cyan-400 text-slate-950">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('post_account')}
          className={`glass-btn px-4 py-2 text-xs transition-all shrink-0 ${
            activeTab === 'post_account'
              ? 'glass-btn-primary font-bold'
              : 'glass-btn-secondary text-zinc-400 hover:text-white'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Account (Direct)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payment_config')}
          className={`glass-btn px-4 py-2 text-xs transition-all shrink-0 ${
            activeTab === 'payment_config'
              ? 'glass-btn-primary font-bold'
              : 'glass-btn-secondary text-zinc-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Payment Channels Config</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('locks')}
          className={`glass-btn px-4 py-2 text-xs transition-all shrink-0 ${
            activeTab === 'locks'
              ? 'glass-btn-primary font-bold'
              : 'glass-btn-secondary text-zinc-400 hover:text-white'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>15m Reservation Locks</span>
          {lockedAccounts.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono-num font-extrabold bg-cyan-400 text-slate-950">
              {lockedAccounts.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`glass-btn px-4 py-2 text-xs transition-all shrink-0 ${
            activeTab === 'inventory'
              ? 'glass-btn-primary font-bold'
              : 'glass-btn-secondary text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Catalog Inventory</span>
        </button>
      </div>

      {/* TAB 1: User Account Sale Submissions */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pending User Sale Requests</span>
                <span className="text-xs font-normal text-zinc-400 font-mono-num">
                  ({pendingSubmissions.length})
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Review user-submitted eFootball accounts and publish approved listings to the live marketplace catalog.
              </p>
            </div>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="p-12 bg-zinc-900/60 rounded-3xl border border-white/[0.08] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">All Submissions Processed</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No user sale submissions are currently waiting for admin review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 bg-zinc-900/90 border border-white/[0.08] hover:border-amber-400/30 rounded-2xl space-y-4 shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md uppercase">
                          {sub.platform}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400">
                          {sub.divisionPeak}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white line-clamp-2">{sub.title}</h3>
                      <div className="text-xs text-zinc-400 flex items-center gap-2 font-mono-num">
                        <span>Strength: <strong className="text-amber-400">{sub.collectiveStrength} PTS</strong></span>
                        <span>·</span>
                        <span>{sub.formation}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                        {submissionPrices[sub.id] !== undefined && submissionPrices[sub.id] !== sub.priceETB
                          ? 'Adjusted Price'
                          : 'Seller Asking Price'}
                      </div>
                      <div className="text-base sm:text-lg font-black text-amber-400 font-mono-num flex items-baseline justify-end gap-1">
                        <span>{(submissionPrices[sub.id] ?? sub.priceETB).toLocaleString()}</span>
                        <span className="text-xs font-bold text-amber-300 font-sans">ETB</span>
                      </div>
                      {submissionPrices[sub.id] !== undefined && submissionPrices[sub.id] !== sub.priceETB && (
                        <div className="text-[10px] text-zinc-500 line-through font-mono-num">
                          Was: {sub.priceETB.toLocaleString()} ETB
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleStartEditSubmissionPrice(sub)}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>{editingSubmissionPriceId === sub.id ? 'Close Editor' : 'Change Price'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Price Adjustment Drawer for Admins */}
                  {editingSubmissionPriceId === sub.id && (
                    <div className="p-3.5 bg-black/80 rounded-xl border border-amber-400/30 space-y-2.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-400" />
                          <span>Admin Price Adjustment</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">Changes live database</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="100"
                            step="100"
                            value={submissionPrices[sub.id] ?? sub.priceETB}
                            onChange={(e) =>
                              setSubmissionPrices((prev) => ({
                                ...prev,
                                [sub.id]: Number(e.target.value),
                              }))
                            }
                            placeholder="Enter new price in ETB"
                            className="w-full bg-zinc-950 border border-amber-400/40 focus:border-amber-400 rounded-lg pl-3 pr-12 py-1.5 text-xs text-white font-mono-num font-bold"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 pointer-events-none">
                            ETB
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSaveSubmissionPrice(sub.id)}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Save Price</span>
                        </button>
                      </div>

                      {/* Quick Percentage Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                        <span className="text-zinc-500 font-medium">Quick Presets:</span>
                        {[
                          { label: '-10%', pct: -10 },
                          { label: '-15%', pct: -15 },
                          { label: '-20%', pct: -20 },
                          { label: '+10%', pct: 10 },
                          { label: 'Reset Original', pct: 0 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleApplyPresetDiscount(sub.id, sub.priceETB, preset.pct)}
                            className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {priceSuccessId === sub.id && (
                        <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Price successfully updated in Firestore database!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Proof Image Preview */}
                  {sub.proofImage && (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-48 bg-black group/img">
                      <img
                        src={sub.proofImage}
                        alt="Squad Proof"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform cursor-pointer"
                        onClick={() => setSelectedScreenshotUrl(sub.proofImage!)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold text-white bg-black/80 px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Inspect Full Proof</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Highlights & Seller Info */}
                  <div className="p-3.5 bg-black/60 rounded-xl border border-white/[0.06] text-xs space-y-2">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase font-bold block mb-0.5">Key Legends & Players</span>
                      <span className="text-zinc-200">{sub.keyPlayers || 'Not specified'}</span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-1 border-t border-white/[0.06]">
                      <span>Seller Contact:</span>
                      <span className="text-amber-400 font-mono font-bold">
                        @{sub.sellerTelegram.username || sub.sellerTelegram.firstName || 'user'}
                      </span>
                    </div>

                    {sub.sellerContact && (
                      <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                        <span>Contact / Phone:</span>
                        <span className="text-zinc-200 font-mono-num font-semibold">{sub.sellerContact}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => onRejectSubmission(sub.id)}
                      className="px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onApproveSubmission(sub, submissionPrices[sub.id] ?? sub.priceETB)
                        }
                        className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md shadow-amber-400/20 cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          Approve &amp; Post Live ({(submissionPrices[sub.id] ?? sub.priceETB).toLocaleString()} ETB)
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Payment Approvals & Screenshots */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pending Payment Screenshot Approvals</span>
                <span className="text-xs font-normal text-zinc-400 font-mono-num">
                  ({pendingOrders.length})
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Verify buyer Telebirr and CBE transaction references and release Konami ID credentials into order vault.
              </p>
            </div>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="p-12 bg-zinc-900/60 rounded-3xl border border-white/[0.08] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">All Payments Verified</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No buyer payment transfer screenshots are currently awaiting approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-5 bg-zinc-900/90 border border-amber-400/30 rounded-2xl space-y-4 shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md uppercase">
                        {order.paymentMethod} Escrow
                      </span>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{order.accountTitle}</h3>
                      <div className="text-[11px] text-zinc-400">
                        Order ID: <span className="font-mono text-zinc-200">{order.orderId}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-amber-400 font-mono-num">
                        {order.priceETB.toLocaleString()} ETB
                      </div>
                    </div>
                  </div>

                  {/* Payment Details & Screenshot Preview */}
                  <div className="p-3.5 bg-black/60 rounded-xl border border-white/[0.06] text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Buyer:</span>
                      <span className="text-amber-400 font-mono font-bold">
                        @{order.buyerTelegram.username || order.buyerTelegram.firstName}
                      </span>
                    </div>

                    {order.buyerEmail && (
                      <div className="flex items-center justify-between p-2.5 bg-amber-400/10 border border-amber-400/25 rounded-xl">
                        <div>
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                            New Account Owner Email (Konami Handover):
                          </span>
                          <span className="text-white font-mono font-bold text-xs">{order.buyerEmail}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.buyerEmail!, `email-${order.orderId}`)}
                          className="px-2 py-1 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Payer Name/Phone:</span>
                      <span className="text-white font-semibold">{order.senderNameOrPhone}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Transaction Ref:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-mono font-bold">{order.transactionRef || 'N/A (in screenshot)'}</span>
                        {order.transactionRef && (
                          <button
                            type="button"
                            onClick={() => handleCopy(order.transactionRef, order.orderId)}
                            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {order.paymentScreenshotUrl ? (
                      <div className="pt-2 border-t border-white/[0.06]">
                        <span className="text-zinc-400 block text-[11px] mb-1.5">Transfer Confirmation Screenshot:</span>
                        <div
                          onClick={() => setSelectedScreenshotUrl(order.paymentScreenshotUrl!)}
                          className="relative rounded-xl overflow-hidden border border-white/10 max-h-52 bg-black cursor-pointer group/shot"
                        >
                          <img
                            src={order.paymentScreenshotUrl}
                            alt="Payment Receipt"
                            className="w-full h-full object-cover group-hover/shot:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/shot:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs font-bold text-white bg-black/80 px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>View Full Receipt</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-rose-400 italic">No screenshot attached</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => onRejectOrder(order.orderId)}
                      className="px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Payment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onApproveOrder(order.orderId)}
                      className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md shadow-amber-400/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Release Credentials</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Direct Post Account Form */}
      {activeTab === 'post_account' && (
        <form onSubmit={handleDirectPostSubmit} className="p-6 sm:p-8 bg-zinc-900/90 border border-white/[0.08] rounded-3xl space-y-6 shadow-2xl max-w-3xl mx-auto">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Direct Admin Account Publishing</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Add a verified eFootball squad with images directly to the live marketplace.
            </p>
          </div>

          {postSuccess && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Account successfully published to the live marketplace catalog!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-300 font-semibold block mb-1">Squad Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Div 1 Rank 100 Championship Squad · 2015 Big Time Messi 106 & Booster Vieira"
                className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white"
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
                  placeholder="e.g. 18500"
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
                <label className="text-xs text-zinc-300 font-semibold block mb-1">Formation</label>
                <input
                  type="text"
                  value={formation}
                  onChange={(e) => setFormation(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
              <label className="text-xs text-zinc-300 font-semibold block mb-1">Squad Screenshot / Image Upload</label>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <label className="flex-1 w-full p-4 border-2 border-dashed border-white/10 hover:border-amber-400/50 rounded-2xl bg-black/40 text-center cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-zinc-300 block">Click to Upload Image</span>
                  <span className="text-[10px] text-zinc-500">PNG, JPG, WEBP</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                <div className="text-xs text-zinc-500 font-bold">OR</div>

                <div className="flex-1 w-full">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste Image URL (https://...)"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {(imagePreview || imageUrl) && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 max-h-56 bg-black">
                  <img src={imagePreview || imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-semibold block mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter squad details, login handover instructions, and account highlights..."
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-400/20 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Account to Marketplace</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: Admin Payment Channels Configuration */}
      {activeTab === 'payment_config' && (
        <form onSubmit={handleSaveConfig} className="p-6 sm:p-8 bg-zinc-900/90 border border-white/[0.08] rounded-3xl space-y-6 shadow-2xl max-w-3xl mx-auto">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Configure Admin Receiving Payment Channels</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              These details are displayed to buyers during checkout to complete Telebirr and CBE transfer payments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-black/50 border border-white/10 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <img
                  src={BRAND.telebirrSvgUrl}
                  alt="Telebirr"
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-lg object-contain bg-white/5 p-0.5"
                />
                <span>Telebirr Receiving Account</span>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-medium block mb-1">Telebirr Mobile Number</label>
                <input
                  type="text"
                  required
                  value={telebirrNumber}
                  onChange={(e) => setTelebirrNumber(e.target.value)}
                  placeholder="0911234567"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-medium block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={telebirrAccountName}
                  onChange={(e) => setTelebirrAccountName(e.target.value)}
                  placeholder="eFootball Escrow Holder"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>
            </div>

            <div className="p-4 bg-black/50 border border-white/10 rounded-2xl space-y-3">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <img
                  src={BRAND.cbeSvgUrl}
                  alt="CBE"
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-lg object-contain bg-white/5 p-0.5"
                />
                <span>CBE Bank Account</span>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-medium block mb-1">CBE Account Number</label>
                <input
                  type="text"
                  required
                  value={cbeAccountNumber}
                  onChange={(e) => setCbeAccountNumber(e.target.value)}
                  placeholder="1000 4829 1849 2"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-medium block mb-1">Beneficiary Name</label>
                <input
                  type="text"
                  required
                  value={cbeAccountName}
                  onChange={(e) => setCbeAccountName(e.target.value)}
                  placeholder="eFootball Escrow Holder"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-300 font-semibold block mb-1">Payment Instructions for Buyers</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
            >
              {configSaved ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Saved Payment Settings!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Save Receiving Accounts</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: Active 15-Minute Reservation Locks */}
      {activeTab === 'locks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Active 15-Minute Reservation Locks</span>
                <span className="text-xs font-normal text-zinc-400 font-mono-num">
                  ({lockedAccounts.length})
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Accounts temporarily reserved in checkout by buyers to prevent double purchases.
              </p>
            </div>
          </div>

          {lockedAccounts.length === 0 ? (
            <div className="p-12 bg-zinc-900/60 rounded-3xl border border-white/[0.08] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">No Active Reservation Locks</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No accounts are currently reserved in checkout by buyers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedAccounts.map((acc) => {
                const remainingSecs = Math.max(
                  0,
                  Math.floor(((acc.lockedUntil || 0) - Date.now()) / 1000)
                );
                const mins = Math.floor(remainingSecs / 60);
                const secs = remainingSecs % 60;

                return (
                  <div
                    key={acc.id}
                    className="p-5 bg-zinc-900/90 border border-amber-400/30 rounded-2xl space-y-3 shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                          {acc.platform} · {acc.collectiveStrength} PTS
                        </span>
                        <h3 className="text-sm font-bold text-white line-clamp-1">{acc.title}</h3>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black text-amber-400 font-mono-num">
                          {(acc.priceETB || 0).toLocaleString()} ETB
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-black/60 rounded-xl border border-white/[0.06] text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Reserved By:</span>
                        <span className="text-sky-400 font-semibold font-mono">
                          @{acc.lockedBy?.username || 'buyer'} ({acc.lockedBy?.firstName})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-500">Lock Remaining:</span>
                        <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-pulse" />
                          {mins}:{secs.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onReleaseAccountLock(acc.id)}
                        className="px-4 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Force Release Lock</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Active Marketplace Inventory Manager */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Live Marketplace Inventory</span>
                <span className="text-xs font-normal text-zinc-400 font-mono-num">
                  ({accounts.length})
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Manage accounts currently displayed in the shop catalog.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 bg-zinc-900/90 border border-white/[0.08] hover:border-amber-400/30 rounded-2xl flex flex-col justify-between space-y-3 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md uppercase">
                      {acc.platform}
                    </span>
                    <span className="text-amber-400 font-bold font-mono-num">{acc.collectiveStrength} PTS</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{acc.title}</h4>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] text-xs gap-2">
                  <div>
                    <div className="font-mono-num font-bold text-amber-400">
                      {(acc.priceETB || 0).toLocaleString()} ETB
                    </div>
                    {acc.originalPriceETB && acc.originalPriceETB > (acc.priceETB || 0) && (
                      <span className="text-[10px] text-zinc-500 line-through font-mono-num">
                        {acc.originalPriceETB.toLocaleString()} ETB
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEditAccount(acc)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white bg-white/[0.06] hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Edit Account Details"
                    >
                      <Pencil className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteAccount(acc.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Remove from marketplace"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modern Screenshot Modal Inspector */}
      {selectedScreenshotUrl && (
        <div
          onClick={() => setSelectedScreenshotUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-zinc-950 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col cursor-default"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Payment Confirmation / Squad Proof Screenshot</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedScreenshotUrl(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.06] bg-black p-2 flex items-center justify-center">
              <img
                src={selectedScreenshotUrl}
                alt="Full receipt preview"
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedScreenshotUrl(null)}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Close Preview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Account Edit Details Modal for Admins */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-zinc-900/90 border-b border-white/[0.08] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Pencil className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    Admin Inventory Editor
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                    Edit: {editingAccount.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveAccountEdit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {editSuccessMsg && (
                <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{editSuccessMsg}</span>
                </div>
              )}

              {/* Title & Pricing */}
              <div className="space-y-3 p-4 bg-zinc-900/60 rounded-2xl border border-white/[0.06]">
                <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Title &amp; ETB Pricing</span>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Squad Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Selling Price (ETB)</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="100"
                        step="50"
                        value={editPriceETB}
                        onChange={(e) => setEditPriceETB(Number(e.target.value))}
                        className="w-full bg-black/60 border border-amber-400/40 focus:border-amber-400 rounded-xl pl-3 pr-12 py-2 text-xs text-amber-300 font-bold font-mono-num"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 pointer-events-none">
                        ETB
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Original / Strike-through Price (ETB)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={editOriginalPriceETB}
                        onChange={(e) => setEditOriginalPriceETB(Number(e.target.value))}
                        placeholder="e.g. 25000"
                        className="w-full bg-black/60 border border-white/10 rounded-xl pl-3 pr-12 py-2 text-xs text-zinc-300 font-mono-num"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 pointer-events-none">
                        ETB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFeatured}
                      onChange={(e) => setEditFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-0 bg-black cursor-pointer"
                    />
                    <span className="text-xs text-zinc-300 font-medium">
                      Feature this account in Homepage Highlight Roster
                    </span>
                  </label>
                </div>
              </div>

              {/* Stats & Formations */}
              <div className="space-y-3 p-4 bg-zinc-900/60 rounded-2xl border border-white/[0.06]">
                <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Team Strength &amp; Tactics</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Collective Strength (PTS)</label>
                    <input
                      type="number"
                      required
                      value={editCollectiveStrength}
                      onChange={(e) => setEditCollectiveStrength(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Division Peak</label>
                    <input
                      type="text"
                      required
                      value={editDivisionPeak}
                      onChange={(e) => setEditDivisionPeak(e.target.value)}
                      placeholder="e.g. Division 1 (Top 500)"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Formation</label>
                    <input
                      type="text"
                      required
                      value={editFormation}
                      onChange={(e) => setEditFormation(e.target.value)}
                      placeholder="e.g. 4-2-1-3"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Konami ID Status</label>
                    <select
                      value={editKonamiIdStatus}
                      onChange={(e) =>
                        setEditKonamiIdStatus(
                          e.target.value as 'Unlinked / Clean' | 'Email Changeable' | 'Full Access Handover'
                        )
                      }
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                    >
                      <option value="Unlinked / Clean">Unlinked / Clean</option>
                      <option value="Email Changeable">Email Changeable</option>
                      <option value="Full Access Handover">Full Access Handover</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Account Sync</label>
                    <div className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Universal Cross-Save</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Currencies & Boosters */}
              <div className="space-y-3 p-4 bg-zinc-900/60 rounded-2xl border border-white/[0.06]">
                <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Currencies &amp; Boosters</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Coins</label>
                    <input
                      type="number"
                      min="0"
                      value={editCoins}
                      onChange={(e) => setEditCoins(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">GP Balance</label>
                    <input
                      type="number"
                      min="0"
                      value={editGp}
                      onChange={(e) => setEditGp(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Epic Boosters</label>
                    <input
                      type="number"
                      min="0"
                      value={editEpicBoosterCount}
                      onChange={(e) => setEditEpicBoosterCount(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Showtime Cards</label>
                    <input
                      type="number"
                      min="0"
                      value={editShowtimeCount}
                      onChange={(e) => setEditShowtimeCount(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-num"
                    />
                  </div>
                </div>
              </div>

              {/* Media, Legends & Description */}
              <div className="space-y-3 p-4 bg-zinc-900/60 rounded-2xl border border-white/[0.06]">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">
                    Key Player Names (comma-separated with ratings)
                  </label>
                  <input
                    type="text"
                    value={editKeyStars}
                    onChange={(e) => setEditKeyStars(e.target.value)}
                    placeholder="e.g. L. Messi (106), P. Vieira (104), K. Rummenigge (104)"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={editCoverImage}
                    onChange={(e) => setEditCoverImage(e.target.value)}
                    placeholder="https://... or /src/assets/..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  {editCoverImage && (
                    <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-white/10 bg-black">
                      <img
                        src={editCoverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Description / Notes</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Account details, build history, unspent items..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Account Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
