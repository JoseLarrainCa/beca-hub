import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Store,
  Clock,
  FileText
} from 'lucide-react';

// Mock data
const reportStats = {
  totalSales: { value: '$185,347,920', change: '+15.2%', trend: 'up' },
  totalOrders: { value: '28,465', change: '+8.7%', trend: 'up' },
  avgOrderValue: { value: '$6,510', change: '+3.1%', trend: 'up' },
  activeStudents: { value: '12,458', change: '+2.3%', trend: 'up' }
};

const salesByVendor = [
  { name: 'Cafetería Andes', sales: 78340000, orders: 4250, percentage: 42.3 },
  { name: 'Sándwich U', sales: 61250000, orders: 3420, percentage: 33.1 },
  { name: 'Dulce & Café', sales: 45757920, orders: 2795, percentage: 24.6 }
];

const monthlyTrends = [
  { month: 'Agosto', sales: 142500000, orders: 22100, students: 11800 },
  { month: 'Septiembre', sales: 156750000, orders: 24300, students: 12100 },
  { month: 'Octubre', sales: 168920000, orders: 25800, students: 12350 },
  { month: 'Noviembre', sales: 174680000, orders: 26900, students: 12400 },
  { month: 'Diciembre', sales: 148320000, orders: 23100, students: 11950 },
  { month: 'Enero', sales: 185347920, orders: 28465, students: 12458 }
];

const topProducts = [
  { name: 'Cappuccino Clásico', vendor: 'Cafetería Andes', units: 2845, revenue: 7112500 },
  { name: 'Sandwich Italiano', vendor: 'Sándwich U', units: 1920, revenue: 9984000 },
  { name: 'Ensalada César', vendor: 'Sándwich U', units: 1680, revenue: 8064000 },
  { name: 'Cheesecake Frutos Rojos', vendor: 'Dulce & Café', units: 1450, revenue: 5075000 },
  { name: 'Croissant Almendras', vendor: 'Cafetería Andes', units: 1320, revenue: 4224000 }
];

export default function ReportsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-muted-foreground">Período: Enero 2025</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Seleccionar Período
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-university">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ventas Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {reportStats.totalSales.value}
            </div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {reportStats.totalSales.change} vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-university">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Órdenes Totales
            </CardTitle>
            <FileText className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {reportStats.totalOrders.value}
            </div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {reportStats.totalOrders.change} vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-university">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Promedio
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {reportStats.avgOrderValue.value}
            </div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {reportStats.avgOrderValue.change} vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-university">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estudiantes Activos
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-primary">
              {reportStats.activeStudents.value}
            </div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {reportStats.activeStudents.change} vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales by Vendor */}
        <Card className="shadow-university">
          <CardHeader>
            <CardTitle className="text-gradient-primary">
              Ventas por Local
            </CardTitle>
            <CardDescription>
              Distribución de ventas entre locales del campus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesByVendor.map((vendor, index) => (
                <div key={vendor.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-accent text-accent-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{vendor.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(vendor.sales)}</p>
                      <p className="text-xs text-muted-foreground">{vendor.orders} órdenes</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${vendor.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {vendor.percentage}% del total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-university">
          <CardHeader>
            <CardTitle className="text-gradient-primary">
              Productos Más Vendidos
            </CardTitle>
            <CardDescription>
              Top 5 productos con mayor demanda este mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-university"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-accent text-accent-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.vendor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{product.units} unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="shadow-university">
        <CardHeader>
          <CardTitle className="text-gradient-primary">
            Tendencias Mensuales
          </CardTitle>
          <CardDescription>
            Evolución de ventas, órdenes y estudiantes activos en los últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
              <div>Mes</div>
              <div className="col-span-2 text-center">Ventas</div>
              <div className="col-span-2 text-center">Órdenes</div>
              <div className="col-span-2 text-center">Estudiantes Activos</div>
            </div>
            {monthlyTrends.map((month) => (
              <div key={month.month} className="grid grid-cols-7 gap-4 items-center py-2 border-b border-border/30">
                <div className="font-medium">{month.month}</div>
                <div className="col-span-2 text-center">
                  <p className="font-semibold">{formatCurrency(month.sales)}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="font-semibold">{month.orders.toLocaleString('es-CL')}</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="font-semibold">{month.students.toLocaleString('es-CL')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-university">
        <CardHeader>
          <CardTitle className="text-gradient-primary">
            Acciones Rápidas
          </CardTitle>
          <CardDescription>
            Genera reportes específicos y exporta datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Reporte de Ventas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Reporte de Estudiantes</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Store className="h-6 w-6" />
              <span className="text-sm">Reporte de Locales</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Clock className="h-6 w-6" />
              <span className="text-sm">Reporte de Horarios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}