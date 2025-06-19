'use client'

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/src/lib/utils"

type AvatarSize = "sm" | "md" | "lg"

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string
  alt?: string
  initials?: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-6",
  md: "size-9",
  lg: "size-12",
}

const Avatar = ({
  src,
  alt,
  initials,
  size = "md",
  className,
  ...props
}: AvatarProps) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizeClasses[size], className)}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="aspect-square size-full"
        />
      )}
      <AvatarPrimitive.Fallback
        className="bg-secondary flex size-full items-center justify-center rounded-full text-sm font-medium"
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

export { Avatar }