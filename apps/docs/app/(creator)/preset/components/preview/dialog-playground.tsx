"use client";

import { createElement, type ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { PresetComponentCustomization } from "@rlz/registry";
import { XClose } from "@rlz/ui/components/base/x-close";
import { Button } from "@rlz/ui/components/ui/button";
import { Dialog, dialogPopupVariants } from "@rlz/ui/components/ui/dialog";
import { Input } from "@rlz/ui/components/ui/input";
import { cn } from "@rlz/ui/lib/cn";
import { currentBool } from "../../lib/component-edits";
import {
  playgroundVariant,
  resolvePreviewClasses,
} from "../../lib/playground-component";

export function DialogPlayground({
  edit,
}: {
  edit?: PresetComponentCustomization;
}) {
  const variant = playgroundVariant("dialog", "variant", edit);
  const native = variant.native as ComponentProps<typeof Dialog>["variant"];
  const classes = (slot: string, defaults = "") =>
    resolvePreviewClasses("dialog", `dialog-${slot}`, defaults, edit, [variant]);

  const renderPart =
    <Tag extends "div" | "h2" | "p">(tag: Tag, slot: string) =>
    (props: ComponentProps<Tag>) =>
      createElement(tag, { ...props, className: classes(slot, props.className) });

  return (
    <div className="flex flex-col items-center gap-4 p-8 text-center">
      <Dialog variant={native}>
        <Dialog.Trigger
          className={classes("trigger")}
          render={<Button variant="outline" />}
        >
          Open dialog
        </Dialog.Trigger>
        {/* The packaged Popup owns its portal and backdrop. Compose just that
            shell here so the Creator can style both without changing its API. */}
        <Dialog.Portal className={classes("portal")}>
          {currentBool("backdrop", edit) && (
            <Dialog.Backdrop
              blur={currentBool("backdropBlur", edit)}
              className={classes("backdrop")}
            />
          )}
          <Dialog.Viewport>
            <DialogPrimitive.Popup
              data-slot="dialog-popup"
              className={classes(
                "popup",
                cn(dialogPopupVariants({ variant: native }))
              )}
            >
              <Dialog.Header render={renderPart("div", "header")}>
                <Dialog.Title render={renderPart("h2", "title")}>
                  Edit profile
                </Dialog.Title>
                <Dialog.Description render={renderPart("p", "description")}>
                  Change how your profile appears to others.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body render={renderPart("div", "body")}>
                <label className="flex flex-col gap-2">
                  Display name
                  <Input defaultValue="Rlz UI" />
                </label>
              </Dialog.Body>
              <Dialog.Footer render={renderPart("div", "footer")}>
                <Dialog.Close render={<Button variant="outline" />}>
                  Cancel
                </Dialog.Close>
                <Dialog.Close render={<Button />}>Save changes</Dialog.Close>
              </Dialog.Footer>
              {currentBool("showCloseButton", edit) && (
                <Dialog.Close
                  data-slot="dialog-close-button"
                  render={<XClose />}
                />
              )}
            </DialogPrimitive.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog>
      <p className="text-xs text-muted-foreground">{variant.value}</p>
    </div>
  );
}
