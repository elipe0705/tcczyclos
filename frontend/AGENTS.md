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
- `src/data/catalog.js` loads listings, categories, sellers and images from the API and maps them to the `product` shape the components use. There is no mock data: when the API is unreachable the query fails and screens show an error with a retry button.
- Every screen uses real API data through React Query: `src/data/social.js` (public profiles, reviews, followers, conversations, notifications, trade status constants) and `src/data/admin.js` (admin lists). Shared UI states (empty, error, loading, listing photo placeholder, avatar) live in `src/components/zyclos/common.jsx`; date/name formatting in `src/lib/format.js`.
- Authentication and favorites live in `AppContext` (`ready` tells when the saved session was read; `updateUser` refreshes the stored user after editing the profile).
- When adding, renaming or deleting a route file, update the checked-in `src/routeTree.gen.js` by hand (the generator writes to /tmp, see `vite.config.js`).
- Keep application and configuration source in JavaScript/JSX; the TCC requires a TypeScript-free source tree while preserving TanStack Start file-based routing.
