
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, TrendingUp, DollarSign, Coffee, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface AnalyticsProps {
  orders: Array<{
    id: string;
    items: Array<{ name: string; price: number; quantity: number; category: string }>;
    total: number;
    timestamp: Date;
    tableNumber?: number;
  }>;
}

const Analytics = ({ orders }: AnalyticsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly'>('daily');

  // Generate sample data for demonstration
  const generateDailyData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(order => 
        order.timestamp.toDateString() === date.toDateString()
      );
      
      last7Days.push({
        date: date.toLocaleDateString(),
        sales: dayOrders.reduce((sum, order) => sum + order.total, 0),
        orders: dayOrders.length,
        items: dayOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
      });
    }
    return last7Days;
  };

  const generateMonthlyData = () => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthOrders = orders.filter(order => 
        order.timestamp >= monthStart && order.timestamp <= monthEnd
      );
      
      last6Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        sales: monthOrders.reduce((sum, order) => sum + order.total, 0),
        orders: monthOrders.length,
        items: monthOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
      });
    }
    return last6Months;
  };

  const getCategoryData = () => {
    const categoryStats = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!categoryStats[item.category]) {
          categoryStats[item.category] = { quantity: 0, revenue: 0 };
        }
        categoryStats[item.category].quantity += item.quantity;
        categoryStats[item.category].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(categoryStats).map(([category, stats]: [string, any]) => ({
      name: category,
      quantity: stats.quantity,
      revenue: stats.revenue
    }));
  };

  const data = selectedPeriod === 'daily' ? generateDailyData() : generateMonthlyData();
  const categoryData = getCategoryData();
  const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Brew & Bean - Analytics Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Period: ${selectedPeriod === 'daily' ? 'Last 7 Days' : 'Last 6 Months'}`, 20, 40);
    
    // Summary Stats
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, 60);
    doc.setFontSize(10);
    doc.text(`Total Sales: $${totalSales.toFixed(2)}`, 20, 70);
    doc.text(`Total Orders: ${totalOrders}`, 20, 80);
    doc.text(`Average Order Value: $${avgOrderValue.toFixed(2)}`, 20, 90);
    doc.text(`Total Items Sold: ${totalItems}`, 20, 100);

    // Sales Data Table
    const tableData = data.map(item => [
      selectedPeriod === 'daily' ? item.date : item.month,
      `$${item.sales.toFixed(2)}`,
      item.orders.toString(),
      item.items.toString()
    ]);

    (doc as any).autoTable({
      head: [[selectedPeriod === 'daily' ? 'Date' : 'Month', 'Sales', 'Orders', 'Items']],
      body: tableData,
      startY: 120,
    });

    // Category Data Table
    const categoryTableData = categoryData.map(item => [
      item.name,
      item.quantity.toString(),
      `$${item.revenue.toFixed(2)}`
    ]);

    (doc as any).autoTable({
      head: [['Category', 'Quantity Sold', 'Revenue']],
      body: categoryTableData,
      startY: (doc as any).lastAutoTable.finalY + 20,
    });

    doc.save(`brew-bean-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <Button
            variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('daily')}
            size="sm"
          >
            Daily
          </Button>
          <Button
            variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('monthly')}
            size="sm"
          >
            Monthly
          </Button>
          <Button onClick={generatePDFReport} className="bg-green-500 hover:bg-green-600">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-amber-600">${avgOrderValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Items Sold</p>
                <p className="text-2xl font-bold text-purple-600">{totalItems}</p>
              </div>
              <Coffee className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={selectedPeriod === 'daily' ? 'date' : 'month'} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Count</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={selectedPeriod === 'daily' ? 'date' : 'month'} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="revenue"
                  label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Sales Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${category.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{category.quantity} items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
