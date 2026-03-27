import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/cn";

function CardFrame({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "relative flex flex-col rounded-xl bg-accent text-card-foreground shadow-md border border-border/50",
      "*:data-[slot=card]:-m-px *:not-first:data-[slot=card]:rounded-t-lg *:not-last:data-[slot=card]:rounded-b-lg *:data-[slot=card]:shadow-none",
      "[--clip-bottom:-1rem] [--clip-top:-1rem]",
      className
    ),
    "data-slot": "card-frame",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function CardFrameHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "card-frame-header",
    className: cn("px-6 flex flex-col gap-0.5 py-4", className),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function CardFrameFooter({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "card-frame-footer",
    className: cn("flex items-center px-6 py-2", className),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function Card({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "card",
    className: cn(
      "bg-card flex flex-col gap-6 rounded-xl border py-4 shadow-md",
      className
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function CardHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "card-header",
    className: cn("px-6 flex flex-col gap-0.5", className),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function CardTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"h3">) {
  const defaultProps = {
    "data-slot": "card-title",
    className: cn(
      "text-lg text-card-foreground leading-none font-semibold",
      className
    ),
  };

  return useRender({
    defaultTagName: "h3",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function CardDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"p">) {
  const defaultProps = {
    "data-slot": "card-description",
    className: cn("ui-description", className),
  };

  return useRender({
    defaultTagName: "p",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function CardBody({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "card-body",
    className: cn("px-6 flex-1", className),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

function CardFooter({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "card-footer",
    className: cn("flex items-center px-6", className),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps(defaultProps, props),
    render,
  });
}

const CardExports = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

const CardFrameExports = Object.assign(CardFrame, {
  Frame: CardFrame,
  Header: CardFrameHeader,
  Footer: CardFrameFooter,
  Title: CardTitle,
  Description: CardDescription,
});

export {
  CardExports as Card,
  CardFrameExports as CardFrame,
  CardFrameHeader,
  CardFrameFooter,
  CardTitle as CardFrameTitle,
  CardDescription as CardFrameDescription,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
};
