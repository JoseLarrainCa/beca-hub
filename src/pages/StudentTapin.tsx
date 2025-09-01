import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Wallet,
	Store,
	ShoppingCart,
	History,
	Star,
	Plus,
	Minus,
	ArrowLeft,
	Check,
	Search,
	MapPin,
	Clock,
	User,
	LogOut,
	CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, Student, Wallet as WalletType } from '@/services/api';
import StudentLogin from '@/components/student/StudentLogin';
import IntegratedWallet from '@/components/student/IntegratedWallet';

type View = 'home' | 'vendor' | 'cart' | 'receipt' | 'wallet';

type Vendor = {
	id: number;
	name: string;
	image: string;
	rating: number;
	description: string;
	status: 'open' | 'closed';
	distance: string;
	wait: string;
	category: string;
};

type MenuItem = {
	id: number;
	name: string;
	price: number;
	image: string;
};

const vendors: Vendor[] = [
	{
		id: 1,
		name: 'Cafetería UDD',
		image:
			'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=480&fit=crop',
		rating: 4.8,
		description: 'Café, desayunos y pastelería',
		status: 'open',
		distance: '70 m',
		wait: '5-10 min',
		category: 'Cafetería'
	},
	{
		id: 2,
		name: 'Sandwich Factory',
		image:
			'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=480&fit=crop',
		rating: 4.6,
		description: 'Sándwiches y ensaladas frescas',
		status: 'open',
		distance: '120 m',
		wait: '8-15 min',
		category: 'Restaurante'
	},
	{
		id: 3,
		name: 'Dulce & Café',
		image:
			'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=480&fit=crop',
		rating: 4.7,
		description: 'Postres artesanales y bebidas',
		status: 'open',
		distance: '200 m',
		wait: '3-7 min',
		category: 'Postres'
	}
];

const menuByVendor: Record<number, MenuItem[]> = {
	1: [
		{
			id: 101,
			name: 'Latte Grande',
			price: 2900,
			image:
				'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=300&fit=crop'
		},
		{
			id: 102,
			name: 'Croissant Almendras',
			price: 3200,
			image:
				'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=400&h=300&fit=crop'
		},
		{
			id: 103,
			name: 'Yogurt con Granola',
			price: 2800,
			image:
				'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'
		}
	],
	2: [
		{
			id: 201,
			name: 'Sándwich Italiano',
			price: 5200,
			image:
				'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop'
		},
		{
			id: 202,
			name: 'Ensalada César',
			price: 4800,
			image:
				'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'
		}
	],
	3: [
		{
			id: 301,
			name: 'Cheesecake Frutos Rojos',
			price: 3500,
			image:
				'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop'
		},
		{
			id: 302,
			name: 'Muffin Chocolate',
			price: 2200,
			image:
				'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop'
		}
	]
};

