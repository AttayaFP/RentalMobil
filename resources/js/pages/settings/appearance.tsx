import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';

export default function Appearance() {
    return (
        <AdminLayout title="Preferensi Tampilan">
            <Head title="Pengaturan Tampilan" />
            
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                        <div className="mb-4">
                            <h4 className="font-weight-bold mb-1">Tema Aplikasi</h4>
                            <p className="text-muted small">Pilih tema yang paling nyaman untuk mata Anda saat mengelola operasional rental.</p>
                        </div>

                        <div className="p-4 bg-light rounded" style={{ borderRadius: '12px' }}>
                            <AppearanceTabs />
                        </div>
                        
                        <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(249, 109, 0, 0.05)', fontSize: '13px' }}>
                            <i className="ion-ios-information-circle mr-2 text-primary"></i> Pengaturan ini akan disimpan secara lokal di browser Anda.
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
