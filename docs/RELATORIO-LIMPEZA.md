# ZYCLOS — Relatório da limpeza de dados fictícios (para continuar no Claude Code)

Contexto para quem continuar: TCC ZYCLOS, marketplace de moda circular. Monorepo com API Spring Boot 3.5 / Java 21
na raiz (`br.com.zyclos`, Supabase PostgreSQL, JWT) e front-end React (TanStack Start + React Query, só JS/JSX) em
`frontend/`, conectado ao Lovable. Objetivo: tirar todo dado fictício/simulado do site antes da entrega.

## Onde está o código

- Todo o trabalho está na `main` (é a que sincroniza com o Lovable). Em 30/10/2026 a branch
  `claude/new-session-s1fq3s` foi juntada na `main` (fast-forward, sem conflitos) e depois apagada, no PC e no GitHub.
- Não fazer force-push, rebase nem amend (ver `frontend/AGENTS.md`).
- Commits, a partir de `fea4d8a`:
  1. `8be1df7` Fase 1 — API: `GET /usuarios/{id}/publico`, `GET /usuarios/publico/{username}`,
     `GET /avaliacoes/usuario/{id}` (públicas); edição de perfil valida campos e username repetido (409).
  2. `7625faa` Fase 2 — páginas públicas: catálogo sem mock (API fora do ar = erro com "Tentar novamente"),
     "Sem foto" no lugar de foto falsa, números reais na home, detalhe com avaliação real do vendedor,
     "Tenho interesse"/"Conversar" abrem conversa, "Propor troca" e "Denunciar" reais, perfis reais com seguir,
     login sem Google/recuperação de senha/termos falsos, páginas de erro em português.
  3. `6f729d5` Fase 3 — mensagens, trocas, notificações (com contador no sino) e "Editar perfil" reais; a API cria
     notificações (proposta recebida/aceita/recusada, novo seguidor, nova mensagem). Corrigido bug antigo: o login
     era desfeito logo depois de entrar (a página de login remontava e apagava o token).
  4. `f79561a` Fase 4 — painel admin real (guarda ADMIN, dashboard, anúncios, usuários, CRUD de categorias,
     denúncias, relatórios); removida a tela "Configurações administrativas". API: `PUT /categorias` grava
     `codStatus`; nome/slug repetido -> 409.
  5. `d5e489e` Fase 5 — apagados `src/data/mock.js` e as fotos de demonstração; READMEs, `AGENTS.md`,
     `.env.example` (tirado o "@" a mais da `DB_URL`) e `docs/requests/zyclos.http` atualizados.
  6. `a1c1b8d` Fase 6 — verificação final: o grep de termos fictícios em `frontend/src` não acha nada.
  7. `63a4858` Fase 7 — validação das respostas às propostas de troca, `show-sql` desligado, `.gitattributes` LF.
  8. `be7c92d` — apagado `frontend/roadmap.md`.
  9. `4103bfc` — `docs/sql/seed_demo.sql` no `.gitignore` (ver "O que já foi feito no banco").
- Verificado: `npm run lint` (0 erros, 8 avisos que já existiam), `npm run build`, `mvnw -DskipTests compile`,
  e testes de ponta a ponta com a API real num PostgreSQL local (schema de `docs/sql/zyclos_db_supabase.sql`).

## O que já foi feito no banco (Supabase, projeto `zyclos`)

- Projeto estava ativo (não precisou de Restore).
- Conta `elipe07.` (lipinho070509@gmail.com, id 4) virou `ADMIN`.
- Contas de teste `zyclos_teste1` e `zyclos_teste2` (ids 2 e 3) desativadas (`cod_status = false`).
  Desfazer: `update usuario set cod_status = true where id in (2, 3);`
- Dados de demonstração aplicados em 30/10/2026 com `docs/sql/seed_demo.sql` (rodado à mão no Supabase):
  2 contas comuns, `demo_anaclara` e `demo_bruno` (senha no próprio arquivo), e 10 anúncios ATIVO, 2 por
  categoria, cada um com 1 foto do Unsplash. Antes disso o banco tinha 0 anúncios.
  O arquivo está no `.gitignore` (tem senha conhecida) e existe só no PC; para recriá-lo em outra máquina é preciso
  copiá-lo. Para tirar a demonstração do site, rodar os dois `update` comentados no fim do script
  (desativam contas e anúncios, sem apagar).
- Conta `elipe` (ghostguedres@gmail.com, id 1) ainda tem senha em texto puro; vira hash no primeiro login dela.

