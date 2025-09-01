import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiService, Wallet } from '@/services/api';
import { ShoppingCart, CreditCard, User, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  vendor: string;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const mockMenuItems: MenuItem[] = [
  // Cafetería Central
  { id: 'cf001', name: 'Café Americano', price: 1500, category: 'Bebidas', vendor: 'Cafetería Central', available: true },
  { id: 'cf002', name: 'Sandwich Italiano', price: 3500, category: 'Comidas', vendor: 'Cafetería Central', available: true },
  { id: 'cf003', name: 'Empanada de Pino', price: 2000, category: 'Comidas', vendor: 'Cafetería Central', available: true },
  { id: 'cf004', name: 'Jugo Natural', price: 2500, category: 'Bebidas', vendor: 'Cafetería Central', available: true },

  // Restaurante El Jardín
  { id: 'rj001', name: 'Ensalada Caesar', price: 4500, category: 'Ensaladas', vendor: 'Restaurante El Jardín', available: true },
  { id: 'rj002', name: 'Pasta Bolognesa', price: 5500, category: 'Comidas', vendor: 'Restaurante El Jardín', available: true },
  { id: 'rj003', name: 'Agua Mineral', price: 1200, category: 'Bebidas', vendor: 'Restaurante El Jardín', available: true },

  // Comida Rápida UDD
  { id: 'cr001', name: 'Hamburguesa Completa', price: 4200, category: 'Comidas', vendor: 'Comida Rápida UDD', available: true },
  { id: 'cr002', name: 'Papas Fritas', price: 2200, category: 'Acompañamientos', vendor: 'Comida Rápida UDD', available: true },
  { id: 'cr003', name: 'Bebida 500ml', price: 1800, category: 'Bebidas', vendor: 'Comida Rápida UDD', available: true },
];

export default function TransactionSimulator() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const walletsData = await apiService.getWallets();
      setWallets(walletsData.filter(w => w.status === 'active'));
    } catch (error) {
      console.error('Failed to load wallets:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CL')}`;
  };

  const getAvailableVendors = () => {
    return [...new Set(mockMenuItems.map(item => item.vendor))];
  };

  const getMenuItemsByVendor = (vendor: string) => {
    return mockMenuItems.filter(item => item.vendor === vendor && item.available);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedWallet = () => {
    return wallets.find(w => w.id === selectedStudent);
  };

  const canProcessPayment = () => {
    const wallet = getSelectedWallet();
    const total = getTotalAmount();
    
    if (!wallet || !selectedVendor || cart.length === 0) return false;
    if (wallet.balance < total) return false;
    if (total > wallet.limitPerPurchase) return false;
    
    return true;
  };

  const processPayment = async () => {
    if (!canProcessPayment()) return;

    const wallet = getSelectedWallet()!;
    const total = getTotalAmount();
    const vendor = selectedVendor;

    setProcessingPayment(true);

    try {
      // Generate order ID
      const orderId = `ORD-${new Date().getFullYear()}-${Date.now()}`;

      // Process transaction and create order via API
      const result = await apiService.processTransactionWithOrder({
        studentId: wallet.id,
        amount: total,
        vendor: vendor,
        orderId: orderId,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });

      // Update local wallet state
      setWallets(prevWallets =>
        prevWallets.map(w =>
          w.id === wallet.id ? result.wallet : w
        )
      );

      // Success feedback
      toast({
        title: "¡Pago procesado exitosamente!",
        description: `Pedido #${result.order.id} confirmado. Nuevo saldo: ${formatCurrency(result.wallet.balance)}`,
      });

      // Reset form
      setCart([]);
      setSelectedStudent('');
      setSelectedVendor('');

    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        title: "Error en el pago",
        description: error.message || "No se pudo procesar la transacción",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const selectedWallet = getSelectedWallet();
  const totalAmount = getTotalAmount();
  const menuItems = selectedVendor ? getMenuItemsByVendor(selectedVendor) : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">
          Simulador de Transacciones POS
        </h1>
        <p className="text-muted-foreground">
          Simula compras reales para probar el sistema de wallets y generar reportes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection & Vendor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Selección de Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student">Estudiante</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex flex-col">
                        <span>{wallet.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Saldo: {formatCurrency(wallet.balance)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedWallet && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Saldo disponible:</span>
                      <span className="font-medium">{formatCurrency(selectedWallet.balance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Límite por compra:</span>
                      <span className="font-medium">{formatCurrency(selectedWallet.limitPerPurchase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estado:</span>
                      <Badge variant={selectedWallet.status === 'active' ? 'default' : 'destructive'}>
                        {selectedWallet.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="vendor">Local / Restaurante</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un local" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableVendors().map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Menú Disponible
            </CardTitle>
            <CardDescription>
              {selectedVendor || 'Selecciona un local para ver el menú'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedVendor ? (
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-sm font-medium text-primary">{formatCurrency(item.price)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      disabled={!selectedStudent}
                    >
                      Agregar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona un local para ver el menú</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shopping Cart & Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Carrito de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  
                  {selectedWallet && (
                    <div className="text-sm space-y-1">
                      {totalAmount > selectedWallet.balance && (
                        <p className="text-destructive flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Saldo insuficiente
                        </p>
                      )}
                      {totalAmount > selectedWallet.limitPerPurchase && (
                        <p className="text-destructive flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Excede límite por compra
                        </p>
                      )}
                      {canProcessPayment() && (
                        <p className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Listo para pagar
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={processPayment}
                  disabled={!canProcessPayment() || processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Procesar Pago
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Carrito vacío</p>
                <p className="text-sm">Agrega productos para comenzar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
