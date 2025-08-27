import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  Store,
  ShoppingCart,
  Receipt,
  History,
  Star,
  Plus,
  Minus,
  ArrowLeft,
  Check
} from 'lucide-react';

// Mock data
const studentData = {
  name: 'María González',
  id: 'E2021-12345',
  balance: 25750,
  validUntil: '2025-06-30'
};

const vendors = [
  {
    id: 1,
    name: 'Cafetería Andes',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
    rating: 4.8,
    description: 'Café premium y desayunos nutritivos',
    status: 'open'
  },
  {
    id: 2,
    name: 'Sándwich U',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    rating: 4.6,
    description: 'Sándwiches gourmet y ensaladas frescas',
    status: 'open'
  },
  {
    id: 3,
    name: 'Dulce & Café',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
    rating: 4.7,
    description: 'Postres artesanales y bebidas especiales',
    status: 'open'
  }
];

const menuItems = {
  1: [
    { id: 101, name: 'Cappuccino Clásico', price: 2500, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=150&fit=crop' },
    { id: 102, name: 'Croissant de Almendras', price: 3200, image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=200&h=150&fit=crop' },
    { id: 103, name: 'Sandwich Palta & Huevo', price: 4500, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=200&h=150&fit=crop' },
    { id: 104, name: 'Yogurt con Granola', price: 3800, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=150&fit=crop' }
  ],
  2: [
    { id: 201, name: 'Sandwich Italiano', price: 5200, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=200&h=150&fit=crop' },
    { id: 202, name: 'Ensalada César', price: 4800, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=150&fit=crop' },
    { id: 203, name: 'Wrap de Pollo', price: 4200, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop' },
    { id: 204, name: 'Jugo Natural', price: 2800, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&h=150&fit=crop' }
  ],
  3: [
    { id: 301, name: 'Cheesecake de Frutos Rojos', price: 3500, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=150&fit=crop' },
    { id: 302, name: 'Latte Macchiato', price: 2900, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&h=150&fit=crop' },
    { id: 303, name: 'Muffin de Chocolate', price: 2200, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&h=150&fit=crop' },
    { id: 304, name: 'Smoothie Tropical', price: 3400, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=200&h=150&fit=crop' }
  ]
};

type View = 'home' | 'vendor' | 'cart' | 'receipt';

export default function StudentApp() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [cart, setCart] = useState<Array<{id: number, name: string, price: number, quantity: number}>>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as typeof cart;
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processOrder = () => {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setLastOrderId(orderId);
    setCart([]);
    setCurrentView('receipt');
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">¡Hola, {studentData.name}!</h1>
            <p className="text-primary-foreground/80 text-sm">ID: {studentData.id}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
            <History className="h-4 w-4 mr-2" />
            Historial
          </Button>
        </div>

        {/* Wallet Card */}
        <Card className="bg-gradient-card border-0 shadow-glow-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Disponible</p>
                  <p className="text-2xl font-bold text-gradient-primary">
                    {formatCurrency(studentData.balance)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Válido hasta: {studentData.validUntil}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/30">
                Activa
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Grid */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gradient-primary">
          Locales Disponibles
        </h2>
        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <Card 
              key={vendor.id}
              className="shadow-university transition-university hover:shadow-lg cursor-pointer"
              onClick={() => {
                setSelectedVendor(vendor.id);
                setCurrentView('vendor');
              }}
            >
              <div className="flex items-center space-x-4 p-4">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{vendor.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{vendor.description}</p>
                  <Badge variant="secondary" className="mt-2 bg-success/10 text-success border-success/30">
                    Abierto
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setCurrentView('cart')}
            className="bg-gradient-accent shadow-glow-accent rounded-full h-14 w-14"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            </div>
          </Button>
        </div>
      )}
    </div>
  );

  const renderVendor = () => {
    const vendor = vendors.find(v => v.id === selectedVendor);
    const items = selectedVendor ? menuItems[selectedVendor as keyof typeof menuItems] : [];

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-primary p-4 text-primary-foreground">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('home')}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{vendor?.name}</h1>
              <p className="text-primary-foreground/80 text-sm">{vendor?.description}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="shadow-university">
              <div className="flex items-center space-x-4 p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-lg font-bold text-gradient-primary">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <Button
                  onClick={() => addToCart(item)}
                  variant="outline"
                  size="sm"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Cart Button */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => setCurrentView('cart')}
              className="bg-gradient-accent shadow-glow-accent rounded-full h-14 w-14"
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              </div>
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderCart = () => (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-4 text-primary-foreground">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView(selectedVendor ? 'vendor' : 'home')}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-bold">Mi Carrito</h1>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cart.map((item) => (
          <Card key={item.id} className="shadow-university">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.price)} c/u
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-semibold min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {/* Total */}
        <Card className="shadow-university bg-gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-gradient-primary">
                {formatCurrency(getCartTotal())}
              </span>
            </div>
            <Button
              onClick={processOrder}
              className="w-full bg-gradient-accent shadow-glow-accent"
              disabled={getCartTotal() > studentData.balance}
            >
              {getCartTotal() > studentData.balance ? 'Saldo Insuficiente' : 'Confirmar Compra'}
            </Button>
            {getCartTotal() > studentData.balance && (
              <p className="text-sm text-destructive text-center mt-2">
                Tu saldo actual es {formatCurrency(studentData.balance)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReceipt = () => (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-4 text-primary-foreground">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success mb-4">
            <Check className="h-8 w-8 text-success-foreground" />
          </div>
          <h1 className="text-lg font-bold">¡Compra Exitosa!</h1>
          <p className="text-primary-foreground/80 text-sm">
            Tu orden ha sido procesada correctamente
          </p>
        </div>
      </div>

      {/* Receipt */}
      <div className="p-4">
        <Card className="shadow-university">
          <CardHeader className="text-center border-b border-dashed">
            <CardTitle className="text-gradient-primary">Comprobante de Compra</CardTitle>
            <CardDescription>ID: {lastOrderId}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-semibold">{new Date().toLocaleString('es-CL')}</p>
            </div>
            
            <div className="border-t border-dashed pt-4">
              <h3 className="font-semibold mb-2">Items Comprados:</h3>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay items en el carrito</p>
              )}
            </div>

            <div className="border-t border-dashed pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-gradient-primary">
                  {formatCurrency(getCartTotal())}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Saldo anterior:</span>
                <span>{formatCurrency(studentData.balance)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Saldo actual:</span>
                <span>{formatCurrency(studentData.balance - getCartTotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-2 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setCurrentView('home')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
          <Button className="flex-1 bg-gradient-primary">
            <Receipt className="mr-2 h-4 w-4" />
            Ver Historial
          </Button>
        </div>
      </div>
    </div>
  );

  // Router logic
  switch (currentView) {
    case 'vendor':
      return renderVendor();
    case 'cart':
      return renderCart();
    case 'receipt':
      return renderReceipt();
    default:
      return renderHome();
  }
}