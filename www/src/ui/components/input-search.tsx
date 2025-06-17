"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/ui/components/button"
import { cn } from "@/src/lib/utils"

interface InputSearchProps {
  className?: string
  placeholder?: string
}

const InputSearch: React.FC<InputSearchProps> = ({
  className = "",
  placeholder = "Search",
}) => {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform))
  }, [])

  const handleClick = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      code: "KeyK",
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      className={cn(
        "relative w-full h-8 justify-start rounded-md text-sm font-normal text-muted-foreground sm:pr-12 md:w-40 md:flex-none lg:w-56 xl:w-64",
        className
      )}
      aria-label="Open search"
    >
      <span className="text-muted-foreground/50">{placeholder}</span>
      <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded-md bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs text-muted-foreground">{isMac ? "⌘" : "Ctrl"}</span>K
      </kbd>
    </Button>
  )
}

InputSearch.displayName = "InputSearch"

export { InputSearch }
