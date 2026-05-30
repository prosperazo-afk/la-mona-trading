'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige px-4">
      <div className="w-full max-w-md">
        {/* Logo header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-terracota rounded-2xl px-8 py-5 shadow-lg">
            <h1 className="font-title text-mostaza text-3xl font-bold leading-tight">
              La Mona Trading
            </h1>
            <p className="text-naranja text-sm mt-1 font-body">Base de Proveedores</p>
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-naranja/20">
          <h2 className="font-title text-marron text-2xl font-bold mb-6 text-center">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-marron mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full border border-naranja/40 rounded-lg px-4 py-2.5 text-marron placeholder-marron/40 focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent bg-beige/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-marron mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-naranja/40 rounded-lg px-4 py-2.5 text-marron placeholder-marron/40 focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent bg-beige/30"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracota hover:bg-marron text-mostaza font-bold py-3 rounded-lg transition-colors duration-200 disabled:opacity-60 font-title text-lg"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-marron/60">
            Solo usuarios invitados por el administrador pueden acceder.
          </p>
        </div>
      </div>
    </div>
  )
}
