import * as React from "react";
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import {
  PopupArrow,
  type PopupArrowPublicProps as ArrowType,
} from "@/components/base/popup-arrow";
import { cn } from "@/lib/utils";

/* ------------------------------ Root PreviewCard ------------------------------ */

function PreviewCardRoot(
  props: React.ComponentProps<typeof PreviewCardPrimitive.Root>
) {
  return <PreviewCardPrimitive.Root data-slot="preview-card" {...props} />;
}

/* ------------------------------ PreviewCard Trigger ------------------------------ */

function PreviewCardTrigger(
  props: React.ComponentProps<typeof PreviewCardPrimitive.Trigger>
) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="preview-card-trigger" {...props} />
  );
}

/* ------------------------------ PreviewCard Popup ------------------------------ */

type PreviewCardPopupProps = React.ComponentProps<
  typeof PreviewCardPrimitive.Popup
> & {
  backdrop?: boolean;
  backdropProps?: React.ComponentProps<typeof PreviewCardPrimitive.Backdrop>;
  positionerProps?: React.ComponentProps<
    typeof PreviewCardPrimitive.Positioner
  >;
};

function PreviewCardPopup({
  className,
  backdrop = false,
  backdropProps,
  positionerProps = {
    sideOffset: 8,
  },
  ...props
}: PreviewCardPopupProps) {
  return (
    <PreviewCardPrimitive.Portal data-slot="preview-card-portal">
      {backdrop && (
        <PreviewCardPrimitive.Backdrop
          data-slot="preview-card-backdrop"
          {...backdropProps}
        />
      )}
      <PreviewCardPrimitive.Positioner
        data-slot="preview-card-positioner"
        {...positionerProps}
      >
        <PreviewCardPrimitive.Popup
          data-slot="preview-card-popup"
          className={cn(
            "flex w-60 origin-(--transform-origin) flex-col gap-2 rounded-lg bg-popover p-2 shadow-md outline-1 outline-border transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1",
            className
          )}
          {...props}
        >
          {props.children}
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

/* ------------------------------ PreviewCard Arrow ------------------------------ */

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

/* ------------------------------ PreviewCard Component ------------------------------ */

type PreviewCardComponent = React.ComponentProps<
  typeof PreviewCardPrimitive.Root
> & {
  children: React.ReactNode;
  triggerRender?: React.ComponentProps<
    typeof PreviewCardPrimitive.Trigger
  >["render"];
  popupContent?: React.ReactNode;
  popupProps?: React.ComponentProps<typeof PreviewCardPopup>;
  arrow?: boolean;
  arrowProps?: React.ComponentProps<typeof PreviewCardArrow>;
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

/* ------------------------------ Exports ------------------------------ */

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
