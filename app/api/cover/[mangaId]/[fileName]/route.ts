import { NextRequest, NextResponse } from 'next/server'

const MANGADX_BASE_URL = 'https://api.mangadx.org'

export async function GET(
  request: NextRequest,
  { params }: { params: { mangaId: string; fileName: string } }
) {
  const { mangaId, fileName } = params
  const { searchParams } = new URL(request.url)
  const size = searchParams.get('size') || '256'
  
  try {
    const imageUrl = `https://uploads.mangadx.org/covers/${mangaId}/${fileName}.${size}.jpg`
    
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'featManga/1.0 (https://github.com/devscafe/featManga)',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const imageBuffer = await response.arrayBuffer()
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 ano
      },
    })
  } catch (error) {
    console.error('Erro ao buscar imagem:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imagem' },
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
