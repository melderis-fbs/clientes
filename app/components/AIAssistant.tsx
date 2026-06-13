'use client';

import { useState } from 'react';
import { NICHOS } from '@/lib/types';

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [nicho, setNicho] = useState('');
  const [modeloNegocio, setModeloNegocio] = useState('');
  const [situacion, setSituacion] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [resultado, setResultado] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nicho || !modeloNegocio.trim() || !situacion.trim()) return;
    setStatus('loading');
    setResultado('');
    setError('');
    try {
      const res = await fetch('/api/sugerir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicho, modeloNegocio, situacion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error desconocido');
      setResultado(data.resultado);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al contactar el servidor');
      setStatus('error');
    }
  }

  function handleReset() {
    setStatus('idle');
    setResultado('');
    setError('');
  }

  async function handleCopyResultado() {
    if (!resultado) return;
    try {
      await navigator.clipboard.writeText(resultado);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
        style={{ backgroundColor: 'var(--accent)' }}
        aria-label="Abrir asistente IA"
      >
        <span className="text-base">✨</span>
        <span className="hidden sm:inline">Nutrir un caso</span>
      </button>

      {/* Panel overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full sm:w-[440px] max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <div>
                <h2
                  className="font-bold text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--accent)' }}
                >
                  ✨ Nutrir un caso
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Describí el lead y la IA sugiere qué mandar
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 transition-colors rounded-lg p-1"
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Form */}
              {status !== 'done' && (
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                      Nicho del lead
                    </label>
                    <select
                      value={nicho}
                      onChange={(e) => setNicho(e.target.value)}
                      required
                      className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18181b]/40 bg-white text-neutral-700"
                    >
                      <option value="">Seleccioná un nicho…</option>
                      {NICHOS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                      Modelo de negocio del lead
                    </label>
                    <textarea
                      value={modeloNegocio}
                      onChange={(e) => setModeloNegocio(e.target.value)}
                      required
                      rows={2}
                      placeholder="Ej: Coach de inglés que vende cursos online…"
                      className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18181b]/40 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                      Situación / objeción
                    </label>
                    <textarea
                      value={situacion}
                      onChange={(e) => setSituacion(e.target.value)}
                      required
                      rows={3}
                      placeholder="Ej: El lead dice que no tiene tiempo y que lo piensa…"
                      className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18181b]/40 resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || !nicho || !modeloNegocio.trim() || !situacion.trim()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Analizando…
                      </>
                    ) : (
                      'Analizar y sugerir'
                    )}
                  </button>
                </form>
              )}

              {/* Result */}
              {status === 'done' && resultado && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--accent)' }}
                    >
                      Sugerencia de la IA
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyResultado}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          copied
                            ? 'border-[#18181b]/30 bg-[#18181b]/10 text-[#18181b]'
                            : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        {copied ? '¡Copiado!' : 'Copiar todo'}
                      </button>
                      <button
                        onClick={handleReset}
                        className="text-xs px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                      >
                        Nueva consulta
                      </button>
                    </div>
                  </div>
                  <div className="ai-output rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-800 max-h-[50vh] overflow-y-auto">
                    {resultado}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
