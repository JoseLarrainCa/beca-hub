import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Store, 
  BarChart3, 
  Users, 
  LogOut 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  onLogout: () => void;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Gestión de Becas',
    href: '/admin/becas',
    icon: GraduationCap,
  },
  {
    title: 'Locales',
    href: '/admin/locales',
    icon: Store,
  },
  {
    title: 'Reportes',
    href: '/admin/reportes',
    icon: BarChart3,
  },
  {
    title: 'Usuarios',
    href: '/admin/usuarios',
    icon: Users,
  },
];

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-accent text-accent-foreground font-medium shadow-sm" 
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  };

  return (
    <Sidebar className={`${state === 'collapsed' ? 'w-[72px]' : 'w-64'} bg-gradient-primary border-r border-primary-foreground/10`} collapsible="icon">
      <SidebarContent>
        {/* Logo/Header */}
        <div className="flex h-16 items-center px-4 border-b border-primary-foreground/10">
          {state !== 'collapsed' ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-primary-foreground">
                  UniBecas
                </span>
                <span className="text-xs text-primary-foreground/70">
                  Admin Portal
                </span>
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center mx-auto">
              <GraduationCap className="h-5 w-5 text-accent-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup className="flex-1 py-4">
          <SidebarGroupLabel className={`${state === 'collapsed' ? 'sr-only' : ''} text-primary-foreground/70 text-xs uppercase tracking-wide px-4 mb-2`}>
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      className={`${getNavClasses(item.href)} transition-university rounded-lg`}
                    >
                      <NavLink to={item.href} end={item.href === '/admin'}>
                        <Icon className={`h-4 w-4 ${state === 'collapsed' ? 'mx-auto' : 'mr-3'}`} />
                        {state !== 'collapsed' && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User section */}
        <div className="border-t border-primary-foreground/10 p-3">
          {state !== 'collapsed' ? (
            <>
              <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    AD
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-foreground truncate">
                    Admin Usuario
                  </p>
                  <p className="text-xs text-primary-foreground/70 truncate">
                    admin@universidad.cl
                  </p>
                </div>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-start text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button
              onClick={onLogout}
              variant="ghost"
              size="icon"
              className="w-full text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}