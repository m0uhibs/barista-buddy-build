
import React, { useState } from 'react';
import { Plus, Minus, Edit2, Trash2, Save, X, Package, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  category: string;
  stock: number;
  image?: string;
}

interface Category {
  id: string;
  name: string;
}

interface InventoryProps {
  menuItems: MenuItem[];
  onUpdateItems: (items: MenuItem[]) => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}

const Inventory = ({ menuItems, onUpdateItems, categories, onUpdateCategories }: InventoryProps) => {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    costPrice: 0,
    category: 'coffee',
    stock: 0,
    image: ''
  });
  const [newCategoryName, setNewCategoryName] = useState('');

  // Placeholder images for demonstration
  const placeholderImages = [
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=200&fit=crop'
  ];

  const filteredItems = items.filter(item => item.category === activeCategory);

  const handleSaveEdit = () => {
    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      setItems(updatedItems);
      onUpdateItems(updatedItems);
      setEditingItem(null);
      toast({ title: `${editingItem.name} updated successfully` });
    }
  };

  const handleAddItem = () => {
    if (!newItem.name) {
      toast({ title: 'Please enter item name', variant: 'destructive' });
      return;
    }

    const item: MenuItem = {
      id: `item-${Date.now()}`,
      ...newItem
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    onUpdateItems(updatedItems);
    setNewItem({ name: '', price: 0, costPrice: 0, category: activeCategory, stock: 0, image: '' });
    setShowAddDialog(false);
    toast({ title: `${item.name} added successfully` });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: 'Please enter category name', variant: 'destructive' });
      return;
    }

    const categoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newCategory: Category = {
      id: categoryId,
      name: newCategoryName.trim()
    };

    const updatedCategories = [...categories, newCategory];
    onUpdateCategories(updatedCategories);
    setNewCategoryName('');
    setShowCategoryDialog(false);
    toast({ title: `Category "${newCategory.name}" added successfully` });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    onUpdateItems(updatedItems);
    toast({ title: 'Item deleted successfully' });
  };

  const updateStock = (itemId: string, change: number) => {
    const updatedItems = items.map(item => 
      item.id === itemId 
        ? { ...item, stock: Math.max(0, item.stock + change) }
        : item
    );
    setItems(updatedItems);
    onUpdateItems(updatedItems);
  };

  const getMargin = (price: number, costPrice: number) => {
    if (costPrice === 0) return 0;
    return ((price - costPrice) / price * 100);
  };

  const addPlaceholderImages = () => {
    const updatedItems = items.map((item, index) => ({
      ...item,
      image: item.image || placeholderImages[index % placeholderImages.length]
    }));
    setItems(updatedItems);
    onUpdateItems(updatedItems);
    toast({ title: 'Placeholder images added to items without images' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light text-slate-800">Inventory Management</h2>
        <div className="flex space-x-3">
          <Button 
            onClick={addPlaceholderImages}
            variant="outline"
            className="border-slate-200 text-slate-600"
          >
            <Image className="h-4 w-4 mr-2" />
            Add Sample Images
          </Button>
          <Button 
            onClick={() => setShowCategoryDialog(true)}
            variant="outline"
            className="border-slate-200 text-slate-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white border-0 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-1 bg-slate-50 p-1 rounded-xl overflow-x-auto">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "ghost"}
            onClick={() => setActiveCategory(category.id)}
            className={`whitespace-nowrap ${
              activeCategory === category.id 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="border-0 shadow-sm bg-white hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-slate-800">{item.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingItem({ ...item })}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteItem(item.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item Image */}
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDE5QzE1LjMxIDIxLjk1IDEyIDEyIDEyIDEyQzEyIDEyIDguNjkgMjEuOTUgMTIgMTlaIiBmaWxsPSIjNjM3Mzg1Ii8+Cjwvc3ZnPgo=';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Selling Price</p>
                  <p className="font-semibold text-slate-800">${item.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Cost Price</p>
                  <p className="font-semibold text-slate-800">${item.costPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Margin</p>
                  <p className={`font-semibold ${getMargin(item.price, item.costPrice) > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {getMargin(item.price, item.costPrice).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Stock</p>
                  <p className={`font-semibold ${item.stock < 10 ? 'text-red-500' : 'text-slate-800'}`}>
                    {item.stock} units
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-sm text-slate-500">Stock Control</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStock(item.id, -1)}
                    className="h-8 w-8 p-0 border-slate-200"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStock(item.id, 1)}
                    className="h-8 w-8 p-0 border-slate-200"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 font-medium">Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-600">Name</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="border-slate-200 focus:border-slate-400"
                />
              </div>
              <div>
                <Label className="text-slate-600">Image URL</Label>
                <Input
                  value={editingItem.image || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  placeholder="Enter image URL"
                  className="border-slate-200 focus:border-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">Selling Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                    className="border-slate-200 focus:border-slate-400"
                  />
                </div>
                <div>
                  <Label className="text-slate-600">Cost Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingItem.costPrice}
                    onChange={(e) => setEditingItem({ ...editingItem, costPrice: parseFloat(e.target.value) || 0 })}
                    className="border-slate-200 focus:border-slate-400"
                  />
                </div>
              </div>
              <div>
                <Label className="text-slate-600">Stock</Label>
                <Input
                  type="number"
                  value={editingItem.stock}
                  onChange={(e) => setEditingItem({ ...editingItem, stock: parseInt(e.target.value) || 0 })}
                  className="border-slate-200 focus:border-slate-400"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveEdit} className="flex-1 bg-slate-800 hover:bg-slate-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1 border-slate-200">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 font-medium">Add New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600">Name</Label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="border-slate-200 focus:border-slate-400"
              />
            </div>
            <div>
              <Label className="text-slate-600">Image URL</Label>
              <Input
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                placeholder="Enter image URL (optional)"
                className="border-slate-200 focus:border-slate-400"
              />
            </div>
            <div>
              <Label className="text-slate-600">Category</Label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-md focus:border-slate-400 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-600">Selling Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  className="border-slate-200 focus:border-slate-400"
                />
              </div>
              <div>
                <Label className="text-slate-600">Cost Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.costPrice}
                  onChange={(e) => setNewItem({ ...newItem, costPrice: parseFloat(e.target.value) || 0 })}
                  className="border-slate-200 focus:border-slate-400"
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-600">Initial Stock</Label>
              <Input
                type="number"
                value={newItem.stock}
                onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                className="border-slate-200 focus:border-slate-400"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddItem} className="flex-1 bg-slate-800 hover:bg-slate-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1 border-slate-200">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-md border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800 font-medium">Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600">Category Name</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="border-slate-200 focus:border-slate-400"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddCategory} className="flex-1 bg-slate-800 hover:bg-slate-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)} className="flex-1 border-slate-200">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
