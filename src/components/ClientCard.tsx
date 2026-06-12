import type { Cliente, Nicho } from "@/types/client";

const NICHO_COLORS: Record<Nicho, string> = {
  "Arquitectura & Construcción": "bg-amber-100 text-amber-800",
  "Arte & Creatividad": "bg-neutral-100 text-neutral-700",
  "Coaching": "bg-gray-100 text-gray-700",
  "Consultoría & Negocios": "bg-red-100 text-red-700",
  "Desarrollo & Espiritualidad": "bg-pink-100 text-pink-700",
  "Educación & Docencia": "bg-yellow-100 text-yellow-700",
  "Estética & Belleza": "bg-purple-100 text-purple-700",
  "Finanzas & Contable": "bg-orange-100 text-orange-700",
  "Fitness & Deporte": "bg-green-100 text-green-700",
  "Idiomas": "bg-blue-100 text-blue-700",
  "Legal": "bg-slate-100 text-slate-700",
  "Marketing & Agencia": "bg-lime-100 text-lime-700",
  "Otros": "bg-sky-100 text-sky-700",
  "Psicología": "bg-rose-100 text-rose-700",
  "Salud & Nutrición": "bg-emerald-100 text-emerald-700",
};

export default function ClientCard({ cliente }: { cliente: Cliente }) {
  const iniciales = cliente.nombre
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm flex items-center justify-center shrink-0">
            {iniciales}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">{cliente.nombre}</h3>
            {cliente.profesion && (
              <p className="text-xs text-gray-500 mt-0.5">{cliente.profesion}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {cliente.casoDeExito && (
            <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-medium">
              Caso de éxito
            </span>
          )}
        </div>
      </div>

      {cliente.nicho && (
        <span
          className={`self-start text-xs font-medium px-2.5 py-1 rounded-full ${NICHO_COLORS[cliente.nicho]}`}
        >
          {cliente.nicho}
        </span>
      )}

      {cliente.negocio && (
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-500">Negocio:</span> {cliente.negocio}
        </p>
      )}

      {cliente.aQuienAyuda && (
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-500">Ayuda a:</span> {cliente.aQuienAyuda}
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-50 mt-auto">
        {cliente.email && (
          <a
            href={`mailto:${cliente.email}`}
            className="text-xs text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {cliente.email}
          </a>
        )}
        {cliente.instagram && (
          <a
            href={cliente.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-pink-600 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
          </a>
        )}
        {cliente.testimonio && (
          <a
            href={cliente.testimonio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver testimonio
          </a>
        )}
      </div>
    </div>
  );
}
