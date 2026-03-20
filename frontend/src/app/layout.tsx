import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gerenciador de Livros | Gestão Inteligente",
  description: "Gerencie sua biblioteca pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <main className="min-h-screen bg-black text-white selection:bg-nexus-500 selection:text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
