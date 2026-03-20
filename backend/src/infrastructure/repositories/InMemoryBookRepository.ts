import { Book } from '../../domain/entities/Book';
import { BookRepository } from '../../domain/repositories/BookRepository';
import { v4 as uuidv4 } from 'uuid';

export class InMemoryBookRepository implements BookRepository {
  private books: Book[] = [
    {
      id: '1',
      title: 'O Hobbit',
      author: 'J.R.R. Tolkien',
      category: 'Fantasia',
      status: 'Lido',
      rating: 5,
      description: 'Uma jornada épica de um hobbit.',
      orderIndex: 0
    },
    {
      id: '2',
      title: 'Arquitetura Limpa',
      author: 'Robert C. Martin',
      category: 'Tecnologia',
      status: 'Lendo',
      rating: 4,
      description: 'Guia do artesão para estrutura e design de software.',
      orderIndex: 1
    }
  ];

  async findAll(): Promise<Book[]> {
    return [...this.books].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.find(b => b.id === id) || null;
  }

  async create(book: Omit<Book, 'id'>): Promise<Book> {
    const orderIndex = this.books.length > 0 ? Math.max(...this.books.map(b => b.orderIndex || 0)) + 1 : 0;
    const newBook: Book = { ...book, id: uuidv4(), orderIndex };
    this.books.push(newBook);
    return newBook;
  }

  async update(id: string, book: Partial<Book>): Promise<Book | null> {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.books[index] = { ...this.books[index], ...book };
    return this.books[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.books.splice(index, 1);
    return true;
  }

  async updateOrder(ids: string[]): Promise<void> {
    ids.forEach((id, index) => {
      const bookIndex = this.books.findIndex(b => b.id === id);
      if (bookIndex !== -1) {
        this.books[bookIndex].orderIndex = index;
      }
    });
  }

  async find(query: Partial<Book>): Promise<Book[]> {
    return this.books.filter(book => {
      return Object.entries(query).every(([key, value]) => {
        if (!value) return true;
        const bookValue = (book as any)[key];
        if (typeof bookValue === 'string' && typeof value === 'string') {
          return bookValue.toLowerCase().includes(value.toLowerCase());
        }
        return bookValue === value;
      });
    }).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }
}