## Onde paramos

Resolvido: o site mostrava "Não foi possível conectar ao servidor do ZYCLOS" porque a API não estava rodando.
- O `.env` na raiz está completo (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `ZYCLOS_JWT_SECRET` com 64 caracteres)
  e o Java é 21.
- Com `.\mvnw.cmd spring-boot:run` a API sobe em ~8 s. A porta 5432 do Supabase funciona na rede da escola
  (não precisa da 6543).
- `GET http://localhost:8080/api/v1/categorias` responde 200 com as categorias do banco. O front usa
  `http://localhost:8080/api/v1` e roda na 5173 (liberada no CORS).

Para usar o site, deixar três terminais abertos:
1. raiz do projeto: `.\mvnw.cmd spring-boot:run` (se fechar, a API cai);
2. `frontend`: `npm run dev` e abrir `http://localhost:5173`;
3. o `claude` (Claude Code). No Windows ele fica em `%USERPROFILE%\.local\bin`; se `claude` não for reconhecido,
   adicionar essa pasta ao PATH do usuário ou rodar `& "$env:USERPROFILE\.local\bin\claude.exe"`.

## Situação em 06/11/2026, à tarde (conferida direto no Supabase)

- Catálogo: 10 anúncios de demonstração ativos + **1 anúncio real** ("Tenis Asic GEL NYC", conta `elipe`).
  Faltam 5 reais para chegar a 6 e poder tirar a demonstração (passo 3).
- Senhas: **0 contas sem hash** (a conta `elipe` entrou). **Passo 4 feito**: a migração temporária foi removida
  do `UsuarioService`; senha gravada que não seja hash BCrypt nunca libera o login. `mvnw test` passou.
- Contas: `elipe` (USUARIO), `elipe07.` (ADMIN), `elipe078765.` (USUARIO, id 5, nova), `demo_anaclara` e
  `demo_bruno` (ativas), `zyclos_teste1` e `zyclos_teste2` (desativadas).
- Segurança: a troca da senha do banco e do `ZYCLOS_JWT_SECRET` (item 0 abaixo) ainda não foi confirmada.

## Divisão da gravação (06/11/2026, noite)

Roteiro de gravação de tela (cenas, cliques e tempos, sem falas) em `docs/ROTEIRO-VIDEO.md`. As falas são
escritas por outro integrante e narradas depois, por cima do vídeo.
- A. Slide de abertura (objetivo, justificativa, ODS 12): **Paty**.
- B. Tour pelo site (conta Luiz Felipe): **Japa (Guilherme)**.
- C. Área administrativa (conta Equipe ZYCLOS: Dashboard, Anúncios, Usuários, Denúncias, Relatórios):
  **Japa (Guilherme)**.
- D. CRUD de categorias com o Supabase aberto ao lado (criar, alterar, excluir; bônus: excluir categoria com
  anúncios dá erro): **Felipe**.
- E. Encerramento com a frase de efeito: **Paty**.

Problema visto ao gravar: o painel admin mostrou "Não foi possível conectar ao servidor do ZYCLOS" porque a API
tinha parado. Solução: subir de novo (`.\mvnw.cmd spring-boot:run` num terminal só dela, esperar
`Started ZyclosApplication`) e clicar em "Tentar novamente". Se a API foi iniciada por uma sessão do Claude Code,
ela cai quando a sessão fecha. Depois de mudar o nome da conta ADMIN para "Equipe ZYCLOS", é preciso sair e
entrar de novo para o cabeçalho atualizar.

## Preparação para gravar o vídeo (06/11/2026, noite)

Ensaio feito pelo Claude do Chrome com a conta ADMIN: os 4 passos do roteiro funcionaram (Sobre; Início →
Anúncios → detalhe → Mensagens → Trocas; CRUD de categoria conferido no Supabase; Dashboard, Denúncias e
Relatórios). A categoria de teste foi apagada (por isso a próxima categoria criada terá id 7).

Preparado no Supabase / pelo site:
- Conversa real sobre o "Tênis Asics GEL-NYC": a conta ADMIN mandou "Tenho interesse" e a conta `elipe`
  respondeu. As notificações dos dois lados apareceram.
- Nome de exibição da conta ADMIN (`elipe07.`) agora é **"Equipe ZYCLOS"** (para não parecer a mesma pessoa
  dos dois lados da conversa). Notificações gravadas com o nome antigo foram ajustadas. Para o cabeçalho
  mostrar o nome novo, sair e entrar de novo nessa conta.
