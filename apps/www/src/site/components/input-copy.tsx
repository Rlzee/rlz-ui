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
      className={cn("pe-9", className)}
      type="text"
      value={value}
      readOnly={readOnly}
      onFocus={(e) => e.target.select()}
      aria-label="Copier le contenu"
      {...props}
    >
      <InputAddon.Right className="pe-0">
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
    <div className={cn("relative", wrapperClassName)}>
      <div className="bg-background-secondary border border-border rounded-t-lg h-12 absolute left-0 bottom-7 w-full flex items-center px-3 text-muted-foreground text-sm pb-1">
        {headerContent}
      </div>
      <InputCopy
        value={value}
        readOnly={readOnly}
        className={cn("rounded-lg", className)}
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
    <InputCopyWithHeader
      value={commands[pm]}
      readOnly={readOnly}
      className={className}
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
