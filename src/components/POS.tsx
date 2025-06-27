
import React, { useState } from 'react';
import { Coffee, Plus, Minus, ShoppingCart, CreditCard, Receipt, X, BarChart3, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import LoginPage from './LoginPage';
import Analytics from './Analytics';
import Inventory from './Inventory';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  category: string;
  stock: number;
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

interface User {
  type: 'admin' | 'user';
  username: string;
}

const POS = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'pos' | 'analytics' | 'inventory'>('pos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [showPayment, setShowPayment] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showReceipt, setShowReceipt] = useState<Order | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    // Coffee
    { id: '1', name: 'Espresso', price: 2.50, costPrice: 0.80, category: 'coffee', stock: 50 },
    { id: '2', name: 'Americano', price: 3.00, costPrice: 0.90, category: 'coffee', stock: 45 },
    { id: '3', name: 'Cappuccino', price: 4.00, costPrice: 1.20, category: 'coffee', stock: 30 },
    { id: '4', name: 'Latte', price: 4.50, costPrice: 1.40, category: 'coffee', stock: 35 },
    { id: '5', name: 'Macchiato', price: 4.25, costPrice: 1.30, category: 'coffee', stock: 25 },
    { id: '6', name: 'Mocha', price: 5.00, costPrice: 1.60, category: 'coffee', stock: 20 },
    
    // Cold Drinks
    { id: '7', name: 'Iced Coffee', price: 3.50, costPrice: 1.10, category: 'cold', stock: 40 },
    { id: '8', name: 'Frappuccino', price: 5.50, costPrice: 1.80, category: 'cold', stock: 30 },
    { id: '9', name: 'Cold Brew', price: 4.00, costPrice: 1.25, category: 'cold', stock: 35 },
    { id: '10', name: 'Iced Tea', price: 2.75, costPrice: 0.70, category: 'cold', stock: 50 },
    
    // Pastries
    { id: '11', name: 'Croissant', price: 3.25, costPrice: 1.00, category: 'pastries', stock: 15 },
    { id: '12', name: 'Muffin', price: 2.75, costPrice: 0.85, category: 'pastries', stock: 20 },
    { id: '13', name: 'Danish', price: 3.50, costPrice: 1.10, category: 'pastries', stock: 12 },
    { id: '14', name: 'Bagel', price: 2.50, costPrice: 0.75, category: 'pastries', stock: 25 },
    
    // Snacks
    { id: '15', name: 'Sandwich', price: 6.50, costPrice: 2.50, category: 'snacks', stock: 18 },
    { id: '16', name: 'Salad', price: 7.25, costPrice: 2.80, category: 'snacks', stock: 15 },
    { id: '17', name: 'Cookies', price: 2.25, costPrice: 0.60, category: 'snacks', stock: 40 },
  ]);

  const categories = [
    { id: 'coffee', name: 'Coffee', icon: Coffee },
    { id: 'cold', name: 'Cold Drinks', icon: Coffee },
    { id: 'pastries', name: 'Pastries', icon: Coffee },
    { id: 'snacks', name: 'Snacks', icon: Coffee },
  ];

  const handleLogin = (userType: 'admin' | 'user', username: string) => {
    setUser({ type: userType, username });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('pos');
    clearCart();
  };

  const addToCart = (item: MenuItem) => {
    if (item.stock <= 0) {
      toast({ title: 'Item out of stock', variant: 'destructive' });
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        if (existingItem.quantity >= item.stock) {
          toast({ title: 'Not enough stock available', variant: 'destructive' });
          return prev;
        }
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
    // Update stock
    const updatedItems = menuItems.map(item => {
      const cartItem = cart.find(c => c.id === item.id);
      if (cartItem) {
        return { ...item, stock: item.stock - cartItem.quantity };
      }
      return item;
    });
    setMenuItems(updatedItems);

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

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-800 p-3 rounded-2xl shadow-sm">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-slate-800">Brew & Bean</h1>
                <p className="text-slate-500 text-sm">Modern Coffee Experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome, {user.username}</p>
                <Badge variant={user.type === 'admin' ? 'default' : 'secondary'} className="text-xs">
                  {user.type}
                </Badge>
              </div>
              
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
                <Button
                  variant={currentView === 'pos' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('pos')}
                  size="sm"
                  className={currentView === 'pos' ? 'bg-white shadow-sm' : 'text-slate-600'}
                >
                  POS
                </Button>
                {user.type === 'admin' && (
                  <>
                    <Button
                      variant={currentView === 'inventory' ? 'default' : 'ghost'}
                      onClick={() => setCurrentView('inventory')}
                      size="sm"
                      className={currentView === 'inventory' ? 'bg-white shadow-sm' : 'text-slate-600'}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Inventory
                    </Button>
                    <Button
                      variant={currentView === 'analytics' ? 'default' : 'ghost'}
                      onClick={() => setCurrentView('analytics')}
                      size="sm"
                      className={currentView === 'analytics' ? 'bg-white shadow-sm' : 'text-slate-600'}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </>
                )}
              </div>
              
              <Button variant="outline" onClick={handleLogout} size="sm" className="border-slate-200">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Content based on current view */}
        {currentView === 'analytics' && user.type === 'admin' ? (
          <Analytics orders={orders} />
        ) : currentView === 'inventory' && user.type === 'admin' ? (
          <Inventory menuItems={menuItems} onUpdateItems={setMenuItems} />
        ) : (
          <>
            {/* POS Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Menu Section */}
              <div className="lg:col-span-3">
                {/* Categories */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6 mb-6">
                  <div className="flex space-x-1 bg-slate-50 p-1 rounded-xl">
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "ghost"}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center space-x-2 flex-1 ${
                          activeCategory === category.id 
                            ? 'bg-white text-slate-800 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                        }`}
                      >
                        <category.icon className="h-4 w-4" />
                        <span>{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <Card key={item.id} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-lg hover:bg-white/80 transition-all duration-200 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4 flex items-center justify-center">
                          <Coffee className="h-12 w-12 text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-800 text-lg mb-1">{item.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-2xl font-light text-slate-800">${item.price.toFixed(2)}</p>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            item.stock > 10 ? 'bg-emerald-100 text-emerald-700' :
                            item.stock > 0 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.stock} left
                          </span>
                        </div>
                        <Button 
                          onClick={() => addToCart(item)}
                          disabled={item.stock <= 0}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-white border-0 shadow-sm disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cart Section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-slate-800 font-medium">
                      <span className="flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Cart
                      </span>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">{cart.length} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">Cart is empty</p>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-slate-50/80 p-4 rounded-xl">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-slate-800">{item.name}</h4>
                                <p className="text-slate-700 font-medium">${item.price.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromCart(item.id)}
                                  className="h-8 w-8 p-0 border-slate-200"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium text-slate-800">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addToCart(item)}
                                  className="h-8 w-8 p-0 border-slate-200"
                                  disabled={item.quantity >= item.stock}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t border-slate-200 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-slate-800">Total:</span>
                            <span className="text-2xl font-light text-slate-800">
                              ${getTotalPrice().toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <Button 
                              onClick={() => setShowPayment(true)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm"
                              disabled={cart.length === 0}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Process Payment
                            </Button>
                            <Button 
                              onClick={clearCart}
                              variant="outline"
                              className="w-full border-slate-200 text-slate-600"
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
          </>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 font-medium">Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <h3 className="font-medium mb-2 text-slate-800">Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-slate-600">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-medium text-slate-800">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={processPayment} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Cash Payment
              </Button>
              <Button onClick={processPayment} className="bg-slate-600 hover:bg-slate-700 text-white">
                Card Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={!!showReceipt} onOpenChange={() => setShowReceipt(null)}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-slate-800 font-medium">
              <span className="flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Receipt
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReceipt(null)}
                className="text-slate-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {showReceipt && (
            <div className="space-y-4 font-mono text-sm">
              <div className="text-center">
                <h2 className="font-bold text-lg text-slate-800">Brew & Bean</h2>
                <p className="text-slate-600">Modern Coffee Experience</p>
                <p className="text-xs text-slate-500">
                  {showReceipt.timestamp.toLocaleString()}
                </p>
              </div>
              
              <div className="border-t border-b border-slate-200 py-2">
                <p className="font-semibold mb-1 text-slate-800">Order: {showReceipt.id}</p>
                {showReceipt.items.map(item => (
                  <div key={item.id} className="flex justify-between text-slate-600">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between font-bold text-lg text-slate-800">
                <span>TOTAL:</span>
                <span>${showReceipt.total.toFixed(2)}</span>
              </div>
              
              <div className="text-center text-xs text-slate-500">
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
