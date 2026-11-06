# ZYCLOS — Roteiro de gravação (o que filmar, cena por cena)

Este é o roteiro de **gravação de tela**: o que abrir, onde clicar e quanto tempo deixar cada coisa na tela.
As falas são escritas por outro integrante e narradas depois, por cima do vídeo. Por isso: **grave devagar**,
sem falar, e pare alguns segundos em cada tela (a narração precisa de tempo).

| Bloco | Quem grava | Duração do vídeo |
| --- | --- | --- |
| A. Slide de abertura | **Paty** | ~1 min 30 s |
| B. Tour pelo site | **Japa (Guilherme)** | ~2 min 30 s |
| C. Área administrativa | **Japa (Guilherme)** | ~1 min 30 s |
| D. CRUD com o banco de dados (a parte mais importante e mais difícil) | **Felipe** | ~2 min |
| E. Encerramento | **Paty** | ~20 s |

--- | --- | --- |
| A. Slide de abertura | **Paty** | ~1 min 30 s |
| B. Tour pelo site | **Felipe** | ~2 min 30 s |
| C. CRUD com o banco + painel admin | **Japa (Guilherme)** | ~3 min |
| D. Encerramento | **Paty** | ~20 s |

---

## Preparação (Japa e Felipe, antes de gravar)

1. API e site rodando: `.\mvnw.cmd spring-boot:run` na raiz e `npm run dev` em `frontend`.
2. **Aba 1:** entrar como **Equipe ZYCLOS** (conta ADMIN `elipe07.`). Se o cabeçalho ainda mostrar o nome
   antigo, sair e entrar de novo.
3. **Aba 2:** entrar como **Luiz Felipe** (conta `elipe`). Nos dois logins, **sem** "Lembrar de mim".
4. **Aba 3:** Supabase → Table Editor → tabela `categoria`.
5. Fechar as outras abas e programas com notificação (WhatsApp, Discord). Navegador em tela cheia (**F11**),
   zoom **100%**.
6. Gravador: **Win+G** → Capturar (ou OBS), resolução 1920×1080. Microfone pode ficar desligado.
7. Mouse sempre devagar. Antes de cada clique, parar o cursor em cima do botão por ~1 s.

---

## Bloco A — Slide de abertura (Paty)

| Cena | O que mostrar | Tempo na tela |
| --- | --- | --- |
| A1 | Slide de capa: logo e nome **ZYCLOS** | 8 s |
| A2 | Slide do **objetivo** | 20 s |
| A3 | Slide da **justificativa** | 25 s |
| A4 | Slide da **ODS 12 — Consumo e Produção Responsáveis** | 25 s |
| A5 | Slide de transição ("Conheça o site") | 5 s |

Gravar o slide em tela cheia (modo apresentação), trocando de slide só quando o tempo indicado passar.

---

## Bloco B — Tour pelo site (Japa, aba 2: Luiz Felipe)

| Cena | Ação | Deixar na tela |
| --- | --- | --- |
| B1 | Abrir `localhost:5173`. Parado no topo da página inicial (foto e frase principal) | 6 s |
| B2 | Rolar devagar até as **categorias** e os **anúncios em destaque** | 8 s |
| B3 | Rolar até a faixa laranja com os **números** e o selo **ODS 12** | 5 s |
| B4 | Clicar em **Sobre** no menu. Rolar devagar: objetivo → justificativa → bloco laranja da ODS 12 → "Como funciona" | 20 s |
| B5 | Clicar em **Anúncios**. Digitar "tênis" na busca, devagar. Depois apagar a busca | 8 s |
| B6 | Na lateral, clicar numa **categoria** (ex.: Calçados) e depois em **Limpar filtros** | 8 s |
| B7 | Abrir o anúncio **Tênis Asics GEL-NYC**. Mostrar foto, preço, informações e o cartão do vendedor (avaliação) | 10 s |
| B8 | Passar o mouse (sem clicar) sobre **Tenho interesse**, **Propor troca** e **Conversar** | 6 s |
| B9 | Clicar em **Mensagens**. Abrir a conversa com a **Equipe ZYCLOS** e mostrar as duas mensagens | 10 s |
| B10 | Clicar no **sino** (Notificações) e mostrar a lista | 6 s |
| B11 | Menu do usuário → **Meu perfil**. Mostrar nome, números e a aba **Anúncios** | 8 s |
| B12 | Clicar na aba **Avaliações** e depois em **Sobre** do perfil | 6 s |

Não clicar em "Tenho interesse", "Propor troca" nem "Conversar", para não criar conversas ou propostas novas.

Terminar a cena B12 parado, para emendar com o bloco C.

---

## Bloco C — Área administrativa (Japa, aba 1: Equipe ZYCLOS)

