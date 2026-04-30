"use client";

import type * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@rlz/ui/lib/cn";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "size-6",
        md: "size-9",
        lg: "size-12",
        xl: "size-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

function AvatarRoot({
  size,
  className,
  ...props
}: AvatarPrimitive.Root.Props &
  Pick<VariantProps<typeof avatarVariants>, "size">) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-accent flex size-full items-center justify-center font-medium",
        className
      )}
      {...props}
    />
  );
}

const avatarStackVariants = cva(
  "flex items-center [&_[data-slot=avatar]]:ring-2 [&_[data-slot=avatar]]:ring-accent",
  {
    variants: {
      space: {
        xs: "-space-x-[0.2rem] ",
        sm: "-space-x-[0.3rem] ",
        md: "-space-x-[0.6rem] ",
        lg: "-space-x-[1rem] ",
        xl: "-space-x-[1.5rem] ",
      },
    },
    defaultVariants: {
      space: "md",
    },
  }
);

function AvatarStack({
  space = "md",
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof avatarStackVariants>) {
  return (
    <div
      data-slot="avatar-stack"
      className={cn(avatarStackVariants({ space }), className)}
      {...props}
    />
  );
}

type AvatarProps = AvatarPrimitive.Root.Props & {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: VariantProps<typeof avatarVariants>["size"];
  loading?: AvatarPrimitive.Image.Props["loading"];
};

function Avatar({
  src,
  alt = "Avatar",
  fallback = "A",
  size = "md",
  loading = "lazy",
  ...props
}: AvatarProps) {
  return (
    <AvatarRoot size={size} {...props}>
      {src && <AvatarImage src={src} alt={alt} loading={loading} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </AvatarRoot>
  );
}

const AvatarExport = Object.assign(Avatar, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Stack: AvatarStack,
});

export {
  AvatarExport as Avatar,
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarStack,
};
