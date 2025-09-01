import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Settings, 
  User, 
  Check, 
  X, 
  Clock,
  AlertTriangle,
  Shield,
  Moon,
  Sun,
  Volume2,
  Mail,
  LogOut,
  UserCircle,
  Key
} from 'lucide-react';

interface HeaderProps {
  showNotifications?: boolean;
}

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Wallet con saldo bajo',
    message: 'María González tiene menos de $5.000 en su wallet',
    time: '5 min',
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: 'Carga de becas completada',
    message: 'Se procesaron 150 nuevas asignaciones exitosamente',
    time: '1 hora',
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'Nuevo local registrado',
    message: 'Cafetería "El Rincón" solicita aprobación',
    time: '2 horas',
    read: true
  }
];

export const Header: React.FC<HeaderProps> = ({ 
  showNotifications = true
}) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Notificaciones leídas",
      description: "Todas las notificaciones han sido marcadas como leídas"
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: darkMode ? "Modo claro activado" : "Modo oscuro activado",
      description: "La interfaz se ha actualizado"
    });
  };

  const handleLogout = () => {
    toast({
      title: "Cerrando sesión",
      description: "Redirigiendo al login..."
    });
    // Here you would actually logout
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Notifications */}
      {showNotifications && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Notificaciones</CardTitle>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      <Check className="h-3 w-3 mr-1" />
                      Marcar todas
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div key={notification.id}>
                        <div className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      <Check className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteNotification(notification.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            </div>
                          </div>
                        </div>
                        {index < notifications.length - 1 && <Separator />}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No hay notificaciones</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      )}

      {/* Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="end">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Configuración</CardTitle>
              <CardDescription className="text-xs">Personaliza tu experiencia</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-10"
                  onClick={handleDarkMode}
                >
                  {darkMode ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
                  {darkMode ? 'Modo claro' : 'Modo oscuro'}
                </Button>
                
                <Button variant="ghost" className="w-full justify-start h-10">
                  <Volume2 className="h-4 w-4 mr-3" />
                  Sonidos
                </Button>
                
                <Button variant="ghost" className="w-full justify-start h-10">
                  <Mail className="h-4 w-4 mr-3" />
                  Notificaciones email
                </Button>
                
                <Button variant="ghost" className="w-full justify-start h-10">
                  <Shield className="h-4 w-4 mr-3" />
                  Privacidad
                </Button>
                
                <Separator className="my-2" />
                
                <Button variant="ghost" className="w-full justify-start h-10 text-muted-foreground">
                  <Key className="h-4 w-4 mr-3" />
                  Cambiar contraseña
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* User Profile */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="end">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Admin Usuario</p>
                  <p className="text-xs text-muted-foreground">admin@universidad.cl</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start h-10">
                  <UserCircle className="h-4 w-4 mr-3" />
                  Mi perfil
                </Button>
                
                <Button variant="ghost" className="w-full justify-start h-10">
                  <Settings className="h-4 w-4 mr-3" />
                  Configuración cuenta
                </Button>
                
                <Separator className="my-2" />
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-10 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Cerrar sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};