'use client';

import { useEffect, useState, useCallback } from 'react';
import type { LeadMagnet } from '@/lib/types';
import LeadMagnetCard from './LeadMagnetCard';

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <svg className="animate-spin h-8 w-8 text-[#18181b]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );
}

export default function LeadMagnetsTab() {
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTema, setFilterTema] = useState('');

  const loadLeadMagnets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leadmagnets');
      if (!res.ok) throw new Error('Error al cargar lead magnets');
      const data: LeadMagnet[] = await res.json();
      setLeadMagnets(data);
    } catch {
      setError('No se pudieron cargar los lead magnets. Revisá la configuración.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeadMagnets();
  }, [loadLeadMagnets]);

  // Build available temas for filter
  const allTemas = Array.from(
    new Set(leadMagnets.map((lm) => lm.tema).filter(Boolean))
  ).sort();

  // Filtered list
  const filtered = leadMagnets.filter((lm) => {
    if (filterTema && lm.tema !== filterTema) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lm.palabraClave.toLowerCase().includes(q) ||
      lm.tema.toLowerCase().includes(q) ||
      lm.descripcion.toLowerCase().includes(q) ||
      lm.dirigidoA.toLowerCase().includes(q)
    );
  });

  // Group by tipo
  const videos = filtered.filter((lm) => lm.tipo === 'Video');
  const entregables = filtered.filter((lm) => lm.tipo === 'Entregable');

  // Sub-group each tipo by tema
  function groupByTema(items: LeadMagnet[]): Record<string, LeadMagnet[]> {
    const groups: Record<string, LeadMagnet[]> = {};
    for (const lm of items) {
      const key = lm.tema || 'Sin tema';
      if (!groups[key]) groups[key] = [];
      groups[key].push(lm);
    }
    return groups;
  }

  function handleUpdate(updated: LeadMagnet) {
    setLeadMagnets((prev) =>
      prev.map((lm) => (lm.id === updated.id ? updated : lm))
    );
  }

  function renderGroup(title: string, items: LeadMagnet[], icon: React.ReactNode) {
    if (items.length === 0) return null;
    return (
      <section key={title} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-neutral-400">{icon}</span>
          <h2
            className="font-bold text-lg"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </h2>
          <span
            className="text-xs text-neutral-400 ml-1"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            ({items.length})
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((lm) => (
            <LeadMagnetCard key={lm.id} lm={lm} onUpdate={handleUpdate} />
          ))}
        </div>
      </section>
    );
  }

  const VideoIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-2.36A.75.75 0 0121 8.868v6.264a.75.75 0 01-1.03.696L15.75 13.5v-3z" />
      <rect x="3" y="6" width="12" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const DocIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar lead magnets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18181b]/40"
          />
        </div>
        {allTemas.length > 0 && (
          <select
            value={filterTema}
            onChange={(e) => setFilterTema(e.target.value)}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18181b]/40 bg-white text-neutral-700"
          >
            <option value="">Todos los temas</option>
            {allTemas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stats */}
      {!loading && !error && (
        <p className="text-xs text-neutral-400 mb-5" style={{ fontFamily: "'Space Mono', monospace" }}>
          {filtered.length} lead magnet{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          {filterTema ? ` en "${filterTema}"` : ''}
          {searchQuery ? ` para "${searchQuery}"` : ''}
        </p>
      )}

      {loading && <Spinner />}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={loadLeadMagnets} className="ml-3 underline font-medium">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-500 text-sm">
          {searchQuery || filterTema
            ? 'No se encontraron lead magnets con ese filtro.'
            : 'No hay lead magnets cargados todavía.'}
        </div>
      )}

      {!loading && !error && (
        <>
          {renderGroup('Videos', videos, <VideoIcon />)}
          {renderGroup('Entregables', entregables, <DocIcon />)}
        </>
      )}
    </div>
  );
}
