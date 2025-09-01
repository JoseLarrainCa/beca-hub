import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Batch } from '@/services/api';
import {
  Check,
  X,
  AlertTriangle,
  Users,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  XCircle,
  Mail,
  User
} from 'lucide-react';

interface BatchDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: Batch | null;
  onBatchAction: (batchId: number, action: 'approve' | 'reject') => void;
}

// Mock detailed student data for the batch
const mockStudentData = [
  {
    id: 'E2025-001',
    name: 'Ana María Torres Silva',
    email: 'ana.torres@universidad.cl',
    amount: 35000,
    status: 'valid',
    year: 3,
    career: 'Ingeniería Comercial'
  },
  {
    id: 'E2025-002',
    name: 'Carlos Eduardo Mendoza',
    email: 'carlos.mendoza@universidad.cl',
    amount: 42000,
    status: 'valid',
    year: 2,
    career: 'Medicina'
  },
  {
    id: 'E2025-003',
    name: 'María José Contreras',
    email: 'maria.contreras@universidad.cl',
    amount: 28000,
    status: 'valid',
    year: 1,
    career: 'Derecho'
  },
  {
    id: 'E2025-004',
    name: 'Pedro Antonio Ruiz López',
    email: 'pedro.ruiz@universidad.cl',
    amount: 65000,
    status: 'valid',
    year: 4,
    career: 'Ingeniería Civil'
  },
  {
    id: 'E2025-005',
    name: 'Isabella Fernández García',
    email: 'isabella.fernandez@universidad.cl',
    amount: 31500,
    status: 'warning',
    year: 2,
    career: 'Psicología'
  }
];

export default function BatchDetailModal({ open, onOpenChange, batch, onBatchAction }: BatchDetailModalProps) {
  const [students, setStudents] = useState(mockStudentData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800 border-green-300">✓ Válido</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⚠ Advertencia</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-300">✗ Error</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getValidationMessage = (status: string) => {
    switch (status) {
      case 'warning':
        return 'Monto menor al promedio esperado';
      case 'error':
        return 'Monto excede el límite máximo permitido';
      default:
        return '';
    }
  };

  const stats = {
    total: students.length,
    valid: students.filter(s => s.status === 'valid').length,
    warnings: students.filter(s => s.status === 'warning').length,
    errors: students.filter(s => s.status === 'error').length,
    totalAmount: students.reduce((sum, s) => sum + s.amount, 0),
    avgAmount: students.reduce((sum, s) => sum + s.amount, 0) / students.length,
    maxAmount: Math.max(...students.map(s => s.amount)),
    minAmount: Math.min(...students.map(s => s.amount))
  };

  const handleApprove = () => {
    if (!batch) return;
    
    if (stats.errors > 0) {
      toast({
        title: "No se puede aprobar",
        description: `Hay ${stats.errors} estudiante(s) con errores que deben ser corregidos.`,
        variant: "destructive"
      });
      return;
    }

    onBatchAction(batch.id, 'approve');
    onOpenChange(false);
    
    toast({
      title: "Lote aprobado",
      description: `${batch.name} ha sido aprobado exitosamente.`,
    });
  };

  const handleReject = () => {
    if (!batch) return;
    
    onBatchAction(batch.id, 'reject');
    onOpenChange(false);
    
    toast({
      title: "Lote rechazado",
      description: `${batch.name} ha sido rechazado.`,
      variant: "destructive"
    });
  };

  const exportBatchData = () => {
    const csvHeaders = ['ID', 'Nombre', 'Email', 'Monto', 'Estado', 'Año', 'Carrera'];
    const csvRows = students.map(student => [
      student.id,
      student.name,
      student.email,
      student.amount,
      student.status,
      student.year,
      student.career
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detalle_${batch?.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exportación exitosa",
      description: "Detalles del lote exportados en CSV.",
    });
  };

  if (!batch) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pr-8">
          <DialogTitle className="flex items-center justify-between mb-2">
            <span>Detalle del Lote: {batch.name}</span>
                               <Button variant="outline" size="sm" onClick={exportBatchData} className="ml-6">
                     <Download className="h-4 w-4 mr-2" />
                     Exportar Excel
                   </Button>
          </DialogTitle>
          <DialogDescription>
            Revisa y valida la información antes de aprobar o rechazar el lote
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Estudiantes</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Monto Total</p>
                    <p className="text-xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Promedio</p>
                    <p className="text-xl font-bold">{formatCurrency(stats.avgAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Válidos</p>
                    <p className="text-xl font-bold text-green-600">{stats.valid}</p>
                    {stats.warnings > 0 && (
                      <p className="text-xs text-yellow-600">{stats.warnings} advertencias</p>
                    )}
                    {stats.errors > 0 && (
                      <p className="text-xs text-red-600">{stats.errors} errores</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validation Alerts */}
          {(stats.errors > 0 || stats.warnings > 0) && (
            <Card className="flex-shrink-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Validaciones Encontradas</h4>
                    {stats.errors > 0 && (
                      <p className="text-sm text-red-600">
                        • {stats.errors} estudiante(s) con errores críticos (revisar antes de aprobar)
                      </p>
                    )}
                    {stats.warnings > 0 && (
                      <p className="text-sm text-yellow-600">
                        • {stats.warnings} estudiante(s) con advertencias (revisar recomendado)
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Students Table */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-lg">Lista de Estudiantes</CardTitle>
              <CardDescription>
                Detalle individual de cada estudiante en el lote
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-hidden">
              <ScrollArea className="h-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Año</TableHead>
                      <TableHead>Carrera</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{student.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(student.amount)}
                        </TableCell>
                        <TableCell>{student.year}°</TableCell>
                        <TableCell className="text-sm">{student.career}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(student.status)}
                            {getValidationMessage(student.status) && (
                              <p className="text-xs text-muted-foreground">
                                {getValidationMessage(student.status)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {batch.status === 'pending' && (
          <div className="flex justify-end space-x-3 pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Rechazar Lote
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={stats.errors > 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Aprobar Lote
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
