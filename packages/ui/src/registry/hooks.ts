import { defineRegistryItems } from "@rlz/registry";

export const registryHooks = defineRegistryItems("hook", {
  "use-copy-to-clipboard": {
    name: "Use Copy To Clipboard",
    description: "A hook that copies text to the clipboard",
    path: "hooks/use-copy-to-clipboard.ts",
    version: "1.0.0",
    hookType: "server",
  },
  "use-mobile": {
    name: "use-mobile",
    description: "A hook that detects if the user is on a mobile device",
    path: "hooks/use-mobile.ts",
    version: "1.0.0",
    hookType: "client",
  },
});
