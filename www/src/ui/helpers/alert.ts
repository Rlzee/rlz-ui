import { AlertDialogParams, AlertDialogPortalName } from "@/src/ui/components/alert-dialog";
import { usePortal } from "@/src/ui/stores/dialog.store";

export function alert(params: AlertDialogParams) {
  const state = usePortal.getState();

  if (!state) {
    console.warn("Portal store not initialized.");
    return;
  }

  state.openPortal(AlertDialogPortalName, params);
}

