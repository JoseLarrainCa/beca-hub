import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Store,
  Edit,
  Star,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  MessageSquare,
  Eye,
  Plus,
  Trash2,
  BarChart3,
  Settings,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  X
} from 'lucide-react';

// Mock data expandido
const vendorsData = {
  1: {
    id: 1,
    name: 'Cafetería Andes',
    description: 'Café premium y desayunos nutritivos para toda la comunidad universitaria',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop',
    rating: 4.8,
    status: 'active',
    contactEmail: 'contacto@cafeteriaandes.cl',
    contactPhone: '+56 9 8765 4321',
    address: 'Edificio Central, Piso 1, Local 103',
    openHours: '07:00 - 20:00',
    todaySales: 945230,
    todayOrders: 423,
    monthlyRevenue: 28356900,
    totalCustomers: 1847,
    averageOrderValue: 6750,
    menuItemsCount: 15,
    foundedDate: '2019-03-15',
    category: 'Cafetería'
  },
  2: {
    id: 2,
    name: 'Sándwich U',
    description: 'Sándwiches gourmet y ensaladas frescas preparados diariamente',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
    rating: 4.6,
    status: 'active',
    contactEmail: 'admin@sandwichu.cl',
    contactPhone: '+56 9 7654 3210',
    address: 'Edificio Estudiantes, Piso 2, Local 201',
    openHours: '08:00 - 19:00',
    todaySales: 785650,
    todayOrders: 356,
    monthlyRevenue: 23569800,
    totalCustomers: 1523,
    averageOrderValue: 7200,
    menuItemsCount: 12,
    foundedDate: '2020-08-22',
    category: 'Comida Rápida'
  },
  3: {
    id: 3,
    name: 'Dulce & Café',
    description: 'Postres artesanales y bebidas especiales para endulzar tu día',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=400&fit=crop',
    rating: 4.7,
    status: 'active',
    contactEmail: 'hola@dulceycafe.cl',
    contactPhone: '+56 9 6543 2109',
    address: 'Plaza Central, Local 5',
    openHours: '09:00 - 18:00',
    todaySales: 623440,
    todayOrders: 289,
    monthlyRevenue: 18703200,
    totalCustomers: 1234,
    averageOrderValue: 5800,
    menuItemsCount: 18,
    foundedDate: '2021-01-10',
    category: 'Postres y Café'
  }
};

