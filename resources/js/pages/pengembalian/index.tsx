import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { RefreshCcw, Plus, Calendar, Receipt, User, AlertCircle, Edit, Trash2, CheckCircle2 } from 'lucide-react';

interface Pengembalian {
    kdpengembalian: string;
    kdbooking: string;
    iduser: number;
    tglpengembalian: string;
    keterlambatan: number;
    denda: number;
    user?: { nama_lengkap: string };
}

interface Props {
    pengembalians: Pengembalian[];
    filters: {
        search?: string;
        date?: string;
    };
}

export default function Index({ pengembalians, filters }: Props) {
    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Hapus Data Pengembalian?',
            text: "Status booking dan ketersediaan mobil akan dikembalikan otomatis!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3b82f6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/pengembalian/${id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Data Dihapus!',
                            text: 'Riwayat pengembalian berhasil dihapus dan status mobil telah diperbarui.',
                            icon: 'success',
                            confirmButtonColor: '#f96d00'
                        });
                    }
                });
            }
        });
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AdminLayout title="Kelola Pengembalian">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card shadow-sm border-0 overflow-hidden" 
                style={{ borderRadius: '15px' }}
            >
                <div className="card-header bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                        <h5 className="font-weight-bold mb-1 text-dark">
                            <RefreshCcw className="inline-block mr-2 text-primary" size={24} /> Data Pengembalian Mobil
                        </h5>
                        <p className="text-muted small mb-0">Kelola pengembalian unit dan denda</p>
                    </div>
                    <button onClick={() => forceNavigate('/pengembalian/create')} className="btn btn-primary px-4 py-2 mt-3 mt-md-0 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <Plus size={18} /> Input Pengembalian
                    </button>
                </div>

                <div className="px-4 pb-2">
                    <SearchFilter routeName="/pengembalian" placeholder="Cari kode kembali, booking, atau nama..." filters={filters} />
                </div>

                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold">Kode Kembali</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Ref. Booking</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Tgl Kembali</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Keterlambatan</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Denda</th>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pengembalians && pengembalians.length > 0 ? pengembalians.map((p) => (
                                <tr key={p.kdpengembalian}>
                                    <td className="px-4 py-4 font-weight-bold text-dark">
                                        <span className="flex items-center gap-2">
                                            <Receipt size={16} className="text-muted" /> {p.kdpengembalian}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="font-weight-bold text-primary mb-0">{p.kdbooking}</div>
                                        <small className="text-muted flex items-center gap-1">
                                            <User size={12} /> {p.user?.nama_lengkap || `ID: #${p.iduser}`}
                                        </small>
                                    </td>
                                    <td className="py-4 text-muted">
                                        <span className="flex items-center gap-1 text-sm">
                                            <Calendar size={14} /> {p.tglpengembalian}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`} style={{ 
                                            backgroundColor: p.keterlambatan > 0 ? '#fef2f2' : '#ecfdf5',
                                            color: p.keterlambatan > 0 ? '#dc2626' : '#059669',
                                            border: '1px solid currentColor'
                                        }}>
                                            {p.keterlambatan > 0 ? <AlertCircle size={10} className="mr-1" /> : <CheckCircle2 size={10} className="mr-1" />}
                                            {p.keterlambatan} Hari
                                        </span>
                                    </td>
                                    <td className="py-4 font-weight-bold" style={{ fontSize: '15px', color: p.denda > 0 ? '#dc2626' : '#059669' }}>
                                        {p.denda > 0 ? formatCurrency(p.denda) : 'Gratis / Tepat Waktu'}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => forceNavigate(`/pengembalian/${p.kdpengembalian}/edit`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(p.kdpengembalian)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">
                                        <div className="flex flex-column items-center gap-2">
                                            <RefreshCcw size={40} className="opacity-20" />
                                            <span>Belum ada data pengembalian.</span>
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