Mostra o painel que só a conta de administrador vê. **Não mexer em Categorias aqui**: o CRUD é o bloco D.

| Cena | Ação | Deixar na tela |
| --- | --- | --- |
| C1 | Na aba 1 (cabeçalho mostrando **Equipe ZYCLOS**), abrir o menu do usuário e passar o mouse em **Painel administrativo** | 3 s |
| C2 | Clicar em **Painel administrativo**. Mostrar o menu lateral e o nome no topo | 4 s |
| C3 | **Dashboard**: parar nos 4 números (anúncios, usuários, trocas, denúncias) | 6 s |
| C4 | Rolar até o gráfico **Crescimento da comunidade** e passar o mouse sobre a barra do mês atual | 6 s |
| C5 | Mostrar **Atividade recente** e a tabela **Anúncios recentes** | 6 s |
| C6 | Menu lateral → **Anúncios**. Rolar a tabela; digitar "tênis" na busca e apagar | 8 s |
| C7 | Menu lateral → **Usuários**. Rolar a tabela (nome, e-mail, tipo, status) | 6 s |
| C8 | Menu lateral → **Denúncias** → **Analisar** → status **Rejeitada** → resposta "Denúncia de teste do sistema" → **Salvar análise**. Mostrar o selo do status mudando | 12 s |
| C9 | Menu lateral → **Relatórios**. Clicar em **7 dias**, **30 dias**, **12 meses** e **Tudo**, parando em cada um | 14 s |
| C10 | Menu lateral → **Categorias**. Só mostrar a lista e parar (gancho para o bloco D) | 4 s |

---

## Bloco D — CRUD com o banco de dados (Felipe, aba 1: Equipe ZYCLOS + aba 3: Supabase)

É o item que o professor exige: cadastrar pela página e mostrar no SQL, alterar e mostrar, excluir e mostrar.
Antes de começar: aba 1 em **Painel administrativo → Categorias**; aba 3 no Supabase, tabela `categoria`.
Ensaiar uma vez sem gravar (e excluir a categoria do ensaio).

| Cena | Ação | Deixar na tela |
| --- | --- | --- |
| D1 | Aba 1: lista de categorias (5 linhas) | 4 s |
| D2 | Aba 3 (Supabase): a tabela `categoria` com as mesmas 5 linhas | 5 s |
| **Criar** | | |
| D3 | Aba 1: **Adicionar categoria** → digitar **Moda Praia** devagar (o slug se preenche sozinho) | 6 s |
| D4 | Clicar em **Criar categoria**. Mostrar o aviso "Categoria criada." e a linha nova na lista | 4 s |
| D5 | Aba 3: **Refresh**. Parar o mouse na linha **Moda Praia** (id, nome, slug) | 7 s |
| **Alterar** | | |
| D6 | Aba 1: **Editar** na linha Moda Praia → descrição "Biquínis, sungas e saídas de praia" → **Salvar alterações** | 8 s |
| D7 | Aba 3: **Refresh**. Parar o mouse na coluna `descricao` com o texto novo | 7 s |
| **Desativar / ativar (opcional, mostra outro tipo de alteração)** | | |
| D8 | Aba 1: **Desativar** → o status vira **Inativa**. Aba 3: Refresh, `cod_status` = false. Voltar e clicar **Ativar** | 10 s |
| **Excluir** | | |
| D9 | Aba 1: **Excluir** na linha Moda Praia → confirmar **Excluir** na janela. Mostrar o aviso "Categoria excluída." | 5 s |
| D10 | Aba 3: **Refresh**. Mostrar que voltaram a ser só 5 linhas | 7 s |
| **Bônus: proteção do banco** | | |
| D11 | Aba 1: **Excluir** em **Calçados** → confirmar. Mostrar a mensagem de erro (não exclui categoria com anúncios) | 6 s |

Se errar no meio: excluir a categoria criada e gravar o bloco D de novo, desde o D1.

---

## Bloco E — Encerramento (Paty)

| Cena | O que mostrar | Tempo na tela |
| --- | --- | --- |
| E1 | Página inicial do site (ou slide final) com a frase "Dar uma nova vida para uma peça também é cuidar do planeta" | 10 s |
| E2 | Slide final: logo ZYCLOS, ODS 12 e nomes do grupo | 10 s |

---

## Montagem (Clipchamp ou CapCut)

1. Ordem: A → B → C → D → E.
2. Cortar o início e o fim de cada gravação (quando aparece o Win+G).
3. Colocar a narração por cima e ajustar: onde a fala for mais longa, deixar a cena parada mais tempo
   (congelar o quadro); onde for mais curta, acelerar a cena em 1,25x a 1,5x.
4. Transição curta (fade) entre os blocos.
5. Exportar em 1080p e assistir inteiro antes de entregar.
