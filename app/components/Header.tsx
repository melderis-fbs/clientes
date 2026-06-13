export default function Header() {
  return (
    <header
      className="border-b border-neutral-200 bg-white sticky top-0 z-30"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-baseline gap-3">
        <h1
          className="text-xl sm:text-2xl font-bold tracking-tight"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'var(--accent)',
          }}
        >
          Biblioteca Clientes
        </h1>
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--text)', opacity: 0.45 }}
        >
          Founders BS
        </span>
      </div>
    </header>
  );
}