- Decisões do dono: rodapé "Técnico em Informática, ITB Belval" está certo; os anúncios de demonstração
  ficam no catálogo para a gravação, avisando no vídeo que são exemplos.
- A única proposta de troca é de `elipe` para `demo_bruno` (por isso a aba Trocas da conta ADMIN fica vazia).
  A denúncia existente é de contas de teste antigas: no vídeo, usar em Denúncias → "Analisar" → status
  Rejeitada, resposta "Denúncia de teste do sistema" (mostra a moderação sem inventar denúncia).

Para gravar, deixar abertos: aba 1 com a conta ADMIN, aba 2 com `elipe` (os dois logins sem "Lembrar de mim",
senão as abas dividem a mesma conta) e o Supabase em Table Editor → `categoria`. Ordem: Sobre → site
(Anúncios, Tênis Asics, Mensagens, Notificações) → CRUD de categorias com o Supabase → admin (Dashboard,
Usuários, Denúncias, Relatórios) → fechamento com a ODS 12.

Falta: **gravar o vídeo**; depois da entrega, trocar a senha do banco, o `ZYCLOS_JWT_SECRET` e a senha da conta
`elipe`.

## Onde paramos em 06/11/2026, à noite (PC de casa)

PC de casa: projeto em `C:\Users\GTECH ELIPÊ\tcczyclos`, na `main` atualizada, com `.env` na raiz (a senha do
banco foi corrigida e a API sobe). `git status` limpo.

Feito hoje à noite (já na `main`):
- **Site pelo IP da rede local** (commit `a39887f`): sem `VITE_API_URL`, o site chama a API na porta 8080 do
  mesmo endereço em que foi aberto (`localhost` ou o IP do PC, ex.: `192.168.15.6`); a API aceita (CORS) origens
  `localhost`, `127.0.0.1`, `192.168.*`, `10.*` e `172.*` nas portas 5173/3000/8686. Não criar
  `frontend\.env` com `VITE_API_URL=localhost`: isso força o endereço antigo.
- **Site por túnel para outra rede** (commits `c0c34ac` e `0b7b9c9`): o Vite aceita `*.trycloudflare.com` e
  repassa `/api` para `localhost:8080` sem o cabeçalho `Origin` (senão o login dava 403). Aberto por um
  endereço com nome, o site chama `/api/v1` no próprio link. Testado: carregou e o login funcionou.

Como mostrar o site para quem está em outra rede:
1. Terminal 1, na raiz: `.\mvnw.cmd spring-boot:run` (esperar `Started ZyclosApplication`).
2. Terminal 2, em `frontend`: `npm run dev`.
3. Terminal 3: `npx cloudflared tunnel --url http://localhost:5173` e mandar o link
   `https://....trycloudflare.com` que aparece no quadro (só no privado).
4. Os três terminais e o PC ficam ligados enquanto usam; reiniciar o túnel gera um link novo. Fechar com Ctrl+C.

Erros vistos e a causa:
- "Não foi possível conectar" abrindo por `192.168.15.6:5173`: CORS antigo (corrigido em `a39887f`).
- "Erro 403 ao acessar /api/v1/usuarios/login" pelo túnel: `Origin` repassado (corrigido em `0b7b9c9`).
- "Blocked request. This host is not allowed": site rodando na versão antiga (`git pull` e reiniciar o site).
- `password authentication failed`: `DB_PASSWORD` errada no `.env`.
- `jdbcUrl, ${DB_URL}`: `.env` ausente na pasta do projeto (na escola o perfil pode virar `rm99692.FIEB.000`).
- Login falhando: conferir o e-mail digitado (`gmail.com`, não `gmal.com`).

Falta:
1. **Gravar o vídeo da entrega** (roteiro em "Entrega final: vídeo").
2. Anúncios reais (hoje 1 real e 10 de demonstração). Com 6+ reais, tirar a demonstração (passo 3).
3. Confirmar o texto do rodapé ("Técnico em Informática, ITB Belval").
4. Depois da entrega: trocar a senha do banco e o `ZYCLOS_JWT_SECRET`, e a senha da conta `elipe` (ela
   apareceu em print durante os testes).

## Onde paramos em 06/11/2026, à tarde (para terminar em casa)

