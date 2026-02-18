import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

function Card({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "data-slot": "card",
    className: cn(
      "bg-card flex flex-col gap-6 rounded-lg border py-4",
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
}: useRender.ComponentProps<"header">) {
  const defaultProps = {
    "data-slot": "card-header",
    className: cn("px-6 flex flex-col gap-0.5", className),
  };

  return useRender({
    defaultTagName: "header",
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
    className: cn("ui-title", className),
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
}: useRender.ComponentProps<"footer">) {
  const defaultProps = {
    "data-slot": "card-footer",
    className: cn("flex items-center px-6", className),
  };

  return useRender({
    defaultTagName: "footer",
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

export {
  CardExports as Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
};
