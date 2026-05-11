import AdminLayout from '@/layouts/AdminLayout';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { Printer, CalendarRange } from 'lucide-react';

interface Booking {
    kdbooking: string;
    nama_pelanggan: string;
    nama_mobil: string;
    plat_mobil: string;
    waktu_order: string;
    tglmulai: string;
    tglselesai: string;
    status: string;
    payment_type: string;
    total_bayar: number;
}

interface Props {
    bookings: Booking[];
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function BookingReport({ bookings, filters }: Props) {
    const handlePrint = () => window.print();
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <AdminLayout title="Laporan Booking">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card shadow-sm border-0 overflow-hidden" 
                style={{ borderRadius: '15px' }}
            >
                <div className="card-header bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center print:hidden">
                    <div>
                        <h5 className="font-weight-bold mb-1 text-dark">
                            <CalendarRange className="inline-block mr-2 text-primary" size={24} /> Laporan Pesanan (Booking)
                        </h5>
                        <p className="text-muted small mb-0">Monitor dan cetak riwayat pesanan pelanggan</p>
                    </div>
                    <button onClick={handlePrint} className="btn btn-dark px-4 py-2 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <Printer size={18} /> Cetak Laporan
                    </button>
                </div>

                <div className="px-4 pb-2 print:hidden">
                    <SearchFilter routeName="/laporan/booking" placeholder="Cari kode booking, pelanggan, mobil, atau status..." filters={filters} showDate={true} />
                </div>

                <div className="card-body p-3 p-md-5 bg-white">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Laporan Riwayat Booking & Reservasi Mobil</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>

                    <div className="table-responsive shadow-none overflow-visible">
                        <table className="table table-striped table-hover w-100" style={{ fontSize: '10px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-3 px-2 border-0 text-center">NO</th>
                                    <th className="py-3 px-2 border-0">KODE</th>
                                    <th className="py-3 px-2 border-0">PELANGGAN</th>
                                    <th className="py-3 px-2 border-0">UNIT MOBIL</th>
                                    <th className="py-3 px-2 border-0">PLAT</th>
                                    <th className="py-3 px-2 border-0 text-center">DURASI</th>
                                    <th className="py-3 px-2 border-0">TGL MULAI</th>
                                    <th className="py-3 px-2 border-0">TGL SELESAI</th>
                                    <th className="py-3 px-2 border-0 text-right">TOTAL</th>
                                    <th className="py-3 px-2 border-0 text-center">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? bookings.map((b, index) => (
                                    <tr key={b.kdbooking}>
                                        <td className="py-3 px-2 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-3 px-2 font-weight-bold text-primary">{b.kdbooking}</td>
                                        <td className="py-3 px-2 font-weight-bold text-dark">{b.nama_pelanggan}</td>
                                        <td className="py-3 px-2">{b.nama_mobil}</td>
                                        <td className="py-3 px-2"><code>{b.plat_mobil}</code></td>
                                        <td className="py-3 px-2 text-center">{b.waktu_order}</td>
                                        <td className="py-3 px-2 text-muted">{b.tglmulai}</td>
                                        <td className="py-3 px-2 text-muted">{b.tglselesai}</td>
                                        <td className="py-3 px-2 text-right font-weight-bold text-dark">{formatCurrency(b.total_bayar)}</td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`small font-weight-bold text-uppercase ${b.status === 'Paid' ? 'text-success' : 'text-warning'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={10} className="text-center py-5 text-muted">Data booking tidak ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Dokumen Keuangan - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
