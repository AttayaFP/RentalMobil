import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';

interface BookingLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

function MinimalBookingLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-background">
            {title && <Head title={title} />}
            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
            <Toaster />
        </div>
    );
}

export default function BookingLayout({ children, breadcrumbs, title }: BookingLayoutProps) {
    const { auth } = usePage<{ auth: { user: { role: string } | null } }>().props;
    const role = auth?.user?.role;

    if (role === 'admin' || role === 'pimpinan') {
        return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
    }

    return <MinimalBookingLayout title={title}>{children}</MinimalBookingLayout>;
}
