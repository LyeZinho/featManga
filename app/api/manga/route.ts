import { NextRequest, NextResponse } from 'next/server'

const MANGADX_BASE_URL = 'https://api.mangadx.org'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  try {
    // Construir a URL da API do MangaDX
    const mangadxUrl = new URL(`${MANGADX_BASE_URL}/manga`)
    
    // Transferir todos os parâmetros de busca
    for (const [key, value] of searchParams.entries()) {
      mangadxUrl.searchParams.append(key, value)
    }
    
    console.log('Fazendo requisição para:', mangadxUrl.toString())
    
    const response = await fetch(mangadxUrl.toString(), {
      headers: {
        'User-Agent': 'featManga/1.0 (https://github.com/devscafe/featManga)',
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Erro na API proxy:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados da API do MangaDX' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
