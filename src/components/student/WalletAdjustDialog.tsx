import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DollarSign } from 'lucide-react';
import { Wallet } from '@/services/api';

interface WalletAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Wallet | null;
  onSuccess: (student: Wallet, amount: number, type: string) => void;
}

export default function WalletAdjustDialog({ open, onOpenChange, student, onSuccess }: WalletAdjustDialogProps) {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract' | 'set'>('add');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);

  const calculateNewBalance = () => {
    if (!student || !amount) return student?.balance || 0;
    
    const adjustmentAmount = parseInt(amount) || 0;
    console.log('🧮 calculateNewBalance:', { 
      currentBalance: student.balance, 
      adjustmentAmount, 
      adjustmentType 
    });
    
    let result;
    switch (adjustmentType) {
      case 'add':
        result = student.balance + adjustmentAmount;
        break;
      case 'subtract':
        result = Math.max(0, student.balance - adjustmentAmount);
        console.log('➖ Subtract calculation:', {
          formula: `max(0, ${student.balance} - ${adjustmentAmount})`,
          result
        });
        break;
      case 'set':
        result = adjustmentAmount;
        break;
      default:
        result = student.balance;
    }
    
    console.log('✨ Final calculated balance:', result);
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !amount || !reason.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const adjustmentAmount = parseInt(amount);
    const typeText = adjustmentType === 'add' ? 'Recarga' : adjustmentType === 'subtract' ? 'Descuento' : 'Ajuste';
    
    console.log('✅ WalletAdjustDialog: About to call onSuccess with:', {
      student: student.name,
      adjustmentAmount,
      adjustmentType
    });
    
    toast({
      title: "Saldo ajustado exitosamente",
      description: `${typeText} de ${formatCurrency(adjustmentAmount)} aplicado a ${student.name}`,
    });

    setIsLoading(false);
    setAmount('');
    setReason('');
    setAdjustmentType('add');
    onSuccess(student, adjustmentAmount, adjustmentType);
    onOpenChange(false);
  };

  const isValid = amount && reason.trim() && parseInt(amount) > 0;

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Ajustar Saldo
          </DialogTitle>
          <DialogDescription>
            Modificar el saldo de la wallet de <strong>{student.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Saldo actual: <span className="font-bold text-primary">{formatCurrency(student.balance)}</span></Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustment-type">Tipo de ajuste</Label>
            <Select value={adjustmentType} onValueChange={(value: 'add' | 'subtract' | 'set') => setAdjustmentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">➕ Agregar saldo</SelectItem>
                <SelectItem value="subtract">➖ Descontar saldo</SelectItem>
                <SelectItem value="set">🎯 Establecer saldo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto (CLP)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 15000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo del ajuste</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe el motivo del ajuste..."
              rows={3}
              required
            />
          </div>

          {amount && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Vista previa:</p>
              <p className="text-lg">
                <span className="text-muted-foreground">Saldo actual:</span> {formatCurrency(student.balance)}
              </p>
              <p className="text-lg">
                <span className="text-muted-foreground">Nuevo saldo:</span>{' '}
                <span className="font-bold text-primary">{formatCurrency(calculateNewBalance())}</span>
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              {isLoading ? 'Procesando...' : 'Confirmar Ajuste'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
