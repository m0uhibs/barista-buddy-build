
import React, { useState } from 'react';
import { Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TableSelectionProps {
  selectedTable: number | null;
  onTableSelect: (tableNumber: number) => void;
  occupiedTables?: number[];
  onClose?: () => void;
}

const TableSelection = ({ selectedTable, onTableSelect, occupiedTables = [], onClose }: TableSelectionProps) => {
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);

  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  const getTableStatus = (tableNumber: number) => {
    if (selectedTable === tableNumber) return 'selected';
    if (occupiedTables.includes(tableNumber)) return 'occupied';
    return 'available';
  };

  const getTableColor = (tableNumber: number) => {
    const status = getTableStatus(tableNumber);
    switch (status) {
      case 'selected': return 'bg-amber-500 text-white border-amber-600';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
    }
  };

  const handleTableClick = (tableNumber: number) => {
    if (!occupiedTables.includes(tableNumber)) {
      onTableSelect(tableNumber);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Select Table
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Choose a table for this order</p>
          </div>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex space-x-4 mb-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 border border-amber-600 rounded"></div>
            <span>Selected</span>
          </div>
        </div>

        {/* Table Layout */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {tables.map(tableNumber => (
            <div
              key={tableNumber}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center
                ${getTableColor(tableNumber)}
                ${hoveredTable === tableNumber && !occupiedTables.includes(tableNumber) ? 'scale-105 shadow-lg' : ''}
                ${occupiedTables.includes(tableNumber) ? 'cursor-not-allowed opacity-60' : ''}
              `}
              onClick={() => handleTableClick(tableNumber)}
              onMouseEnter={() => setHoveredTable(tableNumber)}
              onMouseLeave={() => setHoveredTable(null)}
            >
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="font-semibold">Table {tableNumber}</span>
                {selectedTable === tableNumber && (
                  <Check className="h-4 w-4 absolute top-1 right-1" />
                )}
              </div>
              
              {occupiedTables.includes(tableNumber) && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                  Busy
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Current Selection Info */}
        {selectedTable && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-800">
                  Table {selectedTable} Selected
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTableSelect(0)}
                className="text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Floor Plan Visualization */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-3">Restaurant Layout</h4>
          <div className="relative">
            {/* Simple floor plan representation */}
            <div className="grid grid-cols-5 gap-2 text-xs">
              {tables.map(tableNumber => (
                <div
                  key={`layout-${tableNumber}`}
                  className={`
                    w-8 h-8 rounded border flex items-center justify-center
                    ${getTableStatus(tableNumber) === 'selected' ? 'bg-amber-300 border-amber-400' :
                      getTableStatus(tableNumber) === 'occupied' ? 'bg-red-200 border-red-300' :
                      'bg-green-200 border-green-300'}
                  `}
                >
                  {tableNumber}
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-gray-500 text-xs">
              Restaurant Floor Plan
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableSelection;
