"use client";

import { useId, useState, ComponentProps } from "react";
import { Terminal } from "lucide-react";
import { cn } from "@ui/lib/utils";
import { InputAddon } from "@ui/components/input-addon";
import { Toggle } from "@ui/components/toggle";
import { Clipboard } from "./clipboard";

interface InputCopyProps extends ComponentProps<typeof InputAddon> {
  value: string;
  readOnly?: boolean;
  className?: string;
}

export const InputCopy = ({
  value,
  readOnly = true,
  className,
  ...props
}: InputCopyProps) => {
  const id = useId();

  return (
    <InputAddon
      id={id}
      className={cn("px-3", className)}
      type="text"
      value={value}
      readOnly={readOnly}
      onFocus={(e) => e.target.select()}
      aria-label="Copy to clipboard"
      {...props}
    >
      <InputAddon.Right className="pe-2">
        <Clipboard text={value} />
      </InputAddon.Right>
    </InputAddon>
  );
};

interface InputCopyWithHeaderProps extends InputCopyProps {
  wrapperClassName?: string;
  headerContent: React.ReactNode;
}

const InputCopyWithHeader = ({
  value,
  readOnly,
  className,
  wrapperClassName,
  headerContent,
  ...props
}: InputCopyWithHeaderProps) => {
  return (
    <div
      className={cn(
        "relative bg-background-secondary rounded-lg",
        wrapperClassName
      )}
    >
      <div className="h-12 w-full flex items-center px-3 text-muted-foreground text-sm border-b border-border">
        {headerContent}
      </div>
      <InputCopy
        value={value}
        readOnly={readOnly}
        className={cn(
          "rounded-none h-12 border-0 text-muted-foreground bg-transparent text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
};

type InputCopyCLIProps = {
  commands: Record<"npm" | "pnpm" | "yarn" | "bun", string>;
  readOnly?: boolean;
  className?: string;
  wrapperClassName?: string;
};

export const InputCopyCLI = ({
  commands,
  readOnly = true,
  className,
  wrapperClassName,
}: InputCopyCLIProps) => {
  const [pm, setPm] = useState<keyof typeof commands>("npm");
  const packageManagers = Object.keys(commands) as (keyof typeof commands)[];

  return (
    <div className="pt-1.5">
      <InputCopyWithHeader
        value={commands[pm]}
        readOnly={readOnly}
        className={cn(
          "focus-visible:border-none focus-visible:ring-transparent focus-visible:ring-[0px]",
          className
        )}
        wrapperClassName={wrapperClassName}
        headerContent={
          <>
            <Terminal size={16} className="mr-2" />
            {packageManagers.map((manager) => (
              <Toggle
                key={manager}
                className="h-6 w-auto mr-1 hover:bg-transparent cursor-pointer"
                pressed={pm === manager}
                onPressedChange={() => setPm(manager)}
                aria-pressed={pm === manager}
              >
                {manager}
              </Toggle>
            ))}
          </>
        }
      />
    </div>
  );
};

interface InputCopyTerminalProps {
  command: string;
  readOnly?: boolean;
  className?: string;
  wrapperClassName?: string;
}

export const InputCopyTerminal = ({
  command,
  readOnly,
  className,
  wrapperClassName,
}: InputCopyTerminalProps) => {
  return (
    <InputCopyWithHeader
      value={command}
      readOnly={readOnly}
      className={className}
      wrapperClassName={wrapperClassName}
      headerContent={
        <>
          <Terminal size={16} className="mr-2" />
          <p>Terminal</p>
        </>
      }
    />
  );
};
