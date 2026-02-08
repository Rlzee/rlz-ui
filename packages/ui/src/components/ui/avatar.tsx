import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const AvatarVariants = cva(
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
  },
);

function AvatarRoot({
  size,
  className,
  ...props
}: AvatarPrimitive.Root.Props &
  Pick<VariantProps<typeof AvatarVariants>, "size">) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(AvatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  src,
  alt,
  ...props
}: AvatarPrimitive.Image.Props) {
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

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-accent flex size-full items-center justify-center font-medium",
        className,
      )}
      {...props}
    />
  );
}

function AvatarStack({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-stack"
      className={cn("-space-x-[0.6rem] flex items-center", className)}
      {...props}
    />
  );
}

type AvatarProps = AvatarPrimitive.Root.Props & {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: VariantProps<typeof AvatarVariants>["size"];
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
