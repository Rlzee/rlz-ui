import { SourceFile } from "ts-morph";

/**
 * Removes the "use client" directive from the component if present at the very top of the file.
 * @param sourceFile The source file to modify.
 */
export function removeUseClient(sourceFile: SourceFile): void {
  const text = sourceFile.getFullText();

  const patterns = [
    /^(['"])use client\1;?\s*/m, // "use client"; or 'use client';
  ];

  let updated = text;
  let changed = false;

  for (const pattern of patterns) {
    if (pattern.test(updated)) {
      updated = updated.replace(pattern, "");
      changed = true;
    }
  }

  if (changed) {
    sourceFile.replaceWithText(updated);
  }
}
