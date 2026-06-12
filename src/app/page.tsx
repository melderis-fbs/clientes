import { getClientes } from "@/lib/notion";
import ClientGrid from "@/components/ClientGrid";

export const revalidate = 3600;

export default async function Home() {
  const clientes = await getClientes();
  const casosCantidad = clientes.filter((c) => c.casoDeExito).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Clientes</h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            {clientes.length} clientes · {casosCantidad} casos de éxito
          </p>
        </div>
        <ClientGrid clientes={clientes} />
      </div>
    </main>
  );
}
