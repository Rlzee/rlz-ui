"use client";

import { useId, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Input } from "@/src/ui/components/input";
import { Tooltip } from "@/src/ui/components/tooltip";

type InputCopyProps = {
  value: string;
  readOnly?: boolean;
  className?: string;
};

const InputCopy = ({ value, readOnly = true, className }: InputCopyProps) => {
  const id = useId();
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        className={cn("pe-9", className)}
        type="text"
        defaultValue={value}
        readOnly={readOnly}
      />
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleCopy}
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            disabled={copied}
          >
            <div
              className={cn(
                "transition-all",
                copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            >
              <CheckIcon
                className="stroke-emerald-500"
                size={16}
                aria-hidden="true"
              />
            </div>
            <div
              className={cn(
                "absolute transition-all",
                copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}
            >
              <CopyIcon size={16} aria-hidden="true" />
            </div>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content className="px-2 py-1 text-xs">
          {copied ? "Copied!" : "Copy to clipboard"}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
};

export { InputCopy };
