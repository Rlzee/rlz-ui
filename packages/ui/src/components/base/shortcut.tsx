import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";

export function Shortcut({
  className,
  render,
  ...props
}: useRender.ComponentProps<"kbd">) {
  const defaultProps = {
    "data-slot": "shortcut",
    className: cn(
      "text-muted-foreground/30 ml-auto text-xs tracking-widest",
      className,
    ),
  };

  return useRender({
    defaultTagName: "kbd",
    props: mergeProps<"kbd">(defaultProps, props),
    render,
  });
}
