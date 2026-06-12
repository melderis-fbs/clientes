'use client';

import { useState } from 'react';
import type { LeadMagnet } from '@/lib/types';
import EditableField from './EditableField';

interface LeadMagnetCardProps {
  lm: LeadMagnet;
  onUpdate: (updated: LeadMagnet) => void;
}

function VideoIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-2.36A.75.75 0 0121 8.868v6.264a.75.75 0 01-1.03.696L15.75 13.5v-3z" />
      <rect x="3" y="6" width="12" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

export default function LeadMagnetCard({ lm, onUpdate }: LeadMagnetCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [draft, setDraft] = useState({
    link: lm.link,
    descripcion: lm.descripcion,
    cuandoEnviar: lm.cuandoEnviar,
    dirigidoA: lm.dirigidoA,
    tema: lm.tema,
  });

  function startEdit() {
    setDraft({
      link: lm.link,
      descripcion: lm.descripcion,
      cuandoEnviar: lm.cuandoEnviar,
      dirigidoA: lm.dirigidoA,
      tema: lm.tema,
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
      const res = await fetch(`/api/leadmagnets/${lm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error('Error al guardar');
      onUpdate({ ...lm, ...draft });
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

  async function handleCopy() {
    if (!lm.link) return;
    try {
      await navigator.clipboard.writeText(lm.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: select input
    }
  }

  const isVideo = lm.tipo === 'Video';

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`flex-shrink-0 ${isVideo ? 'text-blue-500' : 'text-neutral-400'}`}
              >
                {isVideo ? <VideoIcon /> : <DocIcon />}
              </span>
              <h3
                className="font-bold text-base truncate"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {lm.palabraClave || (
                  <span className="text-neutral-400 italic">Sin título</span>
                )}
              </h3>
            </div>
            {lm.tema && (
              <span
                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isVideo
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {lm.tema}
              </span>
            )}
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
              isVideo
                ? 'bg-blue-50 text-blue-600'
                : 'bg-neutral-100 text-neutral-500'
            }`}
          >
            {lm.tipo}
          </span>
        </div>

        {/* Details */}
        {!editing && (
          <div className="space-y-1.5 text-sm text-neutral-700">
            {lm.descripcion && <p className="text-sm">{lm.descripcion}</p>}
            {lm.dirigidoA && (
              <p>
                <span className="font-medium text-neutral-500">Dirigido a:</span>{' '}
                {lm.dirigidoA}
              </p>
            )}
            {lm.cuandoEnviar && (
              <p>
                <span className="font-medium text-neutral-500">Cuándo enviar:</span>{' '}
                {lm.cuandoEnviar}
              </p>
            )}
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div className="space-y-3 mt-2">
            <EditableField
              label="Tema"
              value={draft.tema}
              onChange={(v) => setDraft((d) => ({ ...d, tema: v }))}
              placeholder="Ej: Ventas"
            />
            <EditableField
              label="Descripción"
              value={draft.descripcion}
              onChange={(v) => setDraft((d) => ({ ...d, descripcion: v }))}
              type="textarea"
              placeholder="Descripción del lead magnet..."
            />
            <EditableField
              label="Link"
              value={draft.link}
              onChange={(v) => setDraft((d) => ({ ...d, link: v }))}
              type="url"
              placeholder="https://..."
            />
            <EditableField
              label="Dirigido a"
              value={draft.dirigidoA}
              onChange={(v) => setDraft((d) => ({ ...d, dirigidoA: v }))}
              placeholder="Ej: Coaches, consultores..."
            />
            <EditableField
              label="Cuándo enviar"
              value={draft.cuandoEnviar}
              onChange={(v) => setDraft((d) => ({ ...d, cuandoEnviar: v }))}
              type="textarea"
              placeholder="Contexto de envío..."
            />

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
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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

        {/* Action buttons */}
        {!editing && (
          <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap gap-2">
            {lm.link && (
              <a
                href={lm.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0e7c66] text-white hover:bg-[#0a6454] rounded-lg px-4 py-2 text-sm font-medium"
              >
                Abrir link
              </a>
            )}
            {lm.link && (
              <button
                onClick={handleCopy}
                className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 rounded-lg px-4 py-2 text-sm"
              >
                {copied ? '¡Copiado!' : 'Copiar link'}
              </button>
            )}
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
