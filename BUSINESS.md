# Gerenciador de Livros - Business Documentation

## Visão Geral
O **Gerenciador de Livros** é uma solução inteligente para gestão de bibliotecas pessoais.

## User Personas
### O Leitor Ávido
- **Necessidade**: Catalogar centenas de livros rapidamente.
- **Dor**: Preguiça de digitar metadados (autor, categoria, etc.).
- **Solução**: Chatbot que extrai essas informações automaticamente de uma frase simples.

## Fluxos Principais
1. **Adição Inteligente**: "Acabei de começar a ler 'O Hobbit' do Tolkien".
   - O sistema identifica título, autor e coloca o status como "Lendo". Se faltarem dados, ele consulta e preenche.
2. **Consulta e Filtros**: "Quais livros de fantasia eu tenho?".
   - O chatbot filtra a base dinamicamente. Ele usa a ferramenta `list_books` proativamente.
3. **Gestão de Status e Metadados**: "Mude a nota de 'Clean Code' para 5".
   - Atualização instantânea da base de dados e do UI. O Assistente tem capacidades completas de atualizar *Qualquer Campo* (status, nota, descrição, e categoria).
4. **Organização Visual Lógica (Drag & Drop e IA)**: "Reordene meus livros do que tem a nota maior para a menor".
   - O Assistente aplica um novo índice visual (`orderIndex`) e os cards são reposicionados ao vivo. O usuário também pode fazer isso manualmente arrastando os livros na tela (Drag and Drop).
5. **Gestão Manual**: Caso o usuário prefira não usar o chat (que conta com botão flutuante ocultável no mobile), todos os livros podem ser criados, editados e excluídos através de Modais e botões interativos nos Cards.