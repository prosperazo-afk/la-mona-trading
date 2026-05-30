'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Provider } from '@/types/provider'
import { StarRating } from './StarRating'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORY_COLORS: Record<string, string> = {
  'Electrónicos': 'bg-blue-100 text-blue-700',
  'Hogar y decoración': 'bg-green-100 text-green-700',
  'Cosméticos y salud': 'bg-pink-100 text-pink-700',
  'Calzado': 'bg-purple-100 text-purple-700',
  'Juguetes y niños': 'bg-yellow-100 text-yellow-700',
  'Deportes y outdoor': 'bg-emerald-100 text-emerald-700',
  'Maquinaria': 'bg-gray-100 text-gray-700',
  'Vehículos y food trucks': 'bg-orange-100 text-orange-700',
  'Ferretería e insumos': 'bg-stone-100 text-stone-700',
  'Otra': 'bg-beige text-marron',
}

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a "${provider.name}"? Esta acción no se puede deshacer.`)) return
    setDeleting(true)
    await supabase.from('providers').delete().eq('id', provider.id)
    router.refresh()
  }

  const createdAt = new Date(provider.created_at).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-naranja/20 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Card header */}
      <div className="bg-gradient-to-r from-terracota/10 to-naranja/10 px-5 py-4 border-b border-naranja/20">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-title text-marron text-lg font-bold leading-tight line-clamp-2">
            {provider.name}
          </h3>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[provider.category] || CATEGORY_COLORS['Otra']}`}>
            {provider.category}
          </span>
        </div>

        {provider.rating != null && provider.rating > 0 && (
          <div className="mt-2">
            <StarRating value={provider.rating} readonly size="sm" />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="px-5 py-4 flex-1 space-y-2.5">
        {provider.city_province && (
          <Row icon="📍" text={provider.city_province} />
        )}
        {provider.products && (
          <Row icon="🏷️" text={provider.products} clamp />
        )}
        {provider.contact && (
          <Row icon="📱" text={provider.contact} />
        )}
        {provider.moq && (
          <Row icon="📦" label="MOQ:" text={provider.moq} />
        )}
        {provider.production_time && (
          <Row icon="⏱️" label="Producción:" text={provider.production_time} />
        )}
        {provider.notes && (
          <div className="mt-3 p-3 bg-beige/60 rounded-lg text-sm text-marron/70 line-clamp-2 italic">
            {provider.notes}
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="px-5 py-3 border-t border-naranja/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {provider.website_url && (
            <a
              href={provider.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracota hover:text-naranja text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver web
            </a>
          )}
          <span className="text-xs text-marron/40">{createdAt}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/providers/${provider.id}/edit`}
            className="text-xs bg-beige hover:bg-naranja/20 text-marron px-3 py-1.5 rounded-lg transition-colors font-semibold"
          >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors font-semibold disabled:opacity-50"
          >
            {deleting ? '...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, text, clamp }: { icon: string; label?: string; text: string; clamp?: boolean }) {
  return (
    <div className="flex items-start gap-2 text-sm text-marron/80">
      <span className="shrink-0">{icon}</span>
      <span className={clamp ? 'line-clamp-2' : ''}>
        {label && <span className="font-semibold text-marron">{label} </span>}
        {text}
      </span>
    </div>
  )
}
