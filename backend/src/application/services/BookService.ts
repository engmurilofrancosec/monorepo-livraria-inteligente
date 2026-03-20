import { Book, BookStatus } from '../../domain/entities/Book';
import { BookRepository } from '../../domain/repositories/BookRepository';

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async listBooks(filter?: Partial<Book>) {
    if (filter && Object.keys(filter).length > 0) {
      return this.bookRepository.find(filter);
    }
    return this.bookRepository.findAll();
  }

  async getBook(id: string) {
    return this.bookRepository.findById(id);
  }

  async createBook(data: { 
    title: string, 
    author: string, 
    category?: string, 
    status?: BookStatus, 
    rating?: number,
    description?: string 
  }) {
    return this.bookRepository.create({
      title: data.title,
      author: data.author,
      category: data.category || 'Geral',
      status: data.status || 'Quero Ler',
      rating: data.rating,
      description: data.description
    });
  }

  async updateBook(id: string, data: Partial<Book>) {
    return this.bookRepository.update(id, data);
  }

  async removeBook(id: string) {
    return this.bookRepository.delete(id);
  }

  async reorderBooks(ids: string[]) {
    return this.bookRepository.updateOrder(ids);
  }
}
