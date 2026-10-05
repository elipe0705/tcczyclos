# Migração completa do ZYCLOS para JavaScript + JSX

## Objetivo
Converter o projeto existente de TypeScript/TSX para JavaScript/JSX sem recriar a aplicação e sem alterar telas, conteúdo, comportamento, navegação, responsividade ou identidade visual.

## Escopo da conversão
- Converter todos os 90 arquivos `.ts` e `.tsx` atuais em `src/` para `.js` e `.jsx`, incluindo páginas, componentes ZYCLOS, componentes de interface, contexto, dados mockados, hooks e utilitários.
- Remover tipagens, interfaces, aliases, genéricos, imports de tipos, assertions e sintaxe exclusiva do TypeScript, preservando exatamente a lógica JavaScript equivalente.
- Converter os pontos de entrada e configuração aplicáveis, incluindo `router`, `start`, `server` e `vite.config`.
- Atualizar referências internas, comentários de arquitetura e documentação de rotas para as novas extensões.

## Rotas e arquivos gerados
- Renomear as rotas mantendo exatamente a convenção e os caminhos atuais do TanStack Router.
- Configurar o gerador de rotas com `disableTypes` para produzir `src/routeTree.gen.js`.
- Regenerar a árvore de rotas pela ferramenta oficial; não editar manualmente o arquivo gerado.
- Confirmar que todas as páginas públicas e administrativas continuam acessíveis, inclusive parâmetros dinâmicos de anúncios e perfis.

## Configuração JavaScript
- Substituir `tsconfig.json` por configuração JavaScript compatível com JSX e com o alias `@/` existente.
- Ajustar ESLint e o registro do shadcn para JavaScript/JSX.
- Remover dependências usadas exclusivamente para TypeScript somente depois que nenhum arquivo ou configuração depender delas.
- Preservar o framework, bibliotecas, scripts de execução, estilos, imagens e ativos existentes.

## Preservação obrigatória
- Nenhuma mudança visual, de texto, dados mockados, fluxo, interação ou funcionalidade.
- Nenhum banco de dados, API, autenticação real ou serviço externo.
- A sessão demonstrativa continua somente em memória pelo contexto React atual.

## Validação
- Verificar que não restaram arquivos `.ts` ou `.tsx` em `src/` nem referências às extensões antigas.
- Executar lint e build, corrigindo erros de sintaxe, imports e geração de rotas.
- Percorrer todas as rotas em navegador automatizado e comparar telas-chave em computador e celular com registros visuais anteriores.
- Testar os fluxos centrais: catálogo e filtros, detalhes, favoritos, login/cadastro simulado, mensagens, criação de anúncio e área administrativa.
- Confirmar ausência de erros no navegador e que o projeto continua estritamente front-end.
