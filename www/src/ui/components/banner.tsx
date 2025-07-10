"use client";

import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";
import { ComponentProps, useState } from "react";

/* ------------------------------ Root Banner ------------------------------ */

const BannerRoot = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      data-slot="banner"
      className={cn(
        "w-full border-b p-4 shadow-sm t-0 fixed bg-primary z-50",
        "relative flex gap-4 flex-row items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ------------------------------ Banner Content ------------------------------ */

const BannerContent = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      data-slot="banner-content"
      className={cn(
        "flex flex-col lg:gap-3 pt-2 lg:flex-row md:pt-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ------------------------------ Banner Title ------------------------------ */

const BannerTitle = ({
  className,
  children,
  ...props
}: ComponentProps<"h1">) => {
  return (
    <h1
      data-slot="banner-title"
      className={cn("text-sm font-medium text-primary-foreground", className)}
      {...props}
    >
      {children}
    </h1>
  );
};

/* ------------------------------ Banner Description ------------------------------ */

const BannerDescription = ({
  className,
  children,
  ...props
}: ComponentProps<"p">) => {
  return (
    <p
      data-slot="banner-description"
      className={cn("text-sm text-foreground/80 font-sans", className)}
      {...props}
    >
      {children}
    </p>
  );
};

/* ------------------------------ Banner Actions ------------------------------ */

const BannerActions = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      {...props}
      data-slot="banner-actions"
    >
      {children}
    </div>
  );
};

/* ------------------------------ Banner Close Button ------------------------------ */

const BannerCloseButton = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <X
      data-slot="banner-close-button"
      aria-label="Close banner"
      className={cn(
        "h-4 w-4 cursor-pointer text-primary-foreground",
        className
      )}
      onClick={onClick}
    />
  );
};

/* ------------------------------ Banner ------------------------------ */

interface BannerProps {
  className?: string;
  title: string;
  description?: string;
}

const Banner = ({ className, title, description }: BannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <BannerRoot className={className}>
      <BannerContent>
        <BannerTitle>{title}</BannerTitle>
        {description && <BannerDescription>{description}</BannerDescription>}
      </BannerContent>
      <BannerActions>
        <BannerCloseButton onClick={handleClose} />
      </BannerActions>
    </BannerRoot>
  );
};

/* ------------------------------ Exports ------------------------------ */

const BannerComposed = Object.assign(Banner, {
  Root: BannerRoot,
  Content: BannerContent,
  Title: BannerTitle,
  Description: BannerDescription,
  Actions: BannerActions,
  CloseButton: BannerCloseButton,
});

export {
  BannerComposed as Banner,
  BannerRoot,
  BannerContent,
  BannerTitle,
  BannerDescription,
  BannerActions,
  BannerCloseButton,
};
