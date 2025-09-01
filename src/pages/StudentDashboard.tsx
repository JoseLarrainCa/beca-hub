import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  MapPin,
  User,
  LogOut,
  Wallet,
  Receipt
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, Student, Order, Wallet as WalletType, Transaction } from '@/services/api';
import StudentLogin from '@/components/student/StudentLogin';

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { toast } = useToast();

  useEffect(() => {
    if (student) {
      loadStudentData();
      
      // Refresh orders every 30 seconds to show real-time updates
      const interval = setInterval(loadStudentData, 30000);
      return () => clearInterval(interval);
    }
  }, [student]);

  const loadStudentData = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      const [walletData, ordersData, transactionsData] = await Promise.all([
        apiService.getWallet(student.id),
        apiService.getOrders(student.id),
        apiService.getTransactions(student.id)
      ]);
      
      setWallet(walletData);
      setOrders(ordersData.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
      setTransactions(transactionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading student data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del estudiante",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsCollected = async (orderId: string) => {
    try {
      await apiService.markOrderAsCollected(orderId);
      await loadStudentData(); // Refresh data
      toast({
        title: "¡Pedido retirado!",
        description: "Has marcado el pedido como retirado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar el pedido como retirado",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setStudent(null);
    setWallet(null);
    setOrders([]);
    setTransactions([]);
    setActiveTab('home');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getOrderStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'collected': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusText = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'En preparación';
      case 'ready': return 'Listo para retirar';
      case 'collected': return 'Retirado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getWalletStatusColor = (status: WalletType['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!student) {
    return <StudentLogin onLogin={setStudent} />;
  }

  const activeOrders = orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status));
  const completedOrders = orders.filter(o => ['collected', 'cancelled'].includes(o.status));
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="tapin-theme min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{student.name}</h1>
                <p className="text-sm text-gray-500">{student.career} • {student.campus}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Inicio</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>Mi Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>Mis Pedidos</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Wallet Summary */}
            {wallet && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Mi Tarjeta Beca</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(wallet.balance)}</p>
                      <p className="text-sm text-gray-500">Saldo disponible</p>
                    </div>
                    <Badge className={getWalletStatusColor(wallet.status)}>
                      {wallet.status === 'active' ? 'Activa' : 
                       wallet.status === 'suspended' ? 'Suspendida' : 'Vencida'}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Vence: {new Date(wallet.validUntil).toLocaleDateString('es-CL')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Límite: {formatCurrency(wallet.limitPerPurchase)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ready Orders Alert */}
            {readyOrders.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">
                        ¡Tienes {readyOrders.length} pedido{readyOrders.length > 1 ? 's' : ''} listo{readyOrders.length > 1 ? 's' : ''}!
                      </h3>
                      <p className="text-sm text-green-700">
                        {readyOrders.length === 1 
                          ? `Tu pedido en ${readyOrders[0].vendorName} está listo para retirar`
                          : 'Tienes varios pedidos listos para retirar'
                        }
                      </p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('orders')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Ver Pedidos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Pedidos Activos</span>
                </CardTitle>
                <CardDescription>
                  Seguimiento de tus pedidos en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Cargando pedidos...</p>
                  </div>
                ) : activeOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No tienes pedidos activos</p>
                    <p className="text-sm text-gray-400">¡Haz tu primera compra en el casino!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{order.vendorName}</h4>
                            <p className="text-sm text-gray-500">
                              Pedido #{order.id} • {new Date(order.orderDate).toLocaleTimeString('es-CL', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getOrderStatusColor(order.status)}>
                              {getOrderStatusText(order.status)}
                            </Badge>
                            <p className="text-sm font-semibold mt-1">{formatCurrency(order.totalAmount)}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          {order.items.map((item, index) => (
                            <span key={item.id}>
                              {item.quantity}x {item.name}
                              {index < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </div>

                        {order.status === 'ready' && (
                          <Button 
                            onClick={() => handleMarkAsCollected(order.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Retirado
                          </Button>
                        )}

                        {order.status === 'confirmed' && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Tiempo estimado: {order.estimatedTime} minutos</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            {wallet && (
              <>
                {/* Wallet Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Información de mi Tarjeta</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Saldo Actual</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(wallet.balance)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estado</p>
                        <Badge className={getWalletStatusColor(wallet.status)}>
                          {wallet.status === 'active' ? 'Activa' : 
                           wallet.status === 'suspended' ? 'Suspendida' : 'Vencida'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Válida Desde</p>
                        <p className="font-semibold">{new Date(wallet.validFrom).toLocaleDateString('es-CL')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Válida Hasta</p>
                        <p className="font-semibold">{new Date(wallet.validUntil).toLocaleDateString('es-CL')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Límite por Compra</p>
                        <p className="font-semibold">{formatCurrency(wallet.limitPerPurchase)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Última Transacción</p>
                        <p className="font-semibold">{new Date(wallet.lastTransaction).toLocaleDateString('es-CL')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Últimas Transacciones</CardTitle>
                    <CardDescription>Historial de movimientos en tu tarjeta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No hay transacciones</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.slice(0, 10).map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString('es-CL')} • 
                                {new Date(transaction.date).toLocaleTimeString('es-CL', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Saldo: {formatCurrency(transaction.balanceAfter)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial Completo de Pedidos</CardTitle>
                <CardDescription>Todos tus pedidos, activos y completados</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No tienes pedidos</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{order.vendorName}</h4>
                            <p className="text-sm text-gray-500">
                              Pedido #{order.id} • {new Date(order.orderDate).toLocaleDateString('es-CL')} • 
                              {new Date(order.orderDate).toLocaleTimeString('es-CL', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getOrderStatusColor(order.status)}>
                              {getOrderStatusText(order.status)}
                            </Badge>
                            <p className="text-sm font-semibold mt-1">{formatCurrency(order.totalAmount)}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          {order.items.map((item, index) => (
                            <span key={item.id}>
                              {item.quantity}x {item.name} ({formatCurrency(item.price)})
                              {index < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </div>

                        {order.status === 'ready' && (
                          <Button 
                            onClick={() => handleMarkAsCollected(order.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Retirado
                          </Button>
                        )}

                        {order.collectedDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Retirado el {new Date(order.collectedDate).toLocaleDateString('es-CL')} a las{' '}
                            {new Date(order.collectedDate).toLocaleTimeString('es-CL', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
