# @rlz/preset-transform

Node-only preset transformations shared by the CLI and the experimental Creator
source preview. It has no framework, icon, alias, CLI or browser behavior.

```ts
const warnings = transformPresetComponent(
  sourceFile,
  componentId,
  customization
);
```

`sourceFile` is a `ts-morph` source file. The engine reconciles variant values,
types and fallback defaults, then applies common part classes. The caller owns
loading, saving and displaying `warnings.variants` / `warnings.parts`.

The CLI's regression tests remain in `packages/rlz/tests/`. Build this package
before running those tests or the Creator:

```sh
pnpm --filter @rlz/preset-transform build
```

Installed UI components do not import or depend on this package.
