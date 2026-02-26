"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { authStorage } from '@/lib/auth';
import { useSession } from '@/lib/useSession';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorBanner from '@/components/ui/ErrorBanner';
import PageLoader from '@/components/ui/PageLoader';

const profileSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional()
});

export default function ProfilePage() {
  const { user, ready } = useSession();
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({ queryKey: ['dashboard'], queryFn: () => apiFetch('/users/dashboard'), enabled: ready });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', address: '' }
  });

  useEffect(() => {
    if (dashboardQuery.data?.user) {
      form.reset({
        name: dashboardQuery.data.user.name || '',
        address: dashboardQuery.data.user.address || ''
      });
    }
  }, [dashboardQuery.data, form]);

  const updateMutation = useMutation({
    mutationFn: (values) => apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(values) }),
    onSuccess: (updatedUser) => {
      authStorage.setSession({ token: authStorage.getToken(), user: updatedUser });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  if (!ready || dashboardQuery.isLoading) return <PageLoader label="Loading profile..." />;
  if (dashboardQuery.error) return <ErrorBanner message={dashboardQuery.error.message} />;

  const stats = dashboardQuery.data.stats;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="p-6 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <Badge tone="info">{user?.role}</Badge>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}>
          <Input label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
          <Input label="Email" value={dashboardQuery.data.user.email} disabled />
          <Input label="Address" error={form.formState.errors.address?.message} {...form.register('address')} />
          <Button type="submit" disabled={updateMutation.isPending}>Save Changes</Button>
          <ErrorBanner message={updateMutation.error?.message} />
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold">Dashboard Summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          <p className="flex justify-between"><span>Total Orders</span><strong>{stats.totalOrders}</strong></p>
          <p className="flex justify-between"><span>Requested</span><strong>{stats.requestedOrders}</strong></p>
          <p className="flex justify-between"><span>Completed</span><strong>{stats.completedOrders}</strong></p>
          {user?.role === 'farmer' ? <p className="flex justify-between"><span>Active Listings</span><strong>{stats.activeListings}</strong></p> : null}
        </div>
      </Card>
    </div>
  );
}
