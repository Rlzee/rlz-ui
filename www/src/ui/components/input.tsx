import * as React from "react"
import { cn } from "@/src/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input: React.FC<InputProps> = ({ className, type = "text", ...props }) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/50 selection:text-secondary-foreground bg-input/50 flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:shadow-none shadow-xs",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

Input.displayName = "Input"

export { Input }
