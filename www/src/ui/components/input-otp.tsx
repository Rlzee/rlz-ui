"use client";

import {
  ComponentProps,
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useRef,
  Children,
} from "react";
import { Input } from "./input";
import { cn } from "@/src/lib/utils";

/* ---------------------------- Context Input Otp ---------------------------- */

type inputType = "number" | "alphanumeric";

type InputOtpContextType = {
  type: inputType;
  group: boolean;
  onComplete?: (value: string) => void;
};

const InputOtpContext = createContext<InputOtpContextType>({
  type: "number",
  group: false,
});

/* ---------------------------- Provider Input Otp ---------------------------- */

const InputOtpProvider = ({
  children,
  type,
  group,
  onComplete,
}: {
  children: ReactNode;
  type: inputType;
  group: boolean;
  onComplete?: (value: string) => void;
}) => (
  <InputOtpContext.Provider value={{ type, group, onComplete }}>
    {children}
  </InputOtpContext.Provider>
);

/* ---------------------------- Input Otp ---------------------------- */

const InputOtp = ({
  className,
  children,
  type = "number",
  onComplete,
}: {
  className?: string;
  children: ReactNode;
  type?: inputType;
  onComplete?: (value: string) => void;
}) => {
  let hasGroup = false;

  const parsed = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const typedChild = child as ReactElement<any>;

    if (typedChild.type === InputOtpGroup) {
      hasGroup = true;

      const groupChildren = Children.map(
        typedChild.props.children as ReactNode,
        (slot, index) => {
          if (!isValidElement(slot)) return slot;

          const typedSlot = slot as ReactElement<any>;
          if (typedSlot.type === InputOtpSlot) {
            return cloneElement(typedSlot, { index });
          }
          return typedSlot;
        }
      );

      return cloneElement(typedChild, { children: groupChildren });
    }

    if (typedChild.type === InputOtpSlot) {
      return cloneElement(typedChild, { index: 0 });
    }

    return typedChild;
  });

  return (
    <div
      className={cn("flex gap-2", className)}
      data-otp-container
      role="group"
      aria-label="OTP input"
    >
      <InputOtpProvider type={type} group={hasGroup} onComplete={onComplete}>
        {parsed}
      </InputOtpProvider>
    </div>
  );
};

/* ---------------------------- Input Otp Slot ---------------------------- */

type InputOtpSlotProps = ComponentProps<typeof Input> & {
  index?: number;
};

const InputOtpSlot = ({ className, index, ...props }: InputOtpSlotProps) => {
  const { type, group, onComplete } = useContext(InputOtpContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const clean =
      type === "number"
        ? val.replace(/[^0-9]/g, "")
        : val.replace(/[^a-zA-Z0-9]/g, "");

    e.target.value = clean.slice(0, 1);

    if (clean) {
      const container = e.target.closest("[data-otp-container]");
      if (!container) return;

      const inputs = Array.from(
        container.querySelectorAll("input")
      ) as HTMLInputElement[];

      const index = inputs.indexOf(e.target);
      const next = inputs[index + 1];
      if (next) next.focus();

      const allFilled = inputs.every((i) => i.value.length === 1);
      if (allFilled && onComplete) {
        const code = inputs.map((i) => i.value).join("");
        onComplete(code);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const container = target.closest("[data-otp-container]");

    if (!container) return;
    const inputs = Array.from(
      container.querySelectorAll("input")
    ) as HTMLInputElement[];
    const index = inputs.indexOf(target);

    if (e.key === "Backspace" && !target.value && inputs[index - 1]) {
      inputs[index - 1].focus();
    }

    if (e.key === "ArrowLeft" && inputs[index - 1]) {
      inputs[index - 1].focus();
    }

    if (e.key === "ArrowRight" && inputs[index + 1]) {
      inputs[index + 1].focus();
    }

    props.onKeyDown?.(e);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");

    const container = e.currentTarget.closest("[data-otp-container]");
    if (!container) return;

    const inputs = Array.from(
      container.querySelectorAll("input")
    ) as HTMLInputElement[];
    const index = inputs.indexOf(e.currentTarget);

    let clean =
      type === "number"
        ? paste.replace(/[^0-9]/g, "")
        : paste.replace(/[^a-zA-Z0-9]/g, "");

    clean = clean.slice(0, inputs.length - index);

    clean.split("").forEach((char, i) => {
      const input = inputs[index + i];
      if (input) {
        input.value = char;
        const event = new Event("input", { bubbles: true });
        input.dispatchEvent(event);
      }
    });

    const last = inputs[index + clean.length - 1];
    if (last) last.focus();
  };

  const handleFocus = () => {
    inputRef.current?.select();
  };

  return (
    <Input
      ref={inputRef}
      data-slot="input-otp-slot"
      data-index={index}
      type="text"
      inputMode={type === "number" ? "numeric" : "text"}
      maxLength={1}
      aria-label="OTP character"
      autoComplete="one-time-code"
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      className={cn(
        "w-10 h-10 text-center text-2xl font-bold",
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
      {...props}
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
}) => (
  <div
    data-slot="input-otp-group"
    data-otp-group
    className={cn("flex", className)}
  >
    {children}
  </div>
);

/* ---------------------------- Input Otp Separator ---------------------------- */

const InputOtpSeparator = ({
  className,
}: {
  className?: string;
  children?: ReactNode;
}) => (
  <div
    data-slot="input-otp-separator"
    className={cn("flex items-center justify-center", className)}
  >
    <span className="w-4 h-0.5 bg-muted-foreground" />
  </div>
);

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
