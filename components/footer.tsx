import { BookOpen, Github, Twitter, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-manga-dark text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-8 h-8 text-manga-accent" />
              <span className="text-2xl font-bold">
                feat<span className="text-manga-secondary">Manga</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Sua plataforma definitiva para descobrir e explorar os melhores mangás. Recomendações personalizadas
              baseadas em seus gostos e interesses.
            </p>
            <div className="flex space-x-4">
              <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-300 hover:text-white transition-colors">
                  Buscar
                </a>
              </li>
              <li>
                <a href="/trending" className="text-gray-300 hover:text-white transition-colors">
                  Trending
                </a>
              </li>
              <li>
                <a href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Categorias
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/shounen" className="text-gray-300 hover:text-white transition-colors">
                  Shounen
                </Link>
              </li>
              <li>
                <Link href="/categories/seinen" className="text-gray-300 hover:text-white transition-colors">
                  Seinen
                </Link>
              </li>
              <li>
                <Link href="/categories/shoujo" className="text-gray-300 hover:text-white transition-colors">
                  Shoujo
                </Link>
              </li>
              <li>
                <Link href="/categories/josei" className="text-gray-300 hover:text-white transition-colors">
                  Josei
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 featManga. Todos os direitos reservados.
            <span className="block mt-1 text-sm">Dados fornecidos pela API do MangaDex</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
