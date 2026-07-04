import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Layout() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background">
        <AppHeader />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}
