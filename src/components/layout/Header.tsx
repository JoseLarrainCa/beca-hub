import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User, Download, TrendingUp } from 'lucide-react';

interface HeaderProps {
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  showNotifications = true 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
      
      <Button size="sm" className="bg-gradient-primary shadow-glow-accent">
        <TrendingUp className="mr-2 h-4 w-4" />
        Ver Reportes
      </Button>
      
      {showNotifications && (
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
            3
          </Badge>
        </Button>
      )}
      
      <Button variant="ghost" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" size="icon">
        <User className="h-4 w-4" />
      </Button>
    </div>
  );
};