export default function StudentTapin() {
	const [student, setStudent] = useState<Student | null>(null);
	const [wallet, setWallet] = useState<WalletType | null>(null);
	const [view, setView] = useState<View>('home');
	const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
	const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; quantity: number }>>([]);
	const [search, setSearch] = useState('');
	const [lastOrderId, setLastOrderId] = useState<string | null>(null);
	const { toast } = useToast();

	const selectedVendor = useMemo(() => vendors.find(v => v.id === selectedVendorId) || null, [selectedVendorId]);
	const items = useMemo(() => (selectedVendorId ? menuByVendor[selectedVendorId] ?? [] : []), [selectedVendorId]);

	useEffect(() => {
		if (student) {
			loadWalletData();
		}
	}, [student]);

	const loadWalletData = async () => {
		if (!student) return;
		try {
			const walletData = await apiService.getWallet(student.id);
			setWallet(walletData);
		} catch (error) {
			console.error('Error loading wallet:', error);
			toast({
				title: "Error",
				description: "No se pudo cargar la información de la wallet",
				variant: "destructive"
			});
		}
	};

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);

	const addToCart = (item: MenuItem) => {
		setCart(prev => {
			const found = prev.find(i => i.id === item.id);
			if (found) return prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
			return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
		});
	};

	const updateQty = (id: number, delta: number) => {
		setCart(prev =>
			prev
				.map(i => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
				.filter(i => i.quantity > 0)
		);
	};

	const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);

	const confirmOrder = async () => {
		if (!student || !wallet || !selectedVendor || cart.length === 0) {
			toast({
				title: "Error",
				description: "No se puede procesar la compra. Verifica los datos.",
				variant: "destructive"
			});
			return;
		}

		const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		
		// Validate wallet balance
		if (wallet.balance < totalAmount) {
			toast({
				title: "Saldo insuficiente",
				description: `Necesitas ${formatCurrency(totalAmount)} pero solo tienes ${formatCurrency(wallet.balance)}`,
				variant: "destructive"
			});
			return;
		}

		// Validate purchase limit
		if (totalAmount > wallet.limitPerPurchase) {
			toast({
				title: "Límite excedido",
				description: `El monto excede tu límite de ${formatCurrency(wallet.limitPerPurchase)} por compra`,
				variant: "destructive"
			});
			return;
		}

		try {
			const orderId = `TAP-${new Date().getFullYear()}-${Date.now()}`;
			
			// Process the transaction with order
			const result = await apiService.processTransactionWithOrder({
				studentId: student.id,
				amount: totalAmount,
				vendor: selectedVendor.name,
				orderId: orderId,
				items: cart.map(item => ({
					id: item.id.toString(),
					name: item.name,
					price: item.price,
					quantity: item.quantity
				}))
			});

			// Update local wallet data
			setWallet(result.wallet);
			setLastOrderId(orderId);
			
			toast({
				title: "¡Compra exitosa!",
				description: `Pedido #${orderId} confirmado. Nuevo saldo: ${formatCurrency(result.wallet.balance)}`,
			});

			// Clear cart and go to receipt
			setCart([]);
			setView('receipt');
			
		} catch (error: any) {
			toast({
				title: "Error en la compra",
				description: error.message || "No se pudo procesar la compra",
				variant: "destructive"
			});
		}
	};

	const handleLogout = () => {
		setStudent(null);
		setWallet(null);
		setView('home');
		setCart([]);
		setSelectedVendorId(null);
		setLastOrderId(null);
		toast({
			title: "Sesión cerrada",
			description: "Has cerrado sesión exitosamente.",
		});
	};

	const renderHeader = (title: string, onBack?: () => void) => (
		<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
			<div className="flex items-center">
				{onBack && (
					<Button variant="ghost" size="sm" className="text-white mr-2 hover:bg-white/10" onClick={onBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
				)}
				<h1 className="text-lg font-bold">{title}</h1>
			</div>
		</div>
	);

	// Show login if no student is authenticated
	if (!student) {
		return <StudentLogin onLogin={setStudent} />;
	}

	// Show wallet view
	if (view === 'wallet') {
		return <IntegratedWallet student={student} onBack={() => setView('home')} />;
	}

	if (view === 'home') {
		const filtered = vendors.filter(v =>
			v.name.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase())
		);
		return (
			<div className="tapin-theme">
				<div className="min-h-screen bg-gray-50">
					{/* Header */}
					<div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-2xl font-bold">Hola, {student.name.split(' ')[0]} 👋</h2>
								<p className="text-blue-100 text-sm">Saldo disponible: {wallet ? formatCurrency(wallet.balance) : 'Cargando...'}</p>
							</div>
							<div className="flex space-x-2">
								<Button 
									variant="ghost" 
									size="sm" 
									className="text-white hover:bg-white/20"
									onClick={() => setView('wallet')}
								>
									<Wallet className="h-4 w-4 mr-2" /> Mi Wallet
								</Button>
								<Button 
									variant="ghost" 
									size="sm" 
									className="text-white hover:bg-white/20"
									onClick={handleLogout}
								>
									<LogOut className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<Card className="bg-white/10 backdrop-blur-sm border-white/20">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
											<CreditCard className="h-7 w-7 text-white" />
										</div>
										<div>
											<p className="text-blue-100 text-sm">Saldo Disponible</p>
											<p className="text-3xl font-bold text-white">
												{wallet ? formatCurrency(wallet.balance) : 'Cargando...'}
											</p>
											<p className="text-blue-100 text-xs">
												{wallet ? `Válido hasta ${new Date(wallet.validUntil).toLocaleDateString('es-CL')}` : ''}
											</p>
										</div>
									</div>
									{wallet && (
										<Badge className={
											wallet.status === 'active' 
												? "bg-green-400/20 text-green-100 border-green-400/30"
												: wallet.status === 'suspended'
												? "bg-yellow-400/20 text-yellow-100 border-yellow-400/30"  
												: "bg-red-400/20 text-red-100 border-red-400/30"
										}>
											{wallet.status === 'active' ? 'Activa' : 
											 wallet.status === 'suspended' ? 'Suspendida' : 'Vencida'}
										</Badge>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Search */}
					<div className="p-6 space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
							<Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar locales..." className="pl-10" />
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filtered.map(v => (
								<Card
									key={v.id}
									className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
									onClick={() => {
										setSelectedVendorId(v.id);
										setView('vendor');
									}}
								>
									<div className="relative">
										<img src={v.image} alt={v.name} className="w-full h-44 object-cover group-hover:scale-105 transition" />
										<div className="absolute top-3 right-3">
											<Badge className="bg-black/70 text-white border-0">{v.category}</Badge>
										</div>
									</div>
									<CardContent className="p-4">
										<div className="flex items-start justify-between mb-2">
											<h3 className="text-lg font-semibold">{v.name}</h3>
											<div className="flex items-center space-x-1">
												<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
												<span className="text-sm font-medium">{v.rating}</span>
											</div>
										</div>
										<p className="text-sm text-gray-600 mb-3 line-clamp-2">{v.description}</p>
										<div className="flex items-center justify-between text-sm text-gray-500 mb-3">
											<span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{v.distance}</span>
											<span className="flex items-center"><Clock className="h-4 w-4 mr-1" />{v.wait}</span>
										</div>
										<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
											<Store className="h-4 w-4 mr-2" /> Ver menú
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (view === 'vendor' && selectedVendor) {
		return (
			<div className="tapin-theme">
				<div className="min-h-screen bg-background">
					{renderHeader(selectedVendor.name, () => setView('home'))}
					<div className="p-4 space-y-4">
						{items.map(item => (
							<Card key={item.id}>
								<div className="flex items-center gap-4 p-4">
									<img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
									<div className="flex-1">
										<h4 className="font-semibold">{item.name}</h4>
										<p className="text-lg font-bold text-gradient-primary">{formatCurrency(item.price)}</p>
									</div>
									<Button variant="outline" size="sm" onClick={() => addToCart(item)}>
										<Plus className="h-4 w-4 mr-1" /> Agregar
									</Button>
								</div>
							</Card>
						))}

						{cart.length > 0 && (
							<div className="fixed bottom-6 right-6">
								<Button className="rounded-full h-14 w-14 bg-gradient-accent" onClick={() => setView('cart')}>
									<div className="relative">
										<ShoppingCart className="h-6 w-6" />
										<Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive">
											{cart.reduce((s, i) => s + i.quantity, 0)}
										</Badge>
									</div>
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	if (view === 'cart') {
		return (
			<div className="tapin-theme">
				<div className="min-h-screen bg-background">
					{renderHeader('Mi Carrito', () => setView(selectedVendor ? 'vendor' : 'home'))}
					<div className="p-4 space-y-4">
						{cart.map(item => (
							<Card key={item.id}>
								<div className="flex items-center justify-between p-4">
									<div>
										<p className="font-semibold">{item.name}</p>
										<p className="text-sm text-muted-foreground">{formatCurrency(item.price)} c/u</p>
									</div>
									<div className="flex items-center gap-3">
										<Button variant="outline" size="sm" onClick={() => updateQty(item.id, -1)}>
											<Minus className="h-3 w-3" />
										</Button>
										<span className="min-w-[2rem] text-center font-semibold">{item.quantity}</span>
										<Button variant="outline" size="sm" onClick={() => updateQty(item.id, 1)}>
											<Plus className="h-3 w-3" />
										</Button>
									</div>
								</div>
							</Card>
						))}

						<Card className="bg-gradient-card">
							<CardContent className="p-4">
								<div className="flex items-center justify-between mb-3">
									<span className="text-lg font-semibold">Total</span>
									<span className="text-2xl font-bold text-gradient-primary">{formatCurrency(total)}</span>
								</div>
								<Button className="w-full bg-gradient-accent" onClick={confirmOrder} disabled={total === 0}>
									Confirmar Compra
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="tapin-theme">
			<div className="min-h-screen bg-background">
				{renderHeader('Comprobante')}
				<div className="p-4">
					<Card>
						<CardHeader className="text-center border-b border-dashed">
							<CardTitle className="text-gradient-primary">Compra confirmada</CardTitle>
						</CardHeader>
						<CardContent className="p-4 space-y-4">
							<p className="text-center text-sm text-muted-foreground">N° Orden: {lastOrderId}</p>
							<div className="flex items-center justify-between">
								<span>Total</span>
								<span className="font-bold">{formatCurrency(total)}</span>
							</div>
							<Button className="w-full" onClick={() => {
								setCart([]);
								setSelectedVendorId(null);
								setView('home');
							}}>Volver al inicio</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
