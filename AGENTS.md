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

- Keep ZYCLOS strictly frontend-only; all demonstrations use React context and local component state because the TCC explicitly forbids backend persistence and external APIs.
- Keep mock domain records in `src/data` and reusable marketplace UI in `src/components/zyclos` so a future backend can replace data without redesigning pages.
