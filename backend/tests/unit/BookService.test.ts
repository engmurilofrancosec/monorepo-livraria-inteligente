import { BookService } from '../../src/application/services/BookService';
import { BookRepository } from '../../src/domain/repositories/BookRepository';
import { Book } from '../../src/domain/entities/Book';

describe('BookService', () => {
  let mockRepository: jest.Mocked<BookRepository>;
  let service: BookService;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
      updateOrder: jest.fn()
    };
    service = new BookService(mockRepository);
  });

  describe('createBook', () => {
    it('deve criar um livro com default status Quero Ler e category Geral', async () => {
      const mockResult: Book = {
        id: '123',
        title: 'Livro Teste',
        author: 'Autor Teste',
        category: 'Geral',
        status: 'Quero Ler'
      };
      
      mockRepository.create.mockResolvedValue(mockResult);

      const result = await service.createBook({
        title: 'Livro Teste',
        author: 'Autor Teste'
      });

      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Livro Teste',
        status: 'Quero Ler',
        category: 'Geral'
      }));
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateBook', () => {
    it('deve atualizar o status ou nota de um livro', async () => {
      mockRepository.update.mockResolvedValue({ id: '1', title: 'A', author: 'B', category: 'C', status: 'Lido', rating: 5 });
      const result = await service.updateBook('1', { status: 'Lido', rating: 5 });
      
      expect(mockRepository.update).toHaveBeenCalledWith('1', { status: 'Lido', rating: 5 });
      expect(result?.status).toBe('Lido');
    });
  });

  describe('reorderBooks', () => {
    it('deve chamar o repositorio para atualizar a ordem', async () => {
      mockRepository.updateOrder.mockResolvedValue(undefined);
      await service.reorderBooks(['id-2', 'id-1']);
      expect(mockRepository.updateOrder).toHaveBeenCalledWith(['id-2', 'id-1']);
    });
  });
});
