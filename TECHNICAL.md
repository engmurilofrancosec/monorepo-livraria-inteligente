# Gerenciador de Livros - Technical Documentation

## Arquitetura

### Backend (Arquitetura Hexagonal)
O backend segue os princípios da **Arquitetura Hexagonal (Ports and Adapters)** para garantir desacoplamento total da regra de negócio em relação a tecnologias externas.

- **Domain**: Contém as entidades de negócio (`Book`) e as interfaces (`Ports`) dos repositórios.
- **Application**: Contém os casos de uso (Usecases) que orquestram a lógica da aplicação e centralizam os `Services`.
- **Infrastructure**: Implementações concretas de banco de dados e servidores (utilizando **Prisma ORM** conectado ao **PostgreSQL**).
- **Adapters**: Controladores Express e adaptadores de IA (**Gemini** e **Groq**).
- **Core AI**: Localizado em `application/services/AiService.ts`, orquestra múltiplos provedores com fallback automático.

### Frontend (Clean Architecture / DDD)
O frontend utiliza **Next.js 15** com uma estrutura inspirada em DDD (Domain-Driven Design).

- **Domain**: Modelos e tipos transversais.
- **Application**: Hooks customizados para abstrair chamadas de API e lógica de estado.
- **UI**: Componentes puramente visuais utilizando Tailwind CSS e Shadcn/UI.

## Stack Tecnológica
- **Linguagem**: TypeScript (Strict Mode)
- **Frontend**: Next.js 15, Shadcn/UI, Tailwind CSS, Framer Motion (Drag and drop).
- **Backend**: Node.js, Express, Prisma ORM.
- **Stack de IA**: 
  - **Primário**: Groq (Llama-3.3-70b-versatile).
  - **Secundário (Fallback)**: Google Gemini 1.5/2.5 Flash.
- **Banco de Dados**: PostgreSQL local via Docker Compose (ou Nuvem).
- **Testes**: `Jest` e `Supertest` (Backend) + `Vitest` e `@testing-library/react` (Frontend).
- **Documentação de Componentes**: Storybook 10.

## Segurança
1. **Sanitização de Inputs**: Todas as entradas via chat passam por validação estrutural antes de atingir o domínio.
2. **AI Guardrails**: O prompt do Gemini é configurado para recusar comandos fora do escopo de "Gestão de Livros" e evitar injeção de comandos maliciosos.
3. **Desacoplamento de Dados**: A camada de domínio não conhece detalhes de persistência, evitando vazamento de lógica de banco para a aplicação.

## Como Rodar (Modo Monolito/Orquestrado)

Para facilitar o desenvolvimento, você pode rodar ambos os serviços com um único comando a partir da raiz do projeto.

### 1. Preparação
```bash
npm install
npm run install:all
```

### 2. Execução Unificada
```bash
# Instala tudo (Root, Backend, Frontend + Storybook) e configura .env
npm install
npm run all

# Sobe Backend (3001) e Frontend (3000) simultaneamente
npm run dev
```

---

## Como Rodar (Modo Independente)

### 1. Configurar o Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Configurar o Frontend
```bash
cd frontend
npm install --legacy-peer-deps
# Crie o arquivo .env com a URL do backend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env
npm run dev
```

### 3. Documentação de Componentes (Storybook)
O projeto utiliza Storybook para visualização e teste isolado de componentes.
```bash
cd frontend
npm run storybook
```
Acesse em: `http://localhost:6006`


## Detalhes Técnicos

### IA & Resiliência (SOLID)
O sistema utiliza um padrão de **Estratégia e Coordenador** para gerenciar a IA:

1. **IA Port (`IAiProvider`)**: Interface comum para todos os provedores.
2. **Adapters**:
   - `GeminiAdapter`: Implementação nativa via SDK do Google.
   - `GroqAdapter`: Implementação via REST (xAI) para contingência.
3. **Fallback Automático**: O `AiService` tenta o motor principal (Groq) e, em caso de erro, aciona o Gemini como contingência.

**Guardrails**: O prompt de sistema é compartilhado entre todos os provedores para garantir comportamento idêntico, forçando a IA a agir apenas como gestor de livros e recusar comandos fora de escopo.

### Arquitetura Hexagonal (Backend)
- **Entities**: Definem o contrato de dados puro.
- **Repositories**: Interfaces que definem como os dados são acessados.
- **Use Cases**: Lógica de aplicação pura, independente de Express ou Gemini.
- **Adapters**: IA e HTTP se encontram com as regras de negócio.

### DDD (Frontend)
- **Layered UI**: Componentes desacoplados da lógica de API.
- **Infrastructure**: Clientes de API tipados.
- **Domain**: Tipagem compartilhada para garantir integridade em toda a aplicação.

