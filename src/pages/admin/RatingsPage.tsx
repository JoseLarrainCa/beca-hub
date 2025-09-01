import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Modal from '@/components/ui/Modal';
import {
  Star,
  MessageSquare,
  Brain,
  Search,
  Filter,
  Reply,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  Flag,
  TrendingUp,
  Timer,
  ThumbsUp,
  ThumbsDown,
  Target,
  Zap,
  BarChart3,
  X
} from 'lucide-react';

// Datos extendidos de reviews
const allReviews = [
  {
    id: 1,
    vendorId: 1,
    vendorName: 'Cafetería Andes',
    customerName: 'María González',
    customerEmail: 'maria.gonzalez@mail.udd.cl',
    rating: 5,
    comment: 'El mejor café del campus, siempre consistente y rápido. El personal es súper amable y el ambiente muy acogedor.',
    date: '2025-01-15',
    time: '14:30',
    sentiment: 'positive',
    status: 'published',
    vendorResponse: null,
    helpful: 12,
    reported: false,
    orderDetails: {
      items: ['Cappuccino Clásico', 'Croissant de Almendras'],
      total: 5700,
      orderId: 'ORD-001'
    }
  },
  {
    id: 2,
    vendorId: 1,
    vendorName: 'Cafetería Andes',
    customerName: 'Carlos Méndez',
    customerEmail: 'carlos.mendez@mail.udd.cl',
    rating: 4,
    comment: 'Muy bueno pero las colas son largas al mediodía. Sería genial si implementaran un sistema de pre-orden.',
    date: '2025-01-14',
    time: '12:45',
    sentiment: 'neutral',
    status: 'published',
    vendorResponse: {
      text: 'Hola Carlos, gracias por tu feedback. Estamos trabajando en implementar un sistema de pre-orden para mejorar los tiempos de espera. ¡Esperamos tenerlo listo pronto!',
      date: '2025-01-15',
      author: 'Cafetería Andes'
    },
    helpful: 8,
    reported: false,
    orderDetails: {
      items: ['Cappuccino Clásico', 'Sandwich Palta & Huevo'],
      total: 7000,
      orderId: 'ORD-002'
    }
  },
  {
    id: 3,
    vendorId: 1,
    vendorName: 'Cafetería Andes',
    customerName: 'Ana Rodríguez',
    customerEmail: 'ana.rodriguez@mail.udd.cl',
    rating: 5,
    comment: 'Personal súper amable y el cappuccino está perfecto. Es mi lugar favorito para estudiar.',
    date: '2025-01-13',
    time: '09:15',
    sentiment: 'positive',
    status: 'published',
    vendorResponse: null,
    helpful: 15,
    reported: false,
    orderDetails: {
      items: ['Cappuccino Clásico', 'Yogurt con Granola'],
      total: 6300,
      orderId: 'ORD-003'
    }
  },
  {
    id: 4,
    vendorId: 2,
    vendorName: 'Sándwich U',
    customerName: 'Diego Torres',
    customerEmail: 'diego.torres@mail.udd.cl',
    rating: 4,
    comment: 'Sándwiches muy ricos pero demoran bastante en prepararlos. Los ingredientes son frescos y de calidad.',
    date: '2025-01-15',
    time: '13:20',
    sentiment: 'neutral',
    status: 'published',
    vendorResponse: {
      text: 'Hola Diego, gracias por tu paciencia. Estamos optimizando nuestros procesos para reducir los tiempos de preparación sin comprometer la calidad. ¡Tu opinión nos ayuda a mejorar!',
      date: '2025-01-16',
      author: 'Sándwich U'
    },
    helpful: 6,
    reported: false,
    orderDetails: {
      items: ['Sándwich Pollo Palta', 'Ensalada César'],
      total: 8500,
      orderId: 'ORD-004'
    }
  },
  {
    id: 5,
    vendorId: 2,
    vendorName: 'Sándwich U',
    customerName: 'Sofía Herrera',
    customerEmail: 'sofia.herrera@mail.udd.cl',
    rating: 5,
    comment: 'Ingredientes súper frescos, se nota la calidad. El sándwich de pavo con palta estaba delicioso.',
    date: '2025-01-14',
    time: '12:30',
    sentiment: 'positive',
    status: 'published',
    vendorResponse: null,
    helpful: 9,
    reported: false,
    orderDetails: {
      items: ['Sándwich Pavo Palta'],
      total: 6500,
      orderId: 'ORD-005'
    }
  },
  {
    id: 6,
    vendorId: 2,
    vendorName: 'Sándwich U',
    customerName: 'Roberto Silva',
    customerEmail: 'roberto.silva@mail.udd.cl',
    rating: 3,
    comment: 'Rico pero esperé 10 minutos por un sándwich simple. Deberían ser más eficientes.',
    date: '2025-01-12',
    time: '14:15',
    sentiment: 'negative',
    status: 'published',
    vendorResponse: null,
    helpful: 4,
    reported: false,
    orderDetails: {
      items: ['Sándwich Jamón Queso'],
      total: 4500,
      orderId: 'ORD-006'
    }
  },
  {
    id: 7,
    vendorId: 3,
    vendorName: 'Dulce & Café',
    customerName: 'Valentina López',
    customerEmail: 'valentina.lopez@mail.udd.cl',
    rating: 5,
    comment: 'Los mejores postres del campus, vale cada peso. El cheesecake de frutos rojos está increíble.',
    date: '2025-01-15',
    time: '16:45',
    sentiment: 'positive',
    status: 'published',
    vendorResponse: {
      text: '¡Muchas gracias Valentina! Nos alegra saber que disfrutaste nuestro cheesecake. Es una de nuestras especialidades hechas con mucho amor.',
      date: '2025-01-15',
      author: 'Dulce & Café'
    },
    helpful: 11,
    reported: false,
    orderDetails: {
      items: ['Cheesecake Frutos Rojos', 'Café Americano'],
      total: 7200,
      orderId: 'ORD-007'
    }
  },
  {
    id: 8,
    vendorId: 3,
    vendorName: 'Dulce & Café',
    customerName: 'Mateo Vargas',
    customerEmail: 'mateo.vargas@mail.udd.cl',
    rating: 4,
    comment: 'Delicioso pero un poco caro para estudiantes. Podrían tener promociones especiales.',
    date: '2025-01-13',
    time: '15:20',
    sentiment: 'neutral',
    status: 'published',
    vendorResponse: null,
    helpful: 7,
    reported: false,
    orderDetails: {
      items: ['Brownie Chocolate', 'Latte'],
      total: 6800,
      orderId: 'ORD-008'
    }
  }
];

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

