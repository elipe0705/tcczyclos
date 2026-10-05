// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const routeTreePath = fileURLToPath(new URL("./src/routeTree.gen.js", import.meta.url));

function removeTypeFooter(code) {
  return code.replace(/\nimport type \{ getRouter \}[\s\S]*$/, "\n");
}

function stripGeneratedTypeFooter() {
  return {
    name: "zyclos:javascript-route-tree",
    enforce: "post",
    async buildStart() {
      const code = await readFile(routeTreePath, "utf8");
      const javascript = removeTypeFooter(code);
      if (javascript !== code) await writeFile(routeTreePath, javascript);
    },
    transform(code, id) {
      if (!id.endsWith("/src/routeTree.gen.js")) return null;
      return removeTypeFooter(code);
    },
  };
}

export default defineConfig({
  plugins: [stripGeneratedTypeFooter()],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.js (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    router: {
      disableTypes: true,
      generatedRouteTree: "routeTree.gen.js",
    },
  },
});
