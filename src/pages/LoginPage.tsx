import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Shield, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: (email: string, password: string) => boolean;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminEmail, setAdminEmail] = useState('invitado@udd.cl');
  const [adminPassword, setAdminPassword] = useState('invitado-udd');
  const [studentEmail, setStudentEmail] = useState('maria.gonzalez@universidad.cl');
  const [studentPassword, setStudentPassword] = useState('demo123');
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // Simulate API delay
    setTimeout(() => {
      const success = onLogin(adminEmail, adminPassword);
      if (success) {
        navigate('/admin');
      } else {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleStudentLogin = async () => {
    setIsLoading(true);
    setError('');
    
    // For student login, just redirect to student dashboard
    setTimeout(() => {
      navigate('/student');
      setIsLoading(false);
    }, 500);
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
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </TabsTrigger>
                <TabsTrigger value="student" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Estudiante</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    placeholder="admin@universidad.cl"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Contraseña</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-accent shadow-md"
                  onClick={handleAdminLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar como Admin'}
                </Button>
              </TabsContent>

              <TabsContent value="student" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email o RUT</Label>
                  <Input
                    id="student-email"
                    placeholder="tu.email@universidad.cl"
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Contraseña</Label>
                  <Input
                    id="student-password"
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-primary shadow-md"
                  onClick={handleStudentLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar como Estudiante'}
                </Button>
              </TabsContent>
            </Tabs>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 text-center mb-3">
                🎯 Usuarios de Demostración
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-white rounded border border-blue-100">
                  <div className="font-medium text-blue-900 mb-1">👤 Usuario Invitado (Recomendado)</div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div><strong>Email:</strong> invitado@udd.cl</div>
                    <div><strong>Contraseña:</strong> invitado-udd</div>
                    <div className="text-blue-600 mt-1">✅ Acceso completo al dashboard admin</div>
                  </div>
                </div>
                <div className="p-3 bg-white rounded border border-blue-100">
                  <div className="font-medium text-blue-900 mb-1">⚙️ Admin Principal</div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div><strong>Email:</strong> admin@udd.cl</div>
                    <div><strong>Contraseña:</strong> admin123</div>
                  </div>
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