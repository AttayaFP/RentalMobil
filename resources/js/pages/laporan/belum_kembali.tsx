import AdminLayout from '@/layouts/AdminLayout';

interface Booking {
    kdbooking: string;
    nama_mobil: string;
    plat_mobil: string;
    tglmulai: string;
    status: string;
}

interface Props {
    bookings: Booking[];
}

export default function BelumKembaliReport({ bookings }: Props) {
    const handlePrint = () => window.print();

    return (
        <AdminLayout title="Monitoring Mobil Keluar">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center print:hidden">
                    <h5 className="font-weight-bold mb-0 text-dark">
                        <i className="ion-ios-timer mr-2 text-primary"></i> Mobil Belum Kembali
                    </h5>
                    <button onClick={handlePrint} className="btn btn-dark px-4" style={{ borderRadius: '8px' }}>
                        <i className="ion-ios-printer mr-2"></i> Cetak Laporan
                    </button>
                </div>

                <div className="card-body p-3 p-md-4 bg-white">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Laporan Daftar Mobil Yang Masih Dalam Masa Sewa</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>

                    <div className="table-responsive shadow-none overflow-visible">
                        <table className="table table-striped table-hover table-sm w-100" style={{ fontSize: '8px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-2 px-1 border-0 text-center">NO</th>
                                    <th className="py-2 px-1 border-0">KODE RENTAL</th>
                                    <th className="py-2 px-1 border-0">PELANGGAN</th>
                                    <th className="py-2 px-1 border-0">MOBIL</th>
                                    <th className="py-2 px-1 border-0 text-center">PLAT</th>
                                    <th className="py-2 px-1 border-0 text-center">MULAI</th>
                                    <th className="py-2 px-1 border-0 text-center">JATUH TEMPO</th>
                                    <th className="py-2 px-1 border-0 text-center">LAMA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? bookings.map((b, index) => (
                                    <tr key={b.kdbooking}>
                                        <td className="py-2 px-1 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-2 px-1 font-weight-bold text-primary" style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{b.koderental}</td>
                                        <td className="py-2 px-1 font-weight-bold" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{b.nama_pelanggan}</td>
                                        <td className="py-2 px-1" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{b.nama_mobil}</td>
                                        <td className="py-2 px-1 text-center"><code>{b.plat_mobil}</code></td>
                                        <td className="py-2 px-1 text-center text-muted">{b.tglmulai}</td>
                                        <td className="py-2 px-1 text-center text-danger font-weight-bold">{b.tglselesai}</td>
                                        <td className="py-2 px-1 text-center font-weight-bold text-dark">{b.waktu_order}H</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-5 text-muted italic">
                                            <i className="ion-ios-checkmark-circle mr-2" style={{ fontSize: '20px' }}></i>
                                            Alhamdulillah, seluruh mobil sudah dikembalikan tepat waktu.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Dokumen Monitoring Otomatis - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
