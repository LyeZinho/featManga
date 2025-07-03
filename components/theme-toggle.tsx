"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-9 h-9 p-0 hover:bg-accent">
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-current" />
      ) : (
        <Sun className="h-4 w-4 text-current" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
