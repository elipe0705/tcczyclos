<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- This folder is the frontend of a monorepo; the Spring Boot API lives in the repository root and is called through `src/lib/api.js` (`VITE_API_URL`, default `http://localhost:8080/api/v1`).
- `src/data/catalog.js` loads listings, categories, sellers and images from the API and maps them to the `product` shape the components use; it falls back to `src/data/mock.js` when the API is unreachable.
- Authentication and favorites live in `AppContext` and go through the API; messages, trades, notifications, profile and admin still use mock data.
- Keep application and configuration source in JavaScript/JSX; the TCC requires a TypeScript-free source tree while preserving TanStack Start file-based routing.
