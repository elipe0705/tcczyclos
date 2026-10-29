# ZYCLOS — Roteiro de testes manuais

Marque cada item ao testar. Se algo falhar, anote a tela, o que fez e a mensagem que apareceu.

## Antes de começar

- API ligada na raiz: `.\mvnw.cmd spring-boot:run` (esperar `Started ZyclosApplication`).
- Site ligado em `frontend/`: `npm run dev` e abrir `http://localhost:5173`.
- Contas: **A** e **B** (usuários comuns) e **ADMIN** (`lipinho070509@gmail.com`).
  Este roteiro grava dados reais no Supabase: use só contas autorizadas e apague depois o que for de teste.
- Para ver duas contas ao mesmo tempo: uma janela normal e outra anônima (a sessão fica separada).

## Parte 1 — Sem conta e sem dados (pode rodar a qualquer momento)

- [ ] Home abre; os números ("Anúncios ativos", "Categorias") batem com o banco (com 0 anúncios aparece 0).
- [ ] Sem anúncios: home e `/anuncios` mostram "Nenhum anúncio publicado ainda" (nada inventado).
- [ ] Categorias da home levam a `/anuncios` já filtrado.
- [ ] `/login` não oferece Google nem "esqueci a senha".
- [ ] Senha errada: "E-mail ou senha inválidos". 5 erros seguidos: aviso de bloqueio temporário.
- [ ] Rota que não existe (`/xyz`): página de erro em português.

## Parte 2 — Cadastro, login e sessão (contas A e B)

- [ ] Cadastrar A: entra direto e aparece "Conta criada".
- [ ] Cadastrar com e-mail ou username já usado: mensagem de erro (409) e nada é criado.
- [ ] Sair e entrar com "Lembrar de mim": fechar e abrir o navegador, continua logado.
- [ ] Entrar sem "Lembrar de mim": fechar a aba e abrir de novo, pede login.
- [ ] Recarregar a página logado (F5): continua logado na home.

## Parte 3 — Anúncios (conta A)

- [ ] Criar anúncio "Venda ou troca" com foto: aparece "publicado com sucesso".
- [ ] O anúncio aparece na home, no catálogo e em `/perfil`.
- [ ] Anúncio sem foto mostra "Sem foto" (não uma foto qualquer).
- [ ] Busca e filtros (categoria, tamanho, preço, tipo) do catálogo encontram o anúncio.
- [ ] Editar o anúncio: a alteração aparece no detalhe.
- [ ] Excluir o anúncio: some do catálogo (fica INATIVO no banco).
- [ ] Conta B abre `/editar-anuncio/<id do anúncio de A>`: não consegue salvar (erro de permissão).

## Parte 4 — Perfil, seguir e favoritos (conta B)

- [ ] `/perfil/<username de A>` mostra os dados reais de A (sem e-mail).
- [ ] Seguir A: contador de seguidores sobe. Deixar de seguir: desce.
- [ ] A recebe a notificação "novo seguidor".
- [ ] Favoritar o anúncio de A: aparece em favoritos e continua depois de recarregar.

## Parte 5 — Mensagens (A e B)

- [ ] B clica "Tenho interesse" no anúncio de A: abre a conversa em `/mensagens`.
- [ ] B envia mensagem; A vê o contador de não lidas e a notificação de mensagem.
- [ ] A abre a conversa: o contador some. A responde e B recebe.

## Parte 6 — Trocas (A e B, cada um com um anúncio que aceita troca)

- [ ] B, no anúncio de A, clica "Propor troca" e escolhe um anúncio próprio: "Proposta de troca enviada".
- [ ] A recebe a notificação e vê a proposta em `/trocas` (recebidas).
- [ ] A aceita: a proposta vai para o histórico como "Aceita" e B recebe a notificação "aceita".
- [ ] Repetir com outra proposta e recusar: B recebe "recusada".
- [ ] Uma proposta já respondida não volta a ter os botões aceitar/recusar.
- [ ] B cancela uma proposta pendente: ela some.

## Parte 7 — Perfil e denúncia

- [ ] A edita o nome em "Editar perfil": o novo nome aparece no cabeçalho.
- [ ] A tenta usar o username de B: erro de username já usado.
- [ ] B denuncia um anúncio de A: "Denúncia enviada".

## Parte 8 — Administração (ADMIN)

- [ ] `/admin` abre o dashboard com números reais.
- [ ] Anúncios e usuários: listas reais, com busca.
- [ ] Categorias: criar, editar, desativar e ativar.
- [ ] Categoria com nome ou slug repetido: erro 409.
- [ ] Excluir categoria que tem anúncios: erro 409, explicando que há anúncios ligados.
- [ ] Excluir categoria sem anúncios: some da lista e do catálogo.
- [ ] Denúncias: a denúncia da Parte 7 aparece; mudar o status e responder.
- [ ] Relatórios: trocar entre os períodos e conferir que os números mudam conforme as datas.
- [ ] Conta A (comum) em `/admin`: vê "Acesso restrito".

## Parte 9 — API desligada

- [ ] Parar a API (Ctrl+C no terminal dela) e recarregar home, catálogo, perfil, mensagens e `/admin`.
- [ ] Cada tela mostra erro com "Tentar novamente"; nenhum dado aparece.
- [ ] Ligar a API de novo e clicar "Tentar novamente": os dados voltam.

## Depois dos testes

- [ ] Excluir os anúncios, conversas e propostas criados só para teste (ou desativar as contas A e B).
