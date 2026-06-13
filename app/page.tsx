'use client';

import { useState } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import ClientesTab from './components/ClientesTab';
import LeadMagnetsTab from './components/LeadMagnetsTab';
import NuevoClienteForm from './components/NuevoClienteForm';

type Tab = 'clientes' | 'leadmagnets';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('clientes');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as Tab)}
        />
        <main className="pb-24">
          {activeTab === 'clientes' ? <ClientesTab /> : <LeadMagnetsTab />}
        </main>
      </div>
      <NuevoClienteForm />
    </div>
  );
}
