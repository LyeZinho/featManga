import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, Home, BookOpen, TrendingUp, Info } from "lucide-react"

export function Header() {
  return (
    <header className="bg-manga-header-bg text-manga-header-text shadow-lg sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-manga-accent" />
            <span className="text-2xl font-bold">
              feat<span className="text-manga-secondary">Manga</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 hover:text-manga-accent transition-colors">
              <Home className="w-4 h-4" />
              <span>Início</span>
            </Link>
            <Link href="/search" className="flex items-center space-x-2 hover:text-manga-accent transition-colors">
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </Link>
            <Link href="/trending" className="flex items-center space-x-2 hover:text-manga-accent transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </Link>
            <Link href="/categories" className="flex items-center space-x-2 hover:text-manga-accent transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Categorias</span>
            </Link>
            <Link href="/about" className="flex items-center space-x-2 hover:text-manga-accent transition-colors">
              <Info className="w-4 h-4" />
              <span>Sobre</span>
            </Link>
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
