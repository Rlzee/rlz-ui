"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/dialog";
import { Button, ButtonVariant } from "@/src/ui/components/button";
import { usePortal } from "@/src/ui/stores/portal.store";
import { useId } from "react";

const AlertDialogPortalName = "alert-dialog";

export type AlertDialogParams = {
  ConfirmText?: string;
  CloseText?: string;
  ConfirmVariant?: ButtonVariant;
  CloseVariant?: ButtonVariant;
  title?: string;
  description?: string;
  onConfirm?: () => void | Promise<void>;
};

const AlertDialog = () => {
  const { getPortalState, closePortal, getPortalParams } = usePortal();
  const isOpen = getPortalState(AlertDialogPortalName);

  const params = getPortalParams(AlertDialogPortalName) as AlertDialogParams;
  const title = params?.title || "Are you absolutely sure?";
  const description = params?.description || "This action cannot be undone.";
  const onConfirm = (params?.onConfirm as () => void) || (() => {});

  // Generate unique IDs for ARIA attributes
  const titleId = useId();
  const descriptionId = useId();

  const handleConfirm = async () => {
    try {
      await Promise.resolve(onConfirm());
    } finally {
      closePortal(AlertDialogPortalName);
    }
  };

  if (!params) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => closePortal(AlertDialogPortalName)}
      data-slot="alert-dialog"
    >
      <DialogContent
        data-slot="alert-dialog-content"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader data-slot="alert-dialog-header">
          <DialogTitle id={titleId} data-slot="alert-dialog-title">
            {title}
          </DialogTitle>
          <DialogDescription
            id={descriptionId}
            data-slot="alert-dialog-description"
          >
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter data-slot="alert-dialog-footer">
          <Button
            variant={params?.CloseVariant || "secondary"}
            data-slot="alert-dialog-close-button"
            onClick={() => closePortal(AlertDialogPortalName)}
          >
            {params?.CloseText || "Close"}
          </Button>
          <Button
            variant={params?.ConfirmVariant || "primary"}
            data-slot="alert-dialog-confirm-button"
            onClick={handleConfirm}
          >
            {params?.ConfirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AlertDialog, AlertDialogPortalName };
