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

## Próximos passos

0. Trocar a senha do banco e o `ZYCLOS_JWT_SECRET` (ver "Segurança e verificações" abaixo) e atualizar o `.env`.
1. Entrar (não cadastrar) com `lipinho070509@gmail.com`, a conta ADMIN, e conferir que `/admin` abre.
   O cadastro com esse e-mail ou com o username `elipe` daria 409, porque já existem.
2. Entrar uma vez com a conta `elipe` (ghostguedres@gmail.com): isso troca a senha em texto puro dela por hash.
3. Decidir se a apresentação usa os 10 anúncios de demonstração ou anúncios reais cadastrados pelo site
   (nesse caso, desativar a demonstração com o fim de `seed_demo.sql`).
4. Seguir o roteiro de teste manual abaixo.
5. Resolver a migração de senhas (abaixo) e, se quiser, apagar este relatório.

Mudanças no código: fazer só por um Claude de cada vez (o do PC). Antes de começar `git pull`; no fim, commit e
`git push` na `main`.

## Decisões pendentes (situação em 29/10/2026)

- 5.4 feito: `frontend/roadmap.md` apagado (30/10/2026).
- 5.5 feito: apagada `frontend/.lovable/plan/` (três planos antigos do front 100% fictício); mantido
  `.lovable/project.json`.
- 5.9 show-sql: feito (`false` em `application.properties`).
- 5.9 migração de senhas: **mantida**. A consulta abaixo deu 1 (de 4 contas, ativa). Ela segue o formato que o
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

## Roteiro de teste manual

Checklist completo em `docs/ROTEIRO-TESTES.md` (2 contas comuns + 1 ADMIN, API ligada e desligada).

## Observação

O logo (`zyclos-logo.png.asset.json`) só carrega dentro do Lovable; fora dele aparece quebrado. Já era assim.
