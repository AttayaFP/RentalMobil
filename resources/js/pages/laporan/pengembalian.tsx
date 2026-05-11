import AdminLayout from '@/layouts/AdminLayout';

interface Pengembalian {
    kdpengembalian: string;
    nama_pelanggan: string;
    nama_mobil: string;
    plat_mobil: string;
    tglmulai: string;
    tglselesai: string;
    tglpengembalian: string;
    keterlambatan: string;
    denda: number;
}

interface Props {
    pengembalians: Pengembalian[];
}

export default function PengembalianReport({ pengembalians }: Props) {
    const handlePrint = () => window.print();
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AdminLayout title="Rekapitulasi Pengembalian">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center print:hidden">
                    <h5 className="font-weight-bold mb-0 text-dark">
                        <i className="ion-ios-undo mr-2 text-primary"></i> Laporan Serah Terima
                    </h5>
                    <button onClick={handlePrint} className="btn btn-dark px-4" style={{ borderRadius: '8px' }}>
                        <i className="ion-ios-printer mr-2"></i> Cetak Laporan
                    </button>
                </div>

                <div className="card-body p-3 p-md-4 bg-white">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Laporan Historis Pengembalian Mobil & Perhitungan Denda</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>

                    <div className="table-responsive shadow-none overflow-visible">
                        <table className="table table-striped table-hover table-sm w-100" style={{ fontSize: '8px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-2 px-1 border-0 text-center">NO</th>
                                    <th className="py-2 px-1 border-0">KODE PENGEMBALIAN</th>
                                    <th className="py-2 px-1 border-0">PELANGGAN</th>
                                    <th className="py-2 px-1 border-0">MOBIL</th>
                                    <th className="py-2 px-1 border-0 text-center">PLAT</th>
                                    <th className="py-2 px-1 border-0 text-center">TGL MULAI SEWA</th>
                                    <th className="py-2 px-1 border-0 text-center">TGL SELESAI SEWA</th>
                                    <th className="py-2 px-1 border-0 text-center">TGL KEMBALI</th>
                                    <th className="py-2 px-1 border-0 text-center">TELAT</th>
                                    <th className="py-2 px-1 border-0 text-right">DENDA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pengembalians.length > 0 ? pengembalians.map((p, index) => (
                                    <tr key={p.kdpengembalian}>
                                        <td className="py-2 px-1 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-2 px-1 font-weight-bold text-primary" style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{p.kdpengembalian}</td>
                                        <td className="py-2 px-1" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.nama_pelanggan}</td>
                                        <td className="py-2 px-1" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.nama_mobil}</td>
                                        <td className="py-2 px-1 text-center"><code>{p.plat_mobil}</code></td>
                                        <td className="py-2 px-1 text-center text-muted" style={{ whiteSpace: 'normal' }}>{p.tglmulai}</td>
                                        <td className="py-2 px-1 text-center text-muted" style={{ whiteSpace: 'normal' }}>{p.tglselesai}</td>
                                        <td className="py-2 px-1 text-center font-weight-bold text-dark" style={{ whiteSpace: 'normal' }}>{p.tglpengembalian}</td>
                                        <td className="py-2 px-1 text-center">
                                            <span className={`font-weight-bold ${parseInt(p.keterlambatan) > 0 ? 'text-danger' : 'text-success'}`}>
                                                {p.keterlambatan} Hari
                                            </span>
                                        </td>
                                        <td className="py-2 px-1 text-right font-weight-bold text-danger">{formatCurrency(p.denda)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={10} className="text-center py-5 text-muted italic">Data pengembalian belum tersedia.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Laporan Operasional Selesai - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
