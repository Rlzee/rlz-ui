"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/src/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-6",
  md: "size-9",
  lg: "size-12",
};

const isImageUrl = (value?: string) => {
  if (!value) return false;
  return /^(https?:\/\/|\/).+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
};

const Avatar = ({
  src,
  alt,
  fallback,
  size = "md",
  className,
  ...props
}: AvatarProps) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="aspect-square size-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className={`bg-secondary flex size-full items-center justify-center rounded-full font-medium text-${size}`}
      >
        {isImageUrl(fallback) ? (
          <img
            src={fallback}
            alt="fallback"
            className="aspect-square size-full object-cover rounded-full"
          />
        ) : (
          fallback
        )}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

export { Avatar };
