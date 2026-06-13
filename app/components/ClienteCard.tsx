'use client';

import { useState } from 'react';
import type { Cliente } from '@/lib/types';
import { NICHOS } from '@/lib/types';
import EditableField from './EditableField';

interface ClienteCardProps {
  cliente: Cliente;
  onUpdate: (updated: Cliente) => void;
}

function instagramUrl(handle: string): string {
  if (!handle) return '';
  if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
  const clean = handle.replace(/^@/, '');
  return `https://instagram.com/${clean}`;
}

function instagramDisplay(handle: string): string {
  if (!handle) return '';
  if (handle.startsWith('http://') || handle.startsWith('https://')) {
    const match = handle.match(/instagram\.com\/([^/?]+)/);
    if (match) return `@${match[1]}`;
    return handle;
  }
  return handle.startsWith('@') ? handle : `@${handle}`;
}

export default function ClienteCard({ cliente, onUpdate }: ClienteCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Draft state
  const [draft, setDraft] = useState({
    instagram: cliente.instagram,
    negocio: cliente.negocio,
    profesion: cliente.profesion,
    aQuienAyuda: cliente.aQuienAyuda,
    testimonio: cliente.testimonio,
    email: cliente.email,
    estado: cliente.estado,
    nicho: cliente.nicho,
  });

  function startEdit() {
    setDraft({
      instagram: cliente.instagram,
      negocio: cliente.negocio,
      profesion: cliente.profesion,
      aQuienAyuda: cliente.aQuienAyuda,
      testimonio: cliente.testimonio,
      email: cliente.email,
      estado: cliente.estado,
      nicho: cliente.nicho,
    });
    setSaveError('');
    setSaveSuccess(false);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setSaveError('');
    setSaveSuccess(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error('Error al guardar');
      onUpdate({ ...cliente, ...draft });
      setSaveSuccess(true);
      setTimeout(() => {
        setEditing(false);
        setSaveSuccess(false);
      }, 1200);
    } catch {
      setSaveError('No se pudo guardar. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  const tieneTestimonio = !!cliente.testimonio;

  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
        tieneTestimonio ? 'border-l-4 border-l-[#b3810a]' : ''
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-base sm:text-lg truncate"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'var(--text)',
              }}
            >
              {cliente.nombre || <span className="text-neutral-400 italic">Sin nombre</span>}
            </h3>
            {cliente.instagram && (
              <a
                href={instagramUrl(cliente.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0e7c66] hover:underline"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {instagramDisplay(cliente.instagram)}
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
            {cliente.estado && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                cliente.estado === 'Activo'
                  ? 'bg-[#0e7c66]/10 text-[#0e7c66]'
                  : 'bg-neutral-100 text-neutral-500'
              }`}>
                {cliente.estado}
              </span>
            )}
            {tieneTestimonio ? (
              <span className="bg-[#b3810a]/10 text-[#b3810a] text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                Testimonio ▶
              </span>
            ) : (
              <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                Sin testimonio
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        {!editing && (
          <div className="space-y-1.5 text-sm text-neutral-700">
            {cliente.profesion && (
              <p>
                <span className="font-medium text-neutral-500">Profesión:</span>{' '}
                {cliente.profesion}
              </p>
            )}
            {cliente.negocio && (
              <p>
                <span className="font-medium text-neutral-500">Negocio:</span>{' '}
                {cliente.negocio}
              </p>
            )}
            {cliente.aQuienAyuda && (
              <p>
                <span className="font-medium text-neutral-500">A quién ayuda:</span>{' '}
                {cliente.aQuienAyuda}
              </p>
            )}
            {cliente.email && (
              <p className="text-xs text-neutral-400 mt-2">{cliente.email}</p>
            )}
            {tieneTestimonio && (
              <div className="mt-3">
                <a
                  href={cliente.testimonio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#b3810a] hover:underline"
                >
                  ▶ Ver testimonio
                </a>
              </div>
            )}
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div className="space-y-3 mt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Nicho</label>
              <select
                value={draft.nicho}
                onChange={(e) => setDraft((d) => ({ ...d, nicho: e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40 bg-white"
              >
                <option value="">— Sin nicho —</option>
                {NICHOS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <EditableField
              label="Instagram"
              value={draft.instagram}
              onChange={(v) => setDraft((d) => ({ ...d, instagram: v }))}
              type="url"
              placeholder="https://instagram.com/usuario"
            />
            <EditableField
              label="Profesión"
              value={draft.profesion}
              onChange={(v) => setDraft((d) => ({ ...d, profesion: v }))}
              placeholder="Ej: Coach de vida"
            />
            <EditableField
              label="Negocio"
              value={draft.negocio}
              onChange={(v) => setDraft((d) => ({ ...d, negocio: v }))}
              type="textarea"
              placeholder="Resumen del negocio..."
            />
            <EditableField
              label="A quién ayuda"
              value={draft.aQuienAyuda}
              onChange={(v) => setDraft((d) => ({ ...d, aQuienAyuda: v }))}
              placeholder="Ej: Mujeres emprendedoras"
            />
            <EditableField
              label="Testimonio (URL)"
              value={draft.testimonio}
              onChange={(v) => setDraft((d) => ({ ...d, testimonio: v }))}
              type="url"
              placeholder="https://..."
            />
            <EditableField
              label="Email"
              value={draft.email}
              onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
              type="email"
              placeholder="ejemplo@email.com"
            />
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Estado</label>
              <select
                value={draft.estado}
                onChange={(e) => setDraft((d) => ({ ...d, estado: e.target.value }))}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40 bg-white"
              >
                <option value="">— Sin estado —</option>
                <option value="Activo">Activo</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            {saveError && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {saveError}
              </p>
            )}
            {saveSuccess && (
              <p className="text-xs text-[#0e7c66] bg-[#0e7c66]/10 rounded-lg px-3 py-2">
                ¡Guardado correctamente!
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#0e7c66] text-white hover:bg-[#0a6454] rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {saving && (
                  <svg
                    className="animate-spin h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 rounded-lg px-4 py-2 text-sm disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Edit button */}
        {!editing && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <button
              onClick={startEdit}
              className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 rounded-lg px-4 py-2 text-sm"
            >
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
