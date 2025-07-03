import { NextRequest, NextResponse } from 'next/server'

const MANGADX_BASE_URL = 'https://api.mangadx.org'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${MANGADX_BASE_URL}/manga/tag`, {
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
    console.error('Erro na API proxy para tags:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tags da API do MangaDX' },
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
