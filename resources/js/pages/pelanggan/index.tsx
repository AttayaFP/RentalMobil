import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { UserPlus, Users, Edit, Trash2, Mail, Phone, MapPin, User as UserIcon } from 'lucide-react';

interface Pelanggan {
    id: number;
    nama_lengkap: string;
    username: string;
    email: string;
    jenis_kelamin: string;
    nohp: string;
    alamat: string;
    role: string;
    foto?: string;
}

interface Props {
    pelanggans: Pelanggan[];
    filters: {
        search?: string;
        date?: string;
    };
}

export default function Index({ pelanggans, filters }: Props) {
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus Pelanggan?',
            text: "Data akun pelanggan ini akan dihapus permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3b82f6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/pelanggan/${id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Pelanggan berhasil dihapus.',
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

    return (
        <AdminLayout title="Manajemen Pengguna">
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
                            <Users className="inline-block mr-2 text-primary" size={24} /> Daftar Pengguna & Pelanggan
                        </h5>
                        <p className="text-muted small mb-0">Kelola akses dan data pelanggan</p>
                    </div>
                    <button onClick={() => forceNavigate('/pelanggan/create')} className="btn btn-primary px-4 py-2 mt-3 mt-md-0 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <UserPlus size={18} /> Tambah Baru
                    </button>
                </div>

                <div className="px-4 pb-2">
                    <SearchFilter routeName="/pelanggan" placeholder="Cari nama, email, atau username..." filters={filters} showDate={false} />
                </div>

                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold">Informasi User</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Username</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Kontak</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Alamat</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Role</th>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pelanggans.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-4 py-4">
                                        <div className="d-flex align-items-center">
                                            <div className="mr-3 shadow-sm flex items-center justify-content-center text-white overflow-hidden" 
                                                 style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: p.role === 'admin' ? '#ef4444' : '#3b82f6', fontWeight: 600 }}>
                                                {p.foto ? (
                                                    <img src={`/storage/${p.foto}`} alt={p.nama_lengkap} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <UserIcon size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-weight-bold text-dark mb-0">{p.nama_lengkap}</div>
                                                <small className="text-muted">{p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-mono font-bold">
                                            @{p.username}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex flex-column gap-1">
                                            <small className="text-muted flex items-center gap-1"><Mail size={12} /> {p.email}</small>
                                            <small className="text-muted flex items-center gap-1"><Phone size={12} /> {p.nohp || '-'}</small>
                                        </div>
                                    </td>
                                    <td className="py-4 small text-muted" style={{ maxWidth: '200px' }}>
                                        <div className="flex items-start gap-1">
                                            <MapPin size={12} className="mt-1 flex-shrink-0" />
                                            <span>{p.alamat}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`} style={{ 
                                            backgroundColor: p.role === 'admin' ? '#fef2f2' : p.role === 'pelanggan' ? '#ecfdf5' : '#f0f9ff',
                                            color: p.role === 'admin' ? '#dc2626' : p.role === 'pelanggan' ? '#059669' : '#0284c7',
                                            border: '1px solid currentColor'
                                        }}>
                                            {p.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => forceNavigate(`/pelanggan/${p.id}/edit`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
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
