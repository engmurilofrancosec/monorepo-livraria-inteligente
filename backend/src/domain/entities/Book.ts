export type BookStatus = 'Quero Ler' | 'Lendo' | 'Lido' | 'Abandonado';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: BookStatus;
  rating?: number;
  description?: string;
  orderIndex?: number;
}
