import AdminLayout from '@/layouts/AdminLayout';

interface Booking {
    kdbooking: string;
    nama_pelanggan: string;
    nama_mobil: string;
    waktu_order: string;
    tglmulai: string;
    tglselesai: string;
    status: string;
    payment_type: string;
    total_bayar: number;
}

interface Props {
    bookings: Booking[];
}

export default function BookingReport({ bookings }: Props) {
    const handlePrint = () => window.print();
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AdminLayout title="Rekapitulasi Pemesanan">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center print:hidden">
                    <h5 className="font-weight-bold mb-0 text-dark">
                        <i className="ion-ios-journal mr-2 text-primary"></i> Riwayat Pemesanan
                    </h5>
                    <button onClick={handlePrint} className="btn btn-dark px-4" style={{ borderRadius: '8px' }}>
                        <i className="ion-ios-printer mr-2"></i> Cetak Dokumen
                    </button>
                </div>

                <div className="card-body p-3 p-md-4 bg-white">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Laporan Detil Seluruh Transaksi Booking Mobil</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>

                    <div className="table-responsive shadow-none overflow-visible">
                        <table className="table table-striped table-hover table-sm w-100" style={{ fontSize: '8px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-2 px-1 border-0 text-center">NO</th>
                                    <th className="py-2 px-1 border-0">KODE BOOKING</th>
                                    <th className="py-2 px-1 border-0">PELANGGAN</th>
                                    <th className="py-2 px-1 border-0">MOBIL</th>
                                    <th className="py-2 px-1 border-0 text-center">LAMA</th>
                                    <th className="py-2 px-1 border-0 text-center">TGL MULAI</th>
                                    <th className="py-2 px-1 border-0 text-center">TGL SELESAI</th>
                                    <th className="py-2 px-1 border-0 text-center">METODE</th>
                                    <th className="py-2 px-1 border-0 text-center">STATUS</th>
                                    <th className="py-2 px-1 border-0 text-right">TOTAL BAYAR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? bookings.map((b, index) => (
                                    <tr key={b.kdbooking}>
                                        <td className="py-2 px-1 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-2 px-1 font-weight-bold text-primary" style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{b.kdbooking}</td>
                                        <td className="py-2 px-1" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{b.nama_pelanggan}</td>
                                        <td className="py-2 px-1" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{b.nama_mobil}</td>
                                        <td className="py-2 px-1 text-center font-weight-bold">{b.waktu_order}H</td>
                                        <td className="py-2 px-1 text-center text-muted" style={{ whiteSpace: 'normal' }}>{b.tglmulai}</td>
                                        <td className="py-2 px-1 text-center text-muted" style={{ whiteSpace: 'normal' }}>{b.tglselesai}</td>
                                        <td className="py-2 px-1 text-center" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{b.payment_type || 'Manual'}</td>
                                        <td className="py-2 px-1 text-center">
                                            <span className={`small font-weight-bold text-uppercase ${b.status === 'Selesai' ? 'text-success' : 'text-warning'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-1 text-right font-weight-bold text-dark">{formatCurrency(b.total_bayar)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={10} className="text-center py-5 text-muted italic">Data pemesanan belum tersedia.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Dokumen Keuangan - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
