import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function escapeCsv(val: string | number | null | undefined): string {
  if (val == null) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(_request: NextRequest) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: providers, error } = await supabase
    .from('providers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const headers = [
    'Nombre', 'Categoría', 'Ciudad/Provincia', 'Productos',
    'Contacto', 'MOQ', 'Tiempo de producción', 'Calificación',
    'Web/Alibaba', 'Notas', 'Fecha de creación',
  ]

  const rows = (providers || []).map(p => [
    escapeCsv(p.name),
    escapeCsv(p.category),
    escapeCsv(p.city_province),
    escapeCsv(p.products),
    escapeCsv(p.contact),
    escapeCsv(p.moq),
    escapeCsv(p.production_time),
    escapeCsv(p.rating),
    escapeCsv(p.website_url),
    escapeCsv(p.notes),
    escapeCsv(new Date(p.created_at).toLocaleDateString('es-AR')),
  ].join(','))

  const csv = [headers.join(','), ...rows].join('\n')
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="proveedores-la-mona-trading-${date}.csv"`,
    },
  })
}
