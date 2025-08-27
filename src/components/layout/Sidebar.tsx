import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Store, 
  BarChart3, 
  Users, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
  currentPath?: string;
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

export const Sidebar: React.FC<SidebarProps> = ({ className, currentPath = '/admin' }) => {
  return (
    <div className={cn(
      "flex h-full w-64 flex-col bg-gradient-primary border-r border-border/50",
      className
    )}>
      {/* Logo/Header */}
      <div className="flex h-16 items-center px-6">
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "accent" : "ghost"}
              className={cn(
                "w-full justify-start text-left font-medium transition-university",
                isActive 
                  ? "bg-accent text-accent-foreground shadow-md" 
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.title}
            </Button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-primary-foreground/10 p-3">
        <div className="flex items-center space-x-3 px-3 py-2">
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
          variant="ghost"
          className="w-full mt-2 justify-start text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};