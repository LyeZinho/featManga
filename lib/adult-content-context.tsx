"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface AdultContentContextType {
  showAdultContent: boolean
  setShowAdultContent: (show: boolean) => void
  isAdultContentEnabled: boolean
  enableAdultContent: () => void
  disableAdultContent: () => void
}

const AdultContentContext = createContext<AdultContentContextType | undefined>(undefined)

export function AdultContentProvider({ children }: { children: React.ReactNode }) {
  const [showAdultContent, setShowAdultContent] = useState(false)
  const [isAdultContentEnabled, setIsAdultContentEnabled] = useState(false)

  useEffect(() => {
    const savedPreference = localStorage.getItem("adult-content-enabled")
    if (savedPreference === "true") {
      setIsAdultContentEnabled(true)
      setShowAdultContent(true)
    }
  }, [])

  const enableAdultContent = () => {
    setIsAdultContentEnabled(true)
    setShowAdultContent(true)
    localStorage.setItem("adult-content-enabled", "true")
  }

  const disableAdultContent = () => {
    setIsAdultContentEnabled(false)
    setShowAdultContent(false)
    localStorage.setItem("adult-content-enabled", "false")
  }

  return (
    <AdultContentContext.Provider
      value={{
        showAdultContent,
        setShowAdultContent,
        isAdultContentEnabled,
        enableAdultContent,
        disableAdultContent,
      }}
    >
      {children}
    </AdultContentContext.Provider>
  )
}

export function useAdultContent() {
  const context = useContext(AdultContentContext)
  if (context === undefined) {
    throw new Error("useAdultContent must be used within an AdultContentProvider")
  }
  return context
}
