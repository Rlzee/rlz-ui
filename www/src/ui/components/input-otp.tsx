"use client";

import {
  ComponentProps,
  ReactNode,
  useContext,
  createContext,
  isValidElement,
  Children,
} from "react";
import { Input } from "./input";
import { cn } from "@/src/lib/utils";

/* ---------------------------- Context Input Otp ---------------------------- */

type inputType = "number" | "alphanumeric";

type InputOtpContext = {
  type?: inputType;
  group?: boolean;
};

const InputOtpContext = createContext<InputOtpContext>({
  type: "number",
  group: false,
});

/* ---------------------------- Provider Input Otp ---------------------------- */

const InputOtpProvider = ({
  children,
  type,
  group,
}: {
  children: ReactNode;
  type?: inputType;
  group?: boolean;
}) => {
  return (
    <InputOtpContext.Provider value={{ type, group }}>
      {children}
    </InputOtpContext.Provider>
  );
};

/* ---------------------------- Input Otp ---------------------------- */

const InputOtp = ({
  className,
  children,
  type = "number",
}: {
  className?: string;
  children: ReactNode;
  type?: inputType;
}) => {
  let Group = false;

  const parsed = Children.map(children, (c) => {
    if (isValidElement(c) && c.type === InputOtpGroup) Group = true;
    return c;
  });
  
  return (
    <div className={cn("flex gap-2", className)} data-otp-container>
      <InputOtpProvider
        data-slot="input-otp-provider"
        type={type}
        group={Group}
      >
        {parsed}
      </InputOtpProvider>
    </div>
  );
};

/* ---------------------------- Input Otp Slot ---------------------------- */

const InputOtpSlot = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Input>) => {
  const { type, group } = useContext(InputOtpContext);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let cleanValue = "";

    if (type === "number") {
      cleanValue = val.replace(/[^0-9]/g, "").slice(0, 1);
    } else {
      cleanValue = val.replace(/[^a-zA-Z0-9]/g, "").slice(0, 1);
    }

    e.target.value = cleanValue;

    if (cleanValue) {
      const currentInput = e.target;
      const container = currentInput.closest("[data-otp-container]");

      if (container) {
        const allInputs = container.querySelectorAll("input");
        const currentIndex = Array.from(allInputs).indexOf(currentInput);
        const nextInput = allInputs[currentIndex + 1] as HTMLInputElement;

        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !e.currentTarget.value) {
      const currentInput = e.currentTarget;
      const container = currentInput.closest("[data-otp-container]");

      if (container) {
        const allInputs = container.querySelectorAll("input");
        const currentIndex = Array.from(allInputs).indexOf(currentInput);
        const prevInput = allInputs[currentIndex - 1] as HTMLInputElement;

        if (prevInput) {
          prevInput.focus();
        }
      }
    }

    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");

    const currentInput = e.currentTarget;
    const container = currentInput.closest("[data-otp-container]");

    if (container) {
      const allInputs = Array.from(container.querySelectorAll("input"));
      const currentIndex = allInputs.indexOf(currentInput);

      let cleanText = paste;
      if (type === "number") {
        cleanText = paste.replace(/[^0-9]/g, "");
      } else {
        cleanText = paste.replace(/[^a-zA-Z0-9]/g, "");
      }

      for (let i = 0; i < cleanText.length; i++) {
        const input = allInputs[currentIndex + i] as
          | HTMLInputElement
          | undefined;
        if (input) {
          input.value = cleanText[i];
          const event = new Event("input", { bubbles: true });
          input.dispatchEvent(event);
        }
      }

      const lastInput = allInputs[
        currentIndex + cleanText.length - 1
      ] as HTMLInputElement;
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  return (
    <Input
      data-slot="input-otp-slot"
      {...props}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      inputMode={type === "number" ? "numeric" : "text"}
      className={cn(
        "w-9 h-9 text-center text-2xl font-bold",
        group
          ? [
              "first:rounded-l-md first:rounded-r-none",
              "last:rounded-r-md last:rounded-l-none",
              "[&:not(:first-child):not(:last-child)]:rounded-none",
              "focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-offset-0",
              "[&:not(:first-child)]:-ml-px",
            ]
          : "",
        className
      )}
      type="text"
    />
  );
};

/* ---------------------------- Input Otp Group ---------------------------- */

const InputOtpGroup = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex", className)}
      data-otp-group
    >
      {children}
    </div>
  );
};

/* ---------------------------- Input Otp Separator ---------------------------- */

const InputOtpSeparator = ({
  className,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      data-slot="input-otp-separator"
      className={cn("flex items-center justify-center", className)}
    >
      <span className="w-4 h-0.5 bg-muted-foreground" />
    </div>
  );
};

/* ---------------------------- Exports ---------------------------- */

const InputOtpComposed = Object.assign(InputOtp, {
  Slot: InputOtpSlot,
  Group: InputOtpGroup,
  Separator: InputOtpSeparator,
});

export {
  InputOtpComposed as InputOtp,
  InputOtpSlot,
  InputOtpGroup,
  InputOtpSeparator,
};
