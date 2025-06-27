
import React, { useState } from 'react';
import { Calendar, RefreshCw, Printer, DollarSign, Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'refunded';
}

interface SalesHistoryProps {
  orders: Order[];
  onRefundOrder: (orderId: string) => void;
  userType: 'admin' | 'user';
}

const SalesHistory = ({ orders, onRefundOrder, userType }: SalesHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showRefundDialog, setShowRefundDialog] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const orderDate = order.timestamp.toISOString().split('T')[0];
    return orderDate === selectedDate;
  });

  const dailyStats = {
    totalSales: filteredOrders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.total, 0),
    totalOrders: filteredOrders.filter(o => o.status === 'completed').length,
    totalItems: filteredOrders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
    refunds: filteredOrders.filter(o => o.status === 'refunded').length,
    refundAmount: filteredOrders.filter(o => o.status === 'refunded').reduce((sum, order) => sum + order.total, 0)
  };

  const handleRefund = (order: Order) => {
    onRefundOrder(order.id);
    setShowRefundDialog(null);
    toast({ title: `Order ${order.id} refunded successfully` });
  };

  const handlePrintReceipt = (order: Order) => {
    const printContent = `
      BREW & BEAN
      Modern Coffee Experience
      
      Order: ${order.id}
      Date: ${order.timestamp.toLocaleString()}
      
      ${order.items.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      TOTAL: $${order.total.toFixed(2)}
      Status: ${order.status.toUpperCase()}
      
      Thank you for your visit!
    `;
    
    // In a real app, this would connect to a thermal printer
    console.log('Printing receipt:', printContent);
    toast({ title: 'Receipt sent to printer' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light text-slate-800">Sales History</h2>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Total Sales</p>
                <p className="text-2xl font-light text-slate-800">${dailyStats.totalSales.toFixed(2)}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Orders</p>
                <p className="text-2xl font-light text-slate-800">{dailyStats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Items Sold</p>
                <p className="text-2xl font-light text-slate-800">{dailyStats.totalItems}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-2xl">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Refunds</p>
                <p className="text-2xl font-light text-slate-800">{dailyStats.refunds}</p>
                <p className="text-xs text-red-500">-${dailyStats.refundAmount.toFixed(2)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-2xl">
                <RefreshCw className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-slate-800">
            Orders for {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No orders found for this date</p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-slate-800">{order.id}</span>
                      <Badge 
                        variant={
                          order.status === 'completed' ? 'default' : 
                          order.status === 'refunded' ? 'destructive' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        {order.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrintReceipt(order)}
                        className="border-slate-200"
                      >
                        <Printer className="h-3 w-3 mr-1" />
                        Print
                      </Button>
                      {userType === 'admin' && order.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowRefundDialog(order)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    {order.items.map(item => (
                      <div key={`${order.id}-${item.id}`} className="flex justify-between text-sm text-slate-600">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between font-medium text-slate-800 pt-2 border-t border-slate-100">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      <Dialog open={!!showRefundDialog} onOpenChange={() => setShowRefundDialog(null)}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 font-medium">Confirm Refund</DialogTitle>
          </DialogHeader>
          {showRefundDialog && (
            <div className="space-y-4">
              <p className="text-slate-600">
                Are you sure you want to refund order {showRefundDialog.id}?
              </p>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="font-medium text-slate-800">Refund Amount: ${showRefundDialog.total.toFixed(2)}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleRefund(showRefundDialog)} 
                  variant="destructive"
                  className="flex-1"
                >
                  Confirm Refund
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRefundDialog(null)} 
                  className="flex-1 border-slate-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesHistory;
