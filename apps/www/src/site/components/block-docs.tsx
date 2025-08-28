import { ReactNode } from "react";

const BlockDocs = ({
  title,
  description,
  className,
  children,
}: {
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div className={className}>
      <h1 className="text-foreground text-lg">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
      {children}
    </div>
  );
};

export { BlockDocs };
