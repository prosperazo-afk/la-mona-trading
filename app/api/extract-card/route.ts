import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPT = `Analiza esta tarjeta de presentación de un proveedor chino y extrae toda la información disponible.
Responde SOLO con un JSON válido con esta estructura (usa null para campos no encontrados, nunca inventes datos):
{
  "name": "nombre completo de la empresa o fábrica",
  "city_province": "ciudad y provincia en China donde está ubicada",
  "products": "descripción de los productos que fabrica o vende",
  "contact": "número de teléfono, WeChat, WhatsApp o email de contacto",
  "website_url": "URL del sitio web, Alibaba u otra plataforma"
}
No incluyas explicaciones ni texto adicional, responde únicamente con el JSON.`

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const formData = await request.formData()
    const image = formData.get('image') as File | null
    const text = formData.get('text') as string | null

    let messageContent: Anthropic.MessageParam['content']

    if (image) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(image.type)) {
        return NextResponse.json({ error: 'Formato de imagen no soportado' }, { status: 400 })
      }
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'La imagen no puede superar 5 MB' }, { status: 400 })
      }

      const bytes = await image.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')
      const mediaType = image.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

      messageContent = [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        { type: 'text', text: PROMPT },
      ]
    } else if (text?.trim()) {
      messageContent = [
        { type: 'text', text: `${PROMPT}\n\nTexto de la tarjeta de presentación:\n${text}` },
      ]
    } else {
      return NextResponse.json({ error: 'Se requiere imagen o texto' }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: messageContent }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) {
      return NextResponse.json({ error: 'No se pudieron extraer datos de la tarjeta' }, { status: 422 })
    }

    const extracted = JSON.parse(match[0])
    return NextResponse.json(extracted)
  } catch (err: any) {
    console.error('extract-card error:', err)
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 })
  }
}
