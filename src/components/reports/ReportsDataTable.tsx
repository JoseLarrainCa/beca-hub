import { useMemo, useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTransactionsReport, exportTransactionsToExcel } from '@/api/reports';
import { fetchJson } from '@/lib/fetcher';
import { getDateRange } from '@/lib/dateRange';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  ColumnDef,
  SortingState 
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed Select imports - now using native HTML select
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  X, 
  Save,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const fmtCLP = (n: number) => 
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

interface TransactionRow {
  id: string;
  date: string;
  merchant: string;
  studentEmail: string;
  type: "purchase" | "topup" | "adjustment";
  payment: "wallet" | "cash" | "card";
  amount: number;
}

interface QueryParams {
  page: number;
  pageSize: number;
  from: string;
  to: string;
  merchantIds: string[];
  search: string;
  type: string;
  payment: string;
  minAmount: string;
  maxAmount: string;
  sortBy: string;
  sortDir: "asc" | "desc";
}

interface ReportsResponse {
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

export default function ReportsDataTable(props: { 
  initialFrom: string; 
  initialTo: string; 
}) {
  console.log('ReportsDataTable: Component starting...', props);
  
  const [q, setQ] = useState<QueryParams>({
    page: 1,
    pageSize: 25,
    from: props.initialFrom,
    to: props.initialTo,
    merchantIds: [],
    search: "",
    type: "",
    payment: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "date",
    sortDir: "desc"
  });

  console.log('ReportsDataTable: useState completed');

  const [sorting, setSorting] = useState<SortingState>([
    { id: q.sortBy, desc: q.sortDir === "desc" }
  ]);

  // Construir query string para API - SIEMPRE incluir from/to
  const buildQueryString = (params: QueryParams) => {
    const urlParams = new URLSearchParams();
    
    // OBLIGATORIOS: página, tamaño, fechas
    urlParams.set("page", String(params.page));
    urlParams.set("pageSize", String(params.pageSize));
    
    // Asegurar que from/to siempre tienen valor válido
    let from = params.from;
    let to = params.to;
    
    if (!from || !to) {
      // Fallback: usar preset por defecto si faltan fechas
      const range = getDateRange("30d");
      from = from || range.from;
      to = to || range.to;
    }
    
    // Convertir a formato ISO si es necesario
    if (!from.includes('T')) {
      from = new Date(from + 'T00:00:00.000Z').toISOString();
    }
    if (!to.includes('T')) {
      to = new Date(to + 'T23:59:59.999Z').toISOString();
    }
    
    urlParams.set("from", from);
    urlParams.set("to", to);
    urlParams.set("sortBy", params.sortBy);
    urlParams.set("sortDir", params.sortDir);
    
    // Opcionales: solo agregar si tienen valor
    if (params.merchantIds.length) urlParams.set("merchantIds", params.merchantIds.join(","));
    if (params.search) urlParams.set("studentQuery", params.search);
    if (params.type) urlParams.set("type", params.type);
    if (params.payment) urlParams.set("payment", params.payment);
    if (params.minAmount) urlParams.set("minAmount", params.minAmount);
    if (params.maxAmount) urlParams.set("maxAmount", params.maxAmount);
    
    return urlParams.toString();
  };

  const queryStr = buildQueryString(q);

  // Query para obtener datos con manejo de errores explícito
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<ReportsResponse>({
    queryKey: ["reports", queryStr],
    queryFn: async () => {
      console.log('DataTable: Calling API with queryStr:', queryStr);
      try {
        const params = Object.fromEntries(new URLSearchParams(queryStr));
        return await fetchTransactionsReport(params);
      } catch (err) {
        console.error('DataTable: Error in query function:', err);
        throw err;
      }
    },
    retry: 1, // Solo reintentar una vez
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Definir columnas
  const columns = useMemo<ColumnDef<TransactionRow>[]>(() => [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Fecha
          {column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> :
           column.getIsSorted() === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> :
           <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      ),
      sortingFn: "datetime",
      enableSorting: true,
      cell: ({ getValue }) => 
        new Date(getValue() as string).toLocaleString("es-CL", {
          day: "2-digit",
          month: "2-digit", 
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
      sortingFn: "datetime"
    },
    {
      accessorKey: "merchant",
      header: "Local",
      enableSorting: false, // Deshabilitado hasta confirmar relaciones
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      )
    },
    {
      accessorKey: "studentEmail", 
      header: "Email del Estudiante",
      enableSorting: false, // Deshabilitado hasta confirmar relaciones
      cell: ({ getValue }) => (
        <span className="text-blue-600">{getValue() as string}</span>
      )
    },
    {
      accessorKey: "type",
      header: "Tipo",
      enableSorting: false, // Deshabilitado hasta confirmar relaciones
      cell: ({ getValue }) => {
        const type = getValue() as string;
        const variants = {
          purchase: "default",
          topup: "secondary", 
          adjustment: "outline"
        } as const;
        const labels = {
          purchase: "Compra",
          topup: "Recarga",
          adjustment: "Ajuste"
        };
        return (
          <Badge variant={variants[type as keyof typeof variants] || "outline"}>
            {labels[type as keyof typeof labels] || type}
          </Badge>
        );
      }
    },
    {
      accessorKey: "payment",
      header: "Método de Pago",
      enableSorting: false, // Deshabilitado hasta confirmar relaciones
      cell: ({ getValue }) => {
        const payment = getValue() as string;
        const labels = {
          wallet: "Saldo de beca",
          cash: "Efectivo", 
          card: "Tarjeta"
        };
        return labels[payment as keyof typeof labels] || payment;
      }
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Monto
          {column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> :
           column.getIsSorted() === "desc" ? <ArrowDown className="ml-2 h-4 w-4" /> :
           <ArrowUpDown className="ml-2 h-4 w-4" />}
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="font-mono font-medium">
          {fmtCLP(Number(getValue()))}
        </span>
      ),
      sortingFn: "alphanumeric"
    }
  ], []);

  // Configurar tabla
  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      setSorting(updater);
      if (typeof updater === "function") {
        const newSorting = updater(sorting);
        if (newSorting[0]) {
          // Solo permitir sorting de campos seguros
          const allowedSorts = ['date', 'amount'];
          const sortBy = allowedSorts.includes(newSorting[0].id) ? newSorting[0].id : 'date';
          setQ(prev => ({
            ...prev,
            sortBy,
            sortDir: newSorting[0].desc ? "desc" : "asc",
            page: 1 // Reset a primera página al ordenar
          }));
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil((data?.totalRows ?? 0) / q.pageSize)
  });

  // Virtualización
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 8
  });

  // Funciones de control
  const exportExcel = () => {
    const params = Object.fromEntries(new URLSearchParams(buildQueryString(q)));
    exportTransactionsToExcel(params);
  };

  const saveView = () => {
    localStorage.setItem("reports:lastView", JSON.stringify(q));
    // Toast o notificación de éxito aquí
  };

  const loadView = () => {
    const saved = localStorage.getItem("reports:lastView");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQ(parsed);
      } catch (e) {
        console.error("Error loading saved view:", e);
      }
    }
  };

  const clearFilters = () => {
    setQ({
      ...q,
      merchantIds: [],
      search: "",
      type: "",
      payment: "",
      minAmount: "",
      maxAmount: "",
      page: 1
    });
  };

  const removeFilter = (filterKey: keyof QueryParams) => {
    setQ(prev => ({
      ...prev,
      [filterKey]: filterKey === "merchantIds" ? [] : "",
      page: 1
    }));
  };

  // Obtener filtros activos para chips
  const activeFilters = useMemo(() => {
    const filters = [];
    if (q.search) filters.push({ key: "search", label: `Búsqueda: ${q.search}` });
    if (q.type) filters.push({ key: "type", label: `Tipo: ${q.type}` });
    if (q.payment) filters.push({ key: "payment", label: `Pago: ${q.payment}` });
    if (q.minAmount) filters.push({ key: "minAmount", label: `Min: ${fmtCLP(Number(q.minAmount))}` });
    if (q.maxAmount) filters.push({ key: "maxAmount", label: `Max: ${fmtCLP(Number(q.maxAmount))}` });
    if (q.merchantIds.length > 0) {
      filters.push({ key: "merchantIds", label: `Locales: ${q.merchantIds.length} seleccionados` });
    }
    return filters;
  }, [q]);

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-red-600 font-semibold text-lg mb-2">Error cargando reportes</h2>
        <p className="text-sm text-gray-600 mt-1 mb-4 bg-red-50 p-3 rounded border">
          {String((error as Error).message)}
        </p>
        <Button 
          onClick={() => queryClient.invalidateQueries({queryKey: ["reports"]})}
          variant="outline"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  // Evitar renderizar si aún no hay datos válidos
  if (isLoading && !data) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar de filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Rango de fechas */}
            <div className="space-y-2">
              <Label>Fecha desde</Label>
              <Input
                type="date"
                value={q.from}
                onChange={(e) => setQ(prev => ({ ...prev, from: e.target.value, page: 1 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha hasta</Label>
              <Input
                type="date"
                value={q.to}
                onChange={(e) => setQ(prev => ({ ...prev, to: e.target.value, page: 1 }))}
              />
            </div>

            {/* Búsqueda por email */}
            <div className="space-y-2">
              <Label>Buscar estudiante</Label>
              <Input
                placeholder="Email del estudiante..."
                value={q.search}
                onChange={(e) => setQ(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>

            {/* Tipo de transacción */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <select 
                value={q.type} 
                onChange={(e) => setQ(prev => ({ ...prev, type: e.target.value, page: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos los tipos</option>
                <option value="purchase">Compra</option>
                <option value="topup">Recarga</option>
                <option value="adjustment">Ajuste</option>
              </select>
            </div>

            {/* Método de pago */}
            <div className="space-y-2">
              <Label>Método de pago</Label>
              <select 
                value={q.payment} 
                onChange={(e) => setQ(prev => ({ ...prev, payment: e.target.value, page: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos los métodos</option>
                <option value="wallet">Saldo de beca</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
              </select>
            </div>

            {/* Montos mínimo y máximo */}
            <div className="space-y-2">
              <Label>Monto mínimo</Label>
              <Input
                type="number"
                placeholder="0"
                value={q.minAmount}
                onChange={(e) => setQ(prev => ({ ...prev, minAmount: e.target.value, page: 1 }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Monto máximo</Label>
              <Input
                type="number"
                placeholder="Sin límite"
                value={q.maxAmount}
                onChange={(e) => setQ(prev => ({ ...prev, maxAmount: e.target.value, page: 1 }))}
              />
            </div>
          </div>

          {/* Filtros activos (chips) */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter.key} variant="secondary" className="cursor-pointer">
                  {filter.label}
                  <X 
                    className="ml-1 h-3 w-3" 
                    onClick={() => removeFilter(filter.key as keyof QueryParams)}
                  />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar todos
              </Button>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportExcel} className="bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
            <Button variant="outline" onClick={saveView}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Vista
            </Button>
            <Button variant="outline" onClick={loadView}>
              Cargar Vista
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs / Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {data ? fmtCLP(data.summary.revenue) : <Skeleton className="h-8 w-32" />}
            </div>
            <p className="text-sm text-muted-foreground">Ingresos totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {data ? data.summary.txCount.toLocaleString("es-CL") : <Skeleton className="h-8 w-20" />}
            </div>
            <p className="text-sm text-muted-foreground">Transacciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {data ? fmtCLP(data.summary.avgTicket) : <Skeleton className="h-8 w-24" />}
            </div>
            <p className="text-sm text-muted-foreground">Ticket promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla virtualizada */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data?.rows.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Filter className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Sin datos en el rango seleccionado</p>
              <p className="text-sm">Ajusta los filtros para ver resultados</p>
            </div>
          ) : (
            <div ref={parentRef} className="h-[600px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background border-b z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left font-semibold bg-gray-50"
                        >
                          {header.isPlaceholder ? null : header.renderHeader()}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    position: "relative"
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = table.getRowModel().rows[virtualRow.index];
                    return (
                      <tr
                        key={row.id}
                        className={`absolute w-full hover:bg-gray-50 ${
                          virtualRow.index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                        style={{
                          transform: `translateY(${virtualRow.start}px)`,
                          height: `${virtualRow.size}px`
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 border-b">
                            {cell.renderCell()}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {((q.page - 1) * q.pageSize) + 1} a{" "}
              {Math.min(q.page * q.pageSize, data?.totalRows ?? 0)} de{" "}
              {data?.totalRows ?? 0} resultados
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={String(q.pageSize)}
                onChange={(e) => setQ(prev => ({ ...prev, pageSize: Number(e.target.value), page: 1 }))}
                className="w-24 px-2 py-1 border border-gray-300 rounded-md"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                disabled={q.page === 1}
                onClick={() => setQ(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {q.page} de {Math.max(1, Math.ceil((data?.totalRows ?? 0) / q.pageSize))}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={q.page * q.pageSize >= (data?.totalRows ?? 0)}
                onClick={() => setQ(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer con totales */}
      <Card className="border-t-4 border-blue-500">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {data ? fmtCLP(data.summary.revenue) : "---"}
              </div>
              <div className="text-sm text-muted-foreground">Ingresos del período</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {data ? data.summary.txCount.toLocaleString("es-CL") : "---"}
              </div>
              <div className="text-sm text-muted-foreground">Total transacciones</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {data ? fmtCLP(data.summary.avgTicket) : "---"}
              </div>
              <div className="text-sm text-muted-foreground">Promedio por transacción</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
