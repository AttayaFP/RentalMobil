import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { Plus, Car, Tag, Calendar, Info, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    stnk_mobil: string;
    harga: number;
    kdkategori: string;
    status: string;
    foto: string | null;
}

interface Props {
    mobils: Mobil[];
    filters: {
        search?: string;
        date?: string;
    };
}

export default function Index({ mobils, filters }: Props) {
    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Data mobil ini akan dihapus permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3b82f6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/mobil/${id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Data mobil berhasil dihapus.',
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
        <AdminLayout title="Manajemen Mobil">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card shadow-sm border-0 overflow-hidden" 
                style={{ borderRadius: '15px' }}
            >
                <div className="card-header bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                        <h5 className="font-weight-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>
                            <Car className="inline-block mr-2 text-primary" size={24} /> Daftar Mobil
                        </h5>
                        <p className="text-muted small mb-0">Kelola armada rental mobil Anda</p>
                    </div>
                    <button onClick={() => forceNavigate('/mobil/create')} className="btn btn-primary px-4 py-2 mt-3 mt-md-0 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <Plus size={18} /> Tambah Mobil
                    </button>
                </div>

                <div className="px-4 pb-2">
                    <SearchFilter routeName="/mobil" placeholder="Cari kode, nama, atau plat..." filters={filters} showDate={false} />
                </div>

                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold">Info Mobil</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Spesifikasi</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Harga Sewa</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Status</th>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mobils.map((mobil) => (
                                <tr key={mobil.kdmobil}>
                                    <td className="px-4 py-4">
                                        <div className="d-flex align-items-center">
                                            <div className="mr-3 shadow-sm border" style={{ width: '80px', height: '50px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                                                {mobil.foto ? (
                                                    <img src={`/storage/${mobil.foto}`} alt={mobil.nama_mobil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="h-100 d-flex align-items-center justify-content-center text-gray-300">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-weight-bold text-dark mb-0" style={{ fontSize: '15px' }}>{mobil.nama_mobil}</div>
                                                <small className="text-muted flex items-center gap-1">
                                                    <Info size={12} /> {mobil.kdmobil} • {mobil.kdkategori}
                                                </small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="d-flex flex-column">
                                            <span className="badge badge-light text-dark py-1 px-2 mb-1 flex items-center gap-1" style={{ width: 'fit-content', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                                <Tag size={12} className="text-primary" /> {mobil.plat_mobil}
                                            </span>
                                            <small className="text-muted flex items-center gap-1">
                                                <Calendar size={12} /> {mobil.warna_mobil} • {mobil.thn_mobil}
                                            </small>
                                        </div>
                                    </td>
                                    <td className="py-4 font-weight-bold text-primary" style={{ fontSize: '16px' }}>
                                        {formatCurrency(mobil.harga)}
                                        <span className="text-muted small font-weight-normal"> /hari</span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`} style={{ 
                                            backgroundColor: mobil.status === 'Tersedia' ? '#ecfdf5' : mobil.status === 'Disewa' ? '#fef2f2' : '#fffbeb',
                                            color: mobil.status === 'Tersedia' ? '#059669' : mobil.status === 'Disewa' ? '#dc2626' : '#d97706',
                                            border: `1px solid ${mobil.status === 'Tersedia' ? '#10b98120' : mobil.status === 'Disewa' ? '#ef444420' : '#f59e0b20'}`
                                        }}>
                                            <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: 'currentColor' }}></span>
                                            {mobil.status || 'Tersedia'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => forceNavigate(`/mobil/${mobil.kdmobil}/edit`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(mobil.kdmobil)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Hapus">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
