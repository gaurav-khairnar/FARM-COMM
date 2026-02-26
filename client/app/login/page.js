"use client";

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Leaf, ShieldCheck, Tractor, ShoppingBag, Mail, Lock } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const mutation = useMutation({
    mutationFn: (values) =>
      apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values)
      }),
    onSuccess: (data) => {
      authStorage.setSession({ token: data.token, user: data.user });
      router.push('/home');
    }
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Farm Images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80" 
            alt="Fresh vegetables" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80" 
            alt="Farm produce" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80" 
            alt="Fresh fruits" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Marketing Content */}
          <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 text-emerald-700 border border-emerald-200">
            <Leaf size={16} />
            <span className="text-sm font-semibold">Farm-to-Table Marketplace</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight">
            <span className="text-gradient">Fresh Produce</span>
            <br />
            Direct from Farmers
          </h1>
          
          <p className="text-lg text-[color:var(--text-muted)] max-w-lg">
            Connect with local farmers and enjoy fresh, organic produce delivered to your doorstep. 
            Support sustainable farming while getting the best quality products.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
                <Tractor size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-[color:var(--text)]">For Farmers</h3>
                <p className="text-sm text-[color:var(--text-muted)]">Sell directly to customers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl gradient-harvest flex items-center justify-center text-white flex-shrink-0">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-[color:var(--text)]">For Buyers</h3>
                <p className="text-sm text-[color:var(--text-muted)]">Get fresh farm produce</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center gap-6 text-sm">
            <div>
              <p className="text-2xl font-bold text-[color:var(--primary)]">500+</p>
              <p className="text-[color:var(--text-muted)]">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-[color:var(--line)]"></div>
            <div>
              <p className="text-2xl font-bold text-[color:var(--secondary)]">100+</p>
              <p className="text-[color:var(--text-muted)]">Trusted Farmers</p>
            </div>
            <div className="w-px h-12 bg-[color:var(--line)]"></div>
            <div>
              <p className="text-2xl font-bold text-[color:var(--accent)]">1000+</p>
              <p className="text-[color:var(--text-muted)]">Products Listed</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="p-8 md:p-10 shadow-xl animate-slide-up">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-bold text-[color:var(--text)]">Welcome Back</h2>
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white">
                <ShieldCheck size={24} />
              </div>
            </div>
            <p className="text-[color:var(--text-muted)]">Sign in to access your marketplace</p>
          </div>

          <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              icon={<Mail size={18} />}
              error={form.formState.errors.email?.message}
              {...form.register('email')}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              icon={<Lock size={18} />}
              error={form.formState.errors.password?.message}
              {...form.register('password')}
            />
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-[color:var(--text-muted)]">Remember me</span>
              </label>
              <a href="#" className="text-[color:var(--primary)] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full shadow-lg" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
            
            {mutation.error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 font-medium">{mutation.error.message}</p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[color:var(--text-muted)]">
              New to the marketplace?{' '}
              <Link className="font-semibold text-[color:var(--primary)] hover:underline" href="/register">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-[color:var(--line)]">
            <p className="text-xs text-center text-[color:var(--text-muted)]">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}
