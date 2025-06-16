"use client"

import * as React from "react"
import { BorderFlash } from "./border-flash"

interface BorderFlashBoxProps {
  children: React.ReactNode
  className?: string
}

const BorderFlashBox: React.FC<BorderFlashBoxProps> = ({ children, className }) => {
  return (
    <div className="relative w-full max-w-md mx-auto p-6">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0">
        <BorderFlash border="top" borderAnim="left" />
      </div>

      {/* Bottom border */}
      <div className="absolute inset-x-0 bottom-0">
        <BorderFlash border="bottom" borderAnim="right" />
      </div>

      {/* Left border */}
      <div className="absolute inset-y-0 left-0 h-full">
        <BorderFlash border="left" borderAnim="top" className="h-full" />
      </div>

      {/* Right border */}
      <div className="absolute inset-y-0 right-0 h-full">
        <BorderFlash border="right" borderAnim="bottom" className="h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 bg-background text-center">
        {children}
      </div>
    </div>
  )
}

BorderFlashBox.displayName = "BorderFlashBox"

export { BorderFlashBox }
