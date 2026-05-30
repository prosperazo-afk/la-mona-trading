'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-terracota shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="font-title text-mostaza text-xl font-bold tracking-wide">
                La Mona Trading
              </span>
              <span className="text-naranja text-xs font-body">Base de Proveedores</span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/providers/new"
              className="hidden sm:inline-flex items-center gap-2 bg-mostaza hover:bg-naranja text-marron font-bold px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Proveedor
            </Link>

            <button
              onClick={handleLogout}
              className="text-naranja hover:text-mostaza text-sm font-body transition-colors duration-200 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
