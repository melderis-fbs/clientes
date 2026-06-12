interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'clientes', label: 'Clientes' },
  { id: 'leadmagnets', label: 'Lead Magnets' },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="flex gap-1 border-b border-neutral-200 mt-2 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-4 py-3 text-sm font-medium transition-colors focus:outline-none
              ${
                isActive
                  ? 'text-[#0e7c66]'
                  : 'text-neutral-500 hover:text-neutral-800'
              }
            `}
          >
            {tab.label}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
