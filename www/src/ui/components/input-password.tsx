"use client";

import { useState } from "react";
import { Input } from "./input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ComponentProps } from "react";

const InputPassword = ({
  className,
  ...props
}: ComponentProps<typeof Input>) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        data-slot="input-password"
        autoComplete="current-password"
        autoCorrect="off"
        spellCheck="false"
        inputMode="text"
        autoCapitalize="off"
        placeholder="Password"
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Hide the password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

export { InputPassword };
