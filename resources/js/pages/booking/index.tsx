import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { ListChecks, Plus, Calendar, User, Car, ExternalLink, ReceiptText } from 'lucide-react';

interface Booking {
    kdbooking: string;
    tglbooking: string;
    iduser: number;
    kdmobil: string;
    total_bayar: number;
    status: string;
    user?: { nama_lengkap: string };
    mobil?: { nama_mobil: string };
}

interface Props {
    bookings: Booking[];
    filters: {
        search?: string;
        date?: string;
    };
}

export default function Index({ bookings, filters }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: 'Berhasil!',
                text: flash.success,
                icon: 'success',
                confirmButtonColor: '#f96d00'
            });
        }
        if (flash?.error) {
            Swal.fire({
                title: 'Gagal!',
                text: flash.error,
                icon: 'error',
                confirmButtonColor: '#f96d00'
            });
        }
    }, [flash]);

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusStyle = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('selesai') || s.includes('sukses')) return { bg: '#ecfdf5', text: '#059669', border: '#10b98120' };
        if (s.includes('pending') || s.includes('proses')) return { bg: '#fffbeb', text: '#d97706', border: '#f59e0b20' };
        if (s.includes('gagal') || s.includes('batal')) return { bg: '#fef2f2', text: '#dc2626', border: '#ef444420' };
        return { bg: '#f8fafc', text: '#64748b', border: '#94a3b820' };
    };

    return (
        <AdminLayout title="Kelola Pemesanan">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card shadow-sm border-0 overflow-hidden" 
                style={{ borderRadius: '15px' }}
            >
                <div className="card-header bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                        <h5 className="font-weight-bold mb-1 text-dark">
                            <ListChecks className="inline-block mr-2 text-primary" size={24} /> Riwayat Pemesanan Mobil
                        </h5>
                        <p className="text-muted small mb-0">Monitor semua transaksi penyewaan</p>
                    </div>
                    <button onClick={() => forceNavigate('/booking/create')} className="btn btn-primary px-4 py-2 mt-3 mt-md-0 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <Plus size={18} /> Buat Booking
                    </button>
                </div>

                <div className="px-4 pb-2">
                    <SearchFilter routeName="/booking" placeholder="Cari kode booking, nama pelanggan, atau mobil..." filters={filters} />
                </div>

                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold">Kode & Tanggal</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Informasi Sewa</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Total Pembayaran</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Status Pesanan</th>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings && bookings.length > 0 ? bookings.map((b) => {
                                const style = getStatusStyle(b.status);
                                return (
                                    <tr key={b.kdbooking}>
                                        <td className="px-4 py-4">
                                            <div className="font-weight-bold text-primary mb-1 flex items-center gap-2">
                                                <ReceiptText size={16} /> {b.kdbooking}
                                            </div>
                                            <small className="text-muted flex items-center gap-1">
                                                <Calendar size={12} /> {b.tglbooking}
                                            </small>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex flex-column gap-1">
                                                <div className="text-dark font-weight-bold mb-0 flex items-center gap-1">
                                                    <Car size={14} className="text-muted" /> {b.mobil?.nama_mobil || b.kdmobil}
                                                </div>
                                                <small className="text-muted flex items-center gap-1">
                                                    <User size={14} className="text-muted" /> {b.user?.nama_lengkap || `ID: #${b.iduser}`}
                                                </small>
                                            </div>
                                        </td>
                                        <td className="py-4 font-weight-bold" style={{ fontSize: '16px', color: '#1e293b' }}>
                                            {formatCurrency(b.total_bayar)}
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`} style={{ 
                                                backgroundColor: style.bg,
                                                color: style.text,
                                                border: `1px solid ${style.border}`
                                            }}>
                                                <span className="w-1 h-1 rounded-full mr-1.5" style={{ backgroundColor: 'currentColor' }}></span>
                                                {b.status || 'PROSES'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button onClick={() => forceNavigate(`/booking/${b.kdbooking}/invoice`)} className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 ml-auto" title="Detail">
                                                <ExternalLink size={18} />
                                                <span className="text-sm font-semibold">Invoice</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        <div className="flex flex-column items-center gap-2">
                                            <ListChecks size={40} className="opacity-20" />
                                            <span>Belum ada data pemesanan.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
