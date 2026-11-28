import { AlertDialog } from "@rlz/ui/components/ui/alert-dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { Info } from "lucide-react";

export default function Example() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger render={<Button variant="outline" />}>
        Open Alert Dialog
      </AlertDialog.Trigger>
      <AlertDialog.Popup>
        <AlertDialog.Media>
          <Info aria-hidden="true" />
        </AlertDialog.Media>
        <AlertDialog.Title>Continue to the next step?</AlertDialog.Title>
        <AlertDialog.Description>
          You are about to move to the next step. You can review your choices
          before continuing.
        </AlertDialog.Description>
        <AlertDialog.Actions>
          <AlertDialog.Close render={<Button variant="ghost" />}>
            Cancel
          </AlertDialog.Close>
          <AlertDialog.Close render={<Button />}>
            Continue
          </AlertDialog.Close>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog>
  );
}
