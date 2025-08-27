import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  DollarSign,
  Users,
  Store,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  Download
} from 'lucide-react';

// Mock data
const dashboardStats = {
  ventasHoy: { value: '$2,847,320', change: '+12.5%', trend: 'up' },
  ticketsHoy: { value: '1,247', change: '+8.2%', trend: 'up' },
  saldoRemanente: { value: '$45,678,900', change: '-3.1%', trend: 'down' },
  estudiantesActivos: { value: '12,458', change: '+2.3%', trend: 'up' }
};

const pendingApprovals = [
  { id: 1, type: 'Carga de Becas', amount: '$15,650,000', student_count: 450, date: '2025-01-15', status: 'pending' },
  { id: 2, type: 'Ajuste Manual', amount: '$234,500', student_count: 12, date: '2025-01-15', status: 'pending' },
  { id: 3, type: 'Carga de Becas', amount: '$8,750,000', student_count: 280, date: '2025-01-14', status: 'approved' }
];

const topVendors = [
  { name: 'Cafetería Andes', sales: '$945,230', orders: 423, growth: '+15%' },
  { name: 'Sándwich U', sales: '$785,650', orders: 356, growth: '+12%' },
  { name: 'Dulce & Café', sales: '$623,440', orders: 289, growth: '+8%' }
];

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath="/admin" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary">
                Dashboard Universitario
              </h1>
              <p className="text-muted-foreground mt-1">
                Gestión integral de becas alimentarias
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button size="sm" className="bg-gradient-primary shadow-glow-accent">
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver Reportes
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-university transition-university hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ventas Hoy
                </CardTitle>
                <DollarSign className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient-primary">
                  {dashboardStats.ventasHoy.value}
                </div>
                <p className="text-xs text-success flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {dashboardStats.ventasHoy.change} vs ayer
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-university transition-university hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tickets Hoy
                </CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient-primary">
                  {dashboardStats.ticketsHoy.value}
                </div>
                <p className="text-xs text-success flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {dashboardStats.ticketsHoy.change} vs ayer
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-university transition-university hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Saldo Remanente
                </CardTitle>
                <Store className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient-primary">
                  {dashboardStats.saldoRemanente.value}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  Total disponible en wallets
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-university transition-university hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Estudiantes Activos
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient-primary">
                  {dashboardStats.estudiantesActivos.value}
                </div>
                <p className="text-xs text-success flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {dashboardStats.estudiantesActivos.change} este mes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pending Approvals */}
            <Card className="shadow-university">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gradient-primary">
                      Aprobaciones Pendientes
                    </CardTitle>
                    <CardDescription>
                      Cargas de becas esperando aprobación
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                    2 pendientes
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-university"
                  >
                    <div className="flex items-center space-x-3">
                      {approval.status === 'pending' ? (
                        <Clock className="h-5 w-5 text-warning" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{approval.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {approval.student_count} estudiantes • {approval.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{approval.amount}</p>
                      {approval.status === 'pending' && (
                        <Button size="sm" variant="outline" className="mt-1">
                          Revisar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Vendors */}
            <Card className="shadow-university">
              <CardHeader>
                <CardTitle className="text-lg text-gradient-primary">
                  Top Locales
                </CardTitle>
                <CardDescription>
                  Rendimiento de locales hoy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topVendors.map((vendor, index) => (
                  <div
                    key={vendor.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-university"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-accent text-accent-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {vendor.orders} órdenes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{vendor.sales}</p>
                      <p className="text-xs text-success">{vendor.growth}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}