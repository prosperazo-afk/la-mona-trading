'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Provider, ProviderFormData, CATEGORIES, ExtractedCard } from '@/types/provider'
import { CardExtractor } from './CardExtractor'
import { StarRating } from './StarRating'

interface ProviderFormProps {
  provider?: Provider
}

const EMPTY: ProviderFormData = {
  name: '',
  category: 'Otra',
  city_province: '',
  products: '',
  contact: '',
  moq: '',
  production_time: '',
  rating: 0,
  website_url: '',
  notes: '',
}

export function ProviderForm({ provider }: ProviderFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEdit = !!provider

  const [form, setForm] = useState<ProviderFormData>(
    provider
      ? {
          name: provider.name,
          category: provider.category,
          city_province: provider.city_province || '',
          products: provider.products || '',
          contact: provider.contact || '',
          moq: provider.moq || '',
          production_time: provider.production_time || '',
          rating: provider.rating || 0,
          website_url: provider.website_url || '',
          notes: provider.notes || '',
        }
      : { ...EMPTY }
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (field: keyof ProviderFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleExtracted = useCallback((data: ExtractedCard) => {
    setForm(prev => ({
      ...prev,
      ...(data.name && { name: data.name }),
      ...(data.city_province && { city_province: data.city_province }),
      ...(data.products && { products: data.products }),
      ...(data.contact && { contact: data.contact }),
      ...(data.website_url && { website_url: data.website_url }),
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...form,
      rating: form.rating || null,
      city_province: form.city_province || undefined,
      products: form.products || null,
      contact: form.contact || null,
      moq: form.moq || null,
      production_time: form.production_time || null,
      website_url: form.website_url || null,
      notes: form.notes || null,
    }

    try {
      if (isEdit) {
        const { error } = await supabase
          .from('providers')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', provider.id)
        if (error) throw error
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase
          .from('providers')
          .insert({ ...payload, user_id: user!.id })
        if (error) throw error
      }
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Extractor */}
      <CardExtractor onExtracted={handleExtracted} />

      {/* Main fields */}
      <div className="bg-white rounded-2xl shadow-sm border border-naranja/20 p-6 space-y-5">
        <h2 className="font-title text-marron text-xl font-bold">Datos del Proveedor</h2>

        {/* Name */}
        <Field label="Nombre / Fábrica *">
          <input
            required
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ej: Guangzhou Fashion Textile Co., Ltd."
            className={inputCls}
          />
        </Field>

        {/* Category */}
        <Field label="Categoría *">
          <select
            required
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className={inputCls}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Field>

        {/* City/Province */}
        <Field label="Ciudad / Provincia en China">
          <input
            type="text"
            value={form.city_province ?? ''}
            onChange={e => set('city_province', e.target.value)}
            placeholder="Ej: Guangzhou, Guangdong"
            className={inputCls}
          />
        </Field>

        {/* Products */}
        <Field label="Productos que fabrica">
          <textarea
            rows={3}
            value={form.products ?? ''}
            onChange={e => set('products', e.target.value)}
            placeholder="Ej: Ropa deportiva, leggings, tops, conjuntos..."
            className={inputCls}
          />
        </Field>

        {/* Contact */}
        <Field label="Contacto (WeChat / WhatsApp / teléfono)">
          <input
            type="text"
            value={form.contact ?? ''}
            onChange={e => set('contact', e.target.value)}
            placeholder="Ej: WeChat: supplier2024 / +86 138 0000 0000"
            className={inputCls}
          />
        </Field>

        {/* MOQ + Production time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="MOQ (pedido mínimo)">
            <input
              type="text"
              value={form.moq ?? ''}
              onChange={e => set('moq', e.target.value)}
              placeholder="Ej: 100 unidades por color"
              className={inputCls}
            />
          </Field>
          <Field label="Tiempo de producción">
            <input
              type="text"
              value={form.production_time ?? ''}
              onChange={e => set('production_time', e.target.value)}
              placeholder="Ej: 15-20 días hábiles"
              className={inputCls}
            />
          </Field>
        </div>

        {/* Rating */}
        <Field label="Calificación de relación">
          <div className="flex items-center gap-3 pt-1">
            <StarRating
              value={form.rating || 0}
              onChange={v => set('rating', v)}
              size="lg"
            />
            {(form.rating || 0) > 0 && (
              <span className="text-sm text-marron/60">
                {['', 'Muy mala', 'Regular', 'Buena', 'Muy buena', 'Excelente'][form.rating || 0]}
              </span>
            )}
          </div>
        </Field>

        {/* Website */}
        <Field label="Link Alibaba o web">
          <input
            type="url"
            value={form.website_url ?? ''}
            onChange={e => set('website_url', e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
        </Field>

        {/* Notes */}
        <Field label="Notas internas">
          <textarea
            rows={4}
            value={form.notes ?? ''}
            onChange={e => set('notes', e.target.value)}
            placeholder="Observaciones privadas sobre este proveedor..."
            className={inputCls}
          />
        </Field>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 border-2 border-marron/20 text-marron font-bold rounded-xl hover:bg-beige transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-terracota hover:bg-marron text-mostaza font-bold rounded-xl transition-colors disabled:opacity-60 font-title text-lg"
        >
          {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Agregar proveedor'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-marron mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full border border-naranja/30 rounded-xl px-4 py-2.5 text-marron placeholder-marron/40 focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent bg-beige/20 text-sm'
