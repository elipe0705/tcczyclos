# ZYCLOS — Relatório da limpeza de dados fictícios (para continuar no Claude Code)

Contexto para quem continuar: TCC ZYCLOS, marketplace de moda circular. Monorepo com API Spring Boot 3.5 / Java 21
na raiz (`br.com.zyclos`, Supabase PostgreSQL, JWT) e front-end React (TanStack Start + React Query, só JS/JSX) em
`frontend/`, conectado ao Lovable. Objetivo: tirar todo dado fictício/simulado do site antes da entrega.

## Onde está o código

- Branch: `claude/new-session-s1fq3s` (já no GitHub). A `main` NÃO foi alterada (é a que sincroniza com o Lovable).
- Não fazer force-push, rebase nem amend (ver `frontend/AGENTS.md`). Juntar na `main` só depois de testar (PR + merge).
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
- Verificado: `npm run lint` (0 erros, 8 avisos que já existiam), `npm run build`, `mvnw -DskipTests compile`,
  e testes de ponta a ponta com a API real num PostgreSQL local (schema de `docs/sql/zyclos_db_supabase.sql`).

## O que já foi feito no banco (Supabase, projeto `zyclos`)

- Projeto estava ativo (não precisou de Restore).
- Conta `elipe07.` (lipinho070509@gmail.com, id 4) virou `ADMIN`.
- Contas de teste `zyclos_teste1` e `zyclos_teste2` (ids 2 e 3) desativadas (`cod_status = false`).
  Desfazer: `update usuario set cod_status = true where id in (2, 3);`
- Não havia anúncios no banco (0). É preciso cadastrar 6–10 anúncios reais pelo site antes da apresentação.
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

1. Entrar (não cadastrar) com `lipinho070509@gmail.com`, a conta ADMIN, e conferir que `/admin` abre.
   O cadastro com esse e-mail ou com o username `elipe` daria 409, porque já existem.
2. Entrar uma vez com a conta `elipe` (ghostguedres@gmail.com): isso troca a senha em texto puro dela por hash.
3. Cadastrar de 6 a 10 anúncios reais pelo site, com fotos (o banco está com 0 anúncios).
4. Seguir o roteiro de teste manual abaixo.
5. Resolver as decisões pendentes, juntar a branch na `main` (PR + merge) e, se quiser, apagar este relatório.

Mudanças no código: fazer só por um Claude de cada vez (o do PC). Antes de começar `git pull`; no fim, commit e
`git push` na branch `claude/new-session-s1fq3s`.

## Decisões pendentes do dono do projeto

Recomendação: 5.4 apagar o roadmap; 5.5 apagar `plan/`; 5.9 desligar o show-sql já e remover a migração de senhas
só quando a consulta abaixo der 0 (depois do passo 2).

- 5.4: `frontend/roadmap.md` cita "dados mockados" e "sessão simulada" — atualizar ou apagar?
- 5.5: apagar a pasta `frontend/.lovable/plan/` (manter `.lovable/project.json`)?
- 5.9: `spring.jpa.show-sql=true` -> `false`? Remover a "MIGRAÇÃO TEMPORÁRIA" de senhas em texto puro em
  `UsuarioService.conferirCredenciais` — só depois de confirmar com
  `select count(*) from usuario where senha not like '$2%';` = 0 (hoje é 1: a conta id 1).

## Roteiro de teste manual (API ligada; 2 contas normais + 1 ADMIN)

cadastro -> login (continuar logado na home) -> criar anúncio "Venda ou troca" -> ver na home e no catálogo ->
`/perfil` e `/perfil/<outro>` -> seguir -> "Tenho interesse" e trocar mensagens (contador de não lidas some ao
abrir) -> outro usuário "Propor troca" -> aceitar em `/trocas` -> conferir `/notificacoes` dos dois ->
editar perfil (nome muda no cabeçalho; username repetido dá erro) -> denunciar anúncio -> como ADMIN, cada tela
de `/admin` (criar/desativar categoria, excluir categoria com anúncios dá 409, analisar denúncia, períodos dos
relatórios); conta comum em `/admin` vê "Acesso restrito" -> desligar a API: telas mostram erro, nenhum dado falso.

## Observação

O logo (`zyclos-logo.png.asset.json`) só carrega dentro do Lovable; fora dele aparece quebrado. Já era assim.
