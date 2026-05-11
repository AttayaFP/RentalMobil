import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

interface Booking {
    kdbooking: string;
    tglbooking: string;
    iduser: number;
    kdmobil: string;
    total_bayar: number;
    status: string;
}

interface Props {
    bookings: Booking[];
}

export default function Index({ bookings }: Props) {
    const { flash } = usePage<any>().props;

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusStyle = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('selesai') || s.includes('sukses')) return { bg: '#e1f7ec', text: '#0d8a4f' };
        if (s.includes('pending') || s.includes('proses')) return { bg: '#fff4e5', text: '#d69e2e' };
        if (s.includes('gagal') || s.includes('batal')) return { bg: '#ffe8e8', text: '#e53e3e' };
        return { bg: '#f0f2f5', text: '#4a5568' };
    };

    return (
        <AdminLayout title="Kelola Pemesanan">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="font-weight-bold mb-0 text-dark">
                        <i className="ion-ios-list-box mr-2 text-primary"></i> Riwayat Pemesanan Mobil
                    </h5>
                    <button onClick={() => forceNavigate('/booking/create')} className="btn btn-primary px-4 py-2" style={{ borderRadius: '8px', fontWeight: 600 }}>
                        <i className="ion-ios-add-circle mr-2"></i> Buat Booking
                    </button>
                </div>

                {flash?.success && (
                    <div className="mx-4 alert alert-success border-0 shadow-sm mb-4" style={{ borderRadius: '10px' }}>
                        <i className="ion-ios-checkmark-circle mr-2"></i> {flash.success}
                    </div>
                )}

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
                                            <div className="font-weight-bold text-primary mb-0">{b.kdbooking}</div>
                                            <small className="text-muted"><i className="ion-ios-calendar mr-1"></i> {b.tglbooking}</small>
                                        </td>
                                        <td className="py-4">
                                            <div className="d-flex flex-column">
                                                <div className="text-dark font-weight-bold mb-0">Mobil: {b.kdmobil}</div>
                                                <small className="text-muted">User ID: #{b.iduser}</small>
                                            </div>
                                        </td>
                                        <td className="py-4 font-weight-bold" style={{ fontSize: '16px', color: '#2d3748' }}>
                                            {formatCurrency(b.total_bayar)}
                                        </td>
                                        <td className="py-4">
                                            <span className={`badge px-3 py-2 text-uppercase`} style={{ 
                                                borderRadius: '20px', 
                                                backgroundColor: style.bg,
                                                color: style.text,
                                                fontSize: '10px',
                                                fontWeight: 800
                                            }}>
                                                {b.status || 'PROSES'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button onClick={() => forceNavigate(`/booking/${b.kdbooking}`)} className="btn btn-sm btn-info px-3" style={{ borderRadius: '5px' }}>
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">Belum ada data pemesanan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
