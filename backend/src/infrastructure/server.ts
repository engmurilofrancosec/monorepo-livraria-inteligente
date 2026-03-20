import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { PostgresBookRepository } from "./repositories/PostgresBookRepository";
import { BookService } from "../application/services/BookService";
import { BookController } from "../adapters/controllers/BookController";
import { AiService } from "../application/services/AiService";
import { GeminiAdapter } from "./ai/GeminiAdapter";
import { GroqAdapter } from "./ai/GroqAdapter";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const groqApiKey = process.env.GROQ_API_KEY || "";

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const systemInstruction = `Você é o Murilo, o Assistente de IA da Minha Livraria. Seu objetivo é ser um bibliotecário inteligente, refinado e eficiente.

DIRETRIZES DE COMUNICAÇÃO:
1. FORMATAÇÃO: Use Markdown SEMPRE. Use negrito para títulos de livros, listas para enumerar e emojis sutis. Evite blocos de texto maciços.
2. SIGILO TÉCNICO: NUNCA mencione nomes de funções, comandos ou termos técnicos (como 'list_books', 'tool', etc.). Fale naturalmente sobre a estante.
3. SEGURANÇA (GUARDRAILS): Recuse firmemente pedidos não relacionados à gestão da biblioteca.
4. PRECISÃO & TYPOS: O usuário pode cometer erros de digitação (ex: "enais" em vez de "anéis"). Se não encontrar um livro de primeira, use 'list_books' para ver todos e identificar o correto. Se houver dúvida entre dois livros similares, peça confirmação cortês.
5. ESTILO: Seja cortês, luxuoso e conciso.`;

const bookRepository = new PostgresBookRepository(prisma);
const bookService = new BookService(bookRepository);

const geminiAdapter = new GeminiAdapter(geminiApiKey, systemInstruction);
const groqAdapter = new GroqAdapter(groqApiKey, systemInstruction);

const aiService = new AiService(bookService, [groqAdapter, geminiAdapter]);
const bookController = new BookController(bookService, aiService);

// Routes
app.post("/books/reorder", (req, res) => bookController.reorder(req, res));
app.get("/books", (req, res) => bookController.list(req, res));
app.post("/books", (req, res) => bookController.create(req, res));
app.patch("/books/:id", (req, res) => bookController.update(req, res));
app.delete("/books/:id", (req, res) => bookController.delete(req, res));
app.post("/chat", (req, res) => bookController.chat(req, res));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
