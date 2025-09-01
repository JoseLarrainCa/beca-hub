import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  QrCode, 
  History, 
  ArrowLeft, 
  Clock,
  Receipt,
  Calendar,
  AlertCircle,
  CheckCircle,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, Student, Wallet as WalletType, Transaction, Order } from '@/services/api';

interface IntegratedWalletProps {
  student: Student;
  onBack: () => void;
}

export default function IntegratedWallet({ student, onBack }: IntegratedWalletProps) {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('balance');
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWalletData();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(loadWalletData, 30000);
    return () => clearInterval(interval);
  }, [student.id]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletData, transactionsData, ordersData] = await Promise.all([
        apiService.getWallet(student.id),
        apiService.getTransactions(student.id),
        apiService.getOrders(student.id)
      ]);
      
      setWallet(walletData);
      setTransactions(transactionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setOrders(ordersData.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de la wallet",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getWalletStatusColor = (status: WalletType['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateQRCode = () => {
    // Generate QR data with student info for payment
    const qrData = {
      studentId: student.id,
      studentName: student.name,
      rut: student.rut,
      balance: wallet?.balance || 0,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    };
    
    return `UDD-WALLET:${btoa(JSON.stringify(qrData))}`;
  };

  const copyQRToClipboard = () => {
    const qrData = generateQRCode();
    navigator.clipboard.writeText(qrData);
    toast({
      title: "QR copiado",
      description: "El código QR ha sido copiado al portapapeles",
    });
  };

  const markOrderAsCollected = async (orderId: string) => {
    try {
      await apiService.markOrderAsCollected(orderId);
      await loadWalletData(); // Refresh data
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando wallet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-500">No se pudo cargar la información de la wallet</p>
            <Button onClick={loadWalletData} className="mt-4">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status));
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Mi Wallet UDD</h1>
              <p className="text-sm text-gray-500">{student.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Saldo Disponible</p>
                <p className="text-3xl font-bold">{formatCurrency(wallet.balance)}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-blue-100">
                  <span>Vence: {new Date(wallet.validUntil).toLocaleDateString('es-CL')}</span>
                  <Badge className={getWalletStatusColor(wallet.status)}>
                    {wallet.status === 'active' ? 'Activa' : 
                     wallet.status === 'suspended' ? 'Suspendida' : 'Vencida'}
                  </Badge>
                </div>
              </div>
              <CreditCard className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        {/* Ready Orders Alert */}
        {readyOrders.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="balance" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Saldo</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center space-x-2">
              <QrCode className="h-4 w-4" />
              <span>Pago QR</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Actividad</span>
            </TabsTrigger>
          </TabsList>

          {/* Balance Tab */}
          <TabsContent value="balance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Tarjeta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Saldo Actual</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(wallet.balance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Límite por Compra</p>
                    <p className="font-semibold">{formatCurrency(wallet.limitPerPurchase)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Válida Desde</p>
                    <p className="font-semibold">{new Date(wallet.validFrom).toLocaleDateString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Válida Hasta</p>
                    <p className="font-semibold">{new Date(wallet.validUntil).toLocaleDateString('es-CL')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pedidos Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">{order.vendorName}</h4>
                            <p className="text-xs text-gray-500">
                              Pedido #{order.id} • {new Date(order.orderDate).toLocaleTimeString('es-CL', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getOrderStatusColor(order.status)} size="sm">
                              {getOrderStatusText(order.status)}
                            </Badge>
                            <p className="text-xs font-semibold mt-1">{formatCurrency(order.totalAmount)}</p>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          {order.items.map((item, index) => (
                            <span key={item.id}>
                              {item.quantity}x {item.name}
                              {index < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </div>

                        {order.status === 'ready' && (
                          <Button 
                            onClick={() => markOrderAsCollected(order.id)}
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Marcar como Retirado
                          </Button>
                        )}

                        {order.status === 'confirmed' && (
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Tiempo estimado: {order.estimatedTime} minutos</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* QR Tab */}
          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pago con QR</CardTitle>
                <p className="text-sm text-gray-600">
                  Muestra este QR en el punto de venta para pagar con tu wallet
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <QrCode className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 mb-4">
                    Código QR temporal para pago
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono break-all">
                    {generateQRCode()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button onClick={copyQRToClipboard} variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar código QR
                  </Button>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Saldo disponible:</strong> {formatCurrency(wallet.balance)}</p>
                    <p><strong>Límite por compra:</strong> {formatCurrency(wallet.limitPerPurchase)}</p>
                    <p><strong>Estado:</strong> {wallet.status === 'active' ? 'Activa' : 'Inactiva'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Transacciones</CardTitle>
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
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('es-CL')} • 
                            {new Date(transaction.date).toLocaleTimeString('es-CL', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Saldo: {formatCurrency(transaction.balanceAfter)}
                          </p>
                        </div>
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

