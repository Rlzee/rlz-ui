import { cn } from "@/lib/utils";

function KbdRoot({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-background text-muted-foreground flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

const KbdExport = Object.assign(KbdRoot, {
  Group: KbdGroup,
});

export { KbdExport as Kbd, KbdGroup };
