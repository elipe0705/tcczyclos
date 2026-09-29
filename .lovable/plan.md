# Plano — Front-end completo do ZYCLOS

## Objetivo
Construir uma aplicação multipágina completa e responsiva para o TCC ZYCLOS, com identidade própria, navegação funcional e interações simuladas. Todo o conteúdo será fictício e permanecerá apenas no navegador durante a sessão, sem banco de dados, autenticação real, pagamentos, APIs ou backend.

## Direção visual
- Aplicar exatamente a paleta fornecida: roxo principal `#6C218C`, roxo secundário `#BD6ADB`, laranja `#F68F0C` e cinza claro `#E9E9E9`, convertida em cores semânticas do sistema visual.
- Criar uma estética editorial de moda circular: limpa, moderna, confiável e comunitária, com bastante respiro, cantos moderados, sombras suaves e animações discretas.
- Criar uma marca tipográfica simples para ZYCLOS e usar uma combinação tipográfica contemporânea, sem aparência genérica de loja virtual.
- Gerar um conjunto coerente de imagens locais de roupas, calçados, acessórios e moda sustentável para preencher a experiência sem depender de links externos.
- Adaptar de verdade todos os fluxos para desktop, notebook, tablet e celular, incluindo menu, filtros, tabelas, chat e formulários.

## Estrutura compartilhada
- Criar cabeçalho global com logo, busca funcional, Início, Anúncios, Trocas, Mensagens, Notificações e Perfil; no celular, transformar a navegação em menu compacto.
- Criar navegação administrativa separada, com identidade visual claramente distinta da área comum.
- Criar componentes reutilizáveis para botões, campos, seletores, busca, cards de produto e usuário, filtros, avaliações, badges, abas, modais, confirmações, notificações, estados vazios/carregando e tabelas administrativas.
- Centralizar os dados fictícios de produtos, usuários, categorias, mensagens, notificações, trocas, avaliações, denúncias e relatórios.
- Incluir feedback visual, foco acessível, rótulos, textos alternativos, breadcrumbs quando úteis e estados de sucesso, erro, vazio, favorito, seleção e desabilitado.

## Páginas da área do usuário
- **Login e cadastro:** formulários completos, validações visuais, mostrar senha, lembrar usuário, recuperação visual, Google simulado, foto de perfil e redirecionamento local após envio.
- **Home:** apresentação “Moda que continua em movimento”, imagem de moda sustentável, ações para explorar e vender, pilares Compre/Venda/Troque/Sustentabilidade, categorias clicáveis, anúncios em destaque e indicadores demonstrativos.
- **Anúncios:** catálogo com quantidade, ordenação, busca e filtros funcionais por categoria, marca, tamanho, preço, condição, estilo e tipo de negociação; filtros adaptados a painel móvel e estado sem resultados.
- **Produto:** galeria, informações completas, vendedor, tags, localização e ações simuladas de compra, proposta, troca, conversa e favorito.
- **Perfil:** foto, nome, usuário, reputação, seguidores, data de entrada, botões Seguir/Chat e abas de anúncios, avaliações e sobre.
- **Favoritos e notificações:** páginas preenchidas, coração com estado local e notificações com leitura visual.
- **Mensagens:** lista de conversas e chat em duas colunas no desktop, fluxo adaptado no celular e envio local de novas mensagens.
- **Trocas:** abas de ofertas, propostas e histórico; modal para escolher a peça oferecida, comparação das duas peças e confirmação de proposta enviada.
- **Criar anúncio:** fluxo em quatro etapas — informações, fotos com prévia local, preço conforme negociação e revisão — com publicação simulada.
- **Editar anúncio:** formulário preenchido, troca de fotos e ações simuladas de salvar, cancelar e excluir.
- **Configurações:** perfil, preferências, notificações, segurança e aparência, usando controles visuais locais.

## Área administrativa
- **Dashboard:** indicadores, gráficos mockados, anúncios recentes e atividade recente.
- **Anúncios:** tabela pesquisável e filtrável com estados e ações visuais.
- **Usuários:** pesquisa, filtros, tabela e ações de visualizar, editar, suspender e ativar.
- **Categorias:** listagem com contagem, status, datas, ações e modal para adicionar categoria localmente.
- **Denúncias:** listagem com motivo, anúncio, usuário, data, status e ações de visualizar, resolver e arquivar.
- **Relatórios:** gráficos e indicadores filtráveis por hoje, 7 dias, 30 dias e 12 meses.
- **Configurações administrativas:** controles demonstrativos sem configuração real de servidor.

## Navegação e interações
- Implementar todas as páginas solicitadas em URLs próprias, incluindo detalhes por produto/usuário e edição por anúncio, com metadados exclusivos em cada página.
- Fazer busca, categorias, cards, botões e menus levarem aos destinos corretos.
- Manter favoritos, filtros, mensagens, propostas, seguidores, formulários, modais e alterações administrativas em estado local durante a sessão.
- Usar gráficos e ícones consistentes já disponíveis no projeto.

## Validação final
- Verificar a experiência principal ponta a ponta: entrada simulada, busca e filtros, produto, favorito, mensagem, troca, criação/edição de anúncio e principais ações administrativas.
- Conferir visualmente telas largas e celulares, garantindo que textos, controles, imagens, tabelas, chat e menus não se sobreponham.
- Confirmar que todas as páginas abrem, os dados mockados aparecem, as ações dão feedback e a aplicação não contém chamadas externas nem funcionalidades persistentes.

## Detalhes técnicos
- Manter a base atual em React, TypeScript, Vite e TanStack Router, equivalente ao roteamento React solicitado e compatível com o projeto existente.
- Organizar a implementação em páginas, layouts, componentes, dados e recursos visuais reutilizáveis.
- Registrar as decisões estruturais do front-end no guia técnico do projeto.
