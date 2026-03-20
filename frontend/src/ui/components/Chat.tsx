'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Loader2 } from 'lucide-react';
import { useChat } from '@/ui/hooks/useChat';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface ChatProps {
  onUpdate: () => void;
}

export default function Chat({ onUpdate }: ChatProps) {
  const { messages, isTyping, sendMessage } = useChat(onUpdate);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-nexus-500/20 flex items-center justify-center border border-nexus-500/30">
            <Bot className="text-nexus-400" size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Assistente Murilo</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Pronto para te auxiliar</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <div className="bg-nexus-500/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-nexus-500/20">
                <Sparkles className="text-nexus-400" size={28} />
              </div>
              <h3 className="text-white font-medium mb-2">Bem-vindo à Minha Livraria</h3>
              <p className="text-zinc-500 text-sm px-6 leading-relaxed">
                Eu sou seu assistente inteligente. Tente algo como:<br />
                <span className="text-nexus-400/80 italic mt-2 block font-medium">"Adicione o livro O Hobbit do Tolkien com nota 5"</span>
              </p>
            </motion.div>
          )}

          {messages.filter(m => m.role !== 'tool' && (m.content || m.parts?.[0]?.text)).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-lg ${msg.role === 'user'
                ? 'bg-nexus-600 text-white rounded-tr-none shadow-nexus-600/10'
                : 'bg-zinc-900 text-zinc-200 border border-white/5 rounded-tl-none shadow-black/20'
                }`}>
                {msg.role === 'user' ? (
                  msg.content || msg.parts?.[0]?.text || ''
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>
                      {msg.content || msg.parts?.[0]?.text || ''}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start"
            >
              <div className="bg-zinc-900 border border-white/5 rounded-2xl rounded-tl-none px-5 py-3 flex items-center gap-2">
                <Loader2 className="animate-spin text-nexus-400" size={16} />
                <span className="text-xs text-zinc-500 font-medium">Murilo está pensando...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-white/5 bg-[#080808]">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Como posso ajudar hoje?"
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 px-6 pr-14 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-nexus-500/50 focus:bg-zinc-900 transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 top-2.5 p-2.5 bg-nexus-500 hover:bg-nexus-600 disabled:opacity-30 disabled:hover:bg-nexus-500 text-white rounded-xl transition-all shadow-lg shadow-nexus-500/20 active:scale-90"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-4 text-[10px] text-center text-zinc-600 font-medium uppercase tracking-[0.2em]">
          Powered by Nexus AI Hub (Groq & Gemini)
        </p>
      </div>
    </div>
  );
}
