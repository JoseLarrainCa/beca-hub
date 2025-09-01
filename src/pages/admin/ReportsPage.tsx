import React, { useState, useEffect, useMemo } from 'react';
import { getDateRange, type Preset } from '@/lib/dateRange';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiService, Transaction } from '@/services/api';
import ReportsDataTableSimple from '@/components/reports/ReportsDataTableSimple';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Store,
  Clock,
  FileText,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  RefreshCw,
  Filter,
  Table
} from 'lucide-react';

interface ReportStats {
  totalRevenue: number;
  totalTransactions: number;
  avgTransactionValue: number;
  activeStudents: number;
  topVendors: { name: string; revenue: number; transactions: number }[];
  recentTransactions: Transaction[];
  dailyStats: { [key: string]: { revenue: number; transactions: number } };
}

type TimeFilter = '7days' | '30days' | '90days' | '1year' | 'all';

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const { toast } = useToast();

  // Mapear TimeFilter a Preset
  const mapTimeFilterToPreset = (filter: TimeFilter): Preset => {
    switch (filter) {
      case '7days': return '7d';
      case '30days': return '30d';
      case '90days': return '90d';
      case '1year': return '90d'; // Usar 90d como fallback para 1year
      case 'all': return 'all';
      default: return '30d';
    }
  };

  // Memoizar las fechas para el DataTable
  const dateRange = useMemo(() => {
    const preset = mapTimeFilterToPreset(timeFilter);
    const range = getDateRange(preset);
    return {
      from: range.from.split('T')[0],
      to: range.to.split('T')[0]
    };
  }, [timeFilter]);

  useEffect(() => {
    loadReportData();
  }, [timeFilter]);

  // Usar el util centralizado para rangos de fecha
  const getFilteredDateRange = () => {
    const preset = mapTimeFilterToPreset(timeFilter);
    const range = getDateRange(preset);
    return { 
      start: new Date(range.from), 
      end: new Date(range.to) 
    };
  };

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, allTransactions] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getTransactions()
      ]);

      const { start, end } = getFilteredDateRange();

      // Filter transactions by selected time period
      const filteredTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      });

      // Calculate additional report metrics
      const purchaseTransactions = filteredTransactions.filter(t => t.type === 'purchase');
      const totalRevenue = purchaseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const avgTransactionValue = purchaseTransactions.length > 0 
        ? totalRevenue / purchaseTransactions.length 
        : 0;

      // Calculate daily stats for chart
      const chartDays = timeFilter === '7days' ? 7 : timeFilter === '30days' ? 30 : 7;
      const dailyStats: { [key: string]: { revenue: number; transactions: number } } = {};
      const dateRange = Array.from({ length: chartDays }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      dateRange.forEach(date => {
        dailyStats[date] = { revenue: 0, transactions: 0 };
      });

      purchaseTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
        if (dailyStats[transactionDate]) {
          dailyStats[transactionDate].revenue += Math.abs(transaction.amount);
          dailyStats[transactionDate].transactions += 1;
        }
      });

      // Calculate filtered vendor stats
      const vendorStats = purchaseTransactions
        .filter(t => t.vendor)
        .reduce((acc, t) => {
          const vendor = t.vendor!;
          if (!acc[vendor]) {
            acc[vendor] = { name: vendor, revenue: 0, transactions: 0 };
          }
          acc[vendor].revenue += Math.abs(t.amount);
          acc[vendor].transactions += 1;
          return acc;
        }, {} as Record<string, { name: string; revenue: number; transactions: number }>);

      const filteredTopVendors = Object.values(vendorStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setStats({
        totalRevenue,
        totalTransactions: purchaseTransactions.length,
        avgTransactionValue,
        activeStudents: dashboardStats.activeWallets,
        topVendors: filteredTopVendors,
        recentTransactions: filteredTransactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 20),
        dailyStats
      });

    } catch (error) {
      console.error('Failed to load report data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los reportes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CL')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Store className="h-4 w-4 text-blue-500" />;
      case 'adjustment':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'refund':
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFilterLabel = () => {
    switch (timeFilter) {
      case '7days': return 'Últimos 7 días';
      case '30days': return 'Este mes';
      case '90days': return 'Últimos 3 meses';
      case '1year': return 'Último año';
      case 'all': return 'Todo el tiempo';
    }
  };

  const exportReport = async () => {
    try {
      const allTransactions = await apiService.getTransactions();
      const { start, end } = getFilteredDateRange();
      
      // Filter transactions for export
      const filteredForExport = allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      });
      
      // Create comprehensive report CSV
      const headers = [
        'Fecha',
        'Tipo',
        'Descripción',
        'Monto',
        'Estudiante ID',
        'Vendor',
        'Orden ID',
        'Saldo Posterior'
      ];

      const rows = filteredForExport.map(transaction => [
        new Date(transaction.date).toLocaleDateString('es-CL'),
        transaction.type === 'purchase' ? 'Compra' : transaction.type === 'adjustment' ? 'Ajuste' : 'Reembolso',
        `"${transaction.description}"`,
        transaction.amount,
        transaction.studentId,
        transaction.vendor || 'N/A',
        transaction.orderId || 'N/A',
        transaction.balanceAfter
      ]);

      const csvContent = '\uFEFF' + [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\r\n');

      const blob = new Blob([csvContent], { 
        type: 'application/vnd.ms-excel;charset=utf-8;' 
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const filterSuffix = timeFilter === 'all' ? 'completo' : timeFilter;
      link.setAttribute('download', `reporte_transacciones_${filterSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Reporte exportado",
        description: "El reporte completo de transacciones ha sido descargado",
      });

    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Error en exportación",
        description: "No se pudo exportar el reporte",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin datos disponibles</h3>
            <p className="text-muted-foreground mb-4">No se pudieron cargar los reportes</p>
            <Button onClick={loadReportData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Reportes y Analytics
          </h1>
          <p className="text-muted-foreground">
            Análisis detallado de transacciones y rendimiento del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadReportData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Time Filter */}
      <Card className="shadow-university">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <span className="font-medium">Período de análisis:</span>
              </div>
              <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 días</SelectItem>
                  <SelectItem value="30days">Este mes</SelectItem>
                  <SelectItem value="90days">Últimos 3 meses</SelectItem>
                  <SelectItem value="1year">Último año</SelectItem>
                  <SelectItem value="all">Todo el tiempo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Calendar className="h-3 w-3 mr-1" />
              {getFilterLabel()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de contenido */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="datatable" className="flex items-center space-x-2">
            <Table className="h-4 w-4" />
            <span>Tabla de Datos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-university transition-university hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Todas las transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-university transition-university hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transacciones
            </CardTitle>
            <Store className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {stats.totalTransactions.toLocaleString('es-CL')}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              Compras realizadas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-university transition-university hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promedio por Transacción
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {formatCurrency(stats.avgTransactionValue)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Ticket promedio
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-university transition-university hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estudiantes Activos
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {stats.activeStudents.toLocaleString('es-CL')}
            </div>
            <p className="text-xs text-success flex items-center mt-1">
              <Users className="h-3 w-3 mr-1" />
              Con wallet activa
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Performance Chart */}
        <Card className="shadow-university">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center gap-2 card-title-with-description">
              <BarChart3 className="h-5 w-5" />
              Rendimiento por Día
            </CardTitle>
            <CardDescription>
              Ingresos y transacciones - {getFilterLabel()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.dailyStats).map(([date, data]) => {
                const maxRevenue = Math.max(...Object.values(stats.dailyStats).map(d => d.revenue));
                const percentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={date} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{formatDateShort(date)}</span>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(data.revenue)}</p>
                        <p className="text-xs text-muted-foreground">{data.transactions} transacciones</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card className="shadow-university">
          <CardHeader>
            <CardTitle className="text-gradient-primary flex items-center gap-2 card-title-with-description">
              <Store className="h-5 w-5" />
              Ranking de Locales
            </CardTitle>
            <CardDescription>
              Mejor rendimiento por ingresos generados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topVendors.length > 0 ? (
              <div className="space-y-4">
                {stats.topVendors.map((vendor, index) => (
                  <div key={vendor.name} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-university">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-accent text-accent-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {vendor.transactions} transacciones
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatCurrency(vendor.revenue)}</p>
                      <p className="text-xs text-success flex items-center justify-end">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        #{index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Sin datos de vendedores</p>
                <p className="text-xs">Los datos aparecerán después de las primeras transacciones</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-university">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-gradient-primary flex items-center gap-2 card-title-with-description">
                <Clock className="h-5 w-5" />
                Transacciones Recientes
              </CardTitle>
                          <CardDescription>
              Últimas {stats.recentTransactions.length} transacciones - {getFilterLabel()}
            </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/simulator" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ir a POS
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentTransactions.length > 0 ? (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {stats.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-university">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{transaction.studentId}</span>
                          <span>•</span>
                          <span>{formatDate(transaction.date)}</span>
                          {transaction.vendor && (
                            <>
                              <span>•</span>
                              <span>{transaction.vendor}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {transaction.amount < 0 ? '-' : '+'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Saldo: {formatCurrency(transaction.balanceAfter)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Sin transacciones aún</h3>
              <p className="text-sm mb-4">Las transacciones aparecerán aquí una vez que se realicen compras</p>
              <Button variant="outline" asChild>
                <a href="/simulator" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Simulador POS
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="datatable" className="mt-6">
          <ReportsDataTableSimple
            initialFrom={dateRange.from}
            initialTo={dateRange.to}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}