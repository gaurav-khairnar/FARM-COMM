"use client";

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/useSession';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ErrorBanner from '@/components/ui/ErrorBanner';
import PageLoader from '@/components/ui/PageLoader';
import Image from 'next/image';
import { ShieldCheck, Star } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, ready } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const listingQuery = useQuery({
    queryKey: ['listing', params.id],
    queryFn: () => apiFetch(`/listings/${params.id}`),
    enabled: ready
  });

  const sellerReviewsQuery = useQuery({
    queryKey: ['seller-reviews', listingQuery.data?.createdBy?._id],
    queryFn: () => apiFetch(`/reviews/seller/${listingQuery.data.createdBy._id}`),
    enabled: !!listingQuery.data?.createdBy?._id
  });

  const addMutation = useMutation({
    mutationFn: () => apiFetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ listingId: params.id, quantity: Number(quantity) })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      router.push('/cart');
    }
  });

  // Move useMemo hooks before conditional returns
  const listing = listingQuery.data;
  const images = useMemo(
    () => (listing?.productId?.images?.length ? listing.productId.images : [FALLBACK_IMAGE]),
    [listing]
  );
  const selectedImageUrl = images[selectedImage] || images[0];

  // Now do conditional rendering after all hooks
  if (!ready || listingQuery.isLoading) return <PageLoader label="Loading listing..." />;
  if (listingQuery.error) return <ErrorBanner message={listingQuery.error.message} />;

  return (
    <div className="grid gap-6 lg:grid-cols-3 animate-fadeIn">
      <Card className="lg:col-span-2 overflow-hidden p-5">
        <div className="relative h-72 w-full rounded-xl overflow-hidden">
          <Image 
            src={selectedImageUrl} 
            alt={listing.productId?.name || 'Product image'} 
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button 
              key={`${img}-${idx}`} 
              type="button" 
              onClick={() => setSelectedImage(idx)} 
              className={`relative overflow-hidden rounded-lg border h-16 ${idx === selectedImage ? 'border-[color:var(--primary)] ring-2 ring-[color:var(--primary)]' : 'border-[color:var(--line)]'}`}
            >
              <Image 
                src={img} 
                alt={`Preview ${idx + 1}`} 
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-2">
            <Badge tone="info">{listing.productId?.category}</Badge>
            <Badge tone="warning">Expires {new Date(listing.expiryDate).toLocaleDateString()}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{listing.productId?.name}</h1>
          <p className="text-[color:var(--muted)]">{listing.productId?.description || 'No description provided.'}</p>
          <p className="text-xl font-semibold text-[color:var(--primary)]">Rs {listing.price} / {listing.unit}</p>
          <p className="text-sm text-[color:var(--muted)]">Available quantity: {listing.quantity}</p>
        </div>
      </Card>

      <Card className="h-fit p-5">
        <h2 className="text-lg font-semibold">Seller</h2>
        <p className="mt-2 text-sm">{listing.createdBy?.name}</p>
        <p className="text-sm text-[color:var(--muted)]">{listing.createdBy?.email}</p>

        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="inline-flex items-center gap-1 font-semibold"><ShieldCheck size={14} /> Trust Score</p>
          <p className="mt-1 inline-flex items-center gap-1"><Star size={14} /> {(listing.sellerTrust?.averageRating || 0).toFixed(1)} / 5</p>
          <p className="text-xs text-emerald-800">{listing.sellerTrust?.reviewCount || 0} reviews • {listing.sellerTrust?.completedOrdersCount || 0} completed orders</p>
        </div>

        {sellerReviewsQuery.data?.reviews?.length ? (
          <div className="mt-3 space-y-2">
            {sellerReviewsQuery.data.reviews.slice(0, 2).map((review) => (
              <div key={review._id} className="rounded-lg border border-[color:var(--line)] p-2 text-xs">
                <p className="font-semibold">{review.reviewerId?.name || 'Buyer'} • {review.rating}/5</p>
                <p className="text-[color:var(--muted)]">{review.comment || 'No comment'}</p>
              </div>
            ))}
          </div>
        ) : null}

        {user?.role === 'buyer' ? (
          <div className="mt-5 space-y-3">
            <label className="text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              max={listing.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2"
            />
            <Button className="w-full" onClick={() => addMutation.mutate()} disabled={addMutation.isPending}>Add to Cart</Button>
            <ErrorBanner message={addMutation.error?.message} />
          </div>
        ) : (
          <p className="mt-5 text-sm text-[color:var(--muted)]">Switch to a buyer account to place orders.</p>
        )}
      </Card>
    </div>
  );
}
