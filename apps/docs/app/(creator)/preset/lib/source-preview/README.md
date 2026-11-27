# Source preview

## Run

From the repository root:

```sh
pnpm --filter @rlz/registry build
pnpm --filter @rlz/preset-transform build
pnpm --filter docs dev
```

Open `/preset/create` and select a component. The registry determines the available
components; there is no pilot list, environment toggle or alternate canvas.

## Architecture

- `compile.server.ts` reads trusted local `@rlz/ui` sources recursively.
  Presets are validated data, never user-supplied TypeScript or import paths.
- `@rlz/preset-transform` is the source transformation engine also used by `rlz add`.
  Scenarios and reference examples use the same transformed modules, including
  their dependencies.
- All registered documentation examples are selectable scenarios. The default
  view includes default, disabled and loading examples where available.
- A React selection scope applies selected axes and edited props only to public
  consumers in the selected component's module, including internally composed
  parts. Explicit non-axis scenario props and private fixed variant values remain
  intact. Reference examples retain their original props and installed defaults.
- Examples with identifiable removed variant usages display warnings rather than
  silently rewriting their props. Dynamic user-code migration is not supported.
- `runtime.ts` preserves top-level functions, arrows, React contexts, memo/forwardRef
  boundaries, literal data and handles/managers across style edits. External React,
  Base UI and other dependencies are shared with the canvas.
- There is no DOM class rewriting or Creator logic in installable components.
  Failed module updates roll back implementations and public exports; the last
  successful preview and its Tailwind candidates remain available.

The same-origin compile endpoint accepts bounded requests and limits its local
module graph. Its CommonJS loader evaluates only repository-owned compiled code.
Deployment requires those local sources to be available to the server; this is
not a service for compiling arbitrary submitted code.

## Structural changes

Changing a context default or resource configuration requires **Reset source
preview**, rather than silently remounting an open subtree. Sources are local;
the CLI downloads `main` by default, so installation comparisons require matching
component sources.

## Checks

```sh
pnpm --filter rlz test
pnpm --filter docs test:preset
pnpm --filter docs types:check
# With the docs server running (defaults to http://localhost:3000):
pnpm --filter docs test:preset:browser
```

Set `RLZ_PREVIEW_URL` for another server address and
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for another Chromium executable. Browser tests
use installed Edge on Windows, or Playwright's Chromium elsewhere.

Browser coverage includes the public registry and full example catalogs, input
value/focus, tab and Combobox selection, Dialog/Drawer DOM and portal preservation,
composed Tooltip variants, Menu private values, toast managers and a single iframe
navigation. It does not assert every interaction of every documentation example.
