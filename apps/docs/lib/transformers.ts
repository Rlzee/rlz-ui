import type { ShikiTransformer } from "shiki";

export const transformers: ShikiTransformer[] = [
  {
    code(node) {
      if (node.tagName !== "code") return;
      const raw = this.source.trim();
      node.properties["__raw__"] = raw;

      if (raw.startsWith("npx rlz@latest")) {
        node.properties["__npm__"] = raw;
        node.properties["__yarn__"] = raw.replace("npx", "yarn dlx");
        node.properties["__pnpm__"] = raw.replace("npx", "pnpm dlx");
        node.properties["__bun__"] = raw.replace("npx", "bunx --bun");
      } else if (raw.startsWith("npm install")) {
        node.properties["__npm__"] = raw;
        node.properties["__yarn__"] = raw.replace("npm install", "yarn add");
        node.properties["__pnpm__"] = raw.replace("npm install", "pnpm add");
        node.properties["__bun__"] = raw.replace("npm install", "bun add");
      } else if (raw.startsWith("npx")) {
        node.properties["__npm__"] = raw;
        node.properties["__yarn__"] = raw.replace("npx", "yarn dlx");
        node.properties["__pnpm__"] = raw.replace("npx", "pnpm dlx");
        node.properties["__bun__"] = raw.replace("npx", "bunx --bun");
      } else if (raw.startsWith("npm run")) {
        node.properties["__npm__"] = raw;
        node.properties["__yarn__"] = raw.replace("npm run", "yarn");
        node.properties["__pnpm__"] = raw.replace("npm run", "pnpm");
        node.properties["__bun__"] = raw.replace("npm run", "bun");
      }
    },
  },
];
