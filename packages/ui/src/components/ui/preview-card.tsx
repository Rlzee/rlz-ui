import * as React from "react";
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/ui/base/popup-arrow";
import { cn } from "@/lib/utils";

function PreviewCardRoot(props: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="preview-card" {...props} />;
}

function PreviewCardTrigger(props: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="preview-card-trigger" {...props} />
  );
}

function PreviewCardBackdrop({
  className,
  ...props
}: PreviewCardPrimitive.Backdrop.Props) {
  return (
    <PreviewCardPrimitive.Backdrop
      data-slot="preview-card-backdrop"
      className={cn("fixed inset-0", className)}
      {...props}
    />
  );
}

function PreviewCardPositioner(props: PreviewCardPrimitive.Positioner.Props) {
  return (
    <PreviewCardPrimitive.Positioner
      data-slot="preview-card-positioner"
      {...props}
    />
  );
}

function PreviewCardPopup({
  className,
  backdrop = false,
  backdropProps,
  positionerProps,
  ...props
}: PreviewCardPrimitive.Popup.Props & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof PreviewCardBackdrop>;
  positionerProps?: React.ComponentProps<typeof PreviewCardPositioner>;
}) {
  const {
    sideOffset = 6,
    className: positionerClassName,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <PreviewCardPrimitive.Portal data-slot="preview-card-portal">
      {backdrop && (
        <PreviewCardBackdrop
          className={backdropProps?.className}
          {...backdropProps}
        />
      )}
      <PreviewCardPositioner
        {...restPositionerProps}
        sideOffset={sideOffset}
        className={positionerClassName}
      >
        <PreviewCardPrimitive.Popup
          data-slot="preview-card-popup"
          className={cn(
            "flex w-60 origin-(--transform-origin) flex-col gap-2 rounded-lg bg-popover text-popover-foreground p-2 shadow-md outline-1 outline-border transition-[transform,scale,opacity] dark:shadow-none dark:-outline-offset-1",
            "data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0",
            className,
          )}
          {...props}
        >
          {props.children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPositioner>
    </PreviewCardPrimitive.Portal>
  );
}

function PreviewCardArrow(props: ArrowType) {
  return (
    <PopupArrow
      data-slot="preview-card-arrow"
      border={2}
      baseComponent={PreviewCardPrimitive.Arrow}
      {...props}
    />
  );
}

type PreviewCardComponent = PreviewCardPrimitive.Root.Props & {
  arrow?: boolean;
  arrowProps?: React.ComponentProps<typeof PreviewCardArrow>;
  children: React.ReactNode;
  triggerRender?: PreviewCardPrimitive.Trigger.Props["render"];
  popupContent?: React.ReactNode;
  popupProps?: React.ComponentProps<typeof PreviewCardPopup>;
};

function PreviewCard({
  children: childrenTrigger,
  triggerRender,
  popupContent,
  popupProps,
  arrow = true,
  arrowProps,
  ...props
}: PreviewCardComponent) {
  return (
    <PreviewCardRoot {...props}>
      <PreviewCardTrigger render={triggerRender}>
        {childrenTrigger}
      </PreviewCardTrigger>
      <PreviewCardPopup {...popupProps}>
        {arrow && <PreviewCardArrow {...arrowProps} />}
        {popupContent}
      </PreviewCardPopup>
    </PreviewCardRoot>
  );
}

const PreviewCardExports = Object.assign(PreviewCard, {
  Root: PreviewCardRoot,
  Trigger: PreviewCardTrigger,
  Popup: PreviewCardPopup,
  Arrow: PreviewCardArrow,
});

export {
  PreviewCardExports as PreviewCard,
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardPopup,
  PreviewCardArrow,
};
