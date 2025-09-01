import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Download, Receipt, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'purchase' | 'adjustment' | 'refund';
  description: string;
  amount: number;
  balanceAfter: number;
  vendor?: string;
  orderId?: string;
}

interface Student {
  id: string;
  name: string;
  balance: number;
}

interface WalletHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    date: '2025-01-15 12:30',
    type: 'purchase',
    description: 'Compra en Cafetería Andes',
    amount: -2500,
    balanceAfter: 25750,
    vendor: 'Cafetería Andes',
    orderId: 'ORD-2025-001'
  },
  {
    id: 'txn-002',
    date: '2025-01-14 18:45',
    type: 'purchase',
    description: 'Compra en Sándwich U',
    amount: -4200,
    balanceAfter: 28250,
    vendor: 'Sándwich U',
    orderId: 'ORD-2025-002'
  },
  {
    id: 'txn-003',
    date: '2025-01-14 16:20',
    type: 'adjustment',
    description: 'Ajuste manual por error en compra anterior',
    amount: 1500,
    balanceAfter: 32450
  },
  {
    id: 'txn-004',
    date: '2025-01-12 09:15',
    type: 'purchase',
    description: 'Compra en Dulce & Café',
    amount: -3400,
    balanceAfter: 30950,
    vendor: 'Dulce & Café',
    orderId: 'ORD-2025-003'
  },
  {
    id: 'txn-005',
    date: '2025-01-10 14:30',
    type: 'adjustment',
    description: 'Carga de beca mensual',
    amount: 25000,
    balanceAfter: 34350
  },
  {
    id: 'txn-006',
    date: '2025-01-08 11:45',
    type: 'refund',
    description: 'Reverso de compra - producto no disponible',
    amount: 2800,
    balanceAfter: 9350,
    vendor: 'Cafetería Andes',
    orderId: 'ORD-2025-004'
  }
];

export default function WalletHistoryModal({ open, onOpenChange, student }: WalletHistoryModalProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowDown className="h-4 w-4 text-destructive" />;
      case 'adjustment':
        return <RefreshCw className="h-4 w-4 text-primary" />;
      case 'refund':
        return <ArrowUp className="h-4 w-4 text-success" />;
      default:
        return <Receipt className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Badge variant="destructive">Compra</Badge>;
      case 'adjustment':
        return <Badge variant="default">Ajuste</Badge>;
      case 'refund':
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/30">Reverso</Badge>;
      default:
        return <Badge variant="outline">Otro</Badge>;
    }
  };

  const exportTransactions = () => {
    // Mock CSV export
    const csvContent = [
      'Fecha,Tipo,Descripción,Monto,Saldo Posterior,Local,ID Orden',
      ...mockTransactions.map(t => 
        `${t.date},${t.type},${t.description},${t.amount},${t.balanceAfter},${t.vendor || ''},${t.orderId || ''}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial-${student?.id}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  



  
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pr-8">
          <DialogTitle className="flex items-center justify-between mb-2">
            <span>Historial de Transacciones</span>
                               <Button variant="outline" size="sm" onClick={exportTransactions} className="ml-4">
                     <Download className="h-4 w-4 mr-2" />
                     Exportar Excel
                   </Button>
          </DialogTitle>
          <DialogDescription>
            Historial completo de transacciones para <strong>{student.name}</strong> (ID: {student.id})
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg flex-shrink-0">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Saldo Actual</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(student.balance)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Transacciones</p>
              <p className="text-lg font-bold">{mockTransactions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Este Mes</p>
              <p className="text-lg font-bold text-success">
                {mockTransactions.filter(t => t.date.startsWith('2025-01')).length}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {mockTransactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-start justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-1">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {getTransactionBadge(transaction.type)}
                            {transaction.orderId && (
                              <Badge variant="outline" className="text-xs">
                                {transaction.orderId}
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium text-sm mb-1 break-words">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground mb-1">{transaction.date}</p>
                          {transaction.vendor && (
                            <p className="text-xs text-muted-foreground">📍 {transaction.vendor}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className={`font-bold text-sm mb-1 ${
                          transaction.amount > 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          Saldo: {formatCurrency(transaction.balanceAfter)}
                        </p>
                      </div>
                    </div>
                    {index < mockTransactions.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg text-sm flex-shrink-0">
            <div>
              <p className="text-muted-foreground">Total Gastado (Este Mes)</p>
              <p className="font-bold text-destructive">
                {formatCurrency(
                  mockTransactions
                    .filter(t => t.type === 'purchase' && t.date.startsWith('2025-01'))
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Recargado (Este Mes)</p>
              <p className="font-bold text-success">
                {formatCurrency(
                  mockTransactions
                    .filter(t => (t.type === 'adjustment' || t.type === 'refund') && t.amount > 0 && t.date.startsWith('2025-01'))
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
