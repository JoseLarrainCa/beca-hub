import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService, type Vendor } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Modal from '@/components/ui/Modal';
import {
  Store,
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
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

// Datos mock para Analytics con IA
const vendorAnalytics = [
  {
    id: 1,
    vendorName: 'Cafetería Andes',
    averageProductionTime: 3.2, // minutos
    customerSatisfaction: 4.8,
    aiRating: 4.7,
    totalReviews: 342,
    monthlyTrend: 'up',
    trendPercentage: 12.5,
    aiInsights: {
      strengths: ['Velocidad de servicio excepcional', 'Calidad consistente del café', 'Personal amable y eficiente'],
      improvements: ['Tiempo de espera en horarios pico', 'Variedad limitada de opciones veganas'],
      recommendation: 'Implementar sistema de pre-orden para reducir colas en horarios pico'
    },
    recentComments: [
      { id: 1, rating: 5, comment: 'El mejor café del campus, siempre consistente y rápido', sentiment: 'positive', date: '2025-01-15' },
      { id: 2, rating: 4, comment: 'Muy bueno pero las colas son largas al mediodía', sentiment: 'neutral', date: '2025-01-14' },
      { id: 3, rating: 5, comment: 'Personal súper amable y el cappuccino está perfecto', sentiment: 'positive', date: '2025-01-13' }
    ],
    performanceMetrics: {
      efficiency: 92,
      quality: 88,
      innovation: 75,
      sustainability: 82
    }
  },
  {
    id: 2,
    vendorName: 'Sándwich U',
    averageProductionTime: 5.8, // minutos
    customerSatisfaction: 4.6,
    aiRating: 4.5,
    totalReviews: 289,
    monthlyTrend: 'up',
    trendPercentage: 8.3,
    aiInsights: {
      strengths: ['Ingredientes frescos de calidad', 'Porciones generosas', 'Opciones saludables variadas'],
      improvements: ['Tiempo de preparación lento', 'Falta de opciones calientes', 'Presentación mejorable'],
      recommendation: 'Optimizar flujo de preparación y agregar parrilla para opciones calientes'
    },
    recentComments: [
      { id: 4, rating: 4, comment: 'Sándwiches muy ricos pero demoran bastante en prepararlos', sentiment: 'neutral', date: '2025-01-15' },
      { id: 5, rating: 5, comment: 'Ingredientes súper frescos, se nota la calidad', sentiment: 'positive', date: '2025-01-14' },
      { id: 6, rating: 3, comment: 'Rico pero esperé 10 minutos por un sándwich simple', sentiment: 'negative', date: '2025-01-12' }
    ],
    performanceMetrics: {
      efficiency: 68,
      quality: 91,
      innovation: 79,
      sustainability: 86
    }
  },
  {
    id: 3,
    vendorName: 'Dulce & Café',
    averageProductionTime: 4.1, // minutos
    customerSatisfaction: 4.7,
    aiRating: 4.6,
    totalReviews: 198,
    monthlyTrend: 'down',
    trendPercentage: -2.1,
    aiInsights: {
      strengths: ['Postres artesanales únicos', 'Ambiente acogedor', 'Presentación excelente'],
      improvements: ['Precios elevados', 'Horarios limitados', 'Pocas opciones sin azúcar'],
      recommendation: 'Expandir horarios y desarrollar línea de postres saludables sin azúcar'
    },
    recentComments: [
      { id: 7, rating: 5, comment: 'Los mejores postres del campus, vale cada peso', sentiment: 'positive', date: '2025-01-15' },
      { id: 8, rating: 4, comment: 'Delicioso pero un poco caro para estudiantes', sentiment: 'neutral', date: '2025-01-13' },
      { id: 9, rating: 5, comment: 'El cheesecake está increíble, ambiente muy lindo', sentiment: 'positive', date: '2025-01-11' }
    ],
    performanceMetrics: {
      efficiency: 85,
      quality: 95,
      innovation: 88,
      sustainability: 71
    }
  }
];

export default function VendorManagement() {
  const navigate = useNavigate();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [realVendors, setRealVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendorData, setSelectedVendorData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVendors();
  }, []);

  // Usar vendors reales si están disponibles, sino usar mock data
  const vendorsToShow = realVendors.length > 0 ? realVendors : vendors;
  const filteredVendors = vendorsToShow.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedVendor && isEditing) {
      const vendor = vendorsToShow.find(v => String(v.id) === selectedVendor);
      setSelectedVendorData(vendor);
    }
  }, [selectedVendor, isEditing, vendorsToShow]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const vendorsData = await apiService.getVendors();
      setRealVendors(vendorsData);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los locales.",
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

  const handleSaveVendor = async (formData?: any) => {
    if (!selectedVendor) return;

    try {
      // Obtener datos del formulario si no se proporcionan
      const form = document.querySelector('#edit-vendor-form') as HTMLFormElement;
      if (!formData && form) {
        const formDataObj = new FormData(form);
        formData = {
          name: formDataObj.get('name') as string,
          description: formDataObj.get('description') as string,
          rating: parseFloat(formDataObj.get('rating') as string) || 0,
          contactEmail: formDataObj.get('contactEmail') as string,
          contactPhone: formDataObj.get('contactPhone') as string,
          status: formDataObj.get('status') === 'on' ? 'active' : 'inactive'
        };
      }

      // Actualizar vendor en Supabase
      await apiService.updateVendor(selectedVendor, formData);
      
      toast({
        title: "Local actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });
      setIsEditing(false);
      await loadVendors(); // Recargar la lista
    } catch (error) {
      console.error('Failed to update vendor:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el local.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVendor = async (vendorId: string | number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este local? Esta acción no se puede deshacer.")) {
      try {
        await apiService.deleteVendor(String(vendorId));
        toast({
          title: "Local eliminado",
          description: "El local ha sido eliminado exitosamente.",
        });
        await loadVendors(); // Recargar la lista
      } catch (error) {
        console.error('Failed to delete vendor:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el local.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNewVendor = () => {
    setIsAddingNew(true);
  };

  const handleCreateSampleVendors = async () => {
    const sampleVendors = [
      {
        name: 'Cafetería Central',
        description: 'Café premium y desayunos nutritivos para toda la comunidad universitaria',
        category: 'Cafetería',
        contactEmail: 'contacto@cafeteriacentral.cl',
        contactPhone: '+56 9 8765 4321',
        address: 'Edificio Principal, Piso 1, Local 101',
        openHours: '07:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop'
      },
      {
        name: 'Comida Rápida UDD',
        description: 'Comida rápida y sándwiches gourmet preparados diariamente',
        category: 'Comida Rápida',
        contactEmail: 'admin@rapidaudd.cl',
        contactPhone: '+56 9 7654 3210',
        address: 'Edificio de Estudiantes, Piso 2, Local 201',
        openHours: '08:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
      },
      {
        name: 'Cafetería UDD',
        description: 'Café especial y bebidas para acompañar tu día de estudios',
        category: 'Cafetería',
        contactEmail: 'hola@cafeteriaudd.cl',
        contactPhone: '+56 9 6543 2109',
        address: 'Plaza Central, Local 150',
        openHours: '09:00 - 20:00',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop'
      },
      {
        name: 'Restaurante El Jardín',
        description: 'Comida casera y menús ejecutivos en un ambiente natural y relajado',
        category: 'Restaurante',
        contactEmail: 'reservas@eljardin.cl',
        contactPhone: '+56 9 5432 1098',
        address: 'Edificio Académico, Terraza',
        openHours: '12:00 - 16:00',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop'
      }
    ];

    try {
      setLoading(true);
      
      // Primero, eliminar cualquier vendor existente para evitar duplicados
      const existingVendors = await apiService.getVendors();
      for (const existing of existingVendors) {
        await apiService.deleteVendor(existing.id);
      }
      
      // Crear los vendors que coinciden con el dashboard
      for (const vendor of sampleVendors) {
        await apiService.createVendor(vendor);
      }

      toast({
        title: "Locales sincronizados",
        description: `Se crearon ${sampleVendors.length} locales que coinciden con el dashboard.`,
      });

      await loadVendors(); // Recargar la lista
    } catch (error) {
      console.error('Failed to create sample vendors:', error);
      toast({
        title: "Error",
        description: "No se pudieron sincronizar los locales.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (formData: any) => {
    // Validación básica
    if (!formData.name || !formData.description || !formData.contactEmail || !formData.address) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      toast({
        title: "Error",
        description: "Por favor ingrese un email válido.",
        variant: "destructive"
      });
      return;
    }

    try {
      const vendorData = {
        name: formData.name,
        description: formData.description,
        category: formData.category || 'General',
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || '',
        address: formData.address,
        openHours: formData.openHours || '',
        image: formData.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=200&fit=crop',
        status: 'active' as const
      };

      await apiService.createVendor(vendorData);
      
      toast({
        title: "Local agregado",
        description: `${formData.name} ha sido creado exitosamente.`,
      });
      
      setIsAddingNew(false);
      await loadVendors(); // Recargar la lista
    } catch (error) {
      console.error('Failed to create vendor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el local.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="vendors" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="vendors" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Locales</span>
          </TabsTrigger>
        </TabsList>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          {/* Header Actions */}
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-gradient-primary flex items-center space-x-2">
                    <Store className="h-5 w-5" />
                    <span>Gestión de Locales</span>
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
                                                    <Button 
                    className="bg-gradient-primary"
                    onClick={handleAddNewVendor}
                  >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Local
                </Button>
                {realVendors.length === 0 && (
                  <Button 
                    variant="outline"
                    onClick={handleCreateSampleVendors}
                    className="ml-2"
                  >
                    🔄 Sincronizar con Dashboard
                  </Button>
                )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Vendors Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className="shadow-university transition-university hover:shadow-lg flex flex-col h-full"
              >
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
                
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{vendor.rating || 0}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 flex-grow" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {vendor.description}
                  </p>

                  {/* Stats - Solo mostrar para mock vendors que tienen estos datos */}
                  {('todaySales' in vendor) && (
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
                  )}

                  {/* Contact Info */}
                  <div className="space-y-1 mb-4 text-xs text-muted-foreground">
                    <p>{vendor.contactEmail}</p>
                    <p>{vendor.contactPhone || vendor.address}</p>
                  </div>

                  {/* Actions - Siempre al final */}
                  <div className="flex space-x-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVendor(typeof vendor.id === 'string' ? vendor.id : String(vendor.id));
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:bg-red-50 border-red-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVendor(vendor.id);
                      }}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Vendor Modal */}
      <Modal 
        open={isEditing && !!selectedVendor} 
        onClose={() => setIsEditing(false)}
      >
        {selectedVendor && (
          <Card className="w-full max-h-[80vh] overflow-y-auto border-0 shadow-none">
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
              <form id="edit-vendor-form">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="edit-name">Nombre del Local</Label>
                    <Input 
                      id="edit-name" 
                      name="name" 
                      defaultValue={selectedVendorData?.name || ""} 
                      key={`name-${selectedVendor}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-rating">Rating</Label>
                    <Input 
                      id="edit-rating" 
                      name="rating" 
                      defaultValue={selectedVendorData?.rating || 0} 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="5" 
                      key={`rating-${selectedVendor}`}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="edit-description">Descripción</Label>
                  <Textarea 
                    id="edit-description" 
                    name="description" 
                    defaultValue={selectedVendorData?.description || ""} 
                    key={`description-${selectedVendor}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="edit-email">Email de Contacto</Label>
                    <Input 
                      id="edit-email" 
                      name="contactEmail" 
                      defaultValue={selectedVendorData?.contactEmail || ""} 
                      type="email" 
                      key={`email-${selectedVendor}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Teléfono</Label>
                    <Input 
                      id="edit-phone" 
                      name="contactPhone" 
                      defaultValue={selectedVendorData?.contactPhone || ""} 
                      key={`phone-${selectedVendor}`}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch 
                    name="status" 
                    defaultChecked={selectedVendorData?.status === 'active'} 
                    key={`status-${selectedVendor}`}
                  />
                  <Label>Local Activo</Label>
                </div>
              </form>
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => handleSaveVendor()}
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
        )}
      </Modal>

      {/* Add New Vendor Modal */}
      <Modal 
        open={isAddingNew} 
        onClose={() => setIsAddingNew(false)}
      >
        <div className="p-6 w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gradient-primary">Agregar Nuevo Local</h2>
                <p className="text-sm text-muted-foreground">Complete la información del nuevo local</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingNew(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = {
                name: formData.get('name'),
                description: formData.get('description'),
                category: formData.get('category'),
                contactEmail: formData.get('contactEmail'),
                contactPhone: formData.get('contactPhone'),
                address: formData.get('address'),
                openHours: formData.get('openHours'),
                image: formData.get('image')
              };
              handleAddVendor(data);
            }} className="space-y-6">
              
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Local *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ej: Cafetería Central"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <select
                    id="category"
                    name="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Cafetería">Cafetería</option>
                    <option value="Comida Rápida">Comida Rápida</option>
                    <option value="Postres y Café">Postres y Café</option>
                    <option value="Restaurante">Restaurante</option>
                    <option value="Panadería">Panadería</option>
                    <option value="Jugos y Smoothies">Jugos y Smoothies</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe los productos y servicios del local"
                  className="min-h-[80px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de la Imagen</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Información de Contacto</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de Contacto *</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      placeholder="contacto@local.cl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Teléfono</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Hours */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Ubicación y Horarios</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Edificio, Piso, Local"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openHours">Horario de Atención</Label>
                    <Input
                      id="openHours"
                      name="openHours"
                      placeholder="08:00 - 18:00"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Crear Local
                </Button>
              </div>
            </form>
        </div>
      </Modal>
    </div>
  );
}