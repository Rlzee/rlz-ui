"use client";

import { Dialog } from "@/src/ui/components/dialog";
import { Button, ButtonVariant } from "@/src/ui/components/button";
import { useDialog } from "@/src/ui/stores/dialog.store";
import { useId } from "react";

const ALERT_DIALOG_NAME = "alert-dialog";

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
  const { getDialogState, closeDialog, getDialogParams } = useDialog();
  const isOpen = getDialogState(ALERT_DIALOG_NAME);

  const params = getDialogParams(ALERT_DIALOG_NAME) as AlertDialogParams;
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
      closeDialog(ALERT_DIALOG_NAME);
    }
  };

  if (!params) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => closeDialog(ALERT_DIALOG_NAME)}
      data-slot="alert-dialog"
    >
      <Dialog.Content
        data-slot="alert-dialog-content"
        role="alert-dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <Dialog.Header data-slot="alert-dialog-header">
          <Dialog.Title id={titleId} data-slot="alert-dialog-title">
            {title}
          </Dialog.Title>
          <Dialog.Description
            id={descriptionId}
            data-slot="alert-dialog-description"
          >
            {description}
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer data-slot="alert-dialog-footer">
          <Button
            variant={params?.CloseVariant || "outline"}
            data-slot="alert-dialog-close-button"
            onClick={() => closeDialog(ALERT_DIALOG_NAME)}
          >
            {params?.CloseText || "Close"}
          </Button>
          <Button
            variant={params?.ConfirmVariant || "primary"}
            data-slot="alert-dialog-confirm-button"
            onClick={handleConfirm}
            autoFocus
          >
            {params?.ConfirmText || "Confirm"}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

export { AlertDialog, ALERT_DIALOG_NAME };
