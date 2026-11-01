"use client";

import * as React from "react";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { Separator } from "@rlz/ui/components/ui/separator";
import { cva } from "class-variance-authority";
import { cn } from "cn";

const otpFieldInputVariants = cva(
  "relative min-w-0 rounded-md border bg-input not-dark:bg-clip-padding text-center text-sm text-foreground outline-none state-focus-ring state-invalid",
  {
    defaultVariants: { size: "md" },
    variants: {
      size: {
        md: "size-9 leading-9",
        lg: "size-10 leading-10",
      },
    },
  }
);

type OTPFieldSize = "md" | "lg";

const OTPFieldSizeContext = React.createContext<OTPFieldSize>("md");

function OTPFieldRoot({
  className,
  size = "md",
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Root> & {
  size?: OTPFieldSize;
}) {
  return (
    <OTPFieldSizeContext.Provider value={size}>
      <OTPFieldPrimitive.Root
        data-slot="otp-field"
        data-size={size}
        className={cn(
          "flex items-center gap-2 has-disabled:opacity-50",
          className
        )}
        {...props}
      />
    </OTPFieldSizeContext.Provider>
  );
}

function OTPFieldInput({
  className,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Input>) {
  const size = React.useContext(OTPFieldSizeContext);

  return (
    <OTPFieldPrimitive.Input
      data-slot="otp-field-input"
      spellCheck={false}
      className={cn(otpFieldInputVariants({ size }), className)}
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
