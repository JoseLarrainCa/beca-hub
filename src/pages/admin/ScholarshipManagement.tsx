import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import WalletAdjustDialog from '@/components/student/WalletAdjustDialog';
import WalletHistoryModal from '@/components/student/WalletHistoryModal';
import WalletFiltersComponent, { WalletFilters } from '@/components/student/WalletFilters';
import RenewVigencyDialog from '@/components/student/RenewVigencyDialog';
import BatchDetailModal from '@/components/admin/BatchDetailModal';
import { apiService, Wallet, Batch } from '@/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  RefreshCw,
  Loader2
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
  const [selectedStudentForAdjust, setSelectedStudentForAdjust] = useState<Wallet | null>(null);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Wallet | null>(null);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [exportSelection, setExportSelection] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showBatchDetail, setShowBatchDetail] = useState(false);
  const [selectedStudentForRenewal, setSelectedStudentForRenewal] = useState<Wallet | null>(null);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState<WalletFilters>({
    search: '',
    status: 'all',
    year: 'all',
    balanceMin: '',
    balanceMax: '',
    hasTransactions: 'all'
  });
  const { toast } = useToast();

  // Load data from API
  useEffect(() => {
    loadWallets();
    loadBatches();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const walletsData = await apiService.getWallets();
      setWallets(walletsData);
    } catch (error) {
      console.error('Failed to load wallets:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las wallets. Asegúrate de que JSON Server esté corriendo.",
        variant: "destructive"
      });
      // Fallback to mock data if API fails
      setWallets(studentWallets);
    } finally {
      setLoading(false);
    }
  };

  const loadBatches = async () => {
    try {
      setBatchesLoading(true);
      const batchesData = await apiService.getBatches();
      setBatches(batchesData);
    } catch (error) {
      console.error('Failed to load batches:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los lotes históricos.",
        variant: "destructive"
      });
      // Fallback to mock data con dos lotes pendientes
      setBatches([
        {
          id: 1,
          name: "Becas Enero 2025 - Lote 1",
          status: "pending",
          uploadDate: "2025-01-16",
          studentsCount: 185,
          totalAmount: 4625000,
          approvedBy: null,
          processedDate: null
        },
        {
          id: 2,
          name: "Becas Enero 2025 - Lote 2",
          status: "pending", 
          uploadDate: "2025-01-15",
          studentsCount: 92,
          totalAmount: 2300000,
          approvedBy: null,
          processedDate: null
        },
        {
          id: 3,
          name: "Becas Diciembre 2024",
          status: "approved",
          uploadDate: "2024-12-01",
          studentsCount: 145,
          totalAmount: 3625000,
          approvedBy: "Admin Principal",
          processedDate: "2024-12-02"
        },
        {
          id: 4,
          name: "Becas Noviembre 2024",
          status: "approved",
          uploadDate: "2024-11-05",
          studentsCount: 167,
          totalAmount: 4175000,
          approvedBy: "Jefe de Bienestar",
          processedDate: "2024-11-06"
        },
        {
          id: 5,
          name: "Becas Octubre 2024",
          status: "approved",
          uploadDate: "2024-10-15",
          studentsCount: 203,
          totalAmount: 5075000,
          approvedBy: "Admin Principal",
          processedDate: "2024-10-16"
        },
        {
          id: 6,
          name: "Becas Septiembre 2024",
          status: "approved",
          uploadDate: "2024-09-12",
          studentsCount: 189,
          totalAmount: 4725000,
          approvedBy: "Jefe de Bienestar",
          processedDate: "2024-09-13"
        },
        {
          id: 7,
          name: "Becas Agosto 2024",
          status: "approved",
          uploadDate: "2024-08-20",
          studentsCount: 156,
          totalAmount: 3900000,
          approvedBy: "Admin Principal",
          processedDate: "2024-08-21"
        },
        {
          id: 8,
          name: "Becas Julio 2024",
          status: "approved",
          uploadDate: "2024-07-18",
          studentsCount: 178,
          totalAmount: 4450000,
          approvedBy: "Jefe de Bienestar",
          processedDate: "2024-07-19"
        }
      ]);
    } finally {
      setBatchesLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
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

  const filteredWallets = useMemo(() => {
    return wallets.filter(wallet => {
      // Search filter
      const searchMatch = !filters.search || 
        wallet.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        wallet.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        wallet.email.toLowerCase().includes(filters.search.toLowerCase());

      // Status filter
      const statusMatch = filters.status === 'all' || wallet.status === filters.status;

      // Year filter
      const yearMatch = filters.year === 'all' || 
        wallet.validUntil.startsWith(filters.year) || 
        wallet.validFrom.startsWith(filters.year);

      // Balance range filter
      const balanceMin = filters.balanceMin ? parseInt(filters.balanceMin) : 0;
      const balanceMax = filters.balanceMax ? parseInt(filters.balanceMax) : Infinity;
      const balanceMatch = wallet.balance >= balanceMin && wallet.balance <= balanceMax;

      // Has transactions filter (mock based on lastTransaction)
      const hasTransactionsMatch = filters.hasTransactions === 'all' || 
        (filters.hasTransactions === 'yes' && wallet.lastTransaction) ||
        (filters.hasTransactions === 'no' && !wallet.lastTransaction);

      return searchMatch && statusMatch && yearMatch && balanceMatch && hasTransactionsMatch;
    });
  }, [wallets, filters, refreshKey]);

  const handleAdjustSaldo = (student: any) => {
    setSelectedStudentForAdjust(student);
    setShowAdjustDialog(true);
  };

  const handleViewHistory = (student: any) => {
    setSelectedStudentForHistory(student);
    setShowHistoryModal(true);
  };

  const handleWalletSuccess = async (updatedStudent: Wallet, adjustmentAmount: number, adjustmentType: string) => {
    console.log('🔄 handleWalletSuccess called:', { updatedStudent, adjustmentAmount, adjustmentType });
    
    try {
      // Use API to adjust wallet balance
      const result = await apiService.adjustWalletBalance(updatedStudent.id, {
        type: adjustmentType as 'add' | 'subtract' | 'set',
        amount: adjustmentAmount,
        reason: `Ajuste manual desde admin panel`
      });

      console.log('✅ API adjustment successful:', result);

      // Update local state with the new wallet data from API
      setWallets(prevWallets => 
        prevWallets.map(wallet => 
          wallet.id === updatedStudent.id ? result.wallet : wallet
        )
      );

      toast({
        title: "Wallet actualizada",
        description: `Saldo de ${updatedStudent.name} actualizado a ${formatCurrency(result.wallet.balance)}`,
      });

    } catch (error) {
      console.error('❌ Failed to adjust wallet balance:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el saldo. Verifica que JSON Server esté corriendo.",
        variant: "destructive"
      });
    }
  };

  const handleExportBatches = async () => {
    try {
      let batchIds: number[] | undefined;
      
      if (exportSelection !== 'all') {
        batchIds = [parseInt(exportSelection)];
      }
      
      await apiService.exportBatchesCSV(batchIds);
      
      toast({
        title: "Exportación exitosa",
        description: `Excel descargado con ${exportSelection === 'all' ? 'todos los lotes' : 'el lote seleccionado'}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Error en exportación",
        description: "No se pudo exportar el Excel. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handleBatchDetail = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowBatchDetail(true);
  };

  const handleBatchAction = async (batchId: number, action: 'approve' | 'reject') => {
    try {
      // Update batch status in local state (in real app, this would be an API call)
      setBatches(prevBatches => 
        prevBatches.map(batch => 
          batch.id === batchId 
            ? { 
                ...batch, 
                status: action === 'approve' ? 'approved' as const : 'rejected' as const,
                approvedBy: action === 'approve' ? 'Admin Usuario' : null,
                processedDate: new Date().toISOString().split('T')[0]
              }
            : batch
        )
      );

      toast({
        title: action === 'approve' ? "Lote aprobado" : "Lote rechazado",
        description: `El lote ha sido ${action === 'approve' ? 'aprobado' : 'rechazado'} exitosamente.`,
        variant: action === 'approve' ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Failed to update batch:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del lote.",
        variant: "destructive"
      });
    }
  };

  const handleRenewVigency = (student: Wallet) => {
    setSelectedStudentForRenewal(student);
    setShowRenewDialog(true);
  };

  const handleVigencySuccess = async (student: Wallet, newValidUntil: string, reason: string) => {
    try {
      // Update wallet in local state with new valid until date
      setWallets(prevWallets => 
        prevWallets.map(wallet => 
          wallet.id === student.id 
            ? { ...wallet, validUntil: newValidUntil }
            : wallet
        )
      );

      // In a real app, you would also create a transaction record for the renewal
      // const transaction = await apiService.createTransaction({...})

      toast({
        title: "Vigencia renovada",
        description: `La vigencia de ${student.name} ha sido extendida exitosamente.`,
      });

    } catch (error) {
      console.error('❌ Failed to renew vigency:', error);
      toast({
        title: "Error",
        description: "No se pudo renovar la vigencia. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

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
        <TabsContent value="pending" className="space-y-6 tab-scroll-consistent">
          {/* Upload Section */}
          <Card className="shadow-university">
            <CardHeader className="space-y-2">
              <CardTitle className="text-gradient-primary flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Cargar Nuevo Lote de Becas</span>
              </CardTitle>
              <CardDescription>
                Sube un archivo Excel con las asignaciones de becas para estudiantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="excelFile">Archivo Excel</Label>
                <Input
                  id="excelFile"
                  type="file"
                  accept=".xlsx,.xls"
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
                <h4 className="font-medium text-sm mb-2">Formato Excel requerido:</h4>
                <p className="text-xs text-muted-foreground">
                  student_id, monto_centavos, vigencia_desde, vigencia_hasta, limite_por_compra_centavos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Batches List */}
          <Card className="shadow-university">
            <CardHeader className="space-y-2">
              <CardTitle className="text-gradient-primary flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Lotes Pendientes de Aprobación</span>
              </CardTitle>
              <CardDescription>
                Revisa y aprueba las cargas de becas pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batchesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Cargando lotes pendientes...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {batches.filter(batch => batch.status === 'pending').map((batch) => (
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
                            <h4 className="font-semibold">{batch.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Cargado el {formatDate(batch.uploadDate)}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(batch.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-xs text-muted-foreground">Estudiantes</p>
                          <p className="text-lg font-bold">{batch.studentsCount}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-xs text-muted-foreground">Monto Total</p>
                          <p className="text-lg font-bold">{formatCurrency(batch.totalAmount)}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-xs text-muted-foreground">Promedio</p>
                          <p className="text-lg font-bold">{formatCurrency(Math.round(batch.totalAmount / batch.studentsCount))}</p>
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
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleBatchDetail(batch)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Revisar Detalle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                          onClick={() => handleBatchAction(batch.id, 'approve')}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Aprobar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          onClick={() => handleBatchAction(batch.id, 'reject')}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                  {batches.filter(batch => batch.status === 'pending').length === 0 && !batchesLoading && (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No hay lotes pendientes</h3>
                      <p className="text-sm text-muted-foreground">Todos los lotes han sido procesados.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6 tab-scroll-consistent">
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-gradient-primary flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Histórico de Cargas</span>
                  </CardTitle>
                  <CardDescription>
                    Lotes de becas procesados anteriormente
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={exportSelection} onValueChange={setExportSelection}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Seleccionar lotes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los lotes</SelectItem>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.name} ({batch.studentsCount} estudiantes)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={handleExportBatches}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {batchesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Cargando lotes históricos...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {batches.map((batch) => (
                    <div
                      key={batch.id}
                      className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-university"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            batch.status === 'approved' ? 'bg-success/20' : 
                            batch.status === 'pending' ? 'bg-warning/20' : 'bg-destructive/20'
                          }`}>
                            {batch.status === 'approved' ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : batch.status === 'pending' ? (
                              <Clock className="h-5 w-5 text-warning" />
                            ) : (
                              <XCircle className="h-5 w-5 text-destructive" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{batch.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Cargado el {formatDate(batch.uploadDate)}
                              {batch.approvedBy && ` • Aprobado por ${batch.approvedBy}`}
                              {batch.processedDate && ` • ${formatDate(batch.processedDate)}`}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(batch.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-xs text-muted-foreground">Estudiantes</p>
                          <p className="text-lg font-bold">{batch.studentsCount}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-xs text-muted-foreground">Monto Total</p>
                          <p className="text-lg font-bold">{formatCurrency(batch.totalAmount)}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-xs text-muted-foreground">Promedio</p>
                          <p className="text-lg font-bold">{formatCurrency(Math.round(batch.totalAmount / batch.studentsCount))}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-xs text-muted-foreground">Estado</p>
                          <p className="text-lg font-bold">
                            {batch.status === 'approved' ? 'Aplicado' : 
                             batch.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-6 tab-scroll-consistent">
          {/* Advanced Filters */}
          <WalletFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredWallets.length}
          />

          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-gradient-primary flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Wallets de Estudiantes</span>
                  </CardTitle>
                  <CardDescription>
                    Gestión de saldos y estado de becas
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-muted/30">
                  {filteredWallets.length} estudiantes
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Cargando wallets...</span>
                </div>
              ) : (
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewHistory(wallet)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Historial
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAdjustSaldo(wallet)}
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Ajustar Saldo
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRenewVigency(wallet)}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Renovar Vigencia
                      </Button>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <WalletAdjustDialog
        open={showAdjustDialog}
        onOpenChange={setShowAdjustDialog}
        student={selectedStudentForAdjust}
        onSuccess={handleWalletSuccess}
      />

      <WalletHistoryModal
        open={showHistoryModal}
        onOpenChange={setShowHistoryModal}
        student={selectedStudentForHistory}
      />

      <BatchDetailModal
        open={showBatchDetail}
        onOpenChange={setShowBatchDetail}
        batch={selectedBatch}
        onBatchAction={handleBatchAction}
      />

      <RenewVigencyDialog
        open={showRenewDialog}
        onOpenChange={setShowRenewDialog}
        student={selectedStudentForRenewal}
        onSuccess={handleVigencySuccess}
      />
    </div>
  );
}