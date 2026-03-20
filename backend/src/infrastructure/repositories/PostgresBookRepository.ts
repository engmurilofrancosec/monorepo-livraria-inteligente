import { Book, BookStatus } from '../../domain/entities/Book';
import { BookRepository } from '../../domain/repositories/BookRepository';
import { PrismaClient } from '@prisma/client';

export class PostgresBookRepository implements BookRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(): Promise<Book[]> {
    const books = await this.prisma.book.findMany({
      orderBy: { orderIndex: 'asc' }
    });
    return books as Book[];
  }

  async findById(id: string): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({ where: { id } });
    return book as Book | null;
  }

  async create(book: Omit<Book, 'id'>): Promise<Book> {
    const lastBook = await this.prisma.book.findFirst({
      orderBy: { orderIndex: 'desc' }
    });

    const nextOrder = (lastBook?.orderIndex ?? -1) + 1;

    const newBook = await this.prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        category: book.category,
        status: book.status,
        rating: book.rating,
        description: book.description,
        orderIndex: book.orderIndex ?? nextOrder,
      }
    });

    return newBook as Book;
  }

  async update(id: string, book: Partial<Book>): Promise<Book | null> {
    try {
      const updatedBook = await this.prisma.book.update({
        where: { id },
        data: book
      });
      return updatedBook as Book;
    } catch (e) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.book.delete({ where: { id } });
      return true;
    } catch (e) {
      return false;
    }
  }

  async updateOrder(ids: string[]): Promise<void> {
    const queries = ids.map((id, index) =>
      this.prisma.book.update({
        where: { id },
        data: { orderIndex: index }
      })
    );
    await this.prisma.$transaction(queries);
  }

  async find(query: Partial<Book>): Promise<Book[]> {
    const whereClause: any = {};

    if (query.title) whereClause.title = { contains: query.title, mode: 'insensitive' };
    if (query.author) whereClause.author = { contains: query.author, mode: 'insensitive' };
    if (query.category) whereClause.category = { contains: query.category, mode: 'insensitive' };
    if (query.status) whereClause.status = query.status;
    if (query.rating) whereClause.rating = query.rating;

    const books = await this.prisma.book.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' }
    });

    return books as Book[];
  }
}
