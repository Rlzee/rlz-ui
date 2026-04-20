import { Button, type ButtonProps } from "@rlz/ui/components/ui/button";
import { useCopyToClipboard } from "@rlz/ui/hooks/use-copy-to-clipboard";
import { cn } from "@rlz/ui/lib/cn";
import { Copy, Check } from "lucide-react";

type CopyButtonProps = ButtonProps & {
  code: string;
};

export function CopyButton({
  size = "icon-sm",
  variant = "ghost",
  code = "",
  className,
  ...props
}: CopyButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      data-slot="copy-button"
      size={size}
      variant={variant}
      className={cn("text-muted-foreground", className)}
      onClick={() => copyToClipboard(code)}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {isCopied ? <Check className="text-success" /> : <Copy />}
    </Button>
  );
}
