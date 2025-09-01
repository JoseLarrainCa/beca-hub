import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentLoginProps {
  onLogin: (studentData: any) => void;
}

export default function StudentLogin({ onLogin }: StudentLoginProps) {
  const [credentials, setCredentials] = useState({
    rut: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Mock students data for demo - in real app this would come from API
  const mockStudents = [
    { id: 'E2021-12345', rut: '12.345.678-9', password: '123456', name: 'María González Pérez', email: 'maria.gonzalez@udd.cl' },
    { id: 'E2021-67890', rut: '23.456.789-0', password: '123456', name: 'Carlos Rodríguez Silva', email: 'carlos.rodriguez@udd.cl' },
    { id: 'E2021-11111', rut: '34.567.890-1', password: '123456', name: 'Ana Martínez López', email: 'ana.martinez@udd.cl' },
    { id: 'E2022-33445', rut: '45.678.901-2', password: '123456', name: 'Diego Fernández Castro', email: 'diego.fernandez@udd.cl' },
    { id: 'E2022-55667', rut: '56.789.012-3', password: '123456', name: 'Valentina Torres Mendoza', email: 'valentina.torres@udd.cl' }
  ];

  const formatRut = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^0-9kK]/g, '');
    
    if (cleaned.length <= 1) return cleaned;
    
    // Add hyphen before last character
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    // Add dots every 3 digits from right to left
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formattedBody}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setCredentials({ ...credentials, rut: formatted });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Normalize RUT for comparison (remove dots and spaces)
      const normalizeRut = (rut: string) => rut.replace(/[.\s]/g, '').toLowerCase();
      
      // Find matching student
      const student = mockStudents.find(s => 
        normalizeRut(s.rut) === normalizeRut(credentials.rut) && s.password === credentials.password
      );

      if (student) {
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${student.name}, sesión iniciada correctamente.`,
        });
        onLogin(student);
      } else {
        setError('RUT o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoStudent = mockStudents[0]; // María González Pérez
    setCredentials({ rut: demoStudent.rut, password: demoStudent.password });
    toast({
      title: "Datos de demo cargados",
      description: "Presiona 'Iniciar Sesión' para continuar",
    });
  };

  return (
    <div className="tapin-theme min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Portal Estudiante
          </CardTitle>
          <CardDescription className="text-gray-600">
            Ingresa con tu RUT y contraseña UDD
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="rut"
                  type="text"
                  placeholder="12.345.678-9"
                  value={credentials.rut}
                  onChange={handleRutChange}
                  className="pl-10"
                  maxLength={12}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !credentials.rut || !credentials.password}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={handleDemoLogin}
              className="w-full"
            >
              Demo: Cargar datos de prueba
            </Button>
            
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p><strong>Demo RUTs:</strong></p>
              <p>12.345.678-9 (María González)</p>
              <p>23.456.789-0 (Carlos Rodríguez)</p>
              <p><strong>Contraseña:</strong> 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
