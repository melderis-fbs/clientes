'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Cliente } from '@/lib/types';
import ClienteCard from './ClienteCard';

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <svg
        className="animate-spin h-8 w-8 text-[#0e7c66]"
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
    </div>
  );
}

export default function ClientesTab() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConTestimonio, setShowConTestimonio] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const loadClientes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/clientes');
      if (!res.ok) throw new Error('Error al cargar clientes');
      const data: Cliente[] = await res.json();
      setClientes(data);
    } catch {
      setError('No se pudieron cargar los clientes. Revisá la configuración.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // Compute filtered list
  const filtered = clientes.filter((c) => {
    if (showConTestimonio && !c.testimonio) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.profesion.toLowerCase().includes(q) ||
      c.negocio.toLowerCase().includes(q) ||
      c.aQuienAyuda.toLowerCase().includes(q) ||
      c.nicho.toLowerCase().includes(q) ||
      c.instagram.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  // Group by nicho
  const grouped: Record<string, Cliente[]> = {};
  for (const c of filtered) {
    const key = c.nicho || 'Sin nicho';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  }
  const nichos = Object.keys(grouped).sort();

  // Decide which groups are open
  function isGroupOpen(nicho: string): boolean {
    if (searchQuery.trim()) return true; // auto-expand on search
    if (allOpen) return true;
    return openGroups[nicho] ?? false;
  }

  function toggleGroup(nicho: string) {
    setOpenGroups((prev) => ({ ...prev, [nicho]: !isGroupOpen(nicho) }));
  }

  function handleToggleAll() {
    const next = !allOpen;
    setAllOpen(next);
    // Reset individual overrides
    setOpenGroups({});
  }

  function handleClienteUpdate(updated: Cliente) {
    setClientes((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  }

  const totalConTestimonio = clientes.filter((c) => c.testimonio).length;

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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e7c66]/40"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConTestimonio((v) => !v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap ${
              showConTestimonio
                ? 'bg-[#b3810a]/10 border-[#b3810a]/30 text-[#b3810a]'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Con testimonio {showConTestimonio ? `(${totalConTestimonio})` : ''}
          </button>
          <button
            onClick={handleToggleAll}
            className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 rounded-lg px-4 py-2 text-sm whitespace-nowrap"
          >
            {allOpen ? 'Cerrar todo' : 'Abrir todo'}
          </button>
        </div>
      </div>

      {/* Stats summary */}
      {!loading && !error && (
        <p className="text-xs text-neutral-400 mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
          {filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          {showConTestimonio ? ' (con testimonio)' : ''}
          {searchQuery ? ` para "${searchQuery}"` : ''}
        </p>
      )}

      {loading && <Spinner />}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={loadClientes}
            className="ml-3 underline font-medium"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && nichos.length === 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-500 text-sm">
          {searchQuery
            ? 'No se encontraron clientes con esa búsqueda.'
            : 'No hay clientes cargados todavía.'}
        </div>
      )}

      {/* Accordion groups */}
      <div className="space-y-4">
        {nichos.map((nicho) => {
          const items = grouped[nicho];
          const exitoCount = items.filter((c) => c.testimonio).length;
          const open = isGroupOpen(nicho);

          return (
            <div
              key={nicho}
              className="rounded-xl border border-neutral-200 overflow-hidden"
            >
              {/* Accordion header */}
              <button
                onClick={() => toggleGroup(nicho)}
                className="flex items-center justify-between w-full p-4 bg-neutral-50 hover:bg-neutral-100 rounded-t-xl text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {nicho}
                  </span>
                  <span
                    className="text-xs text-neutral-500"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {items.length} cliente{items.length !== 1 ? 's' : ''}
                  </span>
                  {exitoCount > 0 && (
                    <span className="bg-[#b3810a]/10 text-[#b3810a] text-xs font-semibold px-2 py-0.5 rounded-full">
                      {exitoCount} ⭐
                    </span>
                  )}
                </div>
                <svg
                  className={`h-4 w-4 text-neutral-400 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Accordion body */}
              {open && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white">
                  {items.map((cliente) => (
                    <ClienteCard
                      key={cliente.id}
                      cliente={cliente}
                      onUpdate={handleClienteUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
