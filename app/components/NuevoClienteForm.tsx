'use client';

import { useState } from 'react';
import { NICHOS } from '@/lib/types';

const EMPTY = {
  nombre: '',
  instagram: '',
  nicho: '',
  profesion: '',
  negocio: '',
  aQuienAyuda: '',
  email: '',
  estado: 'Activo',
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NuevoClienteForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function reset() {
    setForm(EMPTY);
    setStatus('idle');
    setErrorMsg('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || data.error || 'Error desconocido');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar');
      setStatus('error');
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => { setOpen(true); reset(); }}
        className="fixed bottom-6 right-6 z-40 bg-[#0e7c66] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#0a6454] transition-colors"
        title="Agregar nuevo cliente"
      >
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Backdrop + panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-lg font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text)' }}
                >
                  Nuevo cliente
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-semibold text-[#0e7c66] text-lg mb-1">¡Cliente agregado!</p>
                  <p className="text-sm text-neutral-500 mb-6">Ya aparece en la base de Notion. Recargá la app para verlo.</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={reset}
                      className="bg-[#0e7c66] text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-[#0a6454]"
                    >
                      Agregar otro
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="border border-neutral-300 text-neutral-600 rounded-lg px-5 py-2 text-sm hover:bg-neutral-50"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre — required */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => set('nombre', e.target.value)}
                      placeholder="Nombre completo"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40"
                    />
                  </div>

                  {/* Nicho + Estado en fila */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Nicho</label>
                      <select
                        value={form.nicho}
                        onChange={(e) => set('nicho', e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40 bg-white"
                      >
                        <option value="">— Elegir —</option>
                        {NICHOS.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1">Estado</label>
                      <select
                        value={form.estado}
                        onChange={(e) => set('estado', e.target.value)}
                        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40 bg-white"
                      >
                        <option value="Activo">Activo</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">Instagram</label>
                    <input
                      type="text"
                      value={form.instagram}
                      onChange={(e) => set('instagram', e.target.value)}
                      placeholder="@usuario o URL completa"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40"
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}
                    />
                  </div>

                  {/* Profesión */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">Profesión</label>
                    <input
                      type="text"
                      value={form.profesion}
                      onChange={(e) => set('profesion', e.target.value)}
                      placeholder="Ej: Coach de vida"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40"
                    />
                  </div>

                  {/* Negocio */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">Negocio / Modelo</label>
                    <textarea
                      value={form.negocio}
                      onChange={(e) => set('negocio', e.target.value)}
                      placeholder="Resumen de qué hace y cómo monetiza..."
                      rows={2}
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40 resize-none"
                    />
                  </div>

                  {/* A quién ayuda */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">A quién ayuda</label>
                    <input
                      type="text"
                      value={form.aQuienAyuda}
                      onChange={(e) => set('aQuienAyuda', e.target.value)}
                      placeholder="Ej: Mujeres emprendedoras 30-45"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="cliente@email.com"
                      className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={status === 'loading' || !form.nombre.trim()}
                      className="flex-1 bg-[#0e7c66] text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-[#0a6454] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === 'loading' && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      )}
                      {status === 'loading' ? 'Guardando...' : 'Guardar en Notion'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 rounded-lg px-4 py-2.5 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
