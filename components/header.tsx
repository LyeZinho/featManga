import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Home, BookOpen, TrendingUp, Info } from "lucide-react"

export function Header() {
  return (
    <header className="bg-card text-card-foreground shadow-lg sticky top-0 z-50 border-b border-border tokyo-glow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <BookOpen className="w-8 h-8 text-accent group-hover:text-primary transition-colors" />
            <span className="text-2xl font-bold text-card-foreground">
              feat<span className="text-primary">Manga</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:text-primary transition-colors text-card-foreground group"
            >
              <Home className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span>Início</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center space-x-2 hover:text-primary transition-colors text-card-foreground group"
            >
              <Search className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span>Buscar</span>
            </Link>
            <Link
              href="/trending"
              className="flex items-center space-x-2 hover:text-primary transition-colors text-card-foreground group"
            >
              <TrendingUp className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span>Trending</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center space-x-2 hover:text-primary transition-colors text-card-foreground group"
            >
              <BookOpen className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span>Categorias</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-2 hover:text-primary transition-colors text-card-foreground group"
            >
              <Info className="w-4 h-4 group-hover:text-accent transition-colors" />
              <span>Sobre</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-card-foreground hover:text-primary">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
