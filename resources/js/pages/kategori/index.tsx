import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';

interface Kategori {
    kdkategori: string;
    nama_kategori: string;
}

interface Props {
    kategoris: Kategori[];
}

export default function Index({ kategoris }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/kategori/${id}`);
        }
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    return (
        <AdminLayout title="Kategori Mobil">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="font-weight-bold mb-0 text-dark">
                                <i className="ion-ios-pricetags mr-2 text-primary"></i> Pengaturan Kategori
                            </h5>
                            <button onClick={() => forceNavigate('/kategori/create')} className="btn btn-primary px-3 py-2" style={{ borderRadius: '8px' }}>
                                <i className="ion-ios-add-circle mr-1"></i> Tambah
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold" width="150">Kode</th>
                                        <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Nama Kategori</th>
                                        <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold text-right" width="150">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kategoris.map((k) => (
                                        <tr key={k.kdkategori}>
                                            <td className="px-4 py-4">
                                                <span className="badge badge-light px-3 py-2 text-primary font-weight-bold" style={{ borderRadius: '5px', fontSize: '13px' }}>
                                                    {k.kdkategori}
                                                </span>
                                            </td>
                                            <td className="py-4 font-weight-bold text-dark">{k.nama_kategori}</td>
                                            <td className="px-4 py-4 text-right">
                                                <button onClick={() => forceNavigate(`/kategori/${k.kdkategori}/edit`)} className="btn btn-sm btn-outline-info mr-2" style={{ borderRadius: '5px' }}>
                                                    <i className="ion-ios-create"></i>
                                                </button>
                                                <button onClick={() => handleDelete(k.kdkategori)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: '5px' }}>
                                                    <i className="ion-ios-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 mt-4 mt-lg-0">
                    <div className="card shadow-sm border-0 p-4 bg-primary text-white" style={{ borderRadius: '15px' }}>
                        <h6 className="font-weight-bold mb-3">Informasi Kategori</h6>
                        <p className="small mb-0 opacity-75">Gunakan kategori untuk mempermudah pelanggan mencari mobil yang sesuai dengan kebutuhan mereka, seperti MPV untuk keluarga atau Sedan untuk kenyamanan ekstra.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
