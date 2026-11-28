"use client";

import { Button } from "@rlz/ui/components/ui/button";
import { DialogTrigger } from "@rlz/ui/components/ui/dialog";
import { Plus } from "lucide-react";

import { dialogHandle } from "./project-dialog";

export function NewProjectButton() {
  return (
    <DialogTrigger
      handle={dialogHandle}
      render={
        <Button
          aria-label="Open new project"
          className="w-fit self-start"
        />
      }
    >
      <Plus />
      New
    </DialogTrigger>
  );
}
