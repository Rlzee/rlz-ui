import { Info, TriangleAlert } from "lucide-react";
import type { AppearanceConflict } from "../../../lib/appearance";

export function AppearanceConflicts({
  conflicts,
}: {
  conflicts: AppearanceConflict[];
}) {
  const duplicates = conflicts.filter(({ kind }) => kind === "duplicate");
  const overlaps = conflicts.filter(({ kind }) => kind === "overlap");
  if (!conflicts.length) return null;

  return (
    <div className="flex min-w-0 flex-col gap-2 text-xs">
      {duplicates.length > 0 && (
        <section
          aria-label="Duplicate appearance utilities"
          className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-amber-700 dark:text-amber-400"
        >
          <div className="flex items-center gap-1.5 font-medium">
            <TriangleAlert aria-hidden="true" className="size-3.5 shrink-0" />
            Same property defined multiple times
          </div>
          <p className="mt-1">
            Review these utilities. Class order does not determine which wins.
          </p>
          <ConflictPairs conflicts={duplicates} />
        </section>
      )}
      {overlaps.length > 0 && (
        <details className="rounded-md border border-border/60 p-2 text-muted-foreground">
          <summary className="cursor-pointer">
            <Info aria-hidden="true" className="mr-1 inline size-3.5" />
            Overlapping properties ({overlaps.length})
          </summary>
          <p className="mt-1">
            These utilities affect some of the same areas. This may be
            intentional; no change is required.
          </p>
          <ConflictPairs conflicts={overlaps} />
        </details>
      )}
    </div>
  );
}

function ConflictPairs({ conflicts }: { conflicts: AppearanceConflict[] }) {
  return (
    <ul className="mt-1.5 space-y-1">
      {conflicts.map(({ first, second }, index) => (
        <li key={`${first}:${second}:${index}`} className="break-words">
          <code>{first}</code>
          <span className="mx-1" aria-label="and">
            +
          </span>
          <code>{second}</code>
        </li>
      ))}
    </ul>
  );
}