const menuItems = {
  1: [
    { id: 101, name: 'Cappuccino Clásico', price: 2500, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=150&fit=crop', status: 'active', category: 'Bebidas', description: 'Espresso con leche vaporizada y espuma cremosa' },
    { id: 102, name: 'Croissant de Almendras', price: 3200, image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=200&h=150&fit=crop', status: 'active', category: 'Panadería', description: 'Croissant artesanal relleno de crema de almendras' },
    { id: 103, name: 'Sandwich Palta & Huevo', price: 4500, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=200&h=150&fit=crop', status: 'active', category: 'Sándwiches', description: 'Pan artesanal con palta fresca y huevo revuelto' },
    { id: 104, name: 'Yogurt con Granola', price: 3800, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=150&fit=crop', status: 'active', category: 'Saludable', description: 'Yogurt natural con granola casera y frutas de estación' },
    { id: 105, name: 'Latte Vainilla', price: 2800, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=150&fit=crop', status: 'active', category: 'Bebidas', description: 'Espresso con leche y jarabe de vainilla natural' },
    { id: 106, name: 'Muffin Chocolate', price: 2900, image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=200&h=150&fit=crop', status: 'active', category: 'Panadería', description: 'Muffin casero con chips de chocolate belga' }
  ],
  2: [
    { id: 201, name: 'Sándwich Pollo Palta', price: 6500, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop', status: 'active', category: 'Sándwiches', description: 'Pollo grillado, palta, tomate y lechuga en pan ciabatta' },
    { id: 202, name: 'Ensalada César', price: 5800, image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=200&h=150&fit=crop', status: 'active', category: 'Ensaladas', description: 'Lechuga romana, crutones, queso parmesano y aderezo césar' },
    { id: 203, name: 'Wrap Mediterráneo', price: 5200, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=150&fit=crop', status: 'active', category: 'Wraps', description: 'Hummus, vegetales frescos y queso feta en tortilla integral' },
    { id: 204, name: 'Sándwich Pavo Palta', price: 6200, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&h=150&fit=crop', status: 'active', category: 'Sándwiches', description: 'Pavo ahumado, palta, apio y mayonesa en pan integral' }
  ],
  3: [
    { id: 301, name: 'Cheesecake Frutos Rojos', price: 4200, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&h=150&fit=crop', status: 'active', category: 'Postres', description: 'Cheesecake cremoso con coulis de frutos rojos' },
    { id: 302, name: 'Brownie Chocolate', price: 3800, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=150&fit=crop', status: 'active', category: 'Postres', description: 'Brownie húmedo con nueces y cobertura de chocolate' },
    { id: 303, name: 'Latte Art', price: 3200, image: 'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=200&h=150&fit=crop', status: 'active', category: 'Bebidas', description: 'Café latte con diseños artísticos en la espuma' },
    { id: 304, name: 'Tiramisú', price: 4500, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=150&fit=crop', status: 'active', category: 'Postres', description: 'Tiramisú tradicional con mascarpone y café' }
  ]
};

export default function VendorProfile() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const vendor = vendorsData[parseInt(vendorId || '1') as keyof typeof vendorsData];
  const menu = menuItems[parseInt(vendorId || '1') as keyof typeof menuItems] || [];

  if (!vendor) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Local no encontrado</h1>
          <Button onClick={() => navigate('/admin/locales')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Locales
          </Button>
        </div>
      </div>
    );
  }

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

  const handleSave = () => {
    toast({
      title: "Cambios guardados",
      description: "La información del local ha sido actualizada exitosamente.",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/locales')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Locales
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gradient-primary">{vendor.name}</h1>
            <p className="text-muted-foreground">{vendor.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
            {vendor.status === 'active' ? 'Activo' : 'Inactivo'}
          </Badge>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </>
            )}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} className="bg-gradient-primary">
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          )}
        </div>
      </div>

      {/* Hero Image & Basic Info */}
      <Card className="shadow-university overflow-hidden">
        <div className="relative">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-medium">{vendor.rating}</span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Información General</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label>Descripción</Label>
                    <Textarea defaultValue={vendor.description} />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">{vendor.description}</p>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vendor.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vendor.openHours}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vendor.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{vendor.contactPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Desde {formatDate(vendor.foundedDate)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Menú</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configuración</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-university">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{formatCurrency(vendor.todaySales)}</p>
                <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              </CardContent>
            </Card>
            <Card className="shadow-university">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{vendor.todayOrders}</p>
                <p className="text-sm text-muted-foreground">Órdenes Hoy</p>
              </CardContent>
            </Card>
            <Card className="shadow-university">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(vendor.monthlyRevenue)}</p>
                <p className="text-sm text-muted-foreground">Ingresos Mes</p>
              </CardContent>
            </Card>
            <Card className="shadow-university">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{vendor.rating}/5</p>
                <p className="text-sm text-muted-foreground">Rating Promedio</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-university">
              <CardHeader className="space-y-2">
                <CardTitle className="text-gradient-primary flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Estadísticas de Clientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total de Clientes:</span>
                  <span className="font-semibold">{vendor.totalCustomers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Promedio por Orden:</span>
                  <span className="font-semibold">{formatCurrency(vendor.averageOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items en Menú:</span>
                  <span className="font-semibold">{vendor.menuItemsCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-university">
              <CardHeader className="space-y-2">
                <CardTitle className="text-gradient-primary flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Horarios y Disponibilidad</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Horario de Atención:</span>
                  <span className="font-semibold">{vendor.openHours}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado Actual:</span>
                  <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                    {vendor.status === 'active' ? 'Abierto' : 'Cerrado'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Fundado:</span>
                  <span className="font-semibold">{formatDate(vendor.foundedDate)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-6">
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-gradient-primary flex items-center space-x-2">
                    <Store className="h-5 w-5" />
                    <span>Menú del Local</span>
                  </CardTitle>
                  <CardDescription>
                    Productos disponibles en {vendor.name}
                  </CardDescription>
                </div>
                <Button className="bg-gradient-accent">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menu.map((item) => (
                  <Card key={item.id} className="shadow-sm hover:shadow-md transition-university">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                        {item.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <p className="text-lg font-bold text-gradient-primary mb-2">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="mr-1 h-3 w-3" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card className="shadow-university">
            <CardHeader className="space-y-2">
              <CardTitle className="text-gradient-primary flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Reviews de {vendor.name}</span>
              </CardTitle>
              <CardDescription>
                Reseñas y comentarios de los clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Reviews detalladas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Para ver todas las reviews, visita la sección de Ratings
                </p>
                <Button 
                  onClick={() => navigate('/admin/ratings')}
                  className="bg-gradient-primary"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Todas las Reviews
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="shadow-university">
            <CardHeader className="space-y-2">
              <CardTitle className="text-gradient-primary flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuración del Local</span>
              </CardTitle>
              <CardDescription>
                Ajustes y configuraciones avanzadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Información de Contacto</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Email de Contacto</Label>
                      <Input defaultValue={vendor.contactEmail} />
                    </div>
                    <div>
                      <Label>Teléfono</Label>
                      <Input defaultValue={vendor.contactPhone} />
                    </div>
                    <div>
                      <Label>Dirección</Label>
                      <Input defaultValue={vendor.address} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Configuraciones</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Local Activo</Label>
                        <p className="text-sm text-muted-foreground">Permitir pedidos y mostrar en listados</p>
                      </div>
                      <Switch defaultChecked={vendor.status === 'active'} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificaciones Push</Label>
                        <p className="text-sm text-muted-foreground">Recibir notificaciones de nuevos pedidos</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Modo Vacaciones</Label>
                        <p className="text-sm text-muted-foreground">Pausar temporalmente el servicio</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
