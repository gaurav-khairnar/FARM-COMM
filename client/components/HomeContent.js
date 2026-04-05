"use client";

import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/useSession';
import ListingCard from '@/components/ListingCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ErrorBanner from '@/components/ui/ErrorBanner';
import PageLoader from '@/components/ui/PageLoader';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, TrendingUp, Leaf, ShoppingBag, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function HomeContent() {
  const { ready } = useSession();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [category, setCategory] = useState('all');
  const [scrollPosition, setScrollPosition] = useState(0);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch('/products/categories')
  });

  const listingsQuery = useQuery({
    queryKey: ['listings-feed', category],
    queryFn: () => apiFetch(`/listings/feed${category === 'all' ? '' : `?category=${encodeURIComponent(category)}`}`),
    enabled: ready
  });

  const categories = useMemo(() => ['all', ...(categoriesQuery.data || [])], [categoriesQuery.data]);
  
  // Get hot deals (first 12 products for image carousel)
  const hotDeals = useMemo(() => {
    if (!listingsQuery.data) return [];
    return listingsQuery.data.slice(0, 12);
  }, [listingsQuery.data]);

  // Filter listings based on search query
  const filteredListings = useMemo(() => {
    if (!listingsQuery.data) return [];
    if (!searchQuery) return listingsQuery.data;
    
    const query = searchQuery.toLowerCase();
    return listingsQuery.data.filter((listing) => {
      const productName = listing.productId?.name?.toLowerCase() || '';
      const productDesc = listing.productId?.description?.toLowerCase() || '';
      const productCategory = listing.productId?.category?.toLowerCase() || '';
      return productName.includes(query) || productDesc.includes(query) || productCategory.includes(query);
    });
  }, [listingsQuery.data, searchQuery]);

  const scrollHotDeals = (direction) => {
    const container = document.getElementById('hot-deals-scroll');
    if (container) {
      const scrollAmount = 320;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (!ready || listingsQuery.isLoading) return <PageLoader label="Loading marketplace..." />;
  if (listingsQuery.error) return <ErrorBanner message={listingsQuery.error.message} />;

  return (
    <div className="space-y-8">
      {/* Compact Hero with Hot Deals */}
      <div className="relative overflow-hidden rounded-3xl gradient-harvest shadow-lg">
        <div className="grid md:grid-cols-2 gap-6 p-8">
          {/* Left: Hero Content */}
          <div className="flex flex-col justify-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 w-fit">
              <Flame size={18} className="text-orange-300" />
              <span className="text-sm font-bold">HOT DEALS TODAY</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fresh Farm Products
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Direct from farmers to your doorstep. Browse today's featured deals!
            </p>
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => scrollHotDeals('left')}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scrollHotDeals('right')}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Right: Hot Deals Images */}
          <div className="relative">
            <div 
              id="hot-deals-scroll"
              className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              {hotDeals.map((listing) => (
                <Link 
                  key={listing._id} 
                  href={`/product/${listing._id}`}
                  className="flex-shrink-0 w-48 h-48 snap-start group relative rounded-2xl overflow-hidden"
                >
                  <Image 
                    src={listing.productId?.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'} 
                    alt={listing.productId?.name}
                    fill
                    sizes="192px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-semibold text-sm line-clamp-1">{listing.productId?.name}</p>
                    <p className="text-xs text-white/90">₹{listing.price}/{listing.unit}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mb-3">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-2xl font-bold text-[color:var(--text)] mb-1">{listingsQuery.data.length}+</h3>
          <p className="text-sm text-[color:var(--text-muted)]">Active Listings</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-3">
            <Leaf size={24} />
          </div>
          <h3 className="text-2xl font-bold text-[color:var(--text)] mb-1">100%</h3>
          <p className="text-sm text-[color:var(--text-muted)]">Organic & Fresh</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600 mb-3">
            <Sparkles size={24} />
          </div>
          <h3 className="text-2xl font-bold text-[color:var(--text)] mb-1">500+</h3>
          <p className="text-sm text-[color:var(--text-muted)]">Happy Customers</p>
        </Card>
      </div>

      {/* Category Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[color:var(--text)]">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Products'}
            </h2>
            <p className="text-[color:var(--text-muted)] mt-1">
              {searchQuery 
                ? `Found ${filteredListings.length} ${filteredListings.length === 1 ? 'product' : 'products'}`
                : 'Select a category to filter results'
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <Button
                key={item}
                variant={item === category ? 'primary' : 'outline'}
                size="md"
                className="capitalize"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[color:var(--text)] mb-2">
                {searchQuery ? 'No products found' : 'No listings found'}
              </h3>
              <p className="text-sm text-[color:var(--text-muted)]">
                {searchQuery 
                  ? 'Try searching with different keywords or browse all products.'
                  : 'Try selecting a different category or check back later for new products.'
                }
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
