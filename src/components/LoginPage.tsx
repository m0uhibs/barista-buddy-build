
import React, { useState } from 'react';
import { Coffee, User, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface LoginPageProps {
  onLogin: (userType: 'admin' | 'user', username: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'admin' | 'user'>('user');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication logic
    const validCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      user: { username: 'user', password: 'user123' }
    };

    if (username === validCredentials[userType].username && 
        password === validCredentials[userType].password) {
      onLogin(userType, username);
      toast({ title: `Welcome ${userType}!` });
    } else {
      toast({ title: 'Invalid credentials', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-amber-500 p-3 rounded-xl w-16 h-16 mx-auto mb-4">
            <Coffee className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Brew & Bean</CardTitle>
          <p className="text-gray-600">Coffee Shop POS Login</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex space-x-2 mb-6">
              <Button
                type="button"
                variant={userType === 'user' ? 'default' : 'outline'}
                onClick={() => setUserType('user')}
                className="flex-1"
              >
                <User className="h-4 w-4 mr-2" />
                User
              </Button>
              <Button
                type="button"
                variant={userType === 'admin' ? 'default' : 'outline'}
                onClick={() => setUserType('admin')}
                className="flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
              Login
            </Button>

            <div className="text-xs text-gray-500 mt-4">
              <p><strong>Demo Credentials:</strong></p>
              <p>User: user / user123</p>
              <p>Admin: admin / admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
