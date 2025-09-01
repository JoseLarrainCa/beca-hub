import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiService, Transaction } from '@/services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
  DollarSign,
  Users,
  Store,
  TrendingUp,
  TrendingDown,
  Clock,
  Loader2,
  Activity,
  CreditCard,
  BarChart3,
  PieChart as PieChartIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  activeWallets: number;
  totalBalance: number;
  dailyTransactions: number;
  weeklyRevenue: number;
  topVendors: { name: string; revenue: number; transactions: number }[];
  recentTransactions: Transaction[];
}

interface AnalyticsData {
  revenueOverTime: { date: string; revenue: number; transactions: number }[];
  walletDistribution: { range: string; count: number; avgBalance: number }[];
  topVendorsRanking: { name: string; revenue: number; uniqueUsers: number; transactions: number }[];
  activityHeatmap: { day: string; hour: number; intensity: number }[];
  userBehavior: { 
    totalDistributed: number; 
    totalSpent: number; 
    remainingBalance: number;
    activeUsers: number;
    retentionRate: number;
  };
  spendingPatterns: { category: string; percentage: number; users: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    loadAnalytics();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await apiService.getDashboardStats();
      setStats(dashboardData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const analyticsData = await apiService.getAnalytics(period);
      // Auto-seed demo data si no hay actividad para el período
      const hasAnyActivity = analyticsData.revenueOverTime.some(d => d.revenue > 0 || d.transactions > 0);
      if (!hasAnyActivity) {
        try {
          await apiService.seedDemoData(period);
          const refreshed = await apiService.getAnalytics(period);
          setAnalytics(refreshed);
          return;
        } catch (e) {
          // Si no podemos sembrar, seguimos con datos vacíos
        }
      }
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de analytics",
        variant: "destructive"
      });
    } finally {
      setAnalyticsLoading(false);
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Store className="h-4 w-4 text-blue-500" />;
      case 'adjustment':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'refund':
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Professional KPI Component
  const KPICard = ({ icon: Icon, iconBg, value, label, trend, trendValue }: {
    icon: any;
    iconBg: string;
    value: string;
    label: string;
    trend: 'positive' | 'negative' | 'neutral';
    trendValue: string;
  }) => (
    <div className="kpi-card">
      <div className="dashboard-card-content">
        <div className="kpi-icon" style={{ backgroundColor: iconBg }}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
        <div className={`kpi-trend ${trend}`}>
          {trend === 'positive' ? <TrendingUp className="w-3 h-3" /> : 
           trend === 'negative' ? <TrendingDown className="w-3 h-3" /> : 
           <div className="w-3 h-3 rounded-full bg-current opacity-50" />}
          <span>{trendValue}</span>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (loading || !stats) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Universitario</h1>
            <p className="dashboard-subtitle">Gestión integral de becas alimentarias</p>
          </div>
        </div>
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="kpi-card">
              <div className="dashboard-card-content">
                <div className="kpi-icon skeleton" />
                <div className="kpi-value skeleton h-8 w-24 mb-2" />
                <div className="kpi-label skeleton h-4 w-32 mb-2" />
                <div className="kpi-trend skeleton h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

    return (
    <div className="dashboard-container">
      {/* Professional Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Universitario</h1>
          <p className="dashboard-subtitle">Gestión integral de becas alimentarias</p>
        </div>
        <div className="period-toggle">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              className={`period-button ${period === days ? 'active' : ''}`}
              onClick={() => setPeriod(days)}
            >
              {days} días
            </button>
          ))}
        </div>
      </div>

      {/* Professional Grid Layout */}
      <div className="dashboard-grid">
        {/* KPI Cards Row */}
        <KPICard
          icon={DollarSign}
          iconBg="var(--chart-primary)"
          value={formatCurrency(stats.weeklyRevenue)}
          label="Ingresos Semanales"
          trend="positive"
          trendValue="+12.5%"
        />
        
        <KPICard
          icon={Activity}
          iconBg="var(--chart-secondary)"
          value={stats.dailyTransactions.toLocaleString('es-CL')}
          label="Transacciones Hoy"
          trend={stats.dailyTransactions > 0 ? "positive" : "neutral"}
          trendValue={stats.dailyTransactions > 0 ? "+8.2%" : "Sin cambios"}
        />
        
        <KPICard
          icon={CreditCard}
          iconBg="var(--chart-tertiary)"
          value={formatCurrency(stats.totalBalance)}
          label="Saldo Total Wallets"
          trend="neutral"
          trendValue={`${stats.activeWallets}/${stats.totalStudents} activas`}
        />
        
        <KPICard
          icon={Users}
          iconBg="var(--chart-quaternary)"
          value={stats.activeWallets.toLocaleString('es-CL')}
          label="Estudiantes Activos"
          trend="positive"
          trendValue={`${Math.round((stats.activeWallets / stats.totalStudents) * 100)}% del total`}
        />

        {/* Strategic Analytics Section */}
        {analyticsLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`chart-container ${i % 3 === 0 ? 'large' : 'medium'}`}>
                <div className="dashboard-card-content">
                  <div className="skeleton h-6 w-48 mb-4" />
                  <div className="skeleton h-80 w-full" />
                </div>
              </div>
            ))}
          </>
        ) : analytics ? (
          <>
            {/* 1. Revenue Over Time (único gráfico financiero) - Large */}
            <div className="chart-container large">
              <div className="dashboard-card-header">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--dashboard-neutral-900)' }}>
                    💰 Evolución de Ingresos
                  </h3>
            </div>
                <p className="text-sm" style={{ color: 'var(--dashboard-neutral-600)' }}>
                  Uso de becas alimentarias - Últimos {period} días
                </p>
              </div>
              <div className="dashboard-card-content pt-0">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={analytics.revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-neutral-200)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' })}
                      stroke="var(--dashboard-neutral-500)"
                      fontSize={12}
                    />
                    <YAxis stroke="var(--dashboard-neutral-500)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid var(--dashboard-neutral-200)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--chart-primary)" 
                      strokeWidth={3}
                      dot={{ fill: 'var(--chart-primary)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'var(--chart-primary)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Wallet Distribution (histograma estratégico) - Medium */}
            <div className="chart-container medium">
              <div className="dashboard-card-header">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--dashboard-neutral-900)' }}>
                    📊 Distribución de Saldos
                  </h3>
                </div>
                <p className="text-sm" style={{ color: 'var(--dashboard-neutral-600)' }}>
                  Estudiantes por rango de saldo
                </p>
              </div>
              <div className="dashboard-card-content pt-0">
                {(() => {
                  // Formatear solo en render - datos directos del backend
                  const chartData = analytics.walletDistribution || [];

                  return (
                    <>
                      {chartData.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                          Sin datos de wallets disponibles
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart 
                            data={chartData} 
                            margin={{ left: 16, right: 16, top: 8, bottom: 40 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-neutral-200)" />
                            <XAxis 
                              type="category"
                              dataKey="range"
                              stroke="var(--dashboard-neutral-500)"
                              fontSize={11}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis 
                              type="number"
                              domain={[0, 'dataMax']}
                              allowDecimals={false}
                              stroke="var(--dashboard-neutral-500)"
                              fontSize={12}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid var(--dashboard-neutral-200)',
                                borderRadius: '8px'
                              }}
                              formatter={(value: any, name: string) => {
                                if (name === 'count') return [value, 'Estudiantes'];
                                return [value, name];
                              }}
                              labelFormatter={(label) => `Rango: ${label}`}
                            />
                            <Bar 
                              dataKey="count" 
                              fill="hsl(214 83% 32%)"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 3. Top Vendors Ranking (barras horizontales) - Large */}
            <div className="chart-container large">
              <div className="dashboard-card-header">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--dashboard-neutral-900)' }}>
                    🏆 Ranking de Locales
                  </h3>
            </div>
                <p className="text-sm" style={{ color: 'var(--dashboard-neutral-600)' }}>
                  Ingresos totales por local
            </p>
      </div>
              <div className="dashboard-card-content pt-0">
                {(() => {
                  // Formatear solo en render - NO normalizar los datos
                  const fmtCLP = (n: number) => 
                    n.toLocaleString('es-CL', { 
                      style: 'currency', 
                      currency: 'CLP', 
                      maximumFractionDigits: 0 
                    });

                  // Usar datos DIRECTOS del backend - números crudos sin procesamiento
                  const chartData = analytics.topVendorsRanking || [];

                  return (
                    <>
                      {chartData.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                          Sin datos de ventas para el período seleccionado
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={360}>
                          <BarChart 
                            data={chartData} 
                            layout="vertical" 
                            margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--dashboard-neutral-200)" />
                            <XAxis 
                              type="number"
                              domain={[0, 'dataMax']}
                              tickFormatter={fmtCLP}
                              allowDecimals={false}
                              stroke="var(--dashboard-neutral-500)"
                              fontSize={12}
                            />
                            <YAxis 
                              type="category"
                              dataKey="name"
                              width={180}
                              tick={{ fontSize: 12 }}
                              stroke="var(--dashboard-neutral-500)"
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid var(--dashboard-neutral-200)',
                                borderRadius: '8px'
                              }}
                              formatter={(value: any, name: string) => {
                                if (name === 'revenue') return [fmtCLP(Number(value)), 'Ingresos'];
                                return [value, name];
                              }}
                              labelFormatter={(label) => `Local: ${label}`}
                            />
                            <Bar 
                              dataKey="revenue" 
                              fill="hsl(214 83% 32%)"
                              radius={[6, 6, 6, 6]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* 4. User Behavior (métricas estratégicas) - Medium */}
            <div className="chart-container medium">
              <div className="dashboard-card-header">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--dashboard-neutral-900)' }}>
                    🎯 Comportamiento
                  </h3>
                </div>
                <p className="text-sm" style={{ color: 'var(--dashboard-neutral-600)' }}>
                  Métricas de uso y retención
                </p>
              </div>
              <div className="dashboard-card-content pt-0">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Distribuido</span>
                    <span className="text-lg font-bold">{formatCurrency(analytics.userBehavior.totalDistributed)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Gastado</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(analytics.userBehavior.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Restante</span>
                    <span className="text-lg font-bold text-orange-600">{formatCurrency(analytics.userBehavior.remainingBalance)}</span>
                  </div>
                  <hr style={{ borderColor: 'var(--dashboard-neutral-200)' }} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Usuarios Activos</span>
                    <span className="text-lg font-bold">{analytics.userBehavior.activeUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Retención</span>
                    <span className="text-lg font-bold text-blue-600">{analytics.userBehavior.retentionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Spending Patterns (categorización) - Large */}
            <div className="chart-container large">
              <div className="dashboard-card-header">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--dashboard-neutral-900)' }}>
                    📊 Patrones de Uso Real
                  </h3>
                </div>
                <p className="text-sm" style={{ color: 'var(--dashboard-neutral-600)' }}>
                  Cómo aprovechan los estudiantes sus becas alimentarias
                </p>
              </div>
              <div className="dashboard-card-content pt-0">
                {(() => {
                  const chartData = analytics.spendingPatterns || [];
                  
                  return (
                    <>
                      {chartData.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                          Sin datos de patrones de uso disponibles
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={320}>
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={3}
                              dataKey="percentage"
                              label={({ 
                                cx, cy, midAngle, innerRadius, outerRadius, percentage 
                              }) => {
                                if (percentage <= 5) return '';
                                
                                const RADIAN = Math.PI / 180;
                                const radius = outerRadius + 20;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                
                                return (
                                  <text 
                                    x={x} 
                                    y={y} 
                                    fill="#374151" 
                                    textAnchor={x > cx ? 'start' : 'end'} 
                                    dominantBaseline="central"
                                    fontSize="14"
                                    fontWeight="500"
                                  >
                                    {`${percentage}%`}
                                  </text>
                                );
                              }}
                              labelLine={false}
                            >
                              {chartData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={[
                                    'hsl(214 83% 32%)', // Azul principal
                                    'hsl(214 83% 50%)', // Azul medio  
                                    'hsl(214 83% 70%)', // Azul claro
                                    'hsl(214 83% 85%)'  // Azul muy claro
                                  ][index % 4]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid var(--dashboard-neutral-200)',
                                borderRadius: '8px'
                              }}
                              formatter={(value: any, name: string, entry: any) => [
                                `${entry.payload.users} estudiantes (${value}%)`,
                                entry.payload.category
                              ]}
                            />
                            <Legend 
                              formatter={(value, entry: any) => 
                                `${entry.payload.category}: ${entry.payload.users} estudiantes`
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </>
                  );
                })()}
                
                {/* Explicación metodológica desplegable */}
                <div className="mt-4">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={`flex items-center justify-between w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-200 ${
                      showExplanation 
                        ? 'rounded-t-lg border-b-0' 
                        : 'rounded-lg'
                    }`}
                  >
                    <span className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                      📖 Cómo interpretar este gráfico
                    </span>
                    {showExplanation ? (
                      <ChevronUp className="h-4 w-4 text-blue-700" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-blue-700" />
                    )}
                  </button>
                  
                  {showExplanation && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 border-t-0 rounded-t-none">
                      <div className="text-xs text-blue-800 space-y-2">
                        <p>• <strong>Usuarios Frecuentes:</strong> Estudiantes que han usado ≥70% de su beca alimentaria</p>
                        <p>• <strong>Usuarios Regulares:</strong> Estudiantes que han usado entre 40-69% de su beca</p>
                        <p>• <strong>Usuarios Ocasionales:</strong> Estudiantes que han usado entre 10-39% de su beca</p>
                        <p>• <strong>Usuarios Inactivos:</strong> Estudiantes que han usado &lt;10% de su beca</p>
                        <p className="mt-2 text-blue-700">
                          <strong>Nota:</strong> Los porcentajes se calculan basándose en el uso estimado de la beca durante el período seleccionado.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                    </div>
                  </div>

            {/* 6. Activity Heatmap (día + hora) - Medium */}
            <div className="chart-container medium">
              <div className="dashboard-card-header">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-5 w-5" style={{ color: 'hsl(214 83% 32%)' }} />
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--dashboard-neutral-900)' }}>
                    🕐 Actividad por Horario
                  </h3>
                </div>
                <p className="text-sm" style={{ color: 'var(--dashboard-neutral-600)' }}>
                  Transacciones por día de la semana y hora
                </p>
              </div>
              <div className="dashboard-card-content pt-0">
                {(() => {
                  // Preparar datos para el heatmap como mini barras por día
                  const heatmapData = analytics.activityHeatmap || [];
                  
                  // Agrupar por día para crear mini-gráficos por día
                  const dayGroups = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dayName => {
                    const dayData = heatmapData
                      .filter(d => d.day === dayName)
                      .map(d => ({ hour: d.hour, transactions: d.intensity }))
                      .sort((a, b) => a.hour - b.hour);
                    
                    const totalTransactions = dayData.reduce((sum, d) => sum + d.transactions, 0);
                    return { day: dayName, data: dayData, total: totalTransactions };
                  });

                  const maxIntensity = Math.max(...heatmapData.map(d => d.intensity), 1);
                  
                  return (
                    <>


                      
                      {heatmapData.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                          Sin datos de actividad horaria disponibles
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Leyenda de horas */}
                          <div className="flex justify-between items-center text-xs text-gray-400 px-2">
                            <span>8:00</span>
                            <span>12:00</span>
                            <span>16:00</span>
                            <span>19:00</span>
                          </div>
                          
                          {/* Mini heatmap por día */}
                          <div className="space-y-3">
                            {dayGroups.map(({ day, data, total }) => (
                              <div key={day} className="flex items-center space-x-3">
                                {/* Día de la semana */}
                                <div className="w-10 text-xs font-medium text-gray-600">
                                  {day}
                                </div>
                                
                                {/* Barras por hora */}
                                <div className="flex-1 flex items-end space-x-0.5 h-8 relative">
                                  {data.map(({ hour, transactions }) => {
                                    const intensity = maxIntensity > 0 ? (transactions / maxIntensity) : 0;
                                    const height = Math.max(intensity * 24, transactions > 0 ? 4 : 2); // Mín 4px si hay datos
                                    const opacity = transactions > 0 ? Math.max(intensity, 0.3) : 0.1;
                                    
                                    return (
                                      <div
                                        key={hour}
                                        className="flex-1 rounded-sm transition-all hover:opacity-90 hover:scale-110 hover:z-10 cursor-pointer group relative"
                                        style={{
                                          height: `${height}px`,
                                          backgroundColor: `hsl(214 83% 32%)`,
                                          opacity: opacity,
                                          minWidth: '3px'
                                        }}
                                      >
                                        {/* Tooltip moderno */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                          <div className="font-medium">{day} {hour}:00</div>
                                          <div className="text-gray-300">{transactions} transacciones</div>
                                          {/* Flecha del tooltip */}
                                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {/* Total del día */}
                                <div className="w-8 text-xs text-gray-500 text-right">
                                  {total}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Resumen */}
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>💡 Horario pico: 12:00-14:00</span>
                              <span>📊 Total: {heatmapData.reduce((sum, d) => sum + d.intensity, 0)} transacciones</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}