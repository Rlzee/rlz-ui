"use client";

import type * as React from "react";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { Separator } from "@rlz/ui/components/ui/separator";
import { cn } from "@rlz/ui/lib/cn";

function OTPFieldRoot({
  className,
  size = "md",
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Root> & {
  size?: "md" | "lg";
}) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="otp-field"
      data-size={size}
      className={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function OTPFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Input>) {
  return (
    <OTPFieldPrimitive.Input
      data-slot="otp-field-input"
      spellCheck={false}
      className={cn(
        "relative size-9 min-w-0 rounded-md border bg-input not-dark:bg-clip-padding text-center text-sm text-foreground leading-9 outline-none",
        "in-[[data-slot=otp-field][data-size=lg]]:size-10 in-[[data-slot=otp-field][data-size=lg]]:leading-10",
        "state-focus-ring state-invalid",
        className
      )}
      {...props}
    />
  );
}

function OTPFieldSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <OTPFieldPrimitive.Separator
      data-slot="otp-field-separator"
      render={
        <Separator
          orientation="horizontal"
          className={cn(
            "rounded-full bg-border data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-3",
            className
          )}
          {...props}
        />
      }
    />
  );
}

const OTPFieldExports = Object.assign(OTPFieldRoot, {
  Input: OTPFieldInput,
  Separator: OTPFieldSeparator,
});

export { OTPFieldExports as OTPField, OTPFieldInput, OTPFieldSeparator };
