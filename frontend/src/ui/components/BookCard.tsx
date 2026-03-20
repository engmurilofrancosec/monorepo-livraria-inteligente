'use client';

import { Book } from '@/domain/entities/Book';
import { BookOpen, CheckCircle, Clock, Star, Trash2, Edit2, GripVertical } from 'lucide-react';
import { BookApiService } from '@/infrastructure/api/BookApiService';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

interface BookCardProps {
  book: Book;
  onUpdate: () => void;
  onEdit?: (book: Book) => void;
}

export default function BookCard({ book, onUpdate, onEdit }: BookCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await BookApiService.delete(book.id);
      onUpdate();
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
    }
  };

  const statusIcons = {
    'Lendo': <Clock size={14} className="text-blue-400" />,
    'Lido': <CheckCircle size={14} className="text-emerald-400" />,
    'Quero Ler': <BookOpen size={14} className="text-zinc-400" />,
    'Abandonado': <CheckCircle size={14} className="text-rose-400" />
  };

  const statusColors = {
    'Lendo': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Lido': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Quero Ler': 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    'Abandonado': 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl group relative flex flex-col h-full transition-all hover:bg-[#151515] hover:border-nexus-500/30 hover:shadow-2xl hover:shadow-nexus-500/10"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-2">
           <GripVertical size={16} className="text-zinc-800 group-hover:text-zinc-600 transition-colors" />
           <span className={`px-3 py-1 rounded-xl text-[10px] uppercase tracking-wider font-bold border flex items-center gap-1.5 ${statusColors[book.status] || statusColors['Quero Ler']}`}>
            {statusIcons[book.status] || statusIcons['Quero Ler']}
            {book.status}
          </span>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(book); }}
              className="p-2 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
            >
              <Edit2 size={16} />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsDeleteModalOpen(true); }}
            className="p-2 text-zinc-500 hover:text-rose-400 transition-all hover:bg-rose-400/5 rounded-xl border border-transparent hover:border-rose-400/20"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Remover Livro"
        message={`Tem certeza que deseja remover "${book.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        variant="danger"
      />

      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-nexus-400 transition-colors">{book.title}</h3>
        <p className="text-zinc-500 text-sm font-medium">{book.author}</p>
      </div>
      
      <div className="mt-auto pt-5 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star 
              key={s} 
              size={14} 
              className={s <= (book.rating || 0) ? "fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "text-zinc-800"} 
            />
          ))}
        </div>
        
        {book.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed italic">
            "{book.description}"
          </p>
        )}
        
        <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-[0.15em] text-nexus-500/80 font-black">{book.category}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-500/20"></div>
        </div>
      </div>
    </motion.div>
  );
}
