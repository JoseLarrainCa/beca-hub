import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Universidad Portal", 
  subtitle,
  showNotifications = true 
}) => {
  return (
    <header className="bg-card border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
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
      </div>
    </header>
  );
};