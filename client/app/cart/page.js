"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/useSession';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';
import PageLoader from '@/components/ui/PageLoader';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, CheckCircle, Package } from 'lucide-react';

export default function CartPage() {
  const { ready } = useSession({ requiredRole: 'buyer' });
  const queryClient = useQueryClient();

  const cartQuery = useQuery({ queryKey: ['cart'], queryFn: () => apiFetch('/cart'), enabled: ready });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => apiFetch(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  const removeMutation = useMutation({
    mutationFn: (itemId) => apiFetch(`/cart/items/${itemId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  const orderMutation = useMutation({
    mutationFn: () => apiFetch('/orders', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  if (!ready || cartQuery.isLoading) return <PageLoader label="Loading cart..." />;
  if (cartQuery.error) return <ErrorBanner message={cartQuery.error.message} />;

  const cart = cartQuery.data;
  const total = (cart.items || []).reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
  const itemCount = cart.items?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white">
          <ShoppingCart size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--text)]">Your Cart</h1>
          <p className="text-[color:var(--text-muted)]">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {itemCount === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                  <ShoppingCart size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--text)] mb-2">Your cart is empty</h3>
                <p className="text-sm text-[color:var(--text-muted)] mb-6">
                  Browse our marketplace and add fresh produce to your cart
                </p>
                <Button variant="primary" size="lg">
                  Browse Products
                </Button>
              </div>
            </Card>
          ) : (
            cart.items.map((item) => (
              <Card key={item._id} hover className="p-5">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package size={32} className="text-gray-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg text-[color:var(--text)]">
                          {item.product?.name || item.listing?.productId?.name}
                        </h3>
                        <p className="text-sm text-[color:var(--text-muted)]">
                          ₹{item.priceSnapshot} per {item.unit}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeMutation.mutate(item._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-[color:var(--line)] rounded-lg">
                        <button
                          onClick={() => updateMutation.mutate({ itemId: item._id, quantity: Math.max(1, item.quantity - 1) })}
                          className="p-2 hover:bg-[color:var(--neutral)] rounded-l-lg transition-colors"
                          disabled={item.quantity <= 1 || updateMutation.isPending}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateMutation.mutate({ itemId: item._id, quantity: item.quantity + 1 })}
                          className="p-2 hover:bg-[color:var(--neutral)] rounded-r-lg transition-colors"
                          disabled={updateMutation.isPending}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-xl font-bold text-[color:var(--primary)]">
                        ₹{(item.priceSnapshot * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        <Card className="h-fit p-6 sticky top-20 space-y-4">
          <h2 className="text-xl font-bold text-[color:var(--text)]">Order Summary</h2>
          
          <div className="space-y-3 py-4 border-y border-[color:var(--line)]">
            <div className="flex justify-between text-sm">
              <span className="text-[color:var(--text-muted)]">Subtotal ({itemCount} items)</span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[color:var(--text-muted)]">Delivery</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[color:var(--text-muted)]">Service Fee</span>
              <span className="font-semibold">₹0.00</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-[color:var(--primary)]">₹{total.toFixed(2)}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle size={18} className="text-emerald-600" />
              <span className="text-sm text-emerald-700 font-medium">Cash on Delivery Available</span>
            </div>
          </div>
          
          <Button 
            variant="primary"
            size="lg"
            className="w-full shadow-lg" 
            onClick={() => orderMutation.mutate()} 
            disabled={!itemCount || orderMutation.isPending}
          >
            <CreditCard size={20} />
            {orderMutation.isPending ? 'Processing...' : 'Place Order'}
          </Button>
          
          {orderMutation.isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                <CheckCircle size={16} />
                Order placed successfully!
              </p>
            </div>
          )}
          
          <ErrorBanner message={updateMutation.error?.message || removeMutation.error?.message || orderMutation.error?.message} />
        </Card>
      </div>
    </div>
  );
}
