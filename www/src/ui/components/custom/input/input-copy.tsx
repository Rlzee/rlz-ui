"use client";

import { useId, useRef, useState } from "react";
import { CheckIcon, CopyIcon, Terminal } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { InputAddon } from "@/src/ui/components/input-addon";
import { Tooltip } from "@/src/ui/components/tooltip";
import { Toggle } from "@/src/ui/components/toggle";

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
    <InputAddon
      data-slot="input-copy"
      ref={inputRef}
      id={id}
      className={cn("pe-9", className)}
      type="text"
      defaultValue={value}
      readOnly={readOnly}
    >
      <InputAddon.Right>
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
      </InputAddon.Right>
    </InputAddon>
  );
};

type InputCopyCLIProps = {
  commands: {
    npm: string;
    pnpm: string;
    yarn: string;
    bun: string;
  };
  readOnly?: boolean;
  className?: string;
};

const InputCopyCLI = ({
  commands,
  readOnly = true,
  className,
}: InputCopyCLIProps) => {
  const id = useId();
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedPackageManager, setSelectedPackageManager] = useState<keyof typeof commands>("npm");
  const inputRef = useRef<HTMLInputElement>(null);

  const packageManagers = Object.keys(commands) as Array<keyof typeof commands>;

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handlePackageManagerChange = (packageManager: keyof typeof commands) => {
    setSelectedPackageManager(packageManager);
    // Update the input value based on the selected package manager
    if (inputRef.current) {
      inputRef.current.value = commands[packageManager];
    }
  };

  return (
    <div className="relative">
      <div className="bg-secondary rounded-t-md h-10 absolute left-0 bottom-8 w-full flex items-center justify-start px-3 text-muted-foreground text-sm pb-1">
        <Terminal size={16} className="text-foreground mr-2" />
        {packageManagers.map((pm) => (
          <Toggle
            key={pm}
            className="h-6 w-auto"
            pressed={selectedPackageManager === pm}
            onPressedChange={() => handlePackageManagerChange(pm)}
          >
            <span>{pm}</span>
          </Toggle>
        ))}
      </div>
      <InputAddon
        data-slot="input-copy"
        ref={inputRef}
        id={id}
        className={cn("pe-9", className)}
        type="text"
        defaultValue={commands[selectedPackageManager]}
        readOnly={readOnly}
      >
        <InputAddon.Right>
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
        </InputAddon.Right>
      </InputAddon>
    </div>
  );
};

export { InputCopy, InputCopyCLI };
