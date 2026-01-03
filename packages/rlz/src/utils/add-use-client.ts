import { SourceFile } from "ts-morph";

/**
 * Checks if a component needs "use client" directive
 * @param sourceFile The TypeScript/React source file
 * @returns true if the component needs "use client"
 */
function needsUseClient(sourceFile: SourceFile): boolean {
  const text = sourceFile.getFullText();

  // React hooks that require "use client"
  const clientHooks = [
    "useState",
    "useEffect",
    "useReducer",
    "useCallback",
    "useMemo",
    "useRef",
    "useContext",
    "useLayoutEffect",
    "useImperativeHandle",
    "useDebugValue",
    "useId",
    "useDeferredValue",
    "useTransition",
    "useSyncExternalStore",
  ];

  // Browser APIs that require "use client"
  const browserAPIs = [
    "addEventListener",
    "removeEventListener",
    "document.",
    "window.",
    "localStorage",
    "sessionStorage",
    "fetch(",
    "XMLHttpRequest",
    "navigator.",
    "location.",
    "history.",
  ];

  // React events that require "use client"
  const reactEvents = [
    "onClick",
    "onChange",
    "onSubmit",
    "onMouseOver",
    "onMouseOut",
    "onKeyDown",
    "onKeyUp",
    "onFocus",
    "onBlur",
    "onInput",
    "onLoad",
    "onError",
  ];

  // Check for React hooks presence
  for (const hook of clientHooks) {
    if (text.includes(hook)) {
      return true;
    }
  }

  // Check for browser APIs presence
  for (const api of browserAPIs) {
    if (text.includes(api)) {
      return true;
    }
  }

  // Check for React events presence
  for (const event of reactEvents) {
    if (text.includes(event)) {
      return true;
    }
  }

  return false;
}

/**
 * Adds "use client" at the beginning of a component if needed for Next.js or Remix
 * @param sourceFile The TypeScript/React source file
 * @param cwd The current working directory (optional)
 */
export function addUseClient(sourceFile: SourceFile): void {
  // Check if the component needs "use client"
  if (!needsUseClient(sourceFile)) {
    return;
  }

  const text = sourceFile.getFullText();

  // Check if "use client" is already present
  if (text.includes('"use client"') || text.includes("'use client'")) {
    return;
  }

  // Add "use client" at the beginning of the file
  sourceFile.insertText(0, '"use client";\n\n');
}
