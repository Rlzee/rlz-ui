import { Button, type ButtonProps } from "@rlz/ui/components/ui/button";
import Link from "next/link";

import { cn } from "@rlz/ui/lib/cn";

export function NavLink({
  href,
  isActive,
  children,
  variant = "link",
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  variant?: ButtonProps["variant"];
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      className={
        variant === "link"
          ? "px-2 hover:no-underline text-muted-foreground"
          : ""
      }
      render={<Link href={href} className={cn(isActive && "text-primary")} />}
    >
      {children}
    </Button>
  );
}
