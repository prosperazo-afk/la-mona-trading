import { createClient } from '@/lib/supabase/server'
import { StatsBar } from '@/components/StatsBar'
import { SearchAndFilter } from '@/components/SearchAndFilter'
import { ProviderCard } from '@/components/ProviderCard'
import { Suspense } from 'react'
import Link from 'next/link'

interface PageProps {
  searchParams: { q?: string; category?: string }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const supabase = createClient()

  // Fetch all for stats
  const { data: allProviders } = await supabase
    .from('providers')
    .select('*')
    .order('created_at', { ascending: false })

  // Apply filters
  let query = supabase.from('providers').select('*').order('created_at', { ascending: false })

  if (searchParams.q) {
    const q = searchParams.q.replace(/[%_]/g, '\\$&')
    query = query.or(`name.ilike.%${q}%,city_province.ilike.%${q}%,products.ilike.%${q}%`)
  }

  if (searchParams.category && searchParams.category !== 'all') {
    query = query.eq('category', searchParams.category)
  }

  const { data: providers } = await query

  const filtered = providers || []
  const all = allProviders || []

  return (
    <div>
      {/* Stats */}
      <StatsBar providers={all} />

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="font-title text-marron text-2xl font-bold">
          Proveedores
          {filtered.length !== all.length && (
            <span className="ml-2 text-lg font-normal text-marron/50">
              ({filtered.length} de {all.length})
            </span>
          )}
        </h1>

        <div className="flex items-center gap-3">
          <a
            href="/api/export-csv"
            className="flex items-center gap-2 bg-white border border-naranja/30 hover:bg-beige text-marron font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar CSV
          </a>
          <Link
            href="/providers/new"
            className="sm:hidden flex items-center gap-2 bg-terracota text-mostaza font-bold px-4 py-2 rounded-lg text-sm"
          >
            + Nuevo
          </Link>
        </div>
      </div>

      {/* Search & filter */}
      <Suspense>
        <SearchAndFilter />
      </Suspense>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-title text-marron text-2xl font-bold mb-2">
            {all.length === 0 ? 'Aún no hay proveedores' : 'Sin resultados'}
          </h3>
          <p className="text-marron/60 mb-6">
            {all.length === 0
              ? 'Agrega tu primer proveedor para comenzar.'
              : 'Intenta con otros términos de búsqueda.'}
          </p>
          {all.length === 0 && (
            <Link
              href="/providers/new"
              className="inline-flex items-center gap-2 bg-terracota text-mostaza font-bold px-6 py-3 rounded-xl hover:bg-marron transition-colors font-title"
            >
              + Agregar primer proveedor
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}

      {/* FAB mobile */}
      <Link
        href="/providers/new"
        className="sm:hidden fixed bottom-6 right-6 bg-terracota text-mostaza w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl hover:bg-marron transition-colors z-30"
      >
        +
      </Link>
    </div>
  )
}
