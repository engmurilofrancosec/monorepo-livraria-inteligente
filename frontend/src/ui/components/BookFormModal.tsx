'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Book as BookIcon } from 'lucide-react';
import { BookApiService } from '@/infrastructure/api/BookApiService';
import { Book, BookStatus } from '@/domain/entities/Book';
import StarRating from './StarRating';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (action: string) => void;
  bookToEdit?: Book | null;
}

export default function BookFormModal({ isOpen, onClose, onUpdate, bookToEdit }: BookFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Geral',
    status: 'Quero Ler' as BookStatus,
    rating: 0,
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        category: bookToEdit.category,
        status: bookToEdit.status,
        rating: bookToEdit.rating || 0,
        description: bookToEdit.description || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: 'Geral',
        status: 'Quero Ler',
        rating: 0,
        description: ''
      });
    }
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bookToEdit) {
        await BookApiService.update(bookToEdit.id, formData);
        onUpdate('updated');
      } else {
        await BookApiService.create(formData);
        onUpdate('created');
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-xl bg-[#0a0a0a] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white tracking-tight">
              <div className="w-10 h-10 rounded-xl bg-nexus-500/20 flex items-center justify-center border border-nexus-500/30">
                <BookIcon className="text-nexus-400" size={22} />
              </div>
              {bookToEdit ? 'Editar Livro' : 'Novo Livro'}
            </h2>
            <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto w-full scrollbar-hide">
            <form id="book-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Título do Livro</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-nexus-500/50 focus:bg-[#151515] transition-all"
                    placeholder="Ex: O Senhor dos Anéis"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Autor / Escritor</label>
                  <input 
                    required
                    type="text" 
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-nexus-500/50 focus:bg-[#151515] transition-all"
                    placeholder="Ex: J.R.R. Tolkien"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Status de Leitura</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BookStatus })}
                    className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-nexus-500/50 focus:bg-[#151515] transition-all appearance-none cursor-pointer"
                  >
                    <option value="Quero Ler">Quero Ler</option>
                    <option value="Lendo">Lendo</option>
                    <option value="Lido">Lido</option>
                    <option value="Abandonado">Abandonado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Gênero / Categoria</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-nexus-500/50 focus:bg-[#151515] transition-all"
                    placeholder="Ex: Fantasia"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Sua Avaliação</label>
                <div className="bg-[#111] border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Quanto você curtiu este livro?</span>
                  <StarRating 
                    rating={formData.rating} 
                    onChange={(r) => setFormData({ ...formData, rating: r })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Resumo ou Observações</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-nexus-500/50 focus:bg-[#151515] transition-all resize-none"
                  placeholder="Conte um pouco sobre suas impressões..."
                />
              </div>
            </form>
          </div>

          <div className="p-8 border-t border-white/5 bg-zinc-900/20 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              form="book-form"
              disabled={loading}
              className="px-8 py-3 rounded-2xl font-bold bg-nexus-500 text-white hover:bg-nexus-600 transition-all flex items-center gap-2 disabled:opacity-30 shadow-xl shadow-nexus-500/20 active:scale-95 text-sm uppercase tracking-widest"
            >
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar Livro'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
