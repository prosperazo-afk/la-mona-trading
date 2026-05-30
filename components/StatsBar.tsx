import { Provider } from '@/types/provider'

interface StatsBarProps {
  providers: Provider[]
}

export function StatsBar({ providers }: StatsBarProps) {
  const total = providers.length
  const categories = new Set(providers.map(p => p.category)).size
  const fiveStars = providers.filter(p => p.rating === 5).length
  const cities = new Set(providers.map(p => p.city_province).filter(Boolean)).size

  const stats = [
    { label: 'Proveedores', value: total, icon: '🏭' },
    { label: 'Categorías', value: categories, icon: '📦' },
    { label: 'Aliados 5★', value: fiveStars, icon: '⭐' },
    { label: 'Ciudades', value: cities, icon: '📍' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(stat => (
        <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-naranja/20 text-center">
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className="font-title text-3xl font-bold text-terracota">{stat.value}</div>
          <div className="text-xs text-marron/60 font-body mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
