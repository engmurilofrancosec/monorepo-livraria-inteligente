'use client';

import { useState } from 'react';
import { useBooks } from '@/ui/hooks/useBooks';
import BookCard from '@/ui/components/BookCard';
import Chat from '@/ui/components/Chat';
import BookFormModal from '@/ui/components/BookFormModal';
import Toast, { ToastType } from '@/ui/components/Toast';
import { Book as BookIcon, Library, Sparkles, Plus, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Book } from '@/domain/entities/Book';

export default function Dashboard() {
  const {
    orderedBooks,
    setOrderedBooks,
    loading,
    fetchBooks,
    reorderBooks
  } = useBooks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const handleEditBook = (book: Book) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  const handleAddBook = () => {
    setBookToEdit(null);
    setIsModalOpen(true);
  };

  const handleUpdated = (action: 'created' | 'updated' | 'deleted') => {
    const messages = {
      created: 'Livro adicionado com sucesso!',
      updated: 'Livro atualizado com sucesso!',
      deleted: 'Livro removido com sucesso!'
    };
    showToast(messages[action]);
    fetchBooks();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#050505] text-white">
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
        <header className="mb-10 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <Library className="text-nexus-500" size={36} />
              Minha Livraria
            </h1>
            <p className="text-zinc-400">Gerencie sua coleção com inteligência e elegância.</p>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-nexus-500/10 border border-nexus-500/20 px-4 py-2 rounded-xl items-center gap-2 text-nexus-400 text-sm font-medium">
              <Sparkles size={16} className="animate-pulse" />
              Livraria Inteligente
            </div>
            <button
              onClick={handleAddBook}
              className="bg-white text-black hover:bg-nexus-50 hover:text-nexus-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Novo Livro</span>
            </button>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-56 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={orderedBooks}
            onReorder={reorderBooks}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {orderedBooks.map(book => (
                <Reorder.Item
                  key={book.id}
                  value={book}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="h-full cursor-grab active:cursor-grabbing"
                >
                  <BookCard
                    book={book}
                    onUpdate={() => handleUpdated('deleted')}
                    onEdit={handleEditBook}
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>

            {orderedBooks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/10"
              >
                <div className="bg-zinc-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                  <BookIcon className="text-zinc-700" size={32} />
                </div>
                <h3 className="text-xl font-medium text-zinc-300 mb-2">Sua biblioteca está vazia</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">Comece adicionando um livro manualmente ou peça ajuda ao Assistente Murilo.</p>
              </motion.div>
            )}
          </Reorder.Group>
        )}
      </div>

      <button
        onClick={() => setIsChatOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-nexus-500 text-white p-4 rounded-2xl shadow-2xl shadow-nexus-500/40 hover:scale-110 active:scale-95 transition-all"
      >
        <MessageCircle size={24} />
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#0a0a0a] border-l border-white/5 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900/20">
                <span className="font-bold flex items-center gap-2">
                  <Sparkles size={18} className="text-nexus-400" />
                  Assistente Murilo
                </span>
                <button onClick={() => setIsChatOpen(false)} className="text-zinc-400 hover:text-white bg-white/5 p-2 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
              <Chat onUpdate={() => handleUpdated('updated')} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex lg:w-[450px] border-l border-white/5 bg-[#080808] flex-col shadow-2xl shadow-black">
        <Chat onUpdate={() => handleUpdated('updated')} />
      </aside>

      <BookFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={(action) => handleUpdated(action as any)}
        bookToEdit={bookToEdit}
      />

      <Toast
        {...toast}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
