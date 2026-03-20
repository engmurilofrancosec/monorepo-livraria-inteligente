import { Book } from '../entities/Book';

export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  create(book: Omit<Book, 'id'>): Promise<Book>;
  update(id: string, book: Partial<Book>): Promise<Book | null>;
  delete(id: string): Promise<boolean>;
  find(query: Partial<Book>): Promise<Book[]>;
  updateOrder(ids: string[]): Promise<void>;
}