Já está na `main` e no Supabase (não refazer):
- `/sobre` com objetivo, justificativa e ODS 12 (link no menu e no rodapé).
- Logo: fora do Lovable aparece o ícone + "ZYCLOS"; foto principal sem cortar a cabeça.
- Patch "Acabamento visual para a entrega do TCC" (commit `9f96139`): contraste, categorias com foto e contagem,
  selo ODS 12 na home, cartões de carregamento, rodapé no fim da página com crédito do TCC, lista de UF nos
  formulários, sem "Favoritar" no próprio anúncio.
- Migração de senhas em texto puro removida (0 contas sem hash).
- Supabase: anúncio 11 corrigido ("Tênis Asics GEL-NYC", estado `SP`) e nome do usuário 1
  "Luiz Felipe Louback Silva".

Falta:
1. **Gravar o vídeo da entrega** (roteiro em "Entrega final: vídeo").
2. Confirmar o texto do rodapé: "Técnico em Informática, ITB Belval" (em `site-shell.jsx`).
3. Anúncios reais: hoje 1 real e 10 de demonstração. Com 6+ reais, fazer o passo 3 (tirar a demonstração).
4. Depois da entrega: trocar a senha do banco e o `ZYCLOS_JWT_SECRET` e atualizar o `.env` de cada PC.

Em casa: `git pull` na pasta do projeto, conferir o `.env` na raiz (não vem pelo GitHub), `.\mvnw.cmd
spring-boot:run` na raiz e `npm run dev` em `frontend`. Na escola, este PC usava
`C:\Users\rm99692.FIEB.000\tcczyclos` (o `.env` foi criado ali).

## Onde paramos em 06/11/2026, 11h (PC da escola, usuário `rm99692.FIEB`)

