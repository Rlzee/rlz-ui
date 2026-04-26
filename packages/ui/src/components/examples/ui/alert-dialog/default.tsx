import { AlertDialog } from "@rlz/ui/components/ui/alert-dialog";
import { Button } from "@rlz/ui/components/ui/button";

export default function Example() {
  return (
    <AlertDialog>
      <AlertDialog.Trigger render={<Button variant="outline" />}>
        Open Alert Dialog
      </AlertDialog.Trigger>
      <AlertDialog.Popup>
        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialog.Description>
        <AlertDialog.Actions>
          <AlertDialog.Close render={<Button variant="ghost" />}>
            Cancel
          </AlertDialog.Close>
          <AlertDialog.Close render={<Button />}>Continue</AlertDialog.Close>
        </AlertDialog.Actions>
      </AlertDialog.Popup>
    </AlertDialog>
  );
}
