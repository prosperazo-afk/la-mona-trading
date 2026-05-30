'use client'

import { useState, useRef } from 'react'
import { ExtractedCard } from '@/types/provider'

interface CardExtractorProps {
  onExtracted: (data: ExtractedCard) => void
}

export function CardExtractor({ onExtracted }: CardExtractorProps) {
  const [mode, setMode] = useState<'image' | 'text'>('image')
  const [text, setText] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setSuccess(false)
    setError(null)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const handleExtract = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      if (mode === 'image' && file) {
        formData.append('image', file)
      } else if (mode === 'text' && text.trim()) {
        formData.append('text', text)
      } else {
        setError('Por favor sube una imagen o pega el texto de la tarjeta.')
        setLoading(false)
        return
      }

      const res = await fetch('/api/extract-card', { method: 'POST', body: formData })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Error al extraer datos')
      }

      const data: ExtractedCard = await res.json()
      onExtracted(data)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-terracota/5 to-naranja/10 rounded-2xl border border-naranja/30 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🤖</span>
        <h3 className="font-title text-marron font-bold text-lg">Extraer con IA</h3>
        <span className="text-xs bg-terracota text-mostaza px-2 py-0.5 rounded-full font-semibold">Claude AI</span>
      </div>
      <p className="text-sm text-marron/60 mb-4">
        Sube la foto de la tarjeta de presentación o pega el texto y Claude llenará el formulario automáticamente.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('image')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === 'image' ? 'bg-terracota text-mostaza' : 'bg-white text-marron hover:bg-beige'}`}
        >
          📷 Foto de tarjeta
        </button>
        <button
          type="button"
          onClick={() => setMode('text')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === 'text' ? 'bg-terracota text-mostaza' : 'bg-white text-marron hover:bg-beige'}`}
        >
          📝 Pegar texto
        </button>
      </div>

      {/* Image mode */}
      {mode === 'image' && (
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-naranja/40 rounded-xl p-6 text-center cursor-pointer hover:border-terracota hover:bg-terracota/5 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Tarjeta" className="max-h-40 mx-auto rounded-lg object-contain" />
            ) : (
              <>
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm text-marron/60">Haz clic para subir foto</p>
                <p className="text-xs text-marron/40 mt-1">JPG, PNG, WEBP</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Text mode */}
      {mode === 'text' && (
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setSuccess(false) }}
          placeholder="Pega aquí el texto de la tarjeta (nombre, dirección, teléfono, WeChat, productos...)"
          rows={5}
          className="w-full border border-naranja/30 rounded-xl px-4 py-3 text-sm text-marron placeholder-marron/40 focus:outline-none focus:ring-2 focus:ring-terracota bg-white"
        />
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
          ✓ Datos extraídos. Revisa y completa el formulario.
        </p>
      )}

      <button
        type="button"
        onClick={handleExtract}
        disabled={loading || (mode === 'image' && !file) || (mode === 'text' && !text.trim())}
        className="mt-4 w-full bg-terracota hover:bg-marron text-mostaza font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analizando con Claude...
          </span>
        ) : '✨ Extraer datos automáticamente'}
      </button>
    </div>
  )
}
