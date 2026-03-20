'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden"
        >
          <div className="p-8 pb-4 flex justify-between items-start">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              variant === 'danger' 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-nexus-500/10 border-nexus-500/30 text-nexus-400'
            }`}>
              <AlertCircle size={24} />
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-zinc-400 hover:text-white transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 pt-4">
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
              {title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          <div className="p-8 border-t border-white/5 bg-zinc-900/20 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-8 py-3 rounded-2xl font-bold text-white transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest ${
                variant === 'danger' 
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' 
                  : 'bg-nexus-500 hover:bg-nexus-600 shadow-nexus-500/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
