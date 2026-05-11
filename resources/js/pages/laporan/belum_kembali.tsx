import AdminLayout from '@/layouts/AdminLayout';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { Printer, AlertCircle } from 'lucide-react';

interface Booking {
    kdbooking: string;
    nama_mobil: string;
    plat_mobil: string;
    tglmulai: string;
    status: string;
}

interface Props {
    bookings: Booking[];
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function BelumKembaliReport({ bookings, filters }: Props) {
    const handlePrint = () => window.print();

    return (
        <AdminLayout title="Laporan Belum Kembali">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card shadow-sm border-0 overflow-hidden" 
                style={{ borderRadius: '15px' }}
            >
                <div className="card-header bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center print:hidden">
                    <div>
                        <h5 className="font-weight-bold mb-1 text-dark">
                            <AlertCircle className="inline-block mr-2 text-danger" size={24} /> Laporan Belum Kembali
                        </h5>
                        <p className="text-muted small mb-0">Daftar armada yang masih dalam masa sewa</p>
                    </div>
                    <button onClick={handlePrint} className="btn btn-dark px-4 py-2 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <Printer size={18} /> Cetak Laporan
                    </button>
                </div>

                <div className="px-4 pb-2 print:hidden">
                    <SearchFilter routeName="/laporan/belum-kembali" placeholder="Cari kode booking, mobil, atau plat..." filters={filters} showDate={true} />
                </div>

                <div className="card-body p-3 p-md-5 bg-white">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Laporan Daftar Kendaraan Yang Belum Dikembalikan</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>

                    <div className="table-responsive shadow-none overflow-visible">
                        <table className="table table-striped table-hover w-100" style={{ fontSize: '11px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-3 px-3 border-0 text-center">NO</th>
                                    <th className="py-3 px-3 border-0">KODE BOOKING</th>
                                    <th className="py-3 px-3 border-0">UNIT MOBIL</th>
                                    <th className="py-3 px-3 border-0 text-center">PLAT NOMOR</th>
                                    <th className="py-3 px-3 border-0 text-center">TGL MULAI SEWA</th>
                                    <th className="py-3 px-3 border-0 text-center">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? bookings.map((b, index) => (
                                    <tr key={b.kdbooking}>
                                        <td className="py-3 px-3 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-3 px-3 font-weight-bold text-primary">{b.kdbooking}</td>
                                        <td className="py-3 px-3 font-weight-bold">{b.nama_mobil}</td>
                                        <td className="py-3 px-3 text-center"><code>{b.plat_mobil}</code></td>
                                        <td className="py-3 px-3 text-center text-muted">{b.tglmulai}</td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="badge badge-warning">BELUM KEMBALI</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5 text-muted">Tidak ada kendaraan yang sedang disewa.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Dokumen Monitoring Otomatis - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