export default function RatingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

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

  const handleReplyToReview = (reviewId: number) => {
    if (!replyText.trim()) return;
    
    toast({
      title: "Respuesta enviada",
      description: "Tu respuesta ha sido publicada exitosamente.",
    });
    setReplyText('');
    setShowReviewModal(false);
  };

  const handleReportReview = (reviewId: number) => {
    toast({
      title: "Review reportada",
      description: "La review ha sido marcada para revisión.",
    });
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800 border-green-300">😊 Positivo</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800 border-red-300">😞 Negativo</Badge>;
      case 'neutral':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">😐 Neutral</Badge>;
      default:
        return <Badge variant="secondary">Sin análisis</Badge>;
    }
  };

  // Filtrar y ordenar reviews
  const filteredReviews = allReviews
    .filter(review => {
      const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = reviewFilter === 'all' || 
                           (reviewFilter === 'responded' && review.vendorResponse) ||
                           (reviewFilter === 'pending' && !review.vendorResponse) ||
                           (reviewFilter === 'reported' && review.reported);

      const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;

      return matchesSearch && matchesFilter && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Gestión de Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Analytics IA</span>
          </TabsTrigger>
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          {/* Header */}
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-gradient-primary flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Gestión de Reviews</span>
                  </CardTitle>
                  <CardDescription>
                    Administra y responde a las reseñas de todos los locales del campus
                  </CardDescription>
                </div>
                <Badge className="bg-gradient-accent text-white">
                  {filteredReviews.length} Reviews
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Filters */}
          <Card className="shadow-university">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={reviewFilter} onValueChange={setReviewFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las reviews</SelectItem>
                    <SelectItem value="pending">Sin responder</SelectItem>
                    <SelectItem value="responded">Respondidas</SelectItem>
                    <SelectItem value="reported">Reportadas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los ratings</SelectItem>
                    <SelectItem value="5">5 estrellas</SelectItem>
                    <SelectItem value="4">4 estrellas</SelectItem>
                    <SelectItem value="3">3 estrellas</SelectItem>
                    <SelectItem value="2">2 estrellas</SelectItem>
                    <SelectItem value="1">1 estrella</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Más recientes</SelectItem>
                    <SelectItem value="oldest">Más antiguas</SelectItem>
                    <SelectItem value="rating-high">Rating alto</SelectItem>
                    <SelectItem value="rating-low">Rating bajo</SelectItem>
                    <SelectItem value="helpful">Más útiles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="shadow-university hover:shadow-lg transition-university">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                          {review.customerName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{review.customerName}</h4>
                          <p className="text-sm text-muted-foreground">{review.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSentimentBadge(review.sentiment)}
                        <Badge variant="outline">{review.vendorName}</Badge>
                      </div>
                    </div>

                    {/* Rating and Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.date)} a las {review.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpful} útil</span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">{review.comment}</p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-800 font-medium mb-1">Detalles del Pedido #{review.orderDetails.orderId}</p>
                      <p className="text-sm text-blue-700">
                        {review.orderDetails.items.join(', ')} - {formatCurrency(review.orderDetails.total)}
                      </p>
                    </div>

                    {/* Vendor Response */}
                    {review.vendorResponse && (
                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Respuesta de {review.vendorResponse.author}
                          </span>
                          <span className="text-xs text-green-600">{review.vendorResponse.date}</span>
                        </div>
                        <p className="text-sm text-green-700">{review.vendorResponse.text}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review);
                          setShowReviewModal(true);
                        }}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics IA Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Header */}
          <Card className="shadow-university">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-gradient-primary flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Analytics con IA</span>
                  </CardTitle>
                  <CardDescription>
                    Análisis inteligente de performance, tiempos y satisfacción de locales
                  </CardDescription>
                </div>
                <Badge className="bg-gradient-accent text-white">
                  Powered by AI
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Analytics Cards */}
          <div className="grid gap-6 lg:grid-cols-1">
            {vendorAnalytics.map((analytics) => (
              <Card key={analytics.id} className="shadow-university">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{analytics.vendorName}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={analytics.monthlyTrend === 'up' ? 'default' : 'secondary'}>
                        <TrendingUp className={`h-3 w-3 mr-1 ${analytics.monthlyTrend === 'down' ? 'rotate-180' : ''}`} />
                        {analytics.trendPercentage > 0 ? '+' : ''}{analytics.trendPercentage}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* KPIs Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{analytics.averageProductionTime}min</p>
                      <p className="text-sm text-gray-600">Tiempo Promedio</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{analytics.customerSatisfaction}/5</p>
                      <p className="text-sm text-gray-600">Satisfacción</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">{analytics.aiRating}/5</p>
                      <p className="text-sm text-gray-600">Rating IA</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-orange-600">{analytics.totalReviews}</p>
                      <p className="text-sm text-gray-600">Reviews</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Métricas de Performance</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(analytics.performanceMetrics).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm capitalize">{key === 'efficiency' ? 'Eficiencia' : 
                              key === 'quality' ? 'Calidad' : 
                              key === 'innovation' ? 'Innovación' : 'Sostenibilidad'}</span>
                            <span className="text-sm font-bold">{value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                value >= 90 ? 'bg-green-500' : 
                                value >= 80 ? 'bg-blue-500' : 
                                value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Insights de IA</span>
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-green-600 flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>Fortalezas</span>
                        </h5>
                        <ul className="text-sm space-y-1">
                          {analytics.aiInsights.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-orange-600 flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>Mejoras</span>
                        </h5>
                        <ul className="text-sm space-y-1">
                          {analytics.aiInsights.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-orange-500 mt-1">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-blue-600 flex items-center space-x-1">
                          <Brain className="h-4 w-4" />
                          <span>Recomendación IA</span>
                        </h5>
                        <p className="text-sm bg-blue-50 p-3 rounded-lg">
                          {analytics.aiInsights.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Comments */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Comentarios Recientes</span>
                    </h4>
                    <div className="space-y-3">
                      {analytics.recentComments.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${star <= comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <Badge variant={
                                comment.sentiment === 'positive' ? 'default' : 
                                comment.sentiment === 'negative' ? 'destructive' : 'secondary'
                              }>
                                {comment.sentiment === 'positive' ? '😊 Positivo' : 
                                 comment.sentiment === 'negative' ? '😞 Negativo' : '😐 Neutral'}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                          </div>
                          <p className="text-sm">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Details Modal */}
      <Modal 
        open={showReviewModal && !!selectedReview} 
        onClose={() => setShowReviewModal(false)}
      >
        {selectedReview && (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>📋 Detalles del Review</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReviewModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Review Original */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-medium">{selectedReview.customerName}</span>
                </div>
                <p className="text-sm">{selectedReview.comment}</p>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📧 Información del Cliente</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Email:</span> {selectedReview.email}</p>
                    <p><span className="font-medium">Fecha:</span> {formatDate(selectedReview.date)}</p>
                    <p><span className="font-medium">Local:</span> {selectedReview.vendorName}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📊 Análisis del Review</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Impacto:</span> {selectedReview.rating >= 4 ? '✅ Positivo' : selectedReview.rating >= 3 ? '⚠️ Neutral' : '❌ Negativo'}</p>
                    <p><span className="font-medium">Sentimiento:</span> {selectedReview.rating >= 4 ? 'Satisfecho' : 'Necesita mejoras'}</p>
                    <p><span className="font-medium">ID Pedido:</span> #ORD-{selectedReview.id.toString().padStart(3, '0')}</p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🛒 Detalles del Pedido</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Productos:</span> Cappuccino Clásico, Croissant de Almendras</p>
                  <p><span className="font-medium">Total:</span> <span className="text-green-600 font-bold">$5.700</span></p>
                  <p><span className="font-medium">Método de pago:</span> Saldo de beca</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement export functionality
                    setShowReviewModal(false);
                  }}
                  className="bg-gradient-primary flex-1"
                >
                  📄 Exportar Reporte
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Modal>
    </div>
  );
}
