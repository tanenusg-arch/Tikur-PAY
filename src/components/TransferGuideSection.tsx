import React, { useState } from 'react';
import { Shield, KeyRound, Smartphone, CheckCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export const TransferGuideSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      num: '01',
      title: 'Automated Credential Release',
      desc: 'Once payment completes, our cryptographic vault reveals the linked Konami ID, current master password, and recovery answers.',
      icon: <KeyRound className="w-5 h-5 text-amber-400" />,
    },
    {
      num: '02',
      title: 'Email Address Re-Binding',
      desc: 'Sign into the official portal (my.konami.net), go to Security Settings, and switch the registered email to your personal inbox.',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: '03',
      title: 'Enable Two-Factor Security (2FA)',
      desc: 'Turn on Google Authenticator or SMS 2-step verification. The seller is instantly disconnected from the Konami ID permanently.',
      icon: <Lock className="w-5 h-5 text-sky-400" />,
    },
    {
      num: '04',
      title: 'Sync Squad In-Game',
      desc: 'Open eFootball on your phone, tablet, or PC. From the Title Screen, select Support → Data Transfer and log in with your Konami ID.',
      icon: <Smartphone className="w-5 h-5 text-purple-400" />,
    },
  ];

  const faqs = [
    {
      q: 'Can the previous owner recover or rollback the eFootball account?',
      a: 'No. When you update the primary email on my.konami.net and activate Two-Factor Authentication (2FA), all previous security tokens are revoked by Konami servers. Additionally, every purchase is backed by our Anti-Rollback Escrow Guarantee.',
    },
    {
      q: 'Will my eFootball account get banned by Konami?',
      a: 'All accounts featured on eFootball Vault are verified manually for clean play history with zero automated bot farming, hack tools, or illicit coin exploits. We only list genuine, player-built accounts.',
    },
    {
      q: 'Can I transfer an account between phones, tablets, and PC?',
      a: 'Yes! Konami ID connects cross-platform between Android, iOS, iPadOS, and PC (Steam) seamlessly. All players, managers, GP, and squads sync 100% across all your devices.',
    },
    {
      q: 'How fast do I receive the account details?',
      a: 'Our delivery is 100% automated. Your login credentials, temporary password, and transfer verification PIN are visible immediately inside your browser order vault and emailed to your address.',
    },
  ];

  return (
    <section id="transfer-guide" className="py-16 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Security Architecture</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            How Safe Konami ID Transfer Works
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed [text-wrap:balance]">
            We pioneered the zero-risk handover protocol for eFootball. Follow 4 simple steps to take permanent 100% ownership of your squad.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-black/60 rounded-xl border border-white/[0.08] shadow-sm">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-zinc-700 font-mono-num">{step.num}</span>
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Handover Step</span>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto pt-6 space-y-3">
          <h3 className="text-lg font-bold text-white text-center mb-6">Frequently Asked Safety Questions</h3>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="glass-panel rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4.5 pb-4.5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.06] pt-3.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
