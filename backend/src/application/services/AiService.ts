import { IAiProvider, AiMessage } from "../ports/IAiProvider";
import { BookService } from "./BookService";

export class AiService {
  private tools: any[];

  constructor(
    private bookService: BookService,
    private providers: IAiProvider[]
  ) {
    this.tools = [
      {
        name: "create_book",
        description: "Adiciona um novo livro à biblioteca",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string", description: "Título do livro" },
            author: { type: "string", description: "Autor do livro" },
            category: { type: "string", description: "Categoria do livro" },
            status: { type: "string", description: "Status de leitura" },
            rating: { type: "number", description: "Avaliação de 1 a 5" },
            description: { type: "string", description: "Breve descrição do livro" }
          },
          required: ["title", "author"]
        }
      },
      {
        name: "list_books",
        description: "Lista livros da biblioteca, opcionalmente filtrando por critérios como categoria ou autor",
        parameters: {
          type: "object",
          properties: {
            category: { type: "string", description: "Filtrar por categoria" },
            status: { type: "string", description: "Filtrar por status" },
            author: { type: "string", description: "Filtrar por autor" },
            rating: { type: "number", description: "Filtrar por avaliação (1 a 5)" }
          }
        }
      },
      {
        name: "update_book",
        description: "Atualiza informações de um livro existente (status, nota, categoria, descrição)",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string", description: "Título parcial ou completo para identificar o livro" },
            author: { type: "string", description: "Novo autor do livro" },
            status: { type: "string", description: "Novo status (Quero Ler, Lendo, Lido, Abandonado)" },
            rating: { type: "number", description: "Nova avaliação (1 a 5)" },
            category: { type: "string", description: "Nova categoria" },
            description: { type: "string", description: "Nova descrição" }
          },
          required: ["title"]
        }
      },
      {
        name: "delete_book",
        description: "Remove um livro da biblioteca pelo título",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string", description: "Título do livro para deletar" }
          },
          required: ["title"]
        }
      },
      {
        name: "reorder_books",
        description: "Reordena a lista completa de livros. Passe o array de IDs na nova ordem. IMPORTANTE: chame list_books antes para pegar os IDs atuais.",
        parameters: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "string" },
              description: "Array de strings contendo os IDs dos livros na nova ordem lógica definida no prompt."
            }
          },
          required: ["ids"]
        }
      }
    ];
  }

  async chat(message: string, history: any[] = []): Promise<{ text: string, hasAction: boolean, messages: any[] }> {
    const messages: AiMessage[] = [
      ...(history || []).map(h => ({
        role: h.role === 'tool' ? 'tool' : (h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user') as any,
        content: h.content || (h.parts || []).map((p: any) => p.text).join(" "),
        toolCallId: h.toolCallId,
        name: h.name,
        toolCalls: h.toolCalls || (h.parts || [])
          .filter((p: any) => p.functionCall)
          .map((p: any) => ({
            id: p.functionCall.id,
            name: p.functionCall.name,
            args: p.functionCall.args
          }))
      })),
      { role: 'user', content: message }
    ];

    return await this.executeChatLoop(messages);
  }

  private async executeChatLoop(messages: AiMessage[]): Promise<{ text: string, hasAction: boolean, messages: any[] }> {
    let hasAction = false;
    let finalContent = "";

    for (let i = 0; i < 5; i++) {
      const response = await this.tryAllProviders(messages);
      finalContent = response.content;

      if (!response.toolCalls || response.toolCalls.length === 0) {
        messages.push({ role: 'assistant', content: finalContent });
        break;
      }

      hasAction = true;
      messages.push({ role: 'assistant', content: finalContent, toolCalls: response.toolCalls });

      for (const call of response.toolCalls) {
        const result = await this.executeFunction(call.name, call.args);
        messages.push({
          role: 'tool',
          name: call.name,
          toolCallId: call.id,
          content: result
        });
      }
    }

    if (!finalContent && hasAction) {
      finalContent = "Ação realizada com sucesso na sua estante! ✨";
      // Update the last message if it was empty
      if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
        messages[messages.length - 1].content = finalContent;
      }
    }

    return { text: finalContent, hasAction, messages };
  }

  private async tryAllProviders(messages: AiMessage[]): Promise<any> {
    let lastError: any;
    for (const provider of this.providers) {
      try {
        return await provider.generateResponse(messages, this.tools);
      } catch (error: any) {
        lastError = error;
        console.warn(`[AiService] Provider ${provider.providerName} falhou: ${error.message}`);
      }
    }
    throw new Error(`Todos os provedores de IA falharam. Último erro: ${lastError?.message}`);
  }

  private async executeFunction(name: string, args: any): Promise<string> {
    try {
      if (name === "create_book") {
        const book = await this.bookService.createBook(args);
        return `Livro adicionado com sucesso: ${book.title}`;
      } else if (name === "list_books") {
        const books = await this.bookService.listBooks(args);
        return JSON.stringify(books);
      } else if (name === "update_book") {
        let foundBooks = await this.bookService.listBooks({ title: args.title });

        if (foundBooks.length === 0) {
          const allBooks = await this.bookService.listBooks();
          foundBooks = this.findBestMatches(args.title, allBooks);
        }

        if (foundBooks.length === 0) return `Erro: Livro '${args.title}' não encontrado. Use 'list_books' para ver os títulos exatos disponíveis.`;

        const { title, ...dataToUpdate } = args;
        const book = await this.bookService.updateBook(foundBooks[0].id, dataToUpdate);
        return `Livro '${book?.title}' atualizado com sucesso.`;
      } else if (name === "delete_book") {
        let foundBooks = await this.bookService.listBooks({ title: args.title });

        if (foundBooks.length === 0) {
          const allBooks = await this.bookService.listBooks();
          foundBooks = this.findBestMatches(args.title, allBooks);
        }

        if (foundBooks.length === 0) return `Erro: Livro '${args.title}' não encontrado.`;
        await this.bookService.removeBook(foundBooks[0].id);
        return `Livro '${foundBooks[0].title}' removido com sucesso.`;
      } else if (name === "reorder_books") {
        await this.bookService.reorderBooks(args.ids);
        return `Livros reordenados com sucesso!`;
      }
      return "Função desconhecida";
    } catch (error: any) {
      return `Erro: ${error.message}`;
    }
  }

  private findBestMatches(target: string, books: any[]): any[] {
    const normalizedTarget = target.toLowerCase();
    return books
      .map(b => ({ book: b, score: this.calculateSimilarity(b.title.toLowerCase(), normalizedTarget) }))
      .filter(res => res.score > 0.45)
      .sort((a, b) => b.score - a.score)
      .map(res => res.book);
  }

  private calculateSimilarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    return (longer.length - this.editDistance(longer, shorter)) / longer.length;
  }

  private editDistance(s1: string, s2: string): number {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
}
