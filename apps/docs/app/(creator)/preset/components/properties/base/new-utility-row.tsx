"use client";

import { Input } from "@rlz/ui/components/ui/input";
import { Button } from "@rlz/ui/components/ui/button";
import { cn } from "@rlz/ui/lib/cn";

import { Plus } from "lucide-react";

/**
 * The declaration of a utility of the preset's own. Only the name is asked for
 * here: the classes are written in the field that appears under it, so a new class
 * is authored exactly the way a shared one is retuned.
 */
export function NewUtilityRow({
  name,
  error,
  onName,
  onAdd,
}: {
  name: string;
  error: string;
  onName: (name: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-border pt-2.5">
      <div className="flex items-center gap-2">
        <Input
          value={name}
          spellCheck={false}
          aria-label="Name of the new utility"
          placeholder="my-utility"
          onChange={(event) => onName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onAdd();
          }}
          className="h-8 flex-1 text-xs **:data-[slot=input]:h-8 **:data-[slot=input]:leading-8"
        />

        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus />
          Add
        </Button>
      </div>

      <span
        className={cn(
          "text-[11px]",
          error ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {error ||
          "Declares a class of the preset's own, written into @layer utilities."}
      </span>
    </div>
  );
}
