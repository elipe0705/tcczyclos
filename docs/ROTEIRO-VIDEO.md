# ZYCLOS — Roteiro de gravação do vídeo (meta: 7 a 8 minutos)

| Parte | Quem | Tempo |
| --- | --- | --- |
| 1. Slide de abertura | **Paty** | ~1 min 30 s |
| 2. Tour pelo site | **Felipe** | ~2 min 30 s |
| 3. CRUD + painel admin | **Japa (Guilherme)** | ~3 min |
| 4. Fechamento com a frase de efeito | **Paty** | ~20 s |

Cada um grava a sua parte separado; depois juntem tudo num arquivo só (Clipchamp ou CapCut).

## Antes de gravar (Felipe e Japa)

- API e site rodando (`.\mvnw.cmd spring-boot:run` na raiz e `npm run dev` em `frontend`).
- Aba 1 logada como **Equipe ZYCLOS** (conta ADMIN `elipe07.`) — sair e entrar de novo para o nome novo
  aparecer. Aba 2 logada como **Luiz Felipe** (conta `elipe`). Nos dois logins, **sem** "Lembrar de mim".
- Supabase aberto em outra aba: Table Editor → `categoria`.
- Navegador em tela cheia (F11), zoom 100%. Gravador: Win+G (ou OBS). Testar o microfone.

---

## Parte 1 — Slide de abertura (Paty)

Tela: slide com as cores do ZYCLOS.

> "Olá! Nós somos o grupo do **ZYCLOS**, uma plataforma de **moda circular**, onde as pessoas podem **comprar,
> vender e trocar** roupas e acessórios usados, de pessoa para pessoa.
>
> **Nosso objetivo** é prolongar a vida útil das peças: o que está parado no guarda-roupa de alguém pode ser
> exatamente o que outra pessoa procura.
>
> **A justificativa:** a indústria da moda produz muito, e muitas roupas em bom estado são descartadas cedo.
> Reutilizar diminui a produção de roupas novas e o descarte.
>
> Por isso o ZYCLOS está ligado à **ODS 12 da ONU — Consumo e Produção Responsáveis**, que tem como meta
> reduzir resíduos por meio do reúso.
>
> Agora vamos mostrar o site funcionando."

---

## Parte 2 — Tour pelo site (Felipe)

Tela: aba 2, logada como **Luiz Felipe**.

1. **Página inicial** — "Essa é a página inicial do ZYCLOS: categorias, anúncios em destaque e os números reais
   do catálogo."
2. **Sobre** (menu) — "Na página Sobre, o site mostra o objetivo, a justificativa e a nossa ligação com a ODS 12."
3. **Anúncios** (usar a busca e um filtro) — "No catálogo dá para buscar e filtrar por categoria, tipo de
   negociação, tamanho e condição. Alguns anúncios são exemplos que usamos para demonstrar o sistema."
4. **Tênis Asics GEL-NYC** — "Na página da peça aparecem as informações, o vendedor com a avaliação e os
   botões Tenho interesse, Propor troca e Conversar."
5. **Mensagens** (abrir a conversa) — "Quando alguém se interessa, abre uma conversa. Aqui a Equipe ZYCLOS
   perguntou sobre o tênis e eu respondi. As mensagens ficam salvas no banco de dados."
6. **Notificações** (sino) — "O sino avisa quando chega uma mensagem, uma proposta de troca ou um novo seguidor."
7. **Meu perfil** — "Cada usuário tem o seu perfil, com os anúncios, os seguidores e as avaliações. Agora o
   Japa vai mostrar a parte administrativa e o banco de dados."

---

## Parte 3 — CRUD e painel admin (Japa / Guilherme)

Tela: aba 1, logada como **Equipe ZYCLOS**, e a aba do Supabase.

1. **Painel administrativo** (menu do usuário) — "Esse é o painel administrativo, que só aparece para contas
   de administrador."
2. **CRUD de categorias** (`/admin/categorias`):
   - **Criar:** "Adicionar categoria" → "Moda Praia" → Criar. — "Vamos **cadastrar** uma categoria nova."
     Ir ao Supabase e atualizar. — "No banco, na tabela `categoria`, o registro Moda Praia foi criado."
   - **Alterar:** "Editar" → descrição "Biquínis, sungas e saídas de praia" → Salvar. — "Agora vamos
     **alterar** a descrição." Supabase, atualizar. — "A alteração foi gravada no banco."
   - **Excluir:** "Excluir" → confirmar. — "Por fim, vamos **excluir** o registro." Supabase, atualizar. —
     "E ele não existe mais na tabela. Esse é o CRUD completo funcionando com o banco de dados."
3. **Dashboard** — "Aqui o administrador acompanha os números reais do site e o crescimento por mês."
4. **Usuários** — "Todas as contas cadastradas."
5. **Denúncias** → "Analisar" → status **Rejeitada** → resposta "Denúncia de teste do sistema" → Salvar. —
   "Quando alguém denuncia um anúncio, a moderação analisa e responde por aqui."
6. **Relatórios** (trocar o período) — "E os relatórios mostram a atividade da comunidade no período escolhido."

---

## Parte 4 — Fechamento (Paty)

Tela: slide final (ou a página inicial do site).

> "Esse é o ZYCLOS: moda circular, consciente e de pessoa para pessoa. Porque **dar uma nova vida a uma peça
> também é cuidar do planeta**. Obrigado!"

---

## Dicas

- Fale com calma, mexa o mouse devagar e pare um segundo em cada tela.
- Errou? Regrave só aquele trecho.
- O ID da categoria criada pode ser 7 ou maior: o banco não reaproveita IDs apagados (normal).
