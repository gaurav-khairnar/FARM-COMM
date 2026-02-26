"use client";

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/useSession';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';
import PageLoader from '@/components/ui/PageLoader';

const statusTone = {
  requested: 'warning',
  accepted: 'info',
  completed: 'success',
  rejected: 'danger',
  cancelled: 'danger'
};

export default function OrdersPage() {
  const { user, ready } = useSession();
  const queryClient = useQueryClient();
  const [reviewDrafts, setReviewDrafts] = useState({});

  const ordersQuery = useQuery({ queryKey: ['orders'], queryFn: () => apiFetch('/orders'), enabled: ready });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
  });

  const reviewMutation = useMutation({
    mutationFn: ({ orderId, rating, comment }) => apiFetch('/reviews', {
      method: 'POST',
      body: JSON.stringify({ orderId, rating, comment })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  if (!ready || ordersQuery.isLoading) return <PageLoader label="Loading orders..." />;
  if (ordersQuery.error) return <ErrorBanner message={ordersQuery.error.message} />;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Orders</h1>
      {ordersQuery.data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-lg font-semibold">No orders yet</p>
          <p className="text-sm text-[color:var(--muted)]">Placed or received orders will appear here.</p>
        </Card>
      ) : (
        ordersQuery.data.map((order) => {
          const draft = reviewDrafts[order._id] || { rating: 5, comment: '' };
          return (
            <Card key={order._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-[color:var(--muted)]">Buyer: {order.buyer?.name || order.buyer?.email}</p>
                  <p className="text-sm text-[color:var(--muted)]">Seller: {order.seller?.name || order.seller?.email}</p>
                </div>
                <Badge tone={statusTone[order.status] || 'neutral'}>{order.status}</Badge>
              </div>

              <ul className="mt-3 space-y-1 text-sm">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.product?.name} x {item.quantity} {item.unit}</span>
                    <span>Rs {item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">Total: Rs {order.totalAmount}</p>
                <div className="flex gap-2">
                  {user?.role === 'farmer' && order.status === 'requested' ? (
                    <>
                      <Button variant="primary" onClick={() => statusMutation.mutate({ id: order._id, status: 'accepted' })}>Accept</Button>
                      <Button variant="danger" onClick={() => statusMutation.mutate({ id: order._id, status: 'rejected' })}>Reject</Button>
                    </>
                  ) : null}

                  {user?.role === 'farmer' && order.status === 'accepted' ? (
                    <Button onClick={() => statusMutation.mutate({ id: order._id, status: 'completed' })}>Mark Completed</Button>
                  ) : null}

                  {user?.role === 'buyer' && ['requested', 'accepted'].includes(order.status) ? (
                    <Button variant="danger" onClick={() => statusMutation.mutate({ id: order._id, status: 'cancelled' })}>Cancel</Button>
                  ) : null}
                </div>
              </div>

              {user?.role === 'buyer' && order.status === 'completed' && !order.hasReview ? (
                <div className="mt-4 rounded-xl border border-[color:var(--line)] p-3">
                  <p className="text-sm font-semibold">Leave a review for this seller</p>
                  <div className="mt-2 grid gap-2 md:grid-cols-4">
                    <select
                      value={draft.rating}
                      onChange={(e) => setReviewDrafts((prev) => ({ ...prev, [order._id]: { ...draft, rating: Number(e.target.value) } }))}
                      className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                    <input
                      value={draft.comment}
                      onChange={(e) => setReviewDrafts((prev) => ({ ...prev, [order._id]: { ...draft, comment: e.target.value } }))}
                      className="rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm md:col-span-2"
                      placeholder="Share your experience"
                    />
                    <Button
                      onClick={() => reviewMutation.mutate({ orderId: order._id, rating: draft.rating, comment: draft.comment })}
                      disabled={reviewMutation.isPending}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              ) : null}

              {user?.role === 'buyer' && order.status === 'completed' && order.hasReview ? (
                <p className="mt-3 text-xs text-emerald-700">Review submitted for this order.</p>
              ) : null}
            </Card>
          );
        })
      )}
      <ErrorBanner message={statusMutation.error?.message || reviewMutation.error?.message} />
    </div>
  );
}
