# ZYCLOS API

Backend REST da plataforma de moda circular ZYCLOS (TCC), feito em Spring Boot seguindo a apostila
"Projeto Pizzaria Passo a Passo" (Prof. Rogério Caetano).

O front-end (React + TanStack Start, feito no Lovable) fica na pasta `frontend/` e consome esta API.

## Como rodar tudo junto

1. Suba o back-end (seção "Como rodar (Supabase)" abaixo). A API fica em `http://localhost:8080`.
2. Em outro terminal:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
   O site abre em `http://localhost:5173` (porta já liberada no CORS). A porta está fixada em
   `frontend/vite.config.js`, porque a configuração do Lovable usaria a 8080, que é a da API.
3. Se a API estiver em outro endereço, copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`.

O que o front-end já usa da API:

| Tela | Endpoints |
| --- | --- |
| Login / Cadastro | `POST /usuarios/login`, `POST /usuarios` |
| Início, Anúncios, Detalhe | `GET /anuncios`, `/categorias`, `/usuarios`, `/anuncio-imagens` |
| Favoritos (coração) | `GET/POST /favoritos`, `DELETE /favoritos/{id}` |
| Criar / Editar / Excluir anúncio | `POST/PUT /anuncios`, `POST/PUT/DELETE /anuncio-imagens` |

- A sessão fica no navegador ("Lembrar de mim" mantém o login depois de fechar a aba).
- Excluir um anúncio pelo site muda o `status` para `INATIVO` (não apaga a linha, para não quebrar favoritos
  e conversas). O catálogo mostra só anúncios `ATIVO`.
- A foto do anúncio é um link (URL) de imagem, gravado em `anuncio_imagem`.
- Se a API estiver desligada, o site mostra os dados de demonstração de `frontend/src/data/mock.js`.
- Mensagens, trocas, notificações, perfil e área administrativa ainda usam dados de demonstração.

## Estrutura (MVC)

```
br.com.zyclos
├── config            CorsConfiguration (libera as portas 5173, 3000 e 8686)
├── controller        XxxController  -> endpoints /api/v1/...
└── model
    ├── entity        XxxEntity      -> uma classe por tabela do banco
    ├── repository    XxxRepository  -> extends JpaRepository<Entidade, Long>
    └── services      XxxService     -> regras de negócio (findAll, save, findById, update, delete)
```

Fluxo: Controller -> Service -> Repository -> Banco de Dados, com injeção de dependência via `@Autowired`.

## Como rodar (Supabase)

O banco fica no Supabase (PostgreSQL), projeto `zyclos`, região São Paulo.

1. Copie `.env.example` para `.env` (na raiz do repositório) e preencha:
   - No painel do Supabase, abra o projeto `zyclos` → **Project Settings → Database → Reset database
     password**, gere uma senha e guarde num gerenciador de senhas.
   - Clique em **Connect** (topo do painel) → **Session pooler** e copie só o **host**
     (algo como `aws-X-sa-east-1.pooler.supabase.com`). Cole em `DB_URL` no lugar de `HOST_DO_SESSION_POOLER`.
   - Coloque a senha em `DB_PASSWORD` e mantenha `DB_USERNAME=postgres.mhiagkmgzyroiglskwdo`.
   - Use o **Session pooler** (porta 5432): o host direto `db.mhiagkmgzyroiglskwdo.supabase.co` só
     funciona em IPv6 no plano gratuito e costuma falhar em redes de casa e da escola. Só se a porta 5432
     estiver bloqueada, use a 6543 e acrescente `&prepareThreshold=0` ao final da URL.
2. Rode a classe `ZyclosApplication` no IntelliJ (working directory: raiz do repositório) ou
   `.\mvnw.cmd spring-boot:run`. A API sobe em `http://localhost:8080`.
3. As tabelas já existem no Supabase. `docs/sql/zyclos_db_supabase.sql` é só documentação: **não executar**.
   (`spring.jpa.hibernate.ddl-auto=none`: o Hibernate nunca cria nem altera tabelas.)
4. Projetos gratuitos do Supabase pausam após 7 dias sem uso. Antes de apresentar, abra o painel e clique
   em **Restore** se estiver pausado.
5. ⚠️ Nunca commite o `.env`. Se a senha vazar, resete no painel (Project Settings → Database).
6. Testes e `mvn package` precisam do `.env` preenchido, porque o teste padrão do Spring conecta no banco.
   Sem ele, use `-DskipTests`.

O script antigo do SQL Server continua em `docs/sql/zyclos_db.sql`, só como histórico.

Problemas comuns ao subir:

| Erro no log | Causa provável |
| --- | --- |
| `UnknownHostException` ou timeout | URL com o host direto `db.…supabase.co`, ou a rede bloqueia a porta 5432 |
| `password authentication failed` | Senha errada, ou usuário diferente de `postgres.mhiagkmgzyroiglskwdo` |
| `Tenant or user not found` | Formato do usuário errado, ou host/região do pooler errado |

## Endpoints

Todas as entidades têm o mesmo CRUD:

| Método | Caminho | Ação |
| --- | --- | --- |
| GET | `/api/v1/{recurso}` | Listar todos |
| GET | `/api/v1/{recurso}/{id}` | Listar por ID |
| POST | `/api/v1/{recurso}` | Salvar |
| PUT | `/api/v1/{recurso}/{id}` | Atualizar |
| DELETE | `/api/v1/{recurso}/{id}` | Excluir (exclusão física) |

Recursos: `usuarios`, `categorias`, `anuncios`, `anuncio-imagens`, `favoritos`, `seguidores`,
`conversas`, `mensagens`, `notificacoes`, `avaliacoes`, `propostas-troca`, `denuncias`.

Login: `POST /api/v1/usuarios/login` com `{ "email": "...", "senha": "..." }` devolve o usuário (sem a senha)
ou 401.

Os relacionamentos são enviados pelo id (ex.: `"categoriaId": 3, "vendedorId": 1`).

Respostas de erro:

| Status | Quando |
| --- | --- |
| 400 | Id não numérico, campo obrigatório faltando ou id relacionado inexistente |
| 404 | Registro não encontrado |
| 409 | Exclusão bloqueada porque outros registros dependem deste |

Exemplos prontos para o REST Client (VS Code) ou para copiar no Insomnia: `docs/requests/zyclos.http`.
