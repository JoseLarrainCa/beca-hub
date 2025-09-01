import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Shield, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'student') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: 'admin' | 'student') => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 shadow-glow-accent">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-primary">
            UniBecas
          </h1>
          <p className="text-muted-foreground mt-2">
            Plataforma de Gestión de Becas Alimentarias
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-university">
          <CardHeader className="text-center">
            <CardTitle className="text-gradient-primary">Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede a tu cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Estudiante</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email o RUT</Label>
                  <Input
                    id="student-email"
                    placeholder="tu.email@universidad.cl"
                    type="email"
                    defaultValue="maria.gonzalez@universidad.cl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Contraseña</Label>
                  <Input
                    id="student-password"
                    type="password"
                    defaultValue="demo123"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-primary shadow-md"
                  onClick={() => handleLogin('student')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar como Estudiante'}
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    placeholder="admin@universidad.cl"
                    type="email"
                    defaultValue="admin@universidad.cl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Contraseña</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    defaultValue="admin123"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-accent shadow-md"
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar como Admin'}
                </Button>
              </TabsContent>
            </Tabs>

            {/* Demo credentials */}
            <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground text-center font-medium mb-2">
                Credenciales de Demo:
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Estudiante:</span>
                  <span>maria.gonzalez@universidad.cl / demo123</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span>admin@universidad.cl / admin123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>© 2025 Universidad. Todos los derechos reservados.</p>
          <p className="mt-1">Sistema de Gestión de Becas Alimentarias v1.0</p>
        </div>
      </div>
    </div>
  );
}