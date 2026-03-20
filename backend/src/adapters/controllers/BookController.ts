import { Request, Response } from "express";
import { BookService } from "../../application/services/BookService";
import { AiService } from "../../application/services/AiService";

export class BookController {
  constructor(
    private bookService: BookService,
    private aiService: AiService
  ) {}

  async list(req: Request, res: Response) {
    try {
      const books = await this.bookService.listBooks(req.query as any);
      res.json(books);
    } catch (error) {
      console.error("[Controller Error] list:", error);
      res.status(500).json({ error: "Erro ao listar livros" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const book = await this.bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      console.error("[Controller Error] create:", error);
      res.status(500).json({ error: "Erro ao criar livro" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const book = await this.bookService.updateBook(req.params.id as string, req.body);
      if (!book) return res.status(404).json({ error: "Livro não encontrado" });
      res.json(book);
    } catch (error) {
      console.error("[Controller Error] update:", error);
      res.status(500).json({ error: "Erro ao atualizar livro" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const success = await this.bookService.removeBook(req.params.id as string);
      if (!success) return res.status(404).json({ error: "Livro não encontrado" });
      res.status(204).send();
    } catch (error) {
      console.error("[Controller Error] delete:", error);
      res.status(500).json({ error: "Erro ao deletar livro" });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: "Array de IDs inválido" });
      }
      await this.bookService.reorderBooks(ids);
      res.json({ success: true });
    } catch (error) {
      console.error("[Controller Error] reorder:", error);
      res.status(500).json({ error: "Erro ao reordenar livros" });
    }
  }

  async chat(req: Request, res: Response) {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    
    try {
      const result = await this.aiService.chat(message, history);
      res.json(result);


    } catch (error: any) {
      console.error("[Controller Error] chat:", error);
      
      const errorMessage = error.message || "";
      if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("Too Many Requests")) {
        return res.status(429).json({ 
          error: "Limite de uso da IA atingido para hoje. Por favor, tente novamente mais tarde ou mude para o plano Pro.",
          details: errorMessage 
        });
      }

      res.status(500).json({ error: "Erro na comunicação com a IA: " + errorMessage });
    }
  }
}
