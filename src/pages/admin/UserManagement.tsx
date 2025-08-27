import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Plus,
  Edit,
  Search,
  Shield,
  Key,
  UserCheck,
  UserX,
  Settings,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

// Mock data
const users = [
  {
    id: 1,
    name: 'Carlos Silva',
    email: 'carlos.silva@universidad.cl',
    role: 'Aprobador de Becas',
    permissions: ['becas.aprobar', 'dashboard.ver', 'reportes.ver'],
    status: 'active',
    lastLogin: '2025-01-15 14:30',
    createdAt: '2024-08-15'
  },
  {
    id: 2,
    name: 'Juan Pérez',
    email: 'juan.perez@universidad.cl',
    role: 'Cargador de Becas',
    permissions: ['becas.cargar', 'dashboard.ver'],
    status: 'active',
    lastLogin: '2025-01-15 09:15',
    createdAt: '2024-09-01'
  },
  {
    id: 3,
    name: 'María González',
    email: 'maria.gonzalez@universidad.cl',
    role: 'Cargador de Becas',
    permissions: ['becas.cargar', 'dashboard.ver'],
    status: 'active',
    lastLogin: '2025-01-14 16:45',
    createdAt: '2024-09-01'
  },
  {
    id: 4,
    name: 'Ana Torres',
    email: 'ana.torres@universidad.cl',
    role: 'Analista',
    permissions: ['dashboard.ver', 'reportes.ver'],
    status: 'active',
    lastLogin: '2025-01-13 11:20',
    createdAt: '2024-10-10'
  },
  {
    id: 5,
    name: 'Pedro Ramírez',
    email: 'pedro.ramirez@universidad.cl',
    role: 'Operador de Local',
    permissions: ['locales.ver'],
    status: 'inactive',
    lastLogin: '2024-12-20 10:30',
    createdAt: '2024-11-05'
  }
];

const roles = [
  {
    id: 'superadmin',
    name: 'SuperAdmin',
    description: 'Acceso total al sistema',
    permissions: ['*']
  },
  {
    id: 'aprobador',
    name: 'Aprobador de Becas',
    description: 'Puede aprobar cargas de becas',
    permissions: ['becas.aprobar', 'dashboard.ver', 'reportes.ver']
  },
  {
    id: 'cargador',
    name: 'Cargador de Becas',
    description: 'Puede cargar propuestas de becas',
    permissions: ['becas.cargar', 'dashboard.ver']
  },
  {
    id: 'analista',
    name: 'Analista',
    description: 'Solo lectura de dashboard y reportes',
    permissions: ['dashboard.ver', 'reportes.ver']
  },
  {
    id: 'operador',
    name: 'Operador de Local',
    description: 'Gestión de local específico',
    permissions: ['locales.ver']
  }
];

const allPermissions = [
  { id: 'becas.cargar', name: 'Cargar Becas', description: 'Crear y cargar lotes de becas' },
  { id: 'becas.aprobar', name: 'Aprobar Becas', description: 'Revisar y aprobar cargas de becas' },
  { id: 'locales.gestionar', name: 'Gestionar Locales', description: 'CRUD de locales y menús' },
  { id: 'locales.ver', name: 'Ver Locales', description: 'Solo lectura de información de locales' },
  { id: 'dashboard.ver', name: 'Ver Dashboard', description: 'Acceso al panel principal' },
  { id: 'reportes.ver', name: 'Ver Reportes', description: 'Acceso a reportes y analytics' },
  { id: 'roles.gestionar', name: 'Gestionar Roles', description: 'Crear y modificar roles de usuario' }
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Activo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/30">Inactivo</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Suspendido</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      'SuperAdmin': 'bg-destructive/10 text-destructive border-destructive/30',
      'Aprobador de Becas': 'bg-accent/10 text-accent border-accent/30',
      'Cargador de Becas': 'bg-primary/10 text-primary border-primary/30',
      'Analista': 'bg-muted/10 text-muted-foreground border-muted/30',
      'Operador de Local': 'bg-secondary/10 text-secondary-foreground border-secondary/30'
    };
    
    const colorClass = roleColors[role] || 'bg-muted/10 text-muted-foreground border-muted/30';
    
    return <Badge variant="outline" className={colorClass}>{role}</Badge>;
  };

  const handleToggleStatus = (userId: number) => {
    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido cambiado.",
    });
  };

  const handleResetPassword = (userId: number) => {
    toast({
      title: "Contraseña restablecida",
      description: "Se ha enviado un email con la nueva contraseña.",
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Users List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-university">
            <CardHeader>
              <CardTitle className="text-gradient-primary">
                Lista de Usuarios
              </CardTitle>
              <CardDescription>
                Gestiona los usuarios y sus permisos en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-university"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Último acceso:</p>
                        <p className="font-medium">{user.lastLogin}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Creado:</p>
                        <p className="font-medium">{user.createdAt}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Permisos:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <Key className="mr-1 h-3 w-3" />
                        Reset Password
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === 'active' ? (
                          <>
                            <UserX className="mr-1 h-3 w-3" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-1 h-3 w-3" />
                            Activar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roles Panel */}
        <div className="space-y-4">
          <Card className="shadow-university">
            <CardHeader>
              <CardTitle className="text-gradient-primary">
                Roles del Sistema
              </CardTitle>
              <CardDescription>
                Configuración de roles y permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-university"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{role.name}</h4>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission === '*' ? 'Todos' : permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Crear Nuevo Rol
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-university">
            <CardHeader>
              <CardTitle className="text-gradient-primary">
                Permisos Disponibles
              </CardTitle>
              <CardDescription>
                Lista de todos los permisos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="p-2 bg-muted/30 rounded text-sm"
                  >
                    <p className="font-medium">{permission.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}