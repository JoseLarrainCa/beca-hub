import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

export interface WalletFilters {
  search: string;
  status: 'all' | 'active' | 'suspended' | 'expired';
  year: string;
  balanceMin: string;
  balanceMax: string;
  hasTransactions: 'all' | 'yes' | 'no';
}

interface WalletFiltersProps {
  filters: WalletFilters;
  onFiltersChange: (filters: WalletFilters) => void;
  resultCount: number;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function WalletFiltersComponent({ filters, onFiltersChange, resultCount }: WalletFiltersProps) {
  const updateFilter = (key: keyof WalletFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      year: 'all',
      balanceMin: '',
      balanceMax: '',
      hasTransactions: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.year !== 'all') count++;
    if (filters.balanceMin) count++;
    if (filters.balanceMax) count++;
    if (filters.hasTransactions !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="shadow-university">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gradient-primary flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avanzados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-muted/30">
              {resultCount} resultados
            </Badge>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar estudiante</Label>
          <Input
            id="search"
            placeholder="Nombre, ID o email..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Filtros en grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Estado */}
          <div className="space-y-2">
            <Label>Estado de Wallet</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">🟢 Activa</SelectItem>
                <SelectItem value="suspended">🟡 Suspendida</SelectItem>
                <SelectItem value="expired">🔴 Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Año */}
          <div className="space-y-2">
            <Label>Año de Vigencia</Label>
            <Select value={filters.year} onValueChange={(value) => updateFilter('year', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actividad */}
          <div className="space-y-2">
            <Label>Actividad</Label>
            <Select value={filters.hasTransactions} onValueChange={(value) => updateFilter('hasTransactions', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier actividad</SelectItem>
                <SelectItem value="yes">📈 Con transacciones</SelectItem>
                <SelectItem value="no">📉 Sin transacciones</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rango de saldo */}
        <div className="space-y-2">
          <Label>Rango de Saldo (CLP)</Label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Mín"
              type="number"
              min="0"
              value={filters.balanceMin}
              onChange={(e) => updateFilter('balanceMin', e.target.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground">—</span>
            <Input
              placeholder="Máx"
              type="number"
              min="0"
              value={filters.balanceMax}
              onChange={(e) => updateFilter('balanceMax', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Filtros activos */}
        {activeFiltersCount > 0 && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Búsqueda: "{filters.search}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('search', '')}
                  />
                </Badge>
              )}
              {filters.status !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Estado: {filters.status}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('status', 'all')}
                  />
                </Badge>
              )}
              {filters.year !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Año: {filters.year}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('year', 'all')}
                  />
                </Badge>
              )}
              {filters.balanceMin && (
                <Badge variant="secondary" className="gap-1">
                  Saldo mín: ${filters.balanceMin}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('balanceMin', '')}
                  />
                </Badge>
              )}
              {filters.balanceMax && (
                <Badge variant="secondary" className="gap-1">
                  Saldo máx: ${filters.balanceMax}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('balanceMax', '')}
                  />
                </Badge>
              )}
              {filters.hasTransactions !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {filters.hasTransactions === 'yes' ? 'Con transacciones' : 'Sin transacciones'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('hasTransactions', 'all')}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
