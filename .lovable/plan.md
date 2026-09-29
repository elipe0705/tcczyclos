# Login funcional para integração futura

## Objetivo
Transformar as telas atuais de entrada e cadastro em um fluxo funcional de demonstração, mantendo tudo somente no front-end e sem criar banco de dados.

## O que será feito
- Criar um estado central de sessão simulada no contexto existente, com usuário, entrar, cadastrar e sair.
- Validar e-mail, senha, confirmação de senha, nome e nome de usuário antes de aceitar os formulários.
- Exibir mensagens claras para erros, carregamento e sucesso.
- Fazer “Lembrar de mim”, mostrar/ocultar senha e recuperação de senha funcionarem na demonstração.
- Após entrar ou cadastrar, atualizar a navegação para mostrar a conta ativa e oferecer a opção de sair.
- Preparar o formato do usuário com nome, nome de usuário, e-mail e foto para facilitar a futura ligação ao banco.
- Manter o botão do Google como demonstração explícita, sem conexão externa.
- Preservar a identidade visual preta, roxa e laranja e ajustar a composição da tela de login para ficar mais refinada em celular e computador.

## Limites
- Nenhum banco, autenticação real, API ou armazenamento persistente será criado.
- A sessão simulada será perdida ao recarregar a página.
- As páginas existentes não serão bloqueadas por login nesta etapa.

## Validação
- Testar entrada, cadastro, recuperação simulada, saída, erros de formulário e atualização da navegação.
- Conferir o resultado em computador e celular, além dos diagnósticos do projeto.
