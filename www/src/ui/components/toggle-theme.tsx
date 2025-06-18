'use client'

import * as React from 'react'
import { MoonStar, SunDim } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/src/lib/utils'
import { Button } from '@/src/ui/components/button'

const ThemeToggle = ({ className, ...props }: React.ComponentProps<"button"> ) => {
  const [mounted, setMounted] = React.useState(false)
  const { theme = 'light', setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn("rounded-md", className)} aria-label="Toggle theme">
        <SunDim className="size-5" />
      </Button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <Button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      variant="ghost"
      size="icon"
      className={cn("rounded-md", className)}
      aria-label="Toggle theme"
      {...props}
    >
      {isDark ? <SunDim className="size-5" /> : <MoonStar className="size-4" />}
    </Button>
  )
}

export { ThemeToggle }
