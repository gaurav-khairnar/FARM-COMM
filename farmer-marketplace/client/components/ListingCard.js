"use client";

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import Image from 'next/image';
import { Clock3, Sprout, Star, UserRound, TrendingUp, Package } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80';

const isExpiringSoon = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffHours = (expiry - now) / (1000 * 60 * 60);
  return diffHours > 0 && diffHours <= 48;
};

export default function ListingCard({ listing }) {
  const image = listing.productId?.images?.[0] || FALLBACK_IMAGE;
  const isExpiring = isExpiringSoon(listing.expiryDate);

  return (
    <Link href={`/product/${listing._id}`} className="block group">
      <Card hover className="overflow-hidden transition-all duration-300 group-hover:shadow-xl">
        <div className="relative h-48">
          <Image 
            src={image} 
            alt={listing.productId?.name || 'Product image'} 
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isExpiring && (
            <div className="absolute top-3 right-3">
              <Badge tone="warning" icon={<Clock3 size={12} />}>
                Expiring Soon
              </Badge>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge tone="primary" icon={<Sprout size={12} />}>
              {listing.productId?.category}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[color:var(--text)] group-hover:text-[color:var(--primary)] transition-colors">
              {listing.productId?.name}
            </h3>
            <p className="text-sm text-[color:var(--text-muted)] line-clamp-2 leading-relaxed">
              {listing.productId?.description || 'Fresh produce directly from the farm.'}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[color:var(--line)] pt-3">
            <div className="space-y-1">
              <p className="text-xl font-bold text-[color:var(--primary)]">
                ₹{listing.price}
                <span className="text-sm font-normal text-[color:var(--text-muted)]"> / {listing.unit}</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[color:var(--text-muted)]">
                <Package size={14} />
                <span>{listing.quantity} {listing.unit} available</span>
              </div>
            </div>
            
            {listing.sellerTrust?.averageRating ? (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-amber-700 border border-amber-200">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold">{listing.sellerTrust.averageRating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-[color:var(--text-muted)]">
                  {listing.sellerTrust.reviewCount || 0} reviews
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 border border-emerald-200">
                <TrendingUp size={14} />
                <span className="text-xs font-semibold">New</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[color:var(--line)] pt-3 text-xs">
            <div className="flex items-center gap-1.5 text-[color:var(--text-muted)]">
              <UserRound size={14} className="text-[color:var(--secondary)]" />
              <span className="font-medium">{listing.createdBy?.name || 'Local Farmer'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[color:var(--text-muted)]">
              <Clock3 size={14} className="text-[color:var(--accent)]" />
              <span>{new Date(listing.expiryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
