"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    // This script runs before React hydrates to prevent flash
    const script = `
      (function() {
        try {
          const theme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.classList.toggle('dark', theme === 'dark');
        } catch (e) {}
      })();
    `

    const scriptElement = document.createElement("script")
    scriptElement.innerHTML = script
    document.head.appendChild(scriptElement)

    return () => {
      document.head.removeChild(scriptElement)
    }
  }, [])

  return null
}
