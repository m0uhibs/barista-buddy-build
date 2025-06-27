
import React, { useState } from 'react';
import { Coffee, Plus, Minus, ShoppingCart, CreditCard, Receipt, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending';
}

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [showPayment, setShowPayment] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showReceipt, setShowReceipt] = useState<Order | null>(null);

  const menuItems: MenuItem[] = [
    // Coffee
    { id: '1', name: 'Espresso', price: 2.50, category: 'coffee' },
    { id: '2', name: 'Americano', price: 3.00, category: 'coffee' },
    { id: '3', name: 'Cappuccino', price: 4.00, category: 'coffee' },
    { id: '4', name: 'Latte', price: 4.50, category: 'coffee' },
    { id: '5', name: 'Macchiato', price: 4.25, category: 'coffee' },
    { id: '6', name: 'Mocha', price: 5.00, category: 'coffee' },
    
    // Cold Drinks
    { id: '7', name: 'Iced Coffee', price: 3.50, category: 'cold' },
    { id: '8', name: 'Frappuccino', price: 5.50, category: 'cold' },
    { id: '9', name: 'Cold Brew', price: 4.00, category: 'cold' },
    { id: '10', name: 'Iced Tea', price: 2.75, category: 'cold' },
    
    // Pastries
    { id: '11', name: 'Croissant', price: 3.25, category: 'pastries' },
    { id: '12', name: 'Muffin', price: 2.75, category: 'pastries' },
    { id: '13', name: 'Danish', price: 3.50, category: 'pastries' },
    { id: '14', name: 'Bagel', price: 2.50, category: 'pastries' },
    
    // Snacks
    { id: '15', name: 'Sandwich', price: 6.50, category: 'snacks' },
    { id: '16', name: 'Salad', price: 7.25, category: 'snacks' },
    { id: '17', name: 'Cookies', price: 2.25, category: 'snacks' },
  ];

  const categories = [
    { id: 'coffee', name: 'Coffee', icon: Coffee },
    { id: 'cold', name: 'Cold Drinks', icon: Coffee },
    { id: 'pastries', name: 'Pastries', icon: Coffee },
    { id: 'snacks', name: 'Snacks', icon: Coffee },
  ];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({ title: `${item.name} added to cart` });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processPayment = () => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      total: getTotalPrice(),
      timestamp: new Date(),
      status: 'completed'
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setShowReceipt(newOrder);
    clearCart();
    setShowPayment(false);
    toast({ title: 'Payment processed successfully!' });
  };

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500 p-3 rounded-xl">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Brew & Bean</h1>
                <p className="text-gray-600">Coffee Shop POS System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-amber-600">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-3">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 whitespace-nowrap ${
                      activeCategory === category.id 
                        ? 'bg-amber-500 hover:bg-amber-600' 
                        : 'hover:bg-amber-50'
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg mb-3 flex items-center justify-center">
                      <Coffee className="h-12 w-12 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-2xl font-bold text-amber-600 mb-3">${item.price.toFixed(2)}</p>
                    <Button 
                      onClick={() => addToCart(item)}
                      className="w-full bg-amber-500 hover:bg-amber-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                  </span>
                  <Badge variant="secondary">{cart.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-amber-600 font-semibold">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-amber-600">
                          ${getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          onClick={() => setShowPayment(true)}
                          className="w-full bg-green-500 hover:bg-green-600"
                          disabled={cart.length === 0}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Process Payment
                        </Button>
                        <Button 
                          onClick={clearCart}
                          variant="outline"
                          className="w-full"
                          disabled={cart.length === 0}
                        >
                          Clear Cart
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={processPayment} className="bg-green-500 hover:bg-green-600">
                Cash Payment
              </Button>
              <Button onClick={processPayment} className="bg-blue-500 hover:bg-blue-600">
                Card Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={!!showReceipt} onOpenChange={() => setShowReceipt(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Receipt
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReceipt(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {showReceipt && (
            <div className="space-y-4 font-mono text-sm">
              <div className="text-center">
                <h2 className="font-bold text-lg">Brew & Bean</h2>
                <p>Coffee Shop</p>
                <p className="text-xs text-gray-600">
                  {showReceipt.timestamp.toLocaleString()}
                </p>
              </div>
              
              <div className="border-t border-b py-2">
                <p className="font-semibold mb-1">Order: {showReceipt.id}</p>
                {showReceipt.items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>${showReceipt.total.toFixed(2)}</span>
              </div>
              
              <div className="text-center text-xs text-gray-600">
                <p>Thank you for your visit!</p>
                <p>Have a great day!</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
