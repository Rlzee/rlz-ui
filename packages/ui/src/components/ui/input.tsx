import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

const inputClassName = cn(
  "placeholder:text-muted-foreground w-full min-w-0 h-9 px-3 py-1 rounded-[inherit] outline-none",
  "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
  "[&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
);

type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  "size"
> & {
  unstyled?: boolean;
  nativeInput?: boolean;
  variant?: "default" | "background" | "accent";
};

function Input({
  variant = "default",
  unstyled = false,
  nativeInput = false,
  className,
  ...props
}: InputProps) {
  return (
    <span
      data-slot="input-control"
      data-variant={variant}
      className={cn(
        "flex items-center",
        !unstyled && [
          "data-[variant=default]:bg-input data-[variant=background]:bg-background data-[variant=accent]:bg-accent",
          "text-base md:text-sm relative w-full rounded-md border not-dark:bg-clip-padding shadow-xs transition-[color,box-shadow]",
          "disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50",
          "has-focus-visible:has-aria-invalid:ring-destructive/20 dark:has-focus-visible:has-aria-invalid:ring-destructive/40 has-focus-visible:has-aria-invalid:border-destructive",
          "has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px] has-focus-visible:border-ring",
        ],
        className,
      )}
    >
      {nativeInput ? (
        <input data-slot="input" className={inputClassName} {...props} />
      ) : (
        <InputPrimitive
          data-slot="input"
          className={inputClassName}
          {...props}
        />
      )}
    </span>
  );
}

export { Input, type InputProps };
