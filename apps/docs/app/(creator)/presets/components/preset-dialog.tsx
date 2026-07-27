import type { ReactNode } from "react";
import { Dialog } from "@rlz/ui/components/ui/dialog";
import { Button } from "@rlz/ui/components/ui/button";
import { Braces } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Pre } from "@/components/Pre";

export function PresetDialog({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <Dialog.Trigger render={<Button variant="ghost" size="sm" />}>
        <Braces />
        Preset
      </Dialog.Trigger>
      <Dialog.Popup className="max-w-3xl">
        <Dialog.Header>
          <Dialog.Title>{name}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <CodeBlock>
            <Pre>{children}</Pre>
          </CodeBlock>
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
}
