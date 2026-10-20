import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'agent',
    text: 'Hello, I am Alex from the eFootball Vault Escrow Team. Looking for a specific legend (like 2015 Messi, Rummenigge, or Blitz Curler), or need help with Konami ID email transfer?',
    time: 'Just now',
  },
];

export const LiveChatSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'How do I change the Konami ID email?',
    'What is the Anti-Rollback guarantee?',
    'Do you have 2015 Big Time Messi?',
    'Can I transfer between tablets, phones & PC?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Thanks for your question! Every account on eFootball Vault is backed by 100% full email transfer. You receive the Konami ID credentials automatically upon payment.";

      const lower = text.toLowerCase();
      if (lower.includes('email') || lower.includes('change') || lower.includes('transfer')) {
        reply = "To transfer email: Log in to my.konami.net with the provided credentials -> go to Security Settings -> click 'Change Email Address' -> enter your personal email. Once confirmed, you can activate 2FA and the account is permanently yours!";
      } else if (lower.includes('rollback') || lower.includes('guarantee') || lower.includes('warranty')) {
        reply = "Our Anti-Rollback Guarantee is standard on all purchases: if any account experiences a security claim, our escrow system replaces the account with an equal or superior team strength squad or provides a 100% full refund.";
      } else if (lower.includes('messi') || lower.includes('rummenigge') || lower.includes('legend')) {
        reply = "Yes! Our top listing 'Div 1 Rank 140 God Squad' includes the iconic 2015 Big Time Lionel Messi (106 rating boosted) alongside Epic Booster Rummenigge with Phenomenal Finishing.";
      } else if (lower.includes('ios') || lower.includes('android') || lower.includes('pc') || lower.includes('tablet') || lower.includes('device')) {
        reply = "Yes, Konami ID allows seamless cross-platform login across phones, tablets, and PC (Steam). All your players, managers, formations, and GP sync across devices immediately upon signing in!";
      }

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: reply,
        time: 'Just now',
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs rounded-full shadow-2xl shadow-amber-400/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>24/7 Escrow Support</span>
        </button>
      ) : (
        <div className="w-[340px] sm:w-[380px] bg-zinc-950 border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[480px]">
          {/* Header */}
          <div className="p-4 bg-zinc-900/80 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Escrow Live Specialist</h4>
                <span className="text-[10px] text-emerald-400 font-medium">Online · Ready to assist</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close live chat"
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages scroll */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      isUser
                        ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-zinc-900/80 border border-white/[0.08] text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 px-1 font-mono-num">{m.time}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 bg-zinc-900/80 border border-white/[0.08] rounded-2xl text-[11px] text-zinc-400 w-28">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-200" />
                <span>Typing...</span>
              </div>
            )}
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 py-2 bg-black/60 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSend(q)}
                className="text-[10px] text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-md shrink-0 border border-white/[0.08] transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-zinc-950 border-t border-white/[0.08] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about squads or transfer..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-zinc-900 border border-white/[0.08] focus:border-amber-400/80 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="p-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
