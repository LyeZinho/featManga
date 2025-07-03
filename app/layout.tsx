import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/lib/theme-context"
import { AdultContentProvider } from "@/lib/adult-content-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "featManga - Descubra os Melhores Mangás",
  description:
    "Plataforma de recomendações de mangás com filtros avançados e busca personalizada usando a API do MangaDX",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AdultContentProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AdultContentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
