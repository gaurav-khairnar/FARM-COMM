"use client";

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/useSession';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ErrorBanner from '@/components/ui/ErrorBanner';
import PageLoader from '@/components/ui/PageLoader';

const listingSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Others']),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
  unit: z.enum(['kg', 'litre', 'dozen']),
  expiryDate: z.string().min(1)
});

export default function SellPage() {
  const { ready } = useSession({ requiredRole: 'farmer' });
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);

  const form = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Vegetables',
      price: 1,
      quantity: 1,
      unit: 'kg',
      expiryDate: ''
    }
  });

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: () => apiFetch('/products/categories'), enabled: ready });
  const myListingsQuery = useQuery({ queryKey: ['my-listings'], queryFn: () => apiFetch('/listings/my'), enabled: ready });

  const previewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  const createMutation = useMutation({
    mutationFn: async (values) => {
      let imageUrls = [];

      if (files.length) {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        const uploadRes = await apiFetch('/products/upload', {
          method: 'POST',
          body: formData
        });
        imageUrls = uploadRes.imageUrls || [];
      }

      const product = await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          category: values.category,
          images: imageUrls
        })
      });

      return apiFetch('/listings', {
        method: 'POST',
        body: JSON.stringify({
          productId: product._id,
          price: values.price,
          quantity: values.quantity,
          unit: values.unit,
          expiryDate: values.expiryDate
        })
      });
    },
    onSuccess: () => {
      form.reset();
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listings-feed'] });
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: (id) => apiFetch(`/listings/${id}/deactivate`, { method: 'PATCH' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-listings'] })
  });

  if (!ready) return <PageLoader label="Loading seller workspace..." />;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="p-6 lg:col-span-2">
        <h1 className="text-2xl font-semibold">Create New Listing</h1>
        <form className="mt-4 space-y-3" onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}>
          <Input label="Product name" error={form.formState.errors.name?.message} {...form.register('name')} />
          <Input label="Description" error={form.formState.errors.description?.message} {...form.register('description')} />
          <Select label="Category" error={form.formState.errors.category?.message} {...form.register('category')}>
            {(categoriesQuery.data || []).map((category) => <option key={category} value={category}>{category}</option>)}
          </Select>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Product images (up to 5)</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
              className="w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2.5 text-sm"
            />
          </label>

          {previewUrls.length ? (
            <div className="grid grid-cols-5 gap-2">
              {previewUrls.map((url, idx) => (
                <img key={`${url}-${idx}`} src={url} alt={`Upload preview ${idx + 1}`} className="h-16 w-full rounded-lg object-cover" />
              ))}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <Input label="Price" type="number" error={form.formState.errors.price?.message} {...form.register('price')} />
            <Input label="Quantity" type="number" error={form.formState.errors.quantity?.message} {...form.register('quantity')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Unit" error={form.formState.errors.unit?.message} {...form.register('unit')}>
              <option value="kg">kg</option>
              <option value="litre">litre</option>
              <option value="dozen">dozen</option>
            </Select>
            <Input label="Expiry date" type="date" error={form.formState.errors.expiryDate?.message} {...form.register('expiryDate')} />
          </div>
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>Publish listing</Button>
          <ErrorBanner message={createMutation.error?.message} />
        </form>
      </Card>

      <Card className="p-6 lg:col-span-3">
        <h2 className="text-xl font-semibold">Your Listings</h2>
        <div className="mt-4 space-y-3">
          {(myListingsQuery.data || []).length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">No listings yet. Add your first product listing.</p>
          ) : (
            myListingsQuery.data.map((listing) => (
              <div key={listing._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color:var(--line)] p-3">
                <div>
                  <p className="font-semibold">{listing.productId?.name}</p>
                  <p className="text-sm text-[color:var(--muted)]">Rs {listing.price} / {listing.unit} | Qty {listing.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={listing.isActive ? 'success' : 'neutral'}>{listing.isActive ? 'Active' : 'Inactive'}</Badge>
                  {listing.isActive ? (
                    <Button variant="secondary" onClick={() => deactivateMutation.mutate(listing._id)}>Deactivate</Button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
