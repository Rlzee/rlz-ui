import { ComponentProps } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@ui/lib/utils";

/* ------------------------------ Root Avatar ------------------------------ */

const AvatarRoot = ({
  children,
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Root>
  );
};

/* ------------------------------ Avatar Image ------------------------------ */

const AvatarImage = ({
  src,
  alt,
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) => {
  return (
    <AvatarPrimitive.Image
      src={src}
      alt={alt}
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
};

/* ------------------------------ Avatar Fallback ------------------------------ */

const AvatarFallback = ({
  className,
  children,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "bg-background-secondary flex size-full items-center justify-center rounded-full font-medium",
        className
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
};

/* ------------------------------ Avatar Component ------------------------------ */

type AvatarSize = "sm" | "md" | "lg";

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
  loading = "lazy",
  ...props
}: AvatarProps) => {
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
};

/* ------------------------------ Exports ------------------------------ */

const AvatarComposed = Object.assign(Avatar, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

export { AvatarComposed as Avatar, AvatarRoot, AvatarImage, AvatarFallback };
