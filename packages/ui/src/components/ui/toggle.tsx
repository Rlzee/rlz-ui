import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm text-muted-foreground font-medium bg-transparent hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 transition-[color,box-shadow] outline-none state-invalid state-focus-ring whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "data-[pressed]:bg-accent data-[pressed]:text-foreground",
        outline:
          "border border-border bg-secondary data-[pressed]:bg-accent data-[pressed]:text-foreground",
      },
      size: {
        xs: "h-7 px-1 min-w-7",
        sm: "h-8 px-1.5 min-w-8",
        md: "h-9 px-2 min-w-9",
        lg: "h-10 px-2.5 min-w-10",
        xl: "h-11 px-3 min-w-11",

        "icon-xs": "h-7 w-7 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-md": "h-9 w-9 p-0",
        "icon-lg": "h-10 w-10 p-0",
        "icon-xl": "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ToggleProps = TogglePrimitive.Props & VariantProps<typeof toggleVariants>;

function Toggle({ className, variant, size, ...props }: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ className, variant, size }))}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Toggle, toggleVariants };
