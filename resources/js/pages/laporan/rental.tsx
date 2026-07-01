import AdminLayout from '@/layouts/AdminLayout';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { Printer, TrendingUp } from 'lucide-react';

interface Rental {
    koderental: string;
    kdbooking: string;
    nama_pelanggan: string;
    nama_mobil: string;
    plat_mobil: string;
    tglmulai: string;
    tglselesai: string;
    tglpengembalian: string;
    keterlambatan: string;
    denda: number;
    totalsewa: number;
    total_seluruh: number;
    status: string;
    status_mobil?: string;
}

interface Props {
    rentals: Rental[];
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function RentalReport({ rentals, filters }: Props) {
    const handlePrint = () => window.print();
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const grandTotal = rentals.reduce((acc, curr) => acc + curr.total_seluruh, 0);
    const mobilDisewaCount = rentals.filter(r => (r.status_mobil || '').toLowerCase() === 'disewa').length;
    const mobilKembaliCount = rentals.filter(r => (r.status_mobil || '').toLowerCase() === 'tersedia').length;
    const mobilPerawatanCount = rentals.filter(r => (r.status_mobil || '').toLowerCase() === 'perawatan').length;

    return (
        <AdminLayout title="Laporan Pendapatan">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card shadow-sm border-0 overflow-hidden" 
                style={{ borderRadius: '15px' }}
            >
                <div className="card-header bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center print:hidden">
                    <div>
                        <h5 className="font-weight-bold mb-1 text-dark">
                            <TrendingUp className="inline-block mr-2 text-primary" size={24} /> Laporan Pendapatan (Omzet)
                        </h5>
                        <p className="text-muted small mb-0">Rekapitulasi finansial dari penyewaan mobil</p>
                    </div>
                    <button onClick={handlePrint} className="btn btn-dark px-4 py-2 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <Printer size={18} /> Cetak Laporan
                    </button>
                </div>

                <div className="px-4 pb-2 print:hidden">
                    <SearchFilter routeName="/laporan/rental" placeholder="Cari kode, pelanggan, atau mobil..." filters={filters} showDate={true} />
                </div>

                <div className="card-body p-3 p-md-5 bg-white">
                    <div className="position-relative mb-4 pb-3 border-bottom" style={{ borderColor: '#222831', minHeight: '115px' }}>
                        <div className="position-absolute" style={{ top: 0, left: 0 }}>
                            <img 
                                src="/storage/logo/logo.jpg" 
                                alt="Logo" 
                                style={{ height: '110px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }} 
                            />
                        </div>
                        <div className="text-center" style={{ paddingLeft: '130px', paddingRight: '130px' }}>
                            <h2 className="font-weight-bold mb-1" style={{ color: '#222831', fontSize: '24px', letterSpacing: '0.5px' }}>
                                PT. NABIL RENTAL MOBIL PADANG
                            </h2>
                            <p className="mb-2 text-muted small font-weight-bold">
                                Kompek Perumdam/III/4, Tunggul Hitam, Kota Padang
                            </p>
                            <span className="badge px-3 py-2 text-uppercase" style={{ backgroundColor: '#fff4e5', color: '#f96d00', border: '1px solid #fde8d8', fontSize: '12px', fontWeight: 700 }}>
                                LAPORAN PENDAPATAN - REKAPITULASI PENDAPATAN SEWA & DENDA
                            </span>
                        </div>
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
                                    <th className="py-2 px-1 border-0 text-center">TGL MULAI</th>
                                    <th className="py-2 px-1 border-0 text-center">TGL SELESAI</th>
                                    <th className="py-2 px-1 border-0 text-center">TGL KEMBALI</th>
                                    <th className="py-2 px-1 border-0 text-center">TELAT</th>
                                    <th className="py-2 px-1 border-0 text-right">BIAYA SEWA</th>
                                    <th className="py-2 px-1 border-0 text-right">DENDA</th>
                                    <th className="py-2 px-2 border-0 text-right">TOTAL</th>
                                    <th className="py-2 px-1 border-0 text-center">STATUS MOBIL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rentals.length > 0 ? rentals.map((r, index) => (
                                    <tr key={r.koderental}>
                                        <td className="py-2 px-1 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-2 px-1 font-weight-bold text-primary" style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{r.koderental}</td>
                                        <td className="py-2 px-1" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{r.nama_pelanggan}</td>
                                        <td className="py-2 px-1" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{r.nama_mobil}</td>
                                        <td className="py-2 px-1 text-center"><code>{r.plat_mobil}</code></td>
                                        <td className="py-2 px-1 text-center text-muted" style={{ whiteSpace: 'normal' }}>{r.tglmulai}</td>
                                        <td className="py-2 px-1 text-center text-muted" style={{ whiteSpace: 'normal' }}>{r.tglselesai}</td>
                                        <td className="py-2 px-1 text-center text-muted" style={{ whiteSpace: 'normal' }}>{r.tglpengembalian || '-'}</td>
                                        <td className="py-2 px-1 text-center font-weight-bold">{r.keterlambatan || 0}</td>
                                        <td className="py-2 px-1 text-right">{new Intl.NumberFormat('id-ID').format(r.totalsewa)}</td>
                                        <td className="py-2 px-1 text-right text-danger">{new Intl.NumberFormat('id-ID').format(r.denda)}</td>
                                        <td className="py-2 px-2 text-right font-weight-bold text-primary">{new Intl.NumberFormat('id-ID').format(r.total_seluruh)}</td>
                                        <td className="py-2 px-1 text-center">
                                            <span className={`badge ${
                                                (r.status_mobil || '').toLowerCase() === 'tersedia' ? 'badge-success' :
                                                (r.status_mobil || '').toLowerCase() === 'disewa' ? 'badge-warning' :
                                                'badge-danger'
                                            }`}>
                                                {r.status_mobil || 'Tersedia'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={13} className="text-center py-4">Data tidak ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-light">
                                <tr className="font-weight-bold" style={{ fontSize: '11px' }}>
                                    <td colSpan={11} className="text-right py-3">GRAND TOTAL PENDAPATAN</td>
                                    <td className="text-right py-3 text-primary">{formatCurrency(grandTotal)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="mt-4 p-4 border rounded bg-light">
                        <h6 className="font-weight-bold text-dark mb-3 border-bottom pb-2">
                            Rangkuman Status Armada & Total Pendapatan
                        </h6>
                        <div className="row g-3">
                            <div className="col-md-3 mb-2">
                                <div className="p-3 bg-white border rounded text-center shadow-sm">
                                    <span className="font-weight-bold text-uppercase small text-muted d-block mb-1">Total Pendapatan Keseluruhan</span>
                                    <span className="h5 font-weight-bold mb-0 text-primary">{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>
                            <div className="col-md-3 mb-2">
                                <div className="p-3 bg-white border rounded text-center shadow-sm">
                                    <span className="font-weight-bold text-uppercase small text-muted d-block mb-1">Total Mobil Disewa</span>
                                    <span className="badge badge-warning px-3 py-2 text-dark mt-1" style={{ fontSize: '13px' }}>{mobilDisewaCount} Unit Mobil</span>
                                </div>
                            </div>
                            <div className="col-md-3 mb-2">
                                <div className="p-3 bg-white border rounded text-center shadow-sm">
                                    <span className="font-weight-bold text-uppercase small text-muted d-block mb-1">Total Mobil Sudah Dikembalikan</span>
                                    <span className="badge badge-success px-3 py-2 mt-1" style={{ fontSize: '13px' }}>{mobilKembaliCount} Unit Mobil</span>
                                </div>
                            </div>
                            <div className="col-md-3 mb-2">
                                <div className="p-3 bg-white border rounded text-center shadow-sm">
                                    <span className="font-weight-bold text-uppercase small text-muted d-block mb-1">Total Mobil Dalam Perawatan</span>
                                    <span className="badge badge-danger px-3 py-2 mt-1" style={{ fontSize: '13px' }}>{mobilPerawatanCount} Unit Mobil</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
