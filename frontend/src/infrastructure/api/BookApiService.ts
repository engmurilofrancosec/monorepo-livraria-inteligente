import api from './client';
import { Book } from '@/domain/entities/Book';

export class BookApiService {
  static async getAll(): Promise<Book[]> {
    const { data } = await api.get('/books');
    return data;
  }

  static async create(book: Omit<Book, 'id'>): Promise<Book> {
    const { data } = await api.post('/books', book);
    return data;
  }

  static async update(id: string, book: Partial<Book>): Promise<Book> {
    const { data } = await api.patch(`/books/${id}`, book);
    return data;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  }

  static async reorder(ids: string[]): Promise<void> {
    await api.post('/books/reorder', { ids });
  }

  static async chat(message: string, history: any[]): Promise<{ text: string, hasAction: boolean, messages: any[] }> {
    const { data } = await api.post('/chat', { message, history });
    return data;
  }
}
