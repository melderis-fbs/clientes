"use client";

import { useState, useMemo } from "react";
import type { Cliente, Nicho } from "@/types/client";
import ClientCard from "./ClientCard";

const NICHOS: Nicho[] = [
  "Arquitectura & Construcción",
  "Arte & Creatividad",
  "Coaching",
  "Consultoría & Negocios",
  "Desarrollo & Espiritualidad",
  "Educación & Docencia",
  "Estética & Belleza",
  "Finanzas & Contable",
  "Fitness & Deporte",
  "Idiomas",
  "Legal",
  "Marketing & Agencia",
  "Otros",
  "Psicología",
  "Salud & Nutrición",
];

export default function ClientGrid({ clientes }: { clientes: Cliente[] }) {
  const [search, setSearch] = useState("");
  const [nichoActivo, setNichoActivo] = useState<Nicho | null>(null);
  const [soloCasos, setSoloCasos] = useState(false);

  const filtrados = useMemo(() => {
    return clientes.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.profesion?.toLowerCase().includes(q) ||
        c.negocio?.toLowerCase().includes(q) ||
        c.aQuienAyuda?.toLowerCase().includes(q);
      const matchNicho = !nichoActivo || c.nicho === nichoActivo;
      const matchCasos = !soloCasos || c.casoDeExito;
      return matchSearch && matchNicho && matchCasos;
    });
  }, [clientes, search, nichoActivo, soloCasos]);

  const nichosDisponibles = useMemo(
    () => NICHOS.filter((n) => clientes.some((c) => c.nicho === n)),
    [clientes]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, profesión, negocio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />
        </div>
        <button
          onClick={() => setSoloCasos((v) => !v)}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors shrink-0 ${
            soloCasos
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
          }`}
        >
          Solo casos de éxito
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setNichoActivo(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !nichoActivo
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Todos
        </button>
        {nichosDisponibles.map((nicho) => (
          <button
            key={nicho}
            onClick={() => setNichoActivo(nichoActivo === nicho ? null : nicho)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              nichoActivo === nicho
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {nicho}
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-400">
        {filtrados.length} {filtrados.length === 1 ? "cliente" : "clientes"}{" "}
        {filtrados.length !== clientes.length && `de ${clientes.length}`}
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Sin resultados</p>
          <p className="text-sm mt-1">Probá con otros filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((cliente) => (
            <ClientCard key={cliente.id} cliente={cliente} />
          ))}
        </div>
      )}
    </div>
  );
}
