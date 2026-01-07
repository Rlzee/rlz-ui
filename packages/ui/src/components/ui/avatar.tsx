import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "@/lib/utils";

/* ------------------------------ Root Avatar ------------------------------ */

function AvatarRoot({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Avatar Image ------------------------------ */

function AvatarImage({
  className,
  src,
  alt,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      src={src}
      alt={alt}
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

/* ------------------------------ Avatar Fallback ------------------------------ */

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-accent flex size-full items-center justify-center rounded-full font-medium",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------ Avatar Component ------------------------------ */

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
  loading?: "eager" | "lazy";
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-6",
  md: "size-9",
  lg: "size-12",
  xl: "size-16",
};

const isImageUrl = (value?: string) => {
  if (!value) return false;
  return /^(https?:\/\/|\/).+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
};

function Avatar({
  src,
  alt = "Avatar",
  fallback = "A",
  size = "md",
  className,
  loading = "lazy",
  ...props
}: AvatarProps) {
  return (
    <AvatarRoot className={cn(sizeClasses[size], className)} {...props}>
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback>
        {isImageUrl(fallback) ? (
          <img
            src={fallback}
            alt="fallback"
            loading={loading}
            className="aspect-square size-full object-cover rounded-full"
          />
        ) : (
          fallback
        )}
      </AvatarFallback>
    </AvatarRoot>
  );
}

/* ------------------------------ Exports ------------------------------ */

const AvatarExport = Object.assign(Avatar, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

export { AvatarExport as Avatar, AvatarRoot, AvatarImage, AvatarFallback };