- Neste PC a pasta do usuário é `C:\Users\rm99692.FIEB\` (não `rm99692`). Projeto em
  `C:\Users\rm99692.FIEB\tcczyclos`, com `.env` na raiz e os quatro campos preenchidos (URL e usuário conferidos;
  senha não é o texto do modelo).
- A API falhou uma vez com "Unable to determine Dialect without JDBC metadata" (não conectou ao banco). Os logs do
  Supabase não mostram tentativa nem erro de senha nessa hora, e `Test-NetConnection ... -Port 5432` deu
  `TcpTestSucceeded : True`. Depois disso houve conexões aceitas no Supabase. **Próximo passo: rodar
  `.\mvnw.cmd spring-boot:run` de novo** e, se repetir, ver a primeira linha `Caused by`
  (`.\mvnw.cmd spring-boot:run 2>&1 | Select-String "Caused by" | Select-Object -First 3`).
- Cuidado com comandos: `spring-boot:run.` (com ponto) falha; o `npm` precisa rodar dentro de `frontend`.
- Ainda faltam: anúncios reais (1 de 6), tirar a demonstração (passo 3), verificações e commit (passo 6) e
  **gravar o vídeo da entrega** (ver "Entrega final: vídeo").

## Tarefas para o Claude Code (nesta ordem)

0. **Ambiente.** `git checkout main` e `git pull`. Conferir que o `.env` na raiz tem os quatro campos preenchidos
   (sem mostrar os valores no terminal). Se o dono for trocar os segredos agora:
   - senha do banco: Supabase → projeto `zyclos` → Project Settings → Database → Reset database password;
     colar em `DB_PASSWORD`;
   - `ZYCLOS_JWT_SECRET`: gerar no PowerShell. Neste PC o PowerShell é o 5.1, onde
     `[Security.Cryptography.RandomNumberGenerator]::GetBytes(48)` dá "não contém um método denominado 'GetBytes'".
     Usar:
     `$b = New-Object byte[] 48; [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($b); [Convert]::ToBase64String($b)`
   - O Claude Code não tem permissão de escrever no `.env`: o dono cola os valores com `notepad .env`.
     Todo PC que rodar a API precisa do mesmo `.env` (passar por canal privado, nunca pelo GitHub).
1. **Subir tudo.** `.\mvnw.cmd spring-boot:run` na raiz (esperar `Started ZyclosApplication`) e `npm run dev` em
   `frontend` (rodar `npm ci` antes se faltar `node_modules`). Testar `http://localhost:8080/api/v1/categorias`
   (200 com 5 categorias) e `http://localhost:5173`.
2. **Anúncios reais (o grupo faz pelo site).** Cada integrante entra com a própria conta e cadastra 2 ou 3 peças
   reais com fotos próprias (link de imagem). Meta: 6 a 10. O Claude Code pode conferir pela API/banco quantos
   anúncios reais existem (vendedor sem prefixo `demo_`).
3. **Tirar a demonstração**, só quando houver anúncios reais: rodar os dois `update` comentados no fim de
   `docs/sql/seed_demo.sql` (desativam contas e anúncios demo, sem apagar) e conferir que o catálogo só mostra
   anúncios reais. Se o arquivo não existir neste PC (está no `.gitignore`), desativar direto:
   `update anuncio set status = 'INATIVO' where vendedor_id in (select id from usuario where username like 'demo\_%');`
   `update usuario set cod_status = false where username like 'demo\_%';`
4. ~~**Migração de senhas.**~~ Feito em 06/11 (consulta rígida deu 0; trecho removido de
   `UsuarioService.conferirCredenciais`).
5. **Teste manual** com `docs/ROTEIRO-TESTES.md` (2 contas comuns + ADMIN `elipe07.`, API ligada e desligada).
6. **Fechar:** `npm run lint`, `npm run build`, `.\mvnw.cmd -DskipTests compile`; commit e push na `main`;
   atualizar este relatório.

Se não houver tempo para o passo 2: manter a demonstração e avisar a banca que são dados de teste.

Regras: um Claude por vez mexendo no código; nada de force-push, rebase ou amend; textos do site em português;
front só em JS/JSX; sem novas dependências; não mudar o schema do banco.

## Decisões pendentes (situação em 06/11/2026)

- 5.4 feito: `frontend/roadmap.md` apagado (30/10/2026).
- 5.5 feito: apagada `frontend/.lovable/plan/` (três planos antigos do front 100% fictício); mantido
  `.lovable/project.json`.
- 5.9 show-sql: feito (`false` em `application.properties`).
- 5.9 migração de senhas: **removida em 06/11** (a consulta abaixo deu 0). Ela segue o formato que o
  código aceita (`$2a$`, `$2b$` ou `$2y$` + custo + 53 caracteres); a antiga `not like '$2%'` era mais frouxa:
  `select count(*) from usuario where senha is null or senha !~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$';`
  Quando der 0 (depois do passo 2 acima), apagar o trecho "MIGRAÇÃO TEMPORÁRIA" de
  `UsuarioService.conferirCredenciais` e trocar o `if (isHashBCrypt(...))` por recusar o login quando não for hash.

## Segurança e verificações (29/10/2026)

- **Pendente: trocar a senha do banco e o `ZYCLOS_JWT_SECRET`.** Trechos dos dois apareceram no terminal de uma
  sessão. Os valores reais nunca foram commitados (histórico conferido) e o `.env.example` voltou aos placeholders.
  Os dois só são lidos do `.env` na raiz (não há variáveis de ambiente, CI nem deploy usando).
- Propostas de troca: só `PENDENTE` pode ser respondida, e só com `ACEITA` ou `RECUSADA` (senão 400).
  Teste automatizado sem banco: `.\mvnw.cmd test` (`PropostaTrocaServiceTest`, 7 casos).
- `.gitattributes` com `eol=lf`: no Windows com `core.autocrlf=true` o lint acusava milhares de `Delete ␍`.
  O repositório já era todo LF; nenhum arquivo mudou de conteúdo.

## Entrega final: vídeo (prazo 06/11/2026)

Pedido do professor: vídeo curto mostrando (1) objetivo, justificativa e ODS (ODS 12 — Consumo e Produção
Responsáveis), de preferência pelas páginas do site; (2) o site e suas páginas; (3) o CRUD funcionando com o banco:
cadastrar e mostrar o registro no SQL, alterar e mostrar, deletar.
- Para o CRUD, usar `/admin/categorias` (conta ADMIN `elipe07.`) com o Supabase (Table Editor → `categoria`) aberto
  ao lado: criar → mostrar a linha; editar → mostrar a mudança; excluir → mostrar que a linha sumiu (exclusão física).
  O "excluir" de anúncio é lógico (status `INATIVO`), de propósito, para não perder conversas e favoritos.
- Se os anúncios de demonstração ainda estiverem no ar, dizer no vídeo que são dados de exemplo.
- Página `/sobre` criada (link no menu e no rodapé) com objetivo, justificativa, ODS 12 e "como funciona". Os textos
  ficam no topo de `frontend/src/components/zyclos/about.jsx`; trocar pelo texto oficial do TCC se for diferente.

## Roteiro de teste manual

Checklist completo em `docs/ROTEIRO-TESTES.md` (2 contas comuns + 1 ADMIN, API ligada e desligada).

## Observação

O logo (`zyclos-logo.png.asset.json`) só carrega dentro do Lovable; fora dele aparece quebrado. Já era assim.
