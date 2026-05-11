import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';

interface Pengembalian {
    kdpengembalian: string;
    kdbooking: string;
    iduser: number;
    tglpengembalian: string;
    keterlambatan: number;
    denda: number;
}

interface Props {
    pengembalians: Pengembalian[];
}

export default function Index({ pengembalians }: Props) {
    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pengembalian ini?')) {
            router.delete(`/pengembalian/${id}`);
        }
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AdminLayout title="Kelola Pengembalian">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="font-weight-bold mb-0 text-dark">
                        <i className="ion-ios-refresh-circle mr-2 text-primary"></i> Data Pengembalian Mobil
                    </h5>
                    <button onClick={() => forceNavigate('/pengembalian/create')} className="btn btn-primary px-4 py-2" style={{ borderRadius: '8px', fontWeight: 600 }}>
                        <i className="ion-ios-add-circle mr-2"></i> Input Pengembalian
                    </button>
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
                                    <td className="px-4 py-4 font-weight-bold text-dark">{p.kdpengembalian}</td>
                                    <td className="py-4">
                                        <div className="font-weight-bold text-primary mb-0">{p.kdbooking}</div>
                                        <small className="text-muted">User: #{p.iduser}</small>
                                    </td>
                                    <td className="py-4 text-muted"><i className="ion-ios-calendar mr-1"></i> {p.tglpengembalian}</td>
                                    <td className="py-4">
                                        <span className={`badge px-3 py-2`} style={{ 
                                            borderRadius: '20px', 
                                            backgroundColor: p.keterlambatan > 0 ? '#ffe8e8' : '#e1f7ec',
                                            color: p.keterlambatan > 0 ? '#e53e3e' : '#0d8a4f',
                                            fontSize: '10px',
                                            fontWeight: 800
                                        }}>
                                            {p.keterlambatan} Hari
                                        </span>
                                    </td>
                                    <td className="py-4 font-weight-bold text-danger" style={{ fontSize: '15px' }}>
                                        {p.denda > 0 ? formatCurrency(p.denda) : 'Rp 0'}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button onClick={() => forceNavigate(`/pengembalian/${p.kdpengembalian}/edit`)} className="btn btn-sm btn-outline-info mr-2" style={{ borderRadius: '5px' }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(p.kdpengembalian)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: '5px' }}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">Belum ada data pengembalian.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
