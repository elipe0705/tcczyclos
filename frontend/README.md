# ZYCLOS — Front-end

Site da ZYCLOS, marketplace de moda circular (comprar, vender e trocar roupas), feito no TCC.
React com TanStack Start, TanStack Router e React Query, em JavaScript/JSX. Foi criado no
[Lovable](https://lovable.dev) e está conectado a ele.

Todos os dados vêm da API Spring Boot que fica na raiz deste repositório: se a API estiver
desligada, as telas mostram uma mensagem de erro com "Tentar novamente" (não existem dados de
demonstração).

## Como rodar

1. Suba a API (veja o `README.md` da raiz). Ela fica em `http://localhost:8080`.
2. Nesta pasta:
   ```sh
   npm install
   npm run dev
   ```
   O site abre em `http://localhost:5173`.

Outros comandos: `npm run lint` (ESLint + Prettier) e `npm run build`.

## Endereço da API

O endereço vem de `VITE_API_URL` (padrão `http://localhost:8080/api/v1`). Para mudar, copie
`.env.example` para `.env` nesta pasta e ajuste o valor.

## Mais informações

Endpoints usados por cada tela, regras de acesso e configuração do banco: `README.md` da raiz.
