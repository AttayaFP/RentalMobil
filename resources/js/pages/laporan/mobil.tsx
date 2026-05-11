import AdminLayout from '@/layouts/AdminLayout';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    stnk_mobil: string;
    harga: number;
    nama_kategori: string;
    status: string;
}

interface Props {
    mobils: Mobil[];
}

export default function MobilReport({ mobils }: Props) {
    const handlePrint = () => window.print();
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AdminLayout title="Inventaris Mobil">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center print:hidden">
                    <h5 className="font-weight-bold mb-0 text-dark">
                        <i className="ion-ios-car mr-2 text-primary"></i> Laporan Aset Kendaraan
                    </h5>
                    <button onClick={handlePrint} className="btn btn-dark px-4" style={{ borderRadius: '8px' }}>
                        <i className="ion-ios-printer mr-2"></i> Cetak Mobil
                    </button>
                </div>

                <div className="card-body p-3 p-md-4 bg-white">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Laporan Daftar Inventaris & Kondisi Seluruh Mobil</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>

                    <div className="table-responsive shadow-none overflow-visible">
                        <table className="table table-striped table-hover table-sm w-100" style={{ fontSize: '8px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-2 px-1 border-0 text-center">NO</th>
                                    <th className="py-2 px-1 border-0">KODE</th>
                                    <th className="py-2 px-1 border-0">NAMA UNIT</th>
                                    <th className="py-2 px-1 border-0">KATEGORI</th>
                                    <th className="py-2 px-1 border-0 text-center">THN</th>
                                    <th className="py-2 px-1 border-0">WARNA</th>
                                    <th className="py-2 px-1 border-0">STNK</th>
                                    <th className="py-2 px-1 border-0 text-center">PLAT</th>
                                    <th className="py-2 px-1 border-0 text-right">HARGA</th>
                                    <th className="py-2 px-1 border-0 text-center">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mobils.map((m, index) => (
                                    <tr key={m.kdmobil}>
                                        <td className="py-2 px-1 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-2 px-1 font-weight-bold text-primary">{m.kdmobil}</td>
                                        <td className="py-2 px-1 font-weight-bold" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{m.nama_mobil}</td>
                                        <td className="py-2 px-1 text-muted" style={{ whiteSpace: 'normal' }}>{m.nama_kategori}</td>
                                        <td className="py-2 px-1 text-center text-muted">{m.thn_mobil}</td>
                                        <td className="py-2 px-1" style={{ whiteSpace: 'normal' }}>{m.warna_mobil || '-'}</td>
                                        <td className="py-2 px-1 small" style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{m.stnk_mobil || '-'}</td>
                                        <td className="py-2 px-1 text-center"><code>{m.plat_mobil}</code></td>
                                        <td className="py-2 px-1 text-right font-weight-bold text-dark">{formatCurrency(m.harga)}</td>
                                        <td className="py-2 px-1 text-center">
                                            <span className={`small font-weight-bold text-uppercase ${m.status === 'Tersedia' ? 'text-success' : 'text-danger'}`}>
                                                {m.status || 'Tersedia'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Laporan Inventaris Aset - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
