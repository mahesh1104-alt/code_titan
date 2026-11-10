import React from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <AppHeader />
      <div className="flex-1 flex overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
