import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Biblioteca Comercial — Founders BS',
  description:
    'Herramienta interna del equipo comercial de Founders BS para consultar clientes, lead magnets y obtener sugerencias de la IA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
