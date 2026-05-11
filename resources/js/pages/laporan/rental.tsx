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
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Laporan Rekapitulasi Pendapatan Sewa & Denda</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>
                    <div className="row mb-4 print:hidden">
                        <div className="col-md-12">
                            <div className="p-3 border rounded text-center shadow-sm" style={{ backgroundColor: '#fff4e5' }}>
                                <small className="text-muted text-uppercase font-weight-bold d-block mb-1 text-primary">Total Pendapatan (Sewa + Denda)</small>
                                <h4 className="font-weight-bold mb-0" style={{ color: '#f96d00' }}>{formatCurrency(grandTotal)}</h4>
                            </div>
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
                                    <th className="py-2 px-1 border-0 text-center">TGL KEMBALI</th>
                                    <th className="py-2 px-1 border-0 text-center">TELAT</th>
                                    <th className="py-2 px-1 border-0 text-right">BIAYA SEWA</th>
                                    <th className="py-2 px-1 border-0 text-right">DENDA</th>
                                    <th className="py-2 px-1 border-0 text-right">TOTAL</th>
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
                                        <td className="py-2 px-1 text-center text-muted" style={{ whiteSpace: 'normal' }}>{r.tglpengembalian || '-'}</td>
                                        <td className="py-2 px-1 text-center font-weight-bold">{r.keterlambatan || 0}H</td>
                                        <td className="py-2 px-1 text-right">{new Intl.NumberFormat('id-ID').format(r.totalsewa)}</td>
                                        <td className="py-2 px-1 text-right text-danger">{new Intl.NumberFormat('id-ID').format(r.denda)}</td>
                                        <td className="py-2 px-1 text-right font-weight-bold text-primary">{new Intl.NumberFormat('id-ID').format(r.total_seluruh)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={11} className="text-center py-4">Data tidak ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-light">
                                <tr className="font-weight-bold" style={{ fontSize: '11px' }}>
                                    <td colSpan={10} className="text-right py-3">GRAND TOTAL PENDAPATAN</td>
                                    <td className="text-right py-3 text-primary">{formatCurrency(grandTotal)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
