
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="bg-slate-800 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 shadow-lg">
            <Coffee className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-light text-slate-800 mb-2">Brew & Bean</CardTitle>
          <p className="text-slate-500">Modern Coffee Experience</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex space-x-1 mb-8 bg-slate-50 p-1 rounded-xl">
              <Button
                type="button"
                variant={userType === 'user' ? 'default' : 'ghost'}
                onClick={() => setUserType('user')}
                className={`flex-1 ${
                  userType === 'user' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                User
              </Button>
              <Button
                type="button"
                variant={userType === 'admin' ? 'default' : 'ghost'}
                onClick={() => setUserType('admin')}
                className={`flex-1 ${
                  userType === 'admin' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-600 font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="border-slate-200 focus:border-slate-400 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="border-slate-200 focus:border-slate-400 h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white h-12 text-base font-medium shadow-sm">
              Login
            </Button>

            <div className="text-xs text-slate-500 mt-6 p-4 bg-slate-50 rounded-xl">
              <p className="font-medium mb-2">Demo Credentials:</p>
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
