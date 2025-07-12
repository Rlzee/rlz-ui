"use client";

import { useId } from "react";
import { Input } from "@/src/ui/components/input";
import { cn } from "@/src/lib/utils";

interface InputLabelProps extends React.ComponentProps<typeof Input> {
  labelText?: string;
  className?: string;
}

const InputLabel = ({ labelText, className, ...props }: InputLabelProps) => {
  const id = useId();

  return (
    <div className="group relative" data-slot="input-label">
      <label
        htmlFor={id}
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
      >
        {labelText}
      </label>
      <Input
        id={id}
        className={cn("h-10 bg-background", className)}
        {...props}
      />
    </div>
  );
};

const InputInsetLabel = ({
  labelText,
  classNameContent,
  className,
  ...props
}: InputLabelProps & { classNameContent?: string }) => {
  const id = useId();

  return (
    <div
      className={cn(
        "border-border bg-secondary focus-within:border-border focus-within:ring-muted has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative rounded-md border shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[2px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[input:is(:disabled)]:*:pointer-events-none",
        classNameContent
      )}
      data-slot="input-inset-content"
    >
      <label
        htmlFor={id}
        className="text-foreground block px-3 pt-2 text-xs font-medium"
      >
        {labelText}
      </label>
      <Input
        data-slot="input-inset-label"
        id={id}
        className={cn(
          "flex h-10 w-full bg-transparent px-3 pb-2 text-sm border-none focus-visible:ring-0",
          className
        )}
        {...props}
      />
    </div>
  );
};

const InputLabelAnimate = ({ labelText, className, ...props}: InputLabelProps) =>{
  const id = useId()

  return (
    <div className="group relative" data-slot="input-label-animate-content">
      <label
        htmlFor={id}
        className="origin-start text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
      >
        <span className="bg-background inline-flex px-2">
            {labelText}
        </span>
      </label>
      <Input id={id} className={cn("bg-background", className)} {...props} data-slot="input-label-animate" />
    </div>
  )
}

export { InputLabel, InputInsetLabel, InputLabelAnimate };
