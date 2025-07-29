"use client";

import { InputAddon } from "@/src/ui/components/input-addon";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ComponentProps, useState } from "react";

const InputPassword = ({
  className,
  reverse = false,
  ...props
}: ComponentProps<typeof InputAddon> & { reverse?: boolean }) => {
  const [visible, setVisible] = useState(false);

  return (
    <InputAddon
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
    >
      {reverse ? (
        <InputAddon.Right>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide the password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </InputAddon.Right>
      ) : (
        <InputAddon.Left>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide the password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </InputAddon.Left>
      )}
    </InputAddon>
  );
};

export { InputPassword };
