# ZYCLOS — Roteiro de gravação (o que filmar, cena por cena)

Este é o roteiro de **gravação de tela**: o que abrir, onde clicar e quanto tempo deixar cada coisa na tela.
As falas são escritas por outro integrante e narradas depois, por cima do vídeo. Por isso: **grave devagar**,
sem falar, e pare alguns segundos em cada tela (a narração precisa de tempo).

| Bloco | Quem grava | Duração do vídeo |
| --- | --- | --- |
| A. Slide de abertura | **Paty** | ~1 min 30 s |
| B. Tour pelo site | **Felipe** | ~2 min 30 s |
| C. CRUD com o banco + painel admin | **Japa (Guilherme)** | ~3 min |
| D. Encerramento | **Paty** | ~20 s |

---

## Preparação (Felipe e Japa, antes de gravar)

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

## Bloco B — Tour pelo site (Felipe, aba 2: Luiz Felipe)

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

---

## Bloco C — CRUD com o banco + painel admin (Japa, aba 1: Equipe ZYCLOS + aba 3: Supabase)

| Cena | Ação | Deixar na tela |
| --- | --- | --- |
| C1 | Na aba 1, menu do usuário → **Painel administrativo** | 4 s |
| C2 | Menu lateral → **Categorias**. Mostrar a lista (5 categorias) | 5 s |
| C3 | Ir à **aba 3 (Supabase)**, tabela `categoria`, mostrando as mesmas 5 linhas | 5 s |
| **Criar** | | |
| C4 | Aba 1: **Adicionar categoria** → digitar o nome **Moda Praia** devagar (o slug se preenche sozinho) | 6 s |
| C5 | Clicar em **Criar categoria**. Mostrar o aviso "Categoria criada." e a linha nova na lista | 4 s |
| C6 | Aba 3: clicar em **Refresh** no Supabase. Passar o mouse sobre a linha **Moda Praia** | 6 s |
| **Alterar** | | |
| C7 | Aba 1: **Editar** na linha Moda Praia → escrever a descrição "Biquínis, sungas e saídas de praia" → **Salvar alterações** | 8 s |
| C8 | Aba 3: **Refresh**. Mostrar a descrição nova na coluna `descricao` | 6 s |
| **Excluir** | | |
| C9 | Aba 1: **Excluir** na linha Moda Praia → confirmar **Excluir** na janela | 5 s |
| C10 | Aba 3: **Refresh**. Mostrar que voltaram a ser só 5 linhas | 6 s |
| **Painel admin** | | |
| C11 | Aba 1: **Dashboard**. Mostrar os 4 números, o gráfico e a atividade recente | 10 s |
| C12 | **Anúncios** (menu lateral). Rolar a tabela devagar | 6 s |
| C13 | **Usuários**. Rolar a tabela | 6 s |
| C14 | **Denúncias** → **Analisar** → status **Rejeitada** → resposta "Denúncia de teste do sistema" → **Salvar análise**. Mostrar o selo do status mudando | 12 s |
| C15 | **Relatórios**. Clicar em **7 dias**, **30 dias** e **Tudo**, parando em cada um | 12 s |

Se errar no CRUD (ex.: digitar errado), excluir a categoria criada e gravar o bloco C de novo, do C2.

---

## Bloco D — Encerramento (Paty)

| Cena | O que mostrar | Tempo na tela |
| --- | --- | --- |
| D1 | Página inicial do site (ou slide final) com a frase "Dar uma nova vida para uma peça também é cuidar do planeta" | 10 s |
| D2 | Slide final: logo ZYCLOS, ODS 12 e nomes do grupo | 10 s |

---

## Montagem (Clipchamp ou CapCut)

1. Ordem: A → B → C → D.
2. Cortar o início e o fim de cada gravação (quando aparece o Win+G).
3. Colocar a narração por cima e ajustar: onde a fala for mais longa, deixar a cena parada mais tempo
   (congelar o quadro); onde for mais curta, acelerar a cena em 1,25x a 1,5x.
4. Transição curta (fade) entre os blocos.
5. Exportar em 1080p e assistir inteiro antes de entregar.
