import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Base de Proveedores — La Mona Trading',
  description: 'Gestión de proveedores chinos para La Mona Trading',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
