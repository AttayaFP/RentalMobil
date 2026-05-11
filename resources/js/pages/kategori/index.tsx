import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { Plus, Tag, Edit, Trash2, Info } from 'lucide-react';

interface Kategori {
    kdkategori: string;
    nama_kategori: string;
}

interface Props {
    kategoris: Kategori[];
    filters: {
        search?: string;
        date?: string;
    };
}

export default function Index({ kategoris, filters }: Props) {
    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Hapus Kategori?',
            text: "Kategori yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3b82f6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/kategori/${id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Kategori telah dihapus.',
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
        <AdminLayout title="Kategori Mobil">
            <div className="row">
                <div className="col-lg-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="card shadow-sm border-0 overflow-hidden" 
                        style={{ borderRadius: '15px' }}
                    >
                        <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="font-weight-bold mb-1 text-dark">
                                    <Tag className="inline-block mr-2 text-primary" size={24} /> Pengaturan Kategori
                                </h5>
                                <p className="text-muted small mb-0">Kelola kategori jenis mobil</p>
                            </div>
                            <button onClick={() => forceNavigate('/kategori/create')} className="btn btn-primary px-3 py-2 d-flex align-items-center gap-2" style={{ borderRadius: '10px' }}>
                                <Plus size={18} /> Tambah
                            </button>
                        </div>

                        <div className="px-4 pb-2">
                            <SearchFilter routeName="/kategori" placeholder="Cari kode atau nama kategori..." filters={filters} showDate={false} />
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold" style={{ width: '150px' }}>Kode</th>
                                        <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Nama Kategori</th>
                                        <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold text-right" style={{ width: '150px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kategoris.map((k) => (
                                        <tr key={k.kdkategori}>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                                                    {k.kdkategori}
                                                </span>
                                            </td>
                                            <td className="py-4 font-weight-bold text-dark">{k.nama_kategori}</td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => forceNavigate(`/kategori/${k.kdkategori}/edit`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(k.kdkategori)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
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
                </div>
                
                <div className="col-lg-4 mt-4 mt-lg-0">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="card shadow-sm border-0 p-4 bg-primary text-white" 
                        style={{ borderRadius: '15px' }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={20} />
                            <h6 className="font-weight-bold mb-0">Informasi Kategori</h6>
                        </div>
                        <p className="small mb-0 opacity-90 leading-relaxed">
                            Gunakan kategori untuk mempermudah pelanggan mencari mobil yang sesuai dengan kebutuhan mereka.
                            <br /><br />
                            Contoh: 
                            <ul className="pl-4 mt-2 list-disc opacity-80">
                                <li>MPV: Cocok untuk keluarga</li>
                                <li>Sedan: Untuk kenyamanan & gaya</li>
                                <li>SUV: Untuk medan berat</li>
                            </ul>
                        </p>
                    </motion.div>
                </div>
            </div>
        </AdminLayout>
    );
}
