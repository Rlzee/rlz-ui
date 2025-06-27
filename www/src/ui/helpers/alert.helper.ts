import { AlertDialogParams, AlertDialogName } from "@/src/ui/components/alert-dialog";
import { useDialog } from "@/src/ui/stores/dialog.store";

export function alert(params: AlertDialogParams) {
  const state = useDialog.getState();

  if (!state) {
    console.warn("Dialog store not initialized.");
    return;
  }

  state.openDialog(AlertDialogName, params);
}

