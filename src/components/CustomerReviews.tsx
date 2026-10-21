import React from 'react';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';

interface VerifiedReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  country: string;
  platform: string;
  verifiedBadge?: string;
}

const VERIFIED_REVIEWS: VerifiedReview[] = [
  {
    id: 'rev-1',
    author: 'Dawit T.',
    rating: 5,
    date: '2 hours ago',
    comment: 'Instant Telebirr transfer! I received the Konami ID and changed the email in less than 3 minutes. Big Time Messi 106 is insane in Division 1!',
    country: 'Addis Ababa, ET',
    platform: 'Phone / Tablet',
    verifiedBadge: 'Verified Buyer',
  },
  {
    id: 'rev-2',
    author: 'Yonas M.',
    rating: 5,
    date: 'Yesterday',
    comment: 'Super smooth escrow with admin @el_bicho14. Sent CBE screenshot and account credentials were in my vault immediately.',
    country: 'Nazret, ET',
    platform: 'Steam (PC)',
    verifiedBadge: 'Verified Buyer',
  },
  {
    id: 'rev-3',
    author: 'Abebe K.',
    rating: 5,
    date: '3 days ago',
    comment: 'Sold my 3,165 strength account through admin approval. Received my Telebirr payout directly to my phone within 15 minutes. 100% recommended marketplace.',
    country: 'Hawassa, ET',
    platform: 'Phone / Tablet',
    verifiedBadge: 'Verified Seller',
  },
  {
    id: 'rev-4',
    author: 'Kaleb S.',
    rating: 5,
    date: '4 days ago',
    comment: 'Top quality eFootball accounts with clean unlinked Konami IDs. Excellent customer service on Telegram and zero issues linking my PS5.',
    country: 'Bahir Dar, ET',
    platform: 'PlayStation',
    verifiedBadge: 'Verified Buyer',
  },
];

export const CustomerReviews: React.FC = () => {
  return (
    <section id="reviews" className="py-10 sm:py-14 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Player Community
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 sm:mt-1">
              Verified Buyer Experiences
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
              Real testimonials from competitive players who bought or sold via our escrow vault.
            </p>
          </div>

          <div className="flex items-center gap-2.5 glass-panel px-3.5 py-2 rounded-2xl self-start md:self-auto shadow-md">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-white font-mono-num">4.96 / 5.0</span>
            <span className="text-[11px] text-zinc-400">· 2,480+ Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {VERIFIED_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="glass-panel p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-3.5 hover:border-cyan-400/40 transition-all duration-200"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono-num">{review.date}</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/[0.08]">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{review.author}</span>
                  <span className="text-[10px] text-zinc-400 font-normal">{review.country}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-zinc-400 mt-1 font-medium">
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> {review.verifiedBadge}
                  </span>
                  <span>·</span>
                  <span>{review.platform}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
