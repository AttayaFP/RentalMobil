import AdminLayout from '@/layouts/AdminLayout';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { Printer, RotateCcw } from 'lucide-react';

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
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function PengembalianReport({ pengembalians, filters }: Props) {
    const handlePrint = () => window.print();
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AdminLayout title="Laporan Pengembalian">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="card shadow-sm border-0 overflow-hidden" 
                style={{ borderRadius: '15px' }}
            >
                <div className="card-header bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center print:hidden">
                    <div>
                        <h5 className="font-weight-bold mb-1 text-dark">
                            <RotateCcw className="inline-block mr-2 text-primary" size={24} /> Laporan Pengembalian Unit
                        </h5>
                        <p className="text-muted small mb-0">Monitor ketepatan waktu dan denda armada</p>
                    </div>
                    <button onClick={handlePrint} className="btn btn-dark px-4 py-2 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <Printer size={18} /> Cetak Laporan
                    </button>
                </div>

                <div className="px-4 pb-2 print:hidden">
                    <SearchFilter routeName="/laporan/pengembalian" placeholder="Cari kode, pelanggan, atau mobil..." filters={filters} showDate={true} />
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
                                LAPORAN PENGEMBALIAN - DETIL PENGEMBALIAN & STATUS DENDA
                            </span>
                        </div>
                    </div>

                    <div className="table-responsive shadow-none overflow-visible">
                        <table className="table table-striped table-hover w-100" style={{ fontSize: '9px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-3 px-1 border-0 text-center">NO</th>
                                    <th className="py-3 px-1 border-0">KODE KEMBALI</th>
                                    <th className="py-3 px-1 border-0">PELANGGAN</th>
                                    <th className="py-3 px-1 border-0">UNIT MOBIL</th>
                                    <th className="py-3 px-1 border-0 text-center">TGL SEWA</th>
                                    <th className="py-3 px-1 border-0 text-center">TGL KEMBALI</th>
                                    <th className="py-3 px-1 border-0 text-center">LAMBAT</th>
                                    <th className="py-3 px-1 border-0 text-right">DENDA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pengembalians.length > 0 ? pengembalians.map((p, index) => (
                                    <tr key={p.kdpengembalian}>
                                        <td className="py-3 px-1 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-3 px-1 font-weight-bold text-primary">{p.kdpengembalian}</td>
                                        <td className="py-3 px-1 font-weight-bold text-dark">{p.nama_pelanggan}</td>
                                        <td className="py-3 px-1">{p.nama_mobil} (<code>{p.plat_mobil}</code>)</td>
                                        <td className="py-3 px-1 text-center text-muted">{p.tglmulai} s/d {p.tglselesai}</td>
                                        <td className="py-3 px-1 text-center font-weight-bold">{p.tglpengembalian}</td>
                                        <td className="py-3 px-1 text-center">
                                            <span className={`badge ${p.denda > 0 ? 'badge-danger' : 'badge-success'}`}>
                                                {p.keterlambatan}
                                            </span>
                                        </td>
                                        <td className="py-3 px-1 text-right font-weight-bold text-danger">{formatCurrency(p.denda)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="text-center py-5 text-muted">Data pengembalian tidak ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Laporan Pengembalian Mobil - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
