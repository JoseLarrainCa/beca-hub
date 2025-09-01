import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminLayoutProps {
  onLogout: () => void;
  currentUser: User;
}

export default function AdminLayout({ onLogout, currentUser }: AdminLayoutProps) {
  const location = useLocation();
  
  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case '/admin':
        return { 
          title: 'Dashboard Universitario', 
          subtitle: 'Gestión integral de becas alimentarias',
          pageKey: 'dashboard'
        };
      case '/admin/becas':
        return { 
          title: 'Gestión de Becas', 
          subtitle: 'Cargas, aprobaciones y wallets de estudiantes',
          pageKey: 'becas'
        };
      case '/admin/locales':
        return { 
          title: 'Gestión de Locales', 
          subtitle: 'Administración de restaurantes y menús',
          pageKey: 'locales'
        };
      case '/admin/ratings':
        return { 
          title: 'Ratings y Reviews', 
          subtitle: 'Gestión de reseñas y analytics de locales',
          pageKey: 'ratings'
        };
      case '/admin/reportes':
        return { 
          title: 'Reportes y Analytics', 
          subtitle: 'Análisis de uso y rendimiento',
          pageKey: 'reportes'
        };
      case '/admin/usuarios':
        return { 
          title: 'Gestión de Usuarios', 
          subtitle: 'Roles y permisos del sistema',
          pageKey: 'usuarios'
        };
      default:
        // Handle dynamic vendor profile routes
        if (pathname.startsWith('/admin/locales/')) {
          return {
            title: 'Perfil del Local',
            subtitle: 'Información detallada y configuración',
            pageKey: 'locales'
          };
        }
        return { 
          title: 'Admin Portal', 
          subtitle: 'Sistema administrativo',
          pageKey: 'dashboard'
        };
    }
  };

  const pageInfo = getPageInfo(location.pathname);

  return (
    <div className="udd-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar onLogout={onLogout} currentUser={currentUser} />
          
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header with trigger */}
            <header className="h-16 flex items-center justify-between border-b border-border/50 px-6 bg-card z-[200]">
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
            <main className="flex-1 overflow-auto scrollbar-stable">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}