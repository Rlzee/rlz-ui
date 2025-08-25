import {
  ComponentProps,
  ReactNode,
  isValidElement,
  Children,
} from "react";
import { Input } from "@ui/components/input";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Addon Left ------------------------------ */

const InputAddonLeft = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "text-muted-foreground/80 absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
        className
      )}
      data-slot="input-addon-left"
    >
      {children}
    </div>
  );
};

/* ------------------------------ Addon Right ------------------------------ */

const InputAddonRight = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "text-muted-foreground/80 absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50",
        className
      )}
      data-slot="input-addon-right"
    >
      {children}
    </div>
  );
};

/* ------------------------------ Root Component ------------------------------ */

type Props = ComponentProps<typeof Input> & { children?: ReactNode; classNameContent?: string };

const InputAddon = ({ children, className, classNameContent, ...props }: Props) => {
  let hasLeft = false;
  let hasRight = false;

  const parsed = Children.map(children, (c) => {
    if (isValidElement(c) && c.type === InputAddonLeft) hasLeft = true;
    if (isValidElement(c) && c.type === InputAddonRight) hasRight = true;
    return c;
  });

  return (
    <div className={cn("relative w-full", classNameContent)} data-slot="input-addon">
      <Input
        {...props}
        className={cn(hasLeft && "pl-10", hasRight && "pr-10", className)}
      />
      {parsed}
    </div>
  );
};

/* ------------------------------ Composed Export ------------------------------ */

const InputAddonComposed = Object.assign(InputAddon, {
  Left: InputAddonLeft,
  Right: InputAddonRight,
});

export { InputAddonComposed as InputAddon, InputAddonLeft, InputAddonRight };
