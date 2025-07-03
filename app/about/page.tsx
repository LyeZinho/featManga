import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Code,
  Heart,
  Coffee,
  Github,
  MessageCircle,
  Zap,
  Target,
  BookOpen,
  Globe,
  Star,
  Lightbulb,
  Search,
  TrendingUp,
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="manga-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Coffee className="w-16 h-16 text-manga-secondary mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Sobre Nós</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Conheça a história por trás do featManga e a comunidade que tornou este projeto possível
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Dev's Café Section */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Coffee className="w-8 h-8 text-manga-accent" />
                <CardTitle className="text-3xl">Dev's Café</CardTitle>
              </div>
              <Badge className="mx-auto bg-manga-secondary text-white">Comunidade de Desenvolvedores</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                O <strong>Dev's Café</strong> é uma comunidade vibrante de programadores e desenvolvedores de todos os
                níveis, onde a troca de conhecimento, a colaboração e o crescimento mútuo acontecem diariamente.
                Surgimos no Discord como um espaço de encontro para entusiastas da tecnologia e evoluímos para um
                ecossistema completo de aprendizado, networking e projetos colaborativos.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <Users className="w-12 h-12 text-manga-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Comunidade Ativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Desenvolvedores de todos os níveis compartilhando conhecimento
                  </p>
                </div>
                <div className="text-center">
                  <Code className="w-12 h-12 text-manga-secondary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Projetos Colaborativos</h3>
                  <p className="text-sm text-muted-foreground">Criamos soluções reais para problemas reais</p>
                </div>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-manga-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Crescimento Mútuo</h3>
                  <p className="text-sm text-muted-foreground">Aprendizado contínuo através da colaboração</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Project Section */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-manga-accent" />
                <CardTitle className="text-3xl">Sobre este Projeto</CardTitle>
              </div>
              <Badge className="mx-auto bg-manga-accent text-white">featManga</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Este projeto nasceu dentro do <strong>Dev's Café</strong> com o objetivo de criar uma ferramenta prática
                e personalizada para fãs de mangás que também fazem parte da nossa comunidade. Utilizando a API do
                MangaDx, desenvolvemos uma busca avançada que permite aos usuários filtrar e encontrar mangás que
                combinam exatamente com seus gostos — seja por gênero, status, classificação ou popularidade.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Nosso propósito é unir tecnologia e paixão por cultura pop, incentivando a troca de experiências e
                conhecimento técnico entre os membros do Dev's Café. Ao criar soluções reais para interesses reais,
                fortalecemos nossa comunidade e estimulamos o aprendizado prático através da colaboração.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-manga-accent" />
                    Nossos Objetivos
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-manga-secondary mt-1 flex-shrink-0" />
                      Criar ferramentas úteis para a comunidade
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-manga-secondary mt-1 flex-shrink-0" />
                      Promover aprendizado colaborativo
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-manga-secondary mt-1 flex-shrink-0" />
                      Unir tecnologia e cultura pop
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-manga-secondary mt-1 flex-shrink-0" />
                      Fortalecer nossa comunidade
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-manga-accent" />
                    Tecnologias Utilizadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Next.js 15</Badge>
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">shadcn/ui</Badge>
                    <Badge variant="outline">MangaDx API</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-manga-accent/10 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-manga-accent" />
                  </div>
                  <h3 className="font-semibold">Busca Avançada</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Filtros inteligentes por gênero, demografia, status e muito mais
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-manga-secondary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-manga-secondary" />
                  </div>
                  <h3 className="font-semibold">Trending</h3>
                </div>
                <p className="text-sm text-muted-foreground">Acompanhe os mangás mais populares e bem avaliados</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-manga-accent/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-manga-accent" />
                  </div>
                  <h3 className="font-semibold">Categorias</h3>
                </div>
                <p className="text-sm text-muted-foreground">Explore por demografia e gêneros organizados</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-manga-secondary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-manga-secondary" />
                  </div>
                  <h3 className="font-semibold">Design Responsivo</h3>
                </div>
                <p className="text-sm text-muted-foreground">Interface adaptável para todos os dispositivos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-manga-accent/10 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-manga-accent" />
                  </div>
                  <h3 className="font-semibold">Tema Escuro</h3>
                </div>
                <p className="text-sm text-muted-foreground">Alternância entre temas claro e escuro</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-manga-secondary/10 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-manga-secondary" />
                  </div>
                  <h3 className="font-semibold">Open Source</h3>
                </div>
                <p className="text-sm text-muted-foreground">Código aberto para a comunidade contribuir</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8">
              <MessageCircle className="w-16 h-16 text-manga-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Junte-se ao Dev's Café</h3>
              <p className="text-muted-foreground mb-6">
                Faça parte da nossa comunidade de desenvolvedores! Compartilhe conhecimento, participe de projetos e
                cresça junto conosco.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-manga-accent hover:bg-manga-accent/90">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discord
                </Button>
                <Button
                  variant="outline"
                  className="border-manga-secondary text-manga-secondary hover:bg-manga-secondary hover:text-white bg-transparent"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
