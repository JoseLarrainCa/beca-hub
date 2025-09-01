// Mock API para reportes - reemplazar con backend real
import { z } from 'zod';
import { AMOUNT_FIELD, sumSelect, avgSelect, amountFilter, readAmount } from '@/server/reports/amountField';

export interface TransactionRow {
  id: string;
  date: string;
  merchant: string;
  studentEmail: string;
  type: "purchase" | "topup" | "adjustment";
  payment: "wallet" | "cash" | "card";
  amount: number;
}

export interface ReportsResponse {
  rows: TransactionRow[];
  page: number;
  pageSize: number;
  totalRows: number;
  summary: {
    revenue: number;
    txCount: number;
    avgTicket: number;
  };
  facets: {
    merchants: { id: string; name: string; count: number }[];
    types: { value: string; count: number }[];
  };
}

// Mock data generator
function generateMockTransactions(count: number): TransactionRow[] {
  const merchants = [
    "Cafetería Central",
    "Comida Rápida UDD", 
    "Cafetería UDD",
    "Restaurante El Jardín"
  ];
  
  const students = [
    "ana.rodriguez@mail.udd.cl",
    "diego.torres@mail.udd.cl",
    "valentina.lopez@mail.udd.cl",
    "mateo.silva@mail.udd.cl",
    "sofia.garcia@mail.udd.cl",
    "lucas.martinez@mail.udd.cl"
  ];

  const types: TransactionRow["type"][] = ["purchase", "topup", "adjustment"];
  const payments: TransactionRow["payment"][] = ["wallet", "cash", "card"];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 12) + 8);
    date.setMinutes(Math.floor(Math.random() * 60));

    const type = types[Math.floor(Math.random() * types.length)];
    let amount: number;
    
    if (type === "topup") {
      amount = [10000, 15000, 20000, 25000, 30000][Math.floor(Math.random() * 5)];
    } else if (type === "adjustment") {
      amount = Math.floor(Math.random() * 10000) + 1000;
    } else {
      amount = Math.floor(Math.random() * 8000) + 1500; // Purchase: 1500-9500
    }

    return {
      id: `tx_${String(i + 1).padStart(6, '0')}`,
      date: date.toISOString(),
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      studentEmail: students[Math.floor(Math.random() * students.length)],
      type,
      payment: payments[Math.floor(Math.random() * payments.length)],
      amount
    };
  });
}

// Schema seguro - SOLO campos escalares para evitar errores de relación
const Q = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  from: z.string().datetime(),
  to: z.string().datetime(),
  merchantIds: z.string().optional().transform(s => s ? s.split(',') : []),
  studentQuery: z.string().optional().default(''),
  type: z.enum(['purchase','topup','adjustment']).optional(),
  payment: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  sortBy: z.enum(['date','amount']).default('date'),    // ⚠ por ahora SOLO scalars
  sortDir: z.enum(['asc','desc']).default('desc'),
});

// Mock API function
export async function fetchTransactionsReport(queryParams: Record<string, string>): Promise<ReportsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  
  try {
    // 🔎 Paso 1: Validar con Zod - schema seguro
    const q = Q.parse(queryParams);
    console.log('API: Validated query params:', q);

    // Generate mock data
    const allTransactions = generateMockTransactions(2500);
    
    // Apply filters usando params validados
    let filteredTransactions = allTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      const fromDate = new Date(q.from);
      const toDate = new Date(q.to);
      
      // Date range filter
      if (txDate < fromDate || txDate > toDate) return false;
      
      // Merchant filter
      if (q.merchantIds.length && !q.merchantIds.some(id => tx.merchant.includes(id))) return false;
      
      // Student search
      if (q.studentQuery && !tx.studentEmail.toLowerCase().includes(q.studentQuery.toLowerCase())) return false;
      
      // Type filter
      if (q.type && tx.type !== q.type) return false;
      
      // Payment filter  
      if (q.payment && tx.payment !== q.payment) return false;
      
      // Amount filters
      if (q.minAmount && tx.amount < q.minAmount) return false;
      if (q.maxAmount && tx.amount > q.maxAmount) return false;
      
      return true;
    });

    // 🔎 Paso 2: Sort seguro - solo escalares
    filteredTransactions.sort((a, b) => {
      let aVal: any, bVal: any;
      
      if (q.sortBy === 'amount') {
        aVal = Number(a.amount); 
        bVal = Number(b.amount); 
      } else { // 'date'
        aVal = new Date(a.date).getTime(); 
        bVal = new Date(b.date).getTime(); 
      }
      
      if (q.sortDir === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    // 🔎 Paso 3: Calculate summary con campo uniforme
    const totalRevenue = filteredTransactions
      .filter(tx => tx.type === 'purchase')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const summary = {
      revenue: totalRevenue,
      txCount: filteredTransactions.length,
      avgTicket: filteredTransactions.length > 0 ? Math.round(totalRevenue / filteredTransactions.filter(tx => tx.type === 'purchase').length) : 0
    };

  // Calculate facets
  const merchantCounts = filteredTransactions.reduce((acc, tx) => {
    acc[tx.merchant] = (acc[tx.merchant] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeCounts = filteredTransactions.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const facets = {
    merchants: Object.entries(merchantCounts).map(([name, count], index) => ({
      id: `m${index + 1}`,
      name,
      count
    })),
    types: Object.entries(typeCounts).map(([value, count]) => ({
      value,
      count
    }))
  };

    // Pagination usando params validados
    const startIndex = (q.page - 1) * q.pageSize;
    const endIndex = startIndex + q.pageSize;
    const paginatedRows = filteredTransactions.slice(startIndex, endIndex);

    return {
      rows: paginatedRows,
      page: q.page,
      pageSize: q.pageSize,
      totalRows: filteredTransactions.length,
      summary,
      facets
    };
  } catch (err: any) {
    // 🔎 Error handling detallado 
    console.error('Reports API error:', err);
    const msg = err?.issues?.map((i: any) => `${i.path.join('.')}: ${i.message}`).join('; ')
             || err?.message || 'Unknown error';
    console.error('Formatted error message:', msg);
    throw new Error(msg);
  }
}

// Export to Excel function (mock)
export function exportTransactionsToExcel(queryParams: Record<string, string>): void {
  // In a real implementation, this would call the backend API
  // For now, we'll just trigger a download with mock data
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `report_${queryParams.from || 'all'}_${queryParams.to || 'now'}_${timestamp}.xlsx`;
  
  // Create a mock blob and download
  const mockExcelContent = "Mock Excel Report Content";
  const blob = new Blob([mockExcelContent], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
