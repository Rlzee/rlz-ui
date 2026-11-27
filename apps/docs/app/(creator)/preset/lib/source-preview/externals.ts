import * as React from "react";
import * as JSXRuntime from "react/jsx-runtime";
import * as ReactDOM from "react-dom";
import * as BaseUI from "@base-ui/react";
import * as CVA from "class-variance-authority";
import * as Icons from "lucide-react";
import Link from "next/link";
import { Recharts } from "@rlz/ui/components/ui/chart";
import { cn } from "@rlz/ui/lib/cn";
import type { SourcePreviewBundle } from "./types";

/** Reuse host dependencies: recompiling local sources must not recreate React or Base UI. */
export function sourcePreviewExternals(bundle: SourcePreviewBundle) {
  const dependencies: Record<string, unknown> = {
    react: React,
    "react/jsx-runtime": JSXRuntime,
    "react-dom": ReactDOM,
    "class-variance-authority": CVA,
    cn: { cn },
    "lucide-react": Icons,
    "next/link": { __esModule: true, default: Link },
    recharts: Recharts,
  };
  for (const module of Object.values(bundle.modules))
    for (const target of Object.values(module.imports))
      if (target.startsWith("external:@base-ui/react/"))
        dependencies[target.slice("external:".length)] = BaseUI;
  return dependencies;
}
