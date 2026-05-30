import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-beige">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="mt-12 py-6 text-center text-sm text-marron/40 font-body border-t border-naranja/20">
        La Mona Trading · Base de Proveedores
      </footer>
    </div>
  )
}
