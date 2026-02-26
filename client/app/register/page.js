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
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Leaf, UserPlus, Mail, Lock, User, Tractor, ShoppingBag } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'At least 6 characters'),
  role: z.enum(['buyer', 'farmer'])
});

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', role: 'buyer' }
  });

  const mutation = useMutation({
    mutationFn: (values) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(values) }),
    onSuccess: (data) => {
      authStorage.setSession({ token: data.token, user: data.user });
      router.push('/home');
    }
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Farm Images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50" />
        <div className="absolute top-0 left-0 w-2/5 h-2/5 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80" 
            alt="Farmer in field" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" 
            alt="Fresh produce basket" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute top-1/3 right-1/4 w-1/5 h-1/5 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80" 
            alt="Organic vegetables" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden md:block space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 text-emerald-700 border border-emerald-200">
              <Leaf size={16} />
              <span className="text-sm font-semibold">Join Our Community</span>
            </div>
            
            <h1 className="text-5xl font-bold leading-tight">
              <span className="text-gradient">Start Your Journey</span>
              <br />
              to Fresh Produce
            </h1>
            
            <p className="text-lg text-[color:var(--text-muted)] max-w-lg">
              Join thousands of farmers and buyers in our growing marketplace. Connect directly, trade fairly, and support sustainable agriculture.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
                  <Tractor size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--text)]">For Farmers</h3>
                  <p className="text-sm text-[color:var(--text-muted)]">Sell your harvest directly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl gradient-harvest flex items-center justify-center text-white flex-shrink-0">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[color:var(--text)]">For Buyers</h3>
                  <p className="text-sm text-[color:var(--text-muted)]">Get farm-fresh produce</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <Card className="p-8 md:p-10 shadow-2xl animate-slide-up backdrop-blur-sm bg-white/95">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold text-[color:var(--text)]">Create Account</h2>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white">
                  <UserPlus size={24} />
                </div>
              </div>
              <p className="text-[color:var(--text-muted)]">Join as a buyer or farmer to get started</p>
            </div>

            <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                icon={<User size={18} />}
                error={form.formState.errors.name?.message}
                {...form.register('name')}
              />
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
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
                icon={<Lock size={18} />}
                error={form.formState.errors.password?.message}
                {...form.register('password')}
              />
              <Select 
                label="I want to join as" 
                required 
                error={form.formState.errors.role?.message} 
                {...form.register('role')}
              >
                <option value="buyer">🛒 Buyer - Purchase fresh produce</option>
                <option value="farmer">🚜 Farmer - Sell my products</option>
              </Select>
              
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full shadow-lg" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Creating account...' : 'Create Account'}
              </Button>
              
              {mutation.error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 font-medium">{mutation.error.message}</p>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[color:var(--text-muted)]">
                Already have an account?{' '}
                <Link className="font-semibold text-[color:var(--primary)] hover:underline" href="/login">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-[color:var(--line)]">
              <p className="text-xs text-center text-[color:var(--text-muted)]">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
