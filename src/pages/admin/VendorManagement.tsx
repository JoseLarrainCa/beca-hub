import React, { useState } from 'react';
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
  Store,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  ImageIcon,
  Save,
  X
} from 'lucide-react';

// Mock data
const vendors = [
  {
    id: 1,
    name: 'Cafetería Andes',
    description: 'Café premium y desayunos nutritivos para toda la comunidad universitaria',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
    rating: 4.8,
    status: 'active',
    todaySales: 945230,
    todayOrders: 423,
    menuItemsCount: 15,
    contactEmail: 'contacto@cafeteriaandes.cl',
    contactPhone: '+56 9 8765 4321'
  },
  {
    id: 2,
    name: 'Sándwich U',
    description: 'Sándwiches gourmet y ensaladas frescas preparados diariamente',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    rating: 4.6,
    status: 'active',
    todaySales: 785650,
    todayOrders: 356,
    menuItemsCount: 12,
    contactEmail: 'admin@sandwichu.cl',
    contactPhone: '+56 9 7654 3210'
  },
  {
    id: 3,
    name: 'Dulce & Café',
    description: 'Postres artesanales y bebidas especiales para endulzar tu día',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
    rating: 4.7,
    status: 'active',
    todaySales: 623440,
    todayOrders: 289,
    menuItemsCount: 18,
    contactEmail: 'hola@dulceycafe.cl',
    contactPhone: '+56 9 6543 2109'
  }
];

const menuItems = {
  1: [
    { id: 101, name: 'Cappuccino Clásico', price: 2500, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=150&fit=crop', status: 'active', category: 'Bebidas' },
    { id: 102, name: 'Croissant de Almendras', price: 3200, image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=200&h=150&fit=crop', status: 'active', category: 'Panadería' },
    { id: 103, name: 'Sandwich Palta & Huevo', price: 4500, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=200&h=150&fit=crop', status: 'active', category: 'Sándwiches' },
    { id: 104, name: 'Yogurt con Granola', price: 3800, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=150&fit=crop', status: 'active', category: 'Saludable' }
  ]
};

export default function VendorManagement() {
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Activo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/30">Inactivo</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Suspendido</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const handleSaveVendor = () => {
    toast({
      title: "Local actualizado",
      description: "Los cambios han sido guardados exitosamente.",
    });
    setIsEditing(false);
  };

  const handleToggleStatus = (vendorId: number) => {
    toast({
      title: "Estado actualizado",
      description: "El estado del local ha sido cambiado.",
    });
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="vendors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vendors" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Locales</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span>Menú</span>
          </TabsTrigger>
        </TabsList>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          {/* Header Actions */}
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gradient-primary">
                    Gestión de Locales
                  </CardTitle>
                  <CardDescription>
                    Administra los locales y restaurantes del campus
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar local..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button className="bg-gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Local
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Vendors Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="shadow-university transition-university hover:shadow-lg">
                <div className="relative">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(vendor.status)}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {vendor.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="p-2 bg-muted/30 rounded">
                      <p className="text-xs text-muted-foreground">Ventas Hoy</p>
                      <p className="text-sm font-bold">{formatCurrency(vendor.todaySales)}</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <p className="text-xs text-muted-foreground">Órdenes</p>
                      <p className="text-sm font-bold">{vendor.todayOrders}</p>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <p className="text-xs text-muted-foreground">Items Menú</p>
                      <p className="text-sm font-bold">{vendor.menuItemsCount}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 mb-4 text-xs text-muted-foreground">
                    <p>{vendor.contactEmail}</p>
                    <p>{vendor.contactPhone}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedVendor(vendor.id);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggleStatus(vendor.id)}
                    >
                      {vendor.status === 'active' ? 'Suspender' : 'Activar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-6">
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gradient-primary">
                    Gestión de Menú - Cafetería Andes
                  </CardTitle>
                  <CardDescription>
                    Administra los productos disponibles en el local
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
                {(menuItems[1] || []).map((item) => (
                  <Card key={item.id} className="shadow-sm hover:shadow-md transition-university">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                        {item.category}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-semibold mb-1">{item.name}</h4>
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
      </Tabs>

      {/* Edit Vendor Modal (simplified for this demo) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar Local</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre del Local</Label>
                  <Input defaultValue="Cafetería Andes" />
                </div>
                <div>
                  <Label>Rating</Label>
                  <Input defaultValue="4.8" type="number" step="0.1" min="0" max="5" />
                </div>
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea defaultValue="Café premium y desayunos nutritivos para toda la comunidad universitaria" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email de Contacto</Label>
                  <Input defaultValue="contacto@cafeteriaandes.cl" type="email" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input defaultValue="+56 9 8765 4321" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked />
                <Label>Local Activo</Label>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleSaveVendor}
                  className="bg-gradient-primary flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}