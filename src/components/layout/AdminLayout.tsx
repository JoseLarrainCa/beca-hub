import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';

interface AdminLayoutProps {
  onLogout: () => void;
}

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
  const location = useLocation();
  
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/admin':
        return { title: 'Dashboard Universitario', subtitle: 'Gestión integral de becas alimentarias' };
      case '/admin/becas':
        return { title: 'Gestión de Becas', subtitle: 'Cargas, aprobaciones y wallets de estudiantes' };
      case '/admin/locales':
        return { title: 'Gestión de Locales', subtitle: 'Administración de restaurantes y menús' };
      case '/admin/reportes':
        return { title: 'Reportes y Analytics', subtitle: 'Análisis de uso y rendimiento' };
      case '/admin/usuarios':
        return { title: 'Gestión de Usuarios', subtitle: 'Roles y permisos del sistema' };
      default:
        return { title: 'Admin Portal', subtitle: 'Sistema administrativo' };
    }
  };

  const pageInfo = getPageTitle(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar onLogout={onLogout} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with trigger */}
          <header className="h-16 flex items-center justify-between border-b border-border/50 px-6 bg-card">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-xl font-bold text-gradient-primary">
                  {pageInfo.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {pageInfo.subtitle}
                </p>
              </div>
            </div>
            <Header showNotifications={true} />
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}