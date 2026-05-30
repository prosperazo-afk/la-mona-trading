'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { CATEGORIES } from '@/types/provider'

export function SearchAndFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-marron/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          defaultValue={q}
          placeholder="Buscar por nombre, ciudad o producto..."
          onChange={e => update('q', e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-naranja/30 rounded-xl text-marron placeholder-marron/40 focus:outline-none focus:ring-2 focus:ring-terracota bg-white text-sm"
        />
      </div>

      {/* Category filter */}
      <select
        defaultValue={category}
        onChange={e => update('category', e.target.value)}
        className="sm:w-64 border border-naranja/30 rounded-xl px-4 py-2.5 text-marron focus:outline-none focus:ring-2 focus:ring-terracota bg-white text-sm"
      >
        <option value="all">Todas las categorías</option>
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  )
}
