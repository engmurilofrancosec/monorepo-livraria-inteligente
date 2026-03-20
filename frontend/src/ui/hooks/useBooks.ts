import { useState, useEffect, useCallback } from 'react';
import { Book } from '@/domain/entities/Book';
import { BookApiService } from '@/infrastructure/api/BookApiService';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [orderedBooks, setOrderedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BookApiService.getAll();
      setBooks(data);
      setOrderedBooks(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      setError('Não foi possível carregar os livros.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderBooks = async (newOrder: Book[]) => {
    const previousOrder = [...orderedBooks];
    setOrderedBooks(newOrder);
    try {
      await BookApiService.reorder(newOrder.map(b => b.id));
      setBooks(newOrder);
    } catch (err) {
      console.error('Erro ao reordenar livros:', err);
      setOrderedBooks(previousOrder);
      throw err;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await BookApiService.delete(id);
      await fetchBooks();
    } catch (err) {
      console.error('Erro ao deletar livro:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    orderedBooks,
    setOrderedBooks,
    loading,
    error,
    fetchBooks,
    reorderBooks,
    deleteBook
  };
}
