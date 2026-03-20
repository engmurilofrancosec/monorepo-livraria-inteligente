# Gerenciador de Livros (Minha Livraria)
Gerenciador de biblioteca pessoal com assistente de IA resiliente e design premium.

## ✨ Destaques
- **IA Multimodal & Resiliente**: Assistente inteligente (Groq + Gemini fallback) para gestão total via chat.
- **Design Premium**: Tema Dark moderno com animações fluidas (Framer Motion).
- **Arquitetura Sólida**: Backend em Arquitetura Hexagonal e Frontend inspirado em DDD.
- **Documentação Viva**: Storybook para todos os componentes visuais.
- **Requisitos**: Node.js 25.x (v25.8.0+ recomendado).

## Documentação do Projeto

Para entender mais profundamente o projeto, acesse:
- **[Visão de Negócio (BUSINESS.md)](./BUSINESS.md)**: fluxos principais.
- **[Arquitetura Técnica (TECHNICAL.md)](./TECHNICAL.md)**: Detalhes sobre a Arquitetura Hexagonal, DDD, fallback de IA e stack.


## Como Executar o Projeto

### 1. Iniciar o Banco de Dados
Certifique-se de ter o Docker rodando em sua máquina e inicialize o contêiner do Postgres:
```bash
docker-compose up -d
```

### 2. Configurar e Instalar
Na raiz do projeto, instale as dependências e execute o comando de configuração unificada:
```bash
npm install
npm run all
```

### 3. Sincronizar Banco e Iniciar
```bash
cd backend && npx prisma db push && cd ..
npm run dev
```

### 4. Storybook (Documentação de Componentes)
Visualize todos os componentes da interface em isolamento:
```bash
cd frontend && npm run storybook
```

### 5. Executar Testes Automatizados
O projeto conta com suítes de teste de integração e unidade nas duas frentes:
```bash
cd frontend && npm run test
cd backend && npm run test
```
