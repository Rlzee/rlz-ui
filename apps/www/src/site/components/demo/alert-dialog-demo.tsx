import { AlertDialog, ALERT_DIALOG_NAME } from "@ui/components/alert-dialog";
import { Button } from "@ui/components/button";
import { useDialog } from "@ui/stores/dialog.store";

const code = `import { ALERT_DIALOG_NAME } from "@ui/components/alert-dialog";
import { Button } from "@ui/components/button";
import { useDialog } from "@ui/stores/dialog.store";

export default function Example() {
  const { openDialog } = useDialog();
  return (
    <Button variant="secondary" onClick={() => openDialog(ALERT_DIALOG_NAME)}>
      Open Alert Dialog
    </Button>
  );
}`;

const Component = () => {
  const { openDialog } = useDialog();

  return (
    <>
      <div className="flex items-center justify-center mx-auto">
        <Button
          variant="secondary"
          onClick={() => openDialog(ALERT_DIALOG_NAME)}
        >
          Open Alert Dialog
        </Button>
      </div>

      <AlertDialog />
    </>
  );
};

export const AlertDialogDemo = {
  code,
  component: <Component />,
};
