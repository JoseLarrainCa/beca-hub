import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  Download,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  DollarSign,
  Calendar,
  FileText,
  Eye,
  Check,
  X,
  RefreshCw
} from 'lucide-react';

// Mock data
const pendingBatches = [
  {
    id: 1,
    date: '2025-01-15 14:30',
    uploadedBy: 'Juan Pérez',
    totalAmount: 15650000,
    studentCount: 450,
    fileName: 'becas_enero_2025.csv',
    status: 'pending'
  },
  {
    id: 2,
    date: '2025-01-15 09:15',
    uploadedBy: 'María González',
    totalAmount: 234500,
    studentCount: 12,
    fileName: 'ajuste_manual_estudiantes.csv',
    status: 'pending'
  }
];

const approvedBatches = [
  {
    id: 3,
    date: '2025-01-14 16:45',
    uploadedBy: 'Juan Pérez',
    approvedBy: 'Carlos Silva',
    totalAmount: 8750000,
    studentCount: 280,
    fileName: 'becas_diciembre_2024.csv',
    status: 'approved'
  },
  {
    id: 4,
    date: '2025-01-13 11:20',
    uploadedBy: 'Ana Torres',
    approvedBy: 'Carlos Silva',
    totalAmount: 12300000,
    studentCount: 385,
    fileName: 'becas_primer_semestre.csv',
    status: 'approved'
  }
];

const studentWallets = [
  {
    id: 'E2021-12345',
    name: 'María González Pérez',
    email: 'maria.gonzalez@universidad.cl',
    balance: 25750,
    validFrom: '2025-01-01',
    validUntil: '2025-06-30',
    status: 'active',
    lastTransaction: '2025-01-15 12:30',
    limitPerPurchase: 15000
  },
  {
    id: 'E2021-67890',
    name: 'Carlos Rodríguez Silva',
    email: 'carlos.rodriguez@universidad.cl',
    balance: 42300,
    validFrom: '2025-01-01',
    validUntil: '2025-06-30',
    status: 'active',
    lastTransaction: '2025-01-14 18:45',
    limitPerPurchase: 20000
  },
  {
    id: 'E2020-11111',
    name: 'Ana Martínez López',
    email: 'ana.martinez@universidad.cl',
    balance: 0,
    validFrom: '2024-08-01',
    validUntil: '2024-12-31',
    status: 'expired',
    lastTransaction: '2024-12-30 14:20',
    limitPerPurchase: 12000
  }
];

export default function ScholarshipManagement() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Archivo cargado exitosamente",
            description: "El lote de becas está listo para revisión.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleApprove = (batchId: number) => {
    toast({
      title: "Lote aprobado",
      description: "Las becas han sido aplicadas a las wallets de estudiantes.",
    });
  };

  const handleReject = (batchId: number) => {
    toast({
      title: "Lote rechazado",
      description: "El lote ha sido rechazado y marcado para revisión.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Pendiente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Rechazado</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Activa</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Suspendida</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/30">Vencida</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const filteredWallets = studentWallets.filter(wallet =>
    wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Cargas Pendientes</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Histórico</span>
          </TabsTrigger>
          <TabsTrigger value="wallets" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Wallets</span>
          </TabsTrigger>
        </TabsList>

        {/* Pending Batches Tab */}
        <TabsContent value="pending" className="space-y-6">
          {/* Upload Section */}
          <Card className="shadow-university">
            <CardHeader>
              <CardTitle className="text-gradient-primary flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Cargar Nuevo Lote de Becas
              </CardTitle>
              <CardDescription>
                Sube un archivo CSV con las asignaciones de becas para estudiantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csvFile">Archivo CSV</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Procesando archivo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {selectedFile && !isUploading && (
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-sm font-medium">Archivo seleccionado:</p>
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                </div>
              )}

              <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                <h4 className="font-medium text-sm mb-2">Formato CSV requerido:</h4>
                <p className="text-xs text-muted-foreground">
                  student_id, monto_centavos, vigencia_desde, vigencia_hasta, limite_por_compra_centavos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Batches List */}
          <Card className="shadow-university">
            <CardHeader>
              <CardTitle className="text-gradient-primary">
                Lotes Pendientes de Aprobación
              </CardTitle>
              <CardDescription>
                Revisa y aprueba las cargas de becas pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-university"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{batch.fileName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Cargado por {batch.uploadedBy} • {batch.date}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(batch.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Estudiantes</p>
                        <p className="text-lg font-bold">{batch.studentCount}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Monto Total</p>
                        <p className="text-lg font-bold">{formatCurrency(batch.totalAmount)}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Promedio</p>
                        <p className="text-lg font-bold">{formatCurrency(batch.totalAmount / batch.studentCount)}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Estado</p>
                        <p className="text-lg font-bold">Pendiente</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Revisar Detalle
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-success text-success hover:bg-success hover:text-success-foreground"
                        onClick={() => handleApprove(batch.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleReject(batch.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gradient-primary">
                    Histórico de Cargas
                  </CardTitle>
                  <CardDescription>
                    Lotes de becas procesados anteriormente
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvedBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-university"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{batch.fileName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Cargado por {batch.uploadedBy} • Aprobado por {batch.approvedBy} • {batch.date}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(batch.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Estudiantes</p>
                        <p className="text-lg font-bold">{batch.studentCount}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Monto Total</p>
                        <p className="text-lg font-bold">{formatCurrency(batch.totalAmount)}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Promedio</p>
                        <p className="text-lg font-bold">{formatCurrency(batch.totalAmount / batch.studentCount)}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Estado</p>
                        <p className="text-lg font-bold">Aplicado</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-6">
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gradient-primary">
                    Wallets de Estudiantes
                  </CardTitle>
                  <CardDescription>
                    Gestión de saldos y estado de becas
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar estudiante..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-university"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{wallet.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {wallet.id} • {wallet.email}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(wallet.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Saldo Actual</p>
                        <p className="text-lg font-bold text-gradient-primary">
                          {formatCurrency(wallet.balance)}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Vigencia Desde</p>
                        <p className="text-sm font-medium">{wallet.validFrom}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Vigencia Hasta</p>
                        <p className="text-sm font-medium">{wallet.validUntil}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Límite por Compra</p>
                        <p className="text-sm font-medium">{formatCurrency(wallet.limitPerPurchase)}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Última Transacción</p>
                        <p className="text-sm font-medium">{wallet.lastTransaction}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Historial
                      </Button>
                      <Button variant="outline" size="sm">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Ajustar Saldo
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Renovar Vigencia
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}