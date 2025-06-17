'use client'

import * as React from 'react'
import { MoonStar, SunDim } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/src/ui/components/button'

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = React.useState(false)
  const { theme = 'light', setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" className="rounded-md" aria-label="Toggle theme">
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
      className="rounded-md"
      aria-label="Toggle theme"
    >
      {isDark ? <SunDim className="size-5" /> : <MoonStar className="size-4" />}
    </Button>
  )
}
