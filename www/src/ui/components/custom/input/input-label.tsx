"use client"

import { useId } from "react"
import { Input } from "@/src/ui/components/input"
import { cn } from "@/src/lib/utils"

interface InputLabelProps extends React.ComponentProps<typeof Input> {
    labelText?: string
    className?: string
}

const InputLabel = ({ labelText, className, ...props}: InputLabelProps) => {
  const id = useId()

  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
      >
        {labelText}
      </label>
      <Input id={id} className={cn("h-10 bg-background", className)} {...props} />
    </div>
  )
}

export { InputLabel }
