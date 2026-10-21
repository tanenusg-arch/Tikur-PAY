import React, { useState, useEffect } from 'react';
import {
  EfootballAccount,
  FilterState,
  PurchasedOrder,
  PendingAccountSubmission,
  TelegramUser,
  AdminPaymentConfig,
} from './types/account';
import { INITIAL_ACCOUNTS } from './data/mockAccounts';
import {
  testFirebaseConnection,
  saveAccountToFirestore,
  getAccountsFromFirestore,
  updateAccountLockInFirestore,
  updateAccountInFirestore,
  deleteAccountFromFirestore,
  saveOrderToFirestore,
  getOrdersFromFirestore,
  updateOrderStatusInFirestore,
  savePendingSubmissionToFirestore,
  getPendingSubmissionsFromFirestore,
  updatePendingSubmissionInFirestore,
  DEFAULT_ADMIN_PAYMENT_CONFIG,
  savePaymentConfigToFirestore,
  getPaymentConfigFromFirestore,
} from './lib/firebase';
import { getInitialTelegramUser, checkIsAdmin, saveTelegramUser, setupTelegramBackButton, hideTelegramBackButton } from './lib/telegram';
import { Header, NavTab } from './components/Header';
import { FloatingBottomNav } from './components/FloatingBottomNav';
import { HomePage } from './components/views/HomePage';
import { ShopPage } from './components/views/ShopPage';
import { OrdersPage } from './components/views/OrdersPage';
import { ProfilePage } from './components/views/ProfilePage';
import { AdminPage } from './components/views/AdminPage';
import { AccountDetailModal } from './components/AccountDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SellAccountModal } from './components/SellAccountModal';
import { AccountComparisonModal } from './components/AccountComparisonModal';
import { Footer } from './components/Footer';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // User session state (Telegram WebApp or direct login)
  const [currentUser, setCurrentUser] = useState<TelegramUser>(() => getInitialTelegramUser());

  // Page Navigation State ('home' | 'shop' | 'orders' | 'profile' | 'admin')
  const [currentPage, setCurrentPage] = useState<NavTab>('home');

  // Admin Configured Payment Accounts (Telebirr & CBE)
  const [paymentConfig, setPaymentConfig] = useState<AdminPaymentConfig>(() => {
    try {
      const saved = localStorage.getItem('efb_admin_payment_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_ADMIN_PAYMENT_CONFIG;
  });

  // Accounts state with local storage persistence & Firestore (Demo accounts removed)
  const [accounts, setAccounts] = useState<EfootballAccount[]>(() => {
    try {
      const saved = localStorage.getItem('efb_vault_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((acc: EfootballAccount) => !acc.id.startsWith('efb-acc-0'));
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Orders state with local storage persistence & Firestore
  const [orders, setOrders] = useState<PurchasedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('efb_vault_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Pending user submissions awaiting admin approval
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingAccountSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('efb_pending_submissions');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Filter state for Shop (Strictly in ETB)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    platform: 'Mobile',
    minStrength: 0,
    maxPriceETB: 100000,
    sortBy: 'featured',
    konamiStatus: 'All',
    keyPlayer: 'All',
  });

  // Modals state
  const [detailAccount, setDetailAccount] = useState<EfootballAccount | null>(null);
  const [checkoutAccount, setCheckoutAccount] = useState<EfootballAccount | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [comparedAccountIds, setComparedAccountIds] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [lockNotice, setLockNotice] = useState<string | null>(null);

  // Initialize and sync with Firebase Firestore & Telegram WebApp on boot
  useEffect(() => {
    // Detect official Telegram WebApp user immediately upon launch
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      try {
        tg.ready();
        tg.expand();
        if (tg.disableVerticalSwipes) {
          tg.disableVerticalSwipes();
        }
        if (tg.setHeaderColor) {
          tg.setHeaderColor('#060813');
        }
        if (tg.setBackgroundColor) {
          tg.setBackgroundColor('#060813');
        }
      } catch {
        // Ignore iframe constraint
      }

      // Sync exact Telegram WebApp viewport stable height to avoid disappearing bottom nav
      const updateViewportHeight = () => {
        const height = tg.viewportStableHeight || tg.viewportHeight || window.innerHeight;
        document.documentElement.style.setProperty('--tg-viewport-stable-height', `${height}px`);
        document.documentElement.style.setProperty('--tg-viewport-height', `${height}px`);
      };

      updateViewportHeight();
      if (tg.onEvent) {
        tg.onEvent('viewportChanged', updateViewportHeight);
      }
      window.addEventListener('resize', updateViewportHeight);
      window.addEventListener('orientationchange', updateViewportHeight);
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser && tgUser.id) {
        const username = tgUser.username ? tgUser.username.replace('@', '') : undefined;
        const isAdmin = checkIsAdmin(username);
        const user: TelegramUser = {
          id: tgUser.id,
          firstName: tgUser.first_name || 'Player',
          lastName: tgUser.last_name,
          username,
          photoUrl: tgUser.photo_url,
          isAdmin,
        };
        setCurrentUser(user);
        saveTelegramUser(user);
      }
    }

    testFirebaseConnection();

    async function syncFirestoreData() {
      try {
        // 1. Sync accounts (filter out and purge any legacy demo accounts)
        const remoteAccounts = await getAccountsFromFirestore();
        if (remoteAccounts && Array.isArray(remoteAccounts)) {
          const genuineAccounts = remoteAccounts.filter((acc) => !acc.id.startsWith('efb-acc-0'));
          // Clean up legacy demo accounts from remote firestore if they were seeded earlier
          for (const acc of remoteAccounts) {
            if (acc.id.startsWith('efb-acc-0')) {
              await deleteAccountFromFirestore(acc.id);
            }
          }
          setAccounts(genuineAccounts);
          localStorage.setItem('efb_vault_accounts', JSON.stringify(genuineAccounts));
        }

        // 2. Sync orders
        const remoteOrders = await getOrdersFromFirestore();
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders);
          localStorage.setItem('efb_vault_orders', JSON.stringify(remoteOrders));
        }

        // 3. Sync pending seller submissions
        const remotePending = await getPendingSubmissionsFromFirestore();
        if (remotePending && remotePending.length > 0) {
          setPendingSubmissions(remotePending);
          localStorage.setItem('efb_pending_submissions', JSON.stringify(remotePending));
        }

        // 4. Sync payment configuration
        const remoteConfig = await getPaymentConfigFromFirestore();
        if (remoteConfig) {
          setPaymentConfig(remoteConfig);
          localStorage.setItem('efb_admin_payment_config', JSON.stringify(remoteConfig));
        } else {
          await savePaymentConfigToFirestore(DEFAULT_ADMIN_PAYMENT_CONFIG);
        }
      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
      }
    }

    syncFirestoreData();
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem('efb_vault_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('efb_vault_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('efb_pending_submissions', JSON.stringify(pendingSubmissions));
    } catch (e) {
      console.error(e);
    }
  }, [pendingSubmissions]);

  useEffect(() => {
    try {
      localStorage.setItem('efb_admin_payment_config', JSON.stringify(paymentConfig));
    } catch (e) {
      console.error(e);
    }
  }, [paymentConfig]);

  // Periodic check to release expired 15-minute locks automatically (unless payment is under review or sold!)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      let hasExpired = false;

      const updated = accounts.map((acc) => {
        // Do NOT release locks if status is 'payment_review' or 'sold'
        if (
          acc.lockedUntil &&
          acc.lockedUntil <= now &&
          acc.status !== 'payment_review' &&
          acc.status !== 'sold'
        ) {
          hasExpired = true;
          return {
            ...acc,
            lockedUntil: undefined,
            lockedBy: undefined,
            status: 'active' as const,
          };
        }
        return acc;
      });

      if (hasExpired) {
        setAccounts(updated);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [accounts]);

  // Telegram WebApp Native BackButton: Return to 'home' when browsing other views if no modal is active
  useEffect(() => {
    if (detailAccount || checkoutAccount || isSellModalOpen || isComparisonModalOpen) {
      return;
    }

    if (currentPage !== 'home') {
      const cleanup = setupTelegramBackButton(() => {
        setCurrentPage('home');
      });
      return cleanup;
    } else {
      hideTelegramBackButton();
    }
  }, [currentPage, detailAccount, checkoutAccount, isSellModalOpen, isComparisonModalOpen]);

  // 15-Minute Reservation Lock Handler
  const handleInitiateBuy = async (account: EfootballAccount) => {
    const now = Date.now();

    // Check if account is in payment review or sold
    if (account.status === 'sold') {
      setLockNotice('This account has been sold.');
      setTimeout(() => setLockNotice(null), 3000);
      return;
    }

    if (account.status === 'payment_review') {
      setLockNotice('This account is currently locked pending admin payment verification.');
      setTimeout(() => setLockNotice(null), 3000);
      return;
    }

    // Check if locked by someone else
    if (
      account.lockedUntil &&
      account.lockedUntil > now &&
      account.lockedBy &&
      String(account.lockedBy.id) !== String(currentUser.id)
    ) {
      const remainingMins = Math.ceil((account.lockedUntil - now) / 60000);
      setLockNotice(
        `This account is currently reserved by another buyer (${remainingMins} min remaining).`
      );
      setTimeout(() => setLockNotice(null), 3000);
      return;
    }

    // Apply 15-minute lock
    const lockedUntil = now + 15 * 60 * 1000;
    const lockedBy = {
      id: currentUser.id,
      username: currentUser.username,
      firstName: currentUser.firstName,
    };

    const updatedAccount: EfootballAccount = {
      ...account,
      lockedUntil,
      lockedBy,
      status: 'locked',
    };

    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? updatedAccount : a))
    );

    // Sync to Firestore
    try {
      await updateAccountLockInFirestore(account.id, {
        lockedUntil,
        lockedBy,
        status: 'locked',
      });
    } catch (e) {
      console.warn('Could not sync lock to Firestore:', e);
    }

    setCheckoutAccount(updatedAccount);
  };

  // Release 15-minute lock if checkout canceled
  const handleReleaseLock = async (accountId: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        // Only release if not in payment review or sold!
        if (a.id === accountId && a.status !== 'payment_review' && a.status !== 'sold') {
          return {
            ...a,
            lockedUntil: undefined,
            lockedBy: undefined,
            status: 'active',
          };
        }
        return a;
      })
    );

    try {
      const target = accounts.find((a) => a.id === accountId);
      if (target && target.status !== 'payment_review' && target.status !== 'sold') {
        await updateAccountLockInFirestore(accountId, {
          lockedUntil: 0,
          status: 'active',
        });
      }
    } catch (e) {
      console.warn('Could not release lock in Firestore:', e);
    }
  };

  // Handle payment submission from checkout -> Locks account indefinitely as 'payment_review'
  const handleOrderSuccess = async (newOrder: PurchasedOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Update account status to payment_review (LOCKED while pending admin approval!)
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === newOrder.accountId) {
          return {
            ...a,
            status: 'payment_review',
          };
        }
        return a;
      })
    );

    try {
      await saveOrderToFirestore(newOrder);
      await updateAccountLockInFirestore(newOrder.accountId, {
        status: 'payment_review',
      });
    } catch (err) {
      console.warn('Error saving order to Firestore:', err);
    }
  };

  // Handle user submitting account for admin review
  const handleSubmitForApproval = async (submission: PendingAccountSubmission) => {
    setPendingSubmissions((prev) => [submission, ...prev]);
    try {
      await savePendingSubmissionToFirestore(submission);
    } catch (e) {
      console.warn('Error saving pending submission to Firestore:', e);
    }
  };

  // Admin Actions: Save Payment Accounts Config
  const handleSavePaymentConfig = async (config: AdminPaymentConfig) => {
    setPaymentConfig(config);
    try {
      await savePaymentConfigToFirestore(config);
    } catch (e) {
      console.warn('Error saving payment config to Firestore:', e);
    }
  };

  // Admin Actions: Post New Account directly with images
  const handlePostNewAccount = async (newAccount: EfootballAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);
    try {
      await saveAccountToFirestore(newAccount);
    } catch (e) {
      console.warn('Error posting account to Firestore:', e);
    }
  };

  // Admin Actions: Change user submitted account price
  const handleUpdateSubmissionPrice = async (submissionId: string, newPriceETB: number) => {
    setPendingSubmissions((prev) =>
      prev.map((sub) => (sub.id === submissionId ? { ...sub, priceETB: newPriceETB } : sub))
    );
    try {
      await updatePendingSubmissionInFirestore(submissionId, { priceETB: newPriceETB });
    } catch (e) {
      console.warn('Error updating submission price in Firestore:', e);
    }
  };

  // Admin Actions: Edit details of accounts posted
  const handleUpdateAccount = async (accountId: string, updates: Partial<EfootballAccount>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, ...updates } : acc))
    );
    try {
      await updateAccountInFirestore(accountId, updates);
    } catch (e) {
      console.warn('Error updating account in Firestore:', e);
    }
  };

  // Admin Actions: Approve submission to active marketplace
  const handleApproveSubmission = async (sub: PendingAccountSubmission, overridePriceETB?: number) => {
    const finalImage = sub.proofImage || '/src/assets/images/efootball_mobile_squad_cover_1792504263258.jpg';
    const finalPriceETB = overridePriceETB !== undefined && !isNaN(overridePriceETB) && overridePriceETB > 0
      ? overridePriceETB
      : sub.priceETB;

    const newAccount: EfootballAccount = {
      id: `efb-listed-${Date.now()}`,
      title: sub.title,
      slug: sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      platform: sub.platform,
      collectiveStrength: sub.collectiveStrength,
      divisionPeak: sub.divisionPeak,
      priceETB: finalPriceETB,
      coins: sub.coins,
      gp: sub.gp,
      efootballPoints: 12000,
      epicBoosterCount: sub.epicBoosterCount,
      showtimeCount: 3,
      firstOwner: true,
      konamiIdStatus: sub.konamiIdStatus,
      formation: sub.formation,
      coverImage: finalImage,
      images: [finalImage],
      manager: {
        name: 'L. A. Román (Pep Guardiola)',
        style: 'Possession Game',
        proficiency: 88,
      },
      skillPrograms: 20,
      positionPrograms: 15,
      seller: {
        name: sub.sellerTelegram.firstName,
        username: sub.sellerTelegram.username,
        rating: 5.0,
        completedSales: 1,
        badge: 'Verified Seller',
        responseTime: '< 10 mins',
      },
      description: sub.description || 'Verified eFootball account.',
      featured: false,
      isCustomSubmission: true,
      status: 'active',
      topStars: [
        { id: `ts-${Date.now()}`, name: sub.keyPlayers || 'Epic Legends', rating: 104, position: 'CF', cardType: 'Epic Booster' },
      ],
      startingXI: [],
      bench: [],
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setPendingSubmissions((prev) => prev.filter((p) => p.id !== sub.id));

    try {
      await saveAccountToFirestore(newAccount);
      await updatePendingSubmissionInFirestore(sub.id, { status: 'approved', priceETB: finalPriceETB });
    } catch (e) {
      console.warn('Error approving submission in Firestore:', e);
    }
  };

  // Admin Actions: Reject submission
  const handleRejectSubmission = async (submissionId: string) => {
    setPendingSubmissions((prev) => prev.filter((p) => p.id !== submissionId));
    try {
      await updatePendingSubmissionInFirestore(submissionId, { status: 'rejected' });
    } catch (e) {
      console.warn('Error rejecting submission in Firestore:', e);
    }
  };

  // Admin Actions: Approve order -> REMOVES account from active shop marketplace catalog by setting status = 'sold'!
  const handleApproveOrder = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.orderId === orderId);

    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: 'completed' } : o))
    );

    if (targetOrder) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === targetOrder.accountId ? { ...a, status: 'sold' as const } : a))
      );

      try {
        await updateAccountLockInFirestore(targetOrder.accountId, { status: 'sold' });
      } catch (e) {
        console.warn('Error updating account status in Firestore:', e);
      }
    }

    try {
      await updateOrderStatusInFirestore(orderId, { status: 'completed' });
    } catch (e) {
      console.warn('Error approving order in Firestore:', e);
    }
  };

  // Admin Actions: Reject order -> Resets account status to 'active' so it becomes available in shop again
  const handleRejectOrder = async (orderId: string) => {
    const target = orders.find((o) => o.orderId === orderId);

    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: 'rejected' } : o))
    );

    if (target) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === target.accountId
            ? { ...a, status: 'active' as const, lockedUntil: undefined, lockedBy: undefined }
            : a
        )
      );

      try {
        await updateAccountLockInFirestore(target.accountId, { status: 'active', lockedUntil: 0 });
      } catch (e) {
        console.warn('Error releasing lock in Firestore:', e);
      }
    }

    try {
      await updateOrderStatusInFirestore(orderId, { status: 'rejected' });
    } catch (e) {
      console.warn('Error rejecting order in Firestore:', e);
    }
  };

  // Admin Actions: Delete account from catalog
  const handleDeleteAccount = async (accountId: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    try {
      await deleteAccountFromFirestore(accountId);
    } catch (e) {
      console.warn('Error deleting account in Firestore:', e);
    }
  };

  // Comparison Handlers
  const handleToggleCompare = (account: EfootballAccount) => {
    setComparedAccountIds((prev) => {
      if (prev.includes(account.id)) {
        return prev.filter((id) => id !== account.id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], account.id];
      }
      return [...prev, account.id];
    });
  };

  // Filter out sold accounts from the active public marketplace shop!
  const publicActiveAccounts = accounts.filter((a) => a.status !== 'sold');

  const userSubmissions = pendingSubmissions.filter(
    (s) => String(s.sellerTelegram.id) === String(currentUser.id)
  );

  const pendingAdminOrdersCount = orders.filter((o) => o.status === 'pending_verification').length;
  const adminBadgeTotal = pendingSubmissions.length + pendingAdminOrdersCount;

  return (
    <div className="h-full h-[var(--tg-viewport-stable-height,100dvh)] max-h-[var(--tg-viewport-stable-height,100dvh)] w-full flex flex-col overflow-hidden bg-sports-ambient text-zinc-100 font-sans selection:bg-cyan-400 selection:text-slate-950">
      {/* Header */}
      <Header
        currentUser={currentUser}
        activePage={currentPage}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onNavigatePage={(page) => setCurrentPage(page)}
        ordersCount={orders.length}
        adminBadgeCount={adminBadgeTotal}
      />

      {/* Lock Notice Toast */}
      {lockNotice && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md p-3.5 bg-rose-950/90 border border-rose-500/40 rounded-2xl shadow-2xl text-rose-200 text-xs font-semibold flex items-center gap-3 animate-in slide-in-from-top duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{lockNotice}</span>
        </div>
      )}

      {/* Main Content Scrollable Area (Permanently bounds scroll so Bottom Nav never hides) */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain flex flex-col -webkit-overflow-scrolling-touch">
        <main className="flex-1">
          {currentPage === 'home' && (
            <HomePage
              featuredAccounts={publicActiveAccounts.filter((a) => a.featured || a.epicBoosterCount >= 8)}
              onNavigateToShop={(search) => {
                if (search !== undefined) {
                  setFilters((prev) => ({
                    ...prev,
                    search: search || '',
                    platform: 'Mobile',
                  }));
                }
                setCurrentPage('shop');
              }}
              onOpenValuation={() => setIsSellModalOpen(true)}
              onInspect={setDetailAccount}
              onQuickBuy={handleInitiateBuy}
              comparedAccountIds={comparedAccountIds}
              onToggleCompare={handleToggleCompare}
            />
          )}

          {currentPage === 'shop' && (
            <ShopPage
              accounts={publicActiveAccounts}
              filters={filters}
              onFilterChange={setFilters}
              onInspect={setDetailAccount}
              onQuickBuy={handleInitiateBuy}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              comparedAccountIds={comparedAccountIds}
              onToggleCompare={handleToggleCompare}
            />
          )}

          {currentPage === 'orders' && (
            <OrdersPage orders={orders} onNavigateToShop={() => setCurrentPage('shop')} />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              ordersCount={orders.length}
              userSubmissions={userSubmissions}
              onNavigateToOrders={() => setCurrentPage('orders')}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onNavigateToShop={() => setCurrentPage('shop')}
              onNavigateToAdmin={() => setCurrentPage('admin')}
              onUpdateCurrentUser={setCurrentUser}
            />
          )}

          {currentPage === 'admin' && (
            <AdminPage
              currentUser={currentUser}
              pendingSubmissions={pendingSubmissions}
              orders={orders}
              accounts={accounts}
              paymentConfig={paymentConfig}
              onApproveSubmission={handleApproveSubmission}
              onRejectSubmission={handleRejectSubmission}
              onUpdateSubmissionPrice={handleUpdateSubmissionPrice}
              onApproveOrder={handleApproveOrder}
              onRejectOrder={handleRejectOrder}
              onReleaseAccountLock={handleReleaseLock}
              onDeleteAccount={handleDeleteAccount}
              onUpdateAccount={handleUpdateAccount}
              onSavePaymentConfig={handleSavePaymentConfig}
              onPostNewAccount={handlePostNewAccount}
            />
          )}
        </main>

        {/* Footer inside scrollable body */}
        <Footer />
      </div>

      {/* Pinned Bottom Navigation Bar (ALWAYS SHOWING ON LOAD WITHOUT SCROLLING) */}
      <FloatingBottomNav
        activeTab={currentPage}
        onTabChange={(tab) => setCurrentPage(tab)}
        ordersCount={orders.length}
        isAdmin={currentUser.isAdmin}
        adminBadgeCount={adminBadgeTotal}
      />

      {/* Account Detail Inspection Modal */}
      {detailAccount && (
        <AccountDetailModal
          account={detailAccount}
          onClose={() => setDetailAccount(null)}
          onBuyNow={(acc: EfootballAccount) => {
            setDetailAccount(null);
            handleInitiateBuy(acc);
          }}
        />
      )}

      {/* Checkout Payment Modal */}
      {checkoutAccount && (
        <CheckoutModal
          account={checkoutAccount}
          currentUser={currentUser}
          paymentConfig={paymentConfig}
          onClose={() => setCheckoutAccount(null)}
          onOrderSuccess={handleOrderSuccess}
          onReleaseLock={handleReleaseLock}
        />
      )}

      {/* Sell Account Submission Modal */}
      {isSellModalOpen && (
        <SellAccountModal
          currentUser={currentUser}
          onClose={() => setIsSellModalOpen(false)}
          onSubmitForApproval={handleSubmitForApproval}
        />
      )}

      {/* Account Comparison Modal */}
      {isComparisonModalOpen && (
        <AccountComparisonModal
          accounts={publicActiveAccounts.filter((a) => comparedAccountIds.includes(a.id))}
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
          onSelectBuy={(acc: EfootballAccount) => {
            setIsComparisonModalOpen(false);
            handleInitiateBuy(acc);
          }}
        />
      )}
    </div>
  );
}
