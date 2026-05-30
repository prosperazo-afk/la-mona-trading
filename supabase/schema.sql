-- ============================================================
-- La Mona Trading — Base de Proveedores
-- Ejecutar en Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Tabla principal de proveedores
CREATE TABLE IF NOT EXISTS public.providers (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  name            TEXT          NOT NULL,
  category        TEXT          NOT NULL,
  city_province   TEXT,
  products        TEXT,
  contact         TEXT,
  moq             TEXT,
  production_time TEXT,
  rating          SMALLINT      CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  website_url     TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ   DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMPTZ   DEFAULT NOW() NOT NULL
);

-- 2. Índices para búsqueda eficiente
CREATE INDEX IF NOT EXISTS idx_providers_category    ON public.providers(category);
CREATE INDEX IF NOT EXISTS idx_providers_created_at  ON public.providers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_providers_name        ON public.providers USING gin(to_tsvector('simple', name));

-- 3. Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.providers;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden ver TODOS los proveedores (base compartida)
CREATE POLICY "Authenticated users can read all providers"
  ON public.providers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Usuarios autenticados pueden crear proveedores
CREATE POLICY "Authenticated users can insert providers"
  ON public.providers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Usuarios autenticados pueden actualizar cualquier proveedor
CREATE POLICY "Authenticated users can update providers"
  ON public.providers FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Usuarios autenticados pueden eliminar cualquier proveedor
CREATE POLICY "Authenticated users can delete providers"
  ON public.providers FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- CONFIGURACIÓN DE AUTENTICACIÓN (solo invitados por admin)
-- En Supabase Dashboard → Authentication → Providers → Email:
--   • Disable "Enable email confirmations" = OFF (o ON según prefieras)
--   • "Allow new users to sign up" = OFF  ← IMPORTANTE: solo el admin crea usuarios
-- Para invitar usuarios: Dashboard → Authentication → Users → "Invite user"
-- ============================================================
