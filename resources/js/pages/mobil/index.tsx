import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';

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
}

export default function Index({ mobils }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus mobil ini?')) {
            router.delete(`/mobil/${id}`);
        }
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AdminLayout title="Manajemen Mobil">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="font-weight-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>
                        <i className="ion-ios-car mr-2 text-primary"></i> Daftar Mobil
                    </h5>
                    <button onClick={() => forceNavigate('/mobil/create')} className="btn btn-primary px-4 py-2" style={{ borderRadius: '8px', fontWeight: 600 }}>
                        <i className="ion-ios-add-circle mr-2"></i> Tambah Mobil
                    </button>
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
                                            <div className="mr-3" style={{ width: '80px', height: '50px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#eee' }}>
                                                {mobil.foto ? (
                                                    <img src={`/storage/${mobil.foto}`} alt={mobil.nama_mobil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="h-100 d-flex align-items-center justify-content-center">
                                                        <i className="ion-ios-image text-muted"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-weight-bold text-dark mb-0" style={{ fontSize: '15px' }}>{mobil.nama_mobil}</div>
                                                <small className="text-muted">{mobil.kdmobil} • {mobil.kdkategori}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="d-flex flex-column">
                                            <span className="badge badge-light text-dark py-1 px-2 mb-1" style={{ width: 'fit-content', border: '1px solid #ddd' }}>
                                                <i className="ion-ios-pricetag mr-1"></i> {mobil.plat_mobil}
                                            </span>
                                            <small className="text-muted">{mobil.warna_mobil} • {mobil.thn_mobil}</small>
                                        </div>
                                    </td>
                                    <td className="py-4 font-weight-bold text-primary" style={{ fontSize: '16px' }}>
                                        {formatCurrency(mobil.harga)}
                                        <span className="text-muted small font-weight-normal"> /hari</span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`badge px-3 py-2`} style={{ 
                                            borderRadius: '20px', 
                                            backgroundColor: mobil.status === 'Tersedia' ? '#e1f7ec' : mobil.status === 'Disewa' ? '#ffe8e8' : '#fff4e5',
                                            color: mobil.status === 'Tersedia' ? '#0d8a4f' : mobil.status === 'Disewa' ? '#e53e3e' : '#d69e2e',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            {mobil.status || 'Tersedia'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button onClick={() => forceNavigate(`/mobil/${mobil.kdmobil}/edit`)} className="btn btn-sm btn-outline-info mr-2" style={{ borderRadius: '5px' }}>
                                            <i className="ion-ios-create"></i> Edit
                                        </button>
                                        <button onClick={() => handleDelete(mobil.kdmobil)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: '5px' }}>
                                            <i className="ion-ios-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
