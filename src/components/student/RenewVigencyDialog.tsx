import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Wallet } from '@/services/api';

interface RenewVigencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Wallet | null;
  onSuccess: (student: Wallet, newValidUntil: string, reason: string) => void;
}

export default function RenewVigencyDialog({ open, onOpenChange, student, onSuccess }: RenewVigencyDialogProps) {
  const [newValidUntil, setNewValidUntil] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  const addMonths = (months: number) => {
    if (!student) return;
    
    const currentDate = new Date(student.validUntil);
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + months);
    
    const formattedDate = newDate.toISOString().split('T')[0];
    setNewValidUntil(formattedDate);
  };

  const getQuickOptions = () => [
    { label: '+6 Meses', months: 6, reason: 'Renovación semestral automática' },
    { label: '+1 Año', months: 12, reason: 'Renovación anual automática' },
    { label: '+2 Años', months: 24, reason: 'Renovación bianual automática' }
  ];

  const handleQuickSelect = (months: number, defaultReason: string) => {
    addMonths(months);
    if (!reason.trim()) {
      setReason(defaultReason);
    }
  };

  const getDaysUntilExpiry = () => {
    if (!student) return 0;
    
    const today = new Date();
    const expiryDate = new Date(student.validUntil);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = () => {
    const days = getDaysUntilExpiry();
    
    if (days < 0) {
      return { status: 'expired', message: `Vencida hace ${Math.abs(days)} días`, color: 'text-red-600' };
    } else if (days <= 30) {
      return { status: 'warning', message: `Vence en ${days} días`, color: 'text-orange-600' };
    } else {
      return { status: 'active', message: `Activa por ${days} días más`, color: 'text-green-600' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !newValidUntil || !reason.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Vigencia renovada exitosamente",
      description: `La vigencia de ${student.name} ha sido extendida hasta ${formatDate(newValidUntil)}`,
    });

    setIsLoading(false);
    setNewValidUntil('');
    setReason('');
    onSuccess(student, newValidUntil, reason);
    onOpenChange(false);
  };

  const isValid = newValidUntil && reason.trim() && new Date(newValidUntil) > new Date(student?.validUntil || '');

  if (!student) return null;

  const expiryInfo = getExpiryStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Renovar Vigencia
          </DialogTitle>
          <DialogDescription>
            Extender la vigencia de la wallet de <strong>{student.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Status */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Estado actual:</span>
                </div>
                <span className={`text-sm font-medium ${expiryInfo.color}`}>
                  {expiryInfo.message}
                </span>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Válida desde:</span>
                  <p className="font-medium">{formatDate(student.validFrom)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Válida hasta:</span>
                  <p className="font-medium">{formatDate(student.validUntil)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Options */}
          <div className="space-y-2">
            <Label>Opciones rápidas</Label>
            <div className="grid grid-cols-3 gap-2">
              {getQuickOptions().map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(option.months, option.reason)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* New Date */}
          <div className="space-y-2">
            <Label htmlFor="new-date">Nueva fecha de vencimiento</Label>
            <div className="relative">
              <Input
                id="new-date"
                type="date"
                value={newValidUntil}
                onChange={(e) => setNewValidUntil(e.target.value)}
                min={student.validUntil}
                required
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            {newValidUntil && (
              <p className="text-xs text-muted-foreground">
                Nueva vigencia: {formatDate(newValidUntil)}
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la renovación</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe el motivo de la renovación..."
              rows={3}
              required
            />
          </div>

          {/* Preview */}
          {newValidUntil && isValid && (
            <Card className="bg-blue-50/50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Vista previa del cambio:</p>
                    <p className="text-blue-700">
                      <span className="line-through">{formatDate(student.validUntil)}</span>
                      {' → '}
                      <span className="font-medium">{formatDate(newValidUntil)}</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Extensión: {Math.ceil((new Date(newValidUntil).getTime() - new Date(student.validUntil).getTime()) / (1000 * 60 * 60 * 24))} días adicionales
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading ? 'Renovando...' : 'Confirmar Renovación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
