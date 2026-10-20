export type Platform = 'Mobile';

export interface TelegramUser {
  id: number | string;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  isAdmin?: boolean;
}

export interface PlayerCard {
  id: string;
  name: string;
  rating: number;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'DMF' | 'CMF' | 'AMF' | 'LMF' | 'RMF' | 'LWF' | 'RWF' | 'SS' | 'CF';
  cardType: 'Big Time' | 'Epic Booster' | 'Showtime' | 'Highlight' | 'Featured';
  boosterSkill?: string;
  club?: string;
  x?: number; // Pitch percentage X: 0-100
  y?: number; // Pitch percentage Y: 0-100
}

export interface EfootballAccount {
  id: string;
  title: string;
  slug: string;
  platform: Platform;
  collectiveStrength: number;
  divisionPeak: string;
  priceETB: number; // Strictly in ETB (Ethiopian Birr)
  price?: number; // Optional fallback legacy alias
  originalPriceETB?: number;
  coins: number;
  gp: number;
  efootballPoints: number;
  epicBoosterCount: number;
  showtimeCount: number;
  manager: {
    name: string;
    style: string;
    proficiency: number;
    booster?: string;
  };
  konamiIdStatus: 'Unlinked / Clean' | 'Email Changeable' | 'Full Access Handover';
  firstOwner: boolean;
  formation: string; // e.g., '4-2-1-3', '4-1-2-3', '4-3-3'
  topStars: PlayerCard[];
  startingXI: PlayerCard[];
  bench: PlayerCard[];
  skillPrograms: number;
  positionPrograms: number;
  seller: {
    name: string;
    username?: string;
    rating: number;
    completedSales: number;
    badge: string;
    responseTime: string;
  };
  description: string;
  featured?: boolean;
  isCustomSubmission?: boolean;
  
  // Admin-uploaded images / screenshots
  coverImage?: string;
  images?: string[];

  // 15-Minute Reservation Lock
  lockedUntil?: number; // timestamp ms
  lockedBy?: {
    id: number | string;
    username?: string;
    firstName?: string;
  };

  // Status lifecycle
  status?: 'active' | 'locked' | 'payment_review' | 'sold';
  submissionStatus?: 'approved' | 'pending' | 'rejected';
  sellerTelegram?: string;
  sellerPhone?: string;
  sellerProofUrl?: string;
}

export interface FilterState {
  search: string;
  platform: Platform;
  minStrength: number;
  maxPriceETB: number; // ETB price filter
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'strength-desc' | 'coins-desc';
  konamiStatus: string;
  keyPlayer: string;
}

export interface PurchasedOrder {
  orderId: string;
  accountId: string;
  accountTitle: string;
  platform: Platform;
  priceETB: number; // Purely in ETB
  price?: number; // Optional legacy
  collectiveStrength: number;
  buyerEmail?: string;
  buyerTelegram: {
    id: number | string;
    username?: string;
    firstName: string;
    photoUrl?: string;
  };
  paymentMethod: 'TELEBIRR' | 'CBE';
  senderNameOrPhone: string;
  transactionRef: string;
  paymentScreenshotUrl?: string;
  status: 'pending_verification' | 'completed' | 'rejected';
  credentials?: {
    konamiId: string;
    tempPass: string;
    transferCode: string;
    instructions: string[];
  };
  adminNotes?: string;
  timestamp: string;
}

export interface PendingAccountSubmission {
  id: string;
  title: string;
  platform: Platform;
  collectiveStrength: number;
  divisionPeak: string;
  priceETB: number; // Strictly in ETB
  coins: number;
  gp: number;
  epicBoosterCount: number;
  konamiIdStatus: 'Unlinked / Clean' | 'Email Changeable' | 'Full Access Handover';
  formation: string;
  description: string;
  keyPlayers: string;
  proofImage?: string;
  proofImages?: string[];
  sellerTelegram: {
    id: number | string;
    username?: string;
    firstName: string;
  };
  sellerContact: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
}

export interface AdminPaymentConfig {
  telebirrNumber: string;
  telebirrAccountName: string;
  cbeAccountNumber: string;
  cbeAccountName: string;
  instructions: string;
  updatedAt: string;
}
