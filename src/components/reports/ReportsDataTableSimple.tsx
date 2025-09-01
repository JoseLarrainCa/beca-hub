import React, { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { apiService, Transaction } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Filter, 
  X, 
  Search,
  Calendar,
  DollarSign,
  Clock,
  Store,
  Users,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';

interface FilterState {
  search: string;
  vendor: string;
  type: 'all' | 'purchase' | 'adjustment' | 'refund';
  minAmount: string;
  maxAmount: string;
}

export default function ReportsDataTableSimple(props: { 
  initialFrom: string; 
  initialTo: string; 
}) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    vendor: '',
    type: 'all',
    minAmount: '',
    maxAmount: ''
  });
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch transactions using apiService
  const { data: transactions = [], isLoading, error, refetch } = useQuery({
    queryKey: ["transactions-report", props.initialFrom, props.initialTo],
    queryFn: async () => {
      const allTransactions = await apiService.getTransactions();
      
      // Filter by date range
      const fromDate = new Date(props.initialFrom);
      const toDate = new Date(props.initialTo);
      toDate.setHours(23, 59, 59, 999); // Include entire end date
      
      return allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Apply filters and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Search filter (student ID or description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          transaction.studentId.toLowerCase().includes(searchLower) ||
          transaction.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Vendor filter
      if (filters.vendor && transaction.vendor) {
        const matchesVendor = transaction.vendor.toLowerCase().includes(filters.vendor.toLowerCase());
        if (!matchesVendor) return false;
      }

      // Type filter
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Amount filters
      const amount = Math.abs(transaction.amount);
      if (filters.minAmount && amount < Number(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && amount > Number(filters.maxAmount)) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      if (sortBy === 'amount') {
        aVal = Math.abs(a.amount);
        bVal = Math.abs(b.amount);
      } else {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      }
      
      if (sortOrder === 'desc') {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    });

    return filtered;
  }, [transactions, filters, sortBy, sortOrder]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const purchaseTransactions = filteredAndSortedTransactions.filter(t => t.type === 'purchase');
    const totalRevenue = purchaseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const uniqueStudents = new Set(filteredAndSortedTransactions.map(t => t.studentId)).size;
    const uniqueVendors = new Set(filteredAndSortedTransactions.filter(t => t.vendor).map(t => t.vendor)).size;

    return {
      totalTransactions: filteredAndSortedTransactions.length,
      totalRevenue,
      avgTicket: purchaseTransactions.length > 0 ? totalRevenue / purchaseTransactions.length : 0,
      uniqueStudents,
      uniqueVendors
    };
  }, [filteredAndSortedTransactions]);

  const clearFilters = () => {
    setFilters({
      search: '',
      vendor: '',
      type: 'all',
      minAmount: '',
      maxAmount: ''
    });
  };

  const exportCSV = () => {
    const headers = [
      'Fecha',
      'Estudiante ID',
      'Tipo',
      'Descripción',
      'Monto',
      'Saldo Posterior',
      'Vendor',
      'Orden ID'
    ];

    const csvRows = filteredAndSortedTransactions.map(t => [
      new Date(t.date).toLocaleString('es-CL'),
      t.studentId,
      t.type === 'purchase' ? 'Compra' : t.type === 'adjustment' ? 'Ajuste' : 'Reembolso',
      `"${t.description}"`,
      t.amount,
      t.balanceAfter,
      t.vendor || 'N/A',
      t.orderId || 'N/A'
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_transacciones_${props.initialFrom}_${props.initialTo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString('es-CL')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      purchase: 'Compra',
      adjustment: 'Ajuste',
      refund: 'Reembolso'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeVariant = (type: string) => {
    const variants = {
      purchase: 'default',
      adjustment: 'secondary',
      refund: 'outline'
    } as const;
    return variants[type as keyof typeof variants] || 'outline';
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-600 font-medium mb-2">Error al cargar transacciones</div>
            <p className="text-sm text-muted-foreground mb-4">{String(error)}</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{summaryStats.totalTransactions}</div>
                <p className="text-xs text-muted-foreground">Transacciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">Ingresos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{formatCurrency(summaryStats.avgTicket)}</div>
                <p className="text-xs text-muted-foreground">Ticket Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{summaryStats.uniqueStudents}</div>
                <p className="text-xs text-muted-foreground">Estudiantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Store className="h-4 w-4 text-cyan-500" />
              <div>
                <div className="text-2xl font-bold">{summaryStats.uniqueVendors}</div>
                <p className="text-xs text-muted-foreground">Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Buscar estudiante o descripción</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ID o descripción..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Input
                placeholder="Nombre del vendor..."
                value={filters.vendor}
                onChange={(e) => setFilters(prev => ({ ...prev, vendor: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de transacción</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="purchase">Compras</SelectItem>
                  <SelectItem value="adjustment">Ajustes</SelectItem>
                  <SelectItem value="refund">Reembolsos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Monto mínimo</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minAmount}
                onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Monto máximo</Label>
              <Input
                type="number"
                placeholder="Sin límite"
                value={filters.maxAmount}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrando {filteredAndSortedTransactions.length} de {transactions.length} transacciones
              </span>
              {(filters.search || filters.vendor || filters.type !== 'all' || filters.minAmount || filters.maxAmount) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpiar filtros
                </Button>
              )}
            </div>
            <Button onClick={exportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Transacciones</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredAndSortedTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Filter className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No se encontraron transacciones</p>
              <p className="text-sm">Ajusta los filtros para ver resultados</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('date')}
                          className="h-auto p-0 font-semibold"
                        >
                          Fecha
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">Estudiante</th>
                      <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold">Descripción</th>
                      <th className="px-4 py-3 text-left">
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('amount')}
                          className="h-auto p-0 font-semibold"
                        >
                          Monto
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">Saldo Posterior</th>
                      <th className="px-4 py-3 text-left font-semibold">Vendor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedTransactions.map((transaction, index) => (
                      <tr key={transaction.id} className={`border-b hover:bg-muted/30 ${index % 2 === 0 ? 'bg-white' : 'bg-muted/10'}`}>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {transaction.studentId}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getTypeVariant(transaction.type)}>
                            {getTypeLabel(transaction.type)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm max-w-xs truncate">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-3 text-sm font-mono">
                          <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                            {transaction.amount < 0 ? '-' : '+'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono">
                          {formatCurrency(transaction.balanceAfter)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transaction.vendor || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
