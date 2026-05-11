import AdminLayout from '@/layouts/AdminLayout';
import SearchFilter from '@/components/SearchFilter';
import { motion } from 'framer-motion';
import { Printer, Users } from 'lucide-react';

interface Pelanggan {
    id: number;
    nama_lengkap: string;
    username: string;
    email: string;
    nohp: string;
    alamat: string;
}

interface Props {
    pelanggans: Pelanggan[];
    filters: {
        search?: string;
    };
}

export default function PelangganReport({ pelanggans, filters }: Props) {
    const handlePrint = () => window.print();

    return (
        <AdminLayout title="Laporan Data Pelanggan">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card shadow-sm border-0 overflow-hidden" 
                style={{ borderRadius: '15px' }}
            >
                <div className="card-header bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center print:hidden">
                    <div>
                        <h5 className="font-weight-bold mb-1 text-dark">
                            <Users className="inline-block mr-2 text-primary" size={24} /> Laporan Master Pelanggan
                        </h5>
                        <p className="text-muted small mb-0">Cari dan cetak data pelanggan rental</p>
                    </div>
                    <button onClick={handlePrint} className="btn btn-dark px-4 py-2 d-flex align-items-center gap-2" style={{ borderRadius: '10px', fontWeight: 600 }}>
                        <Printer size={18} /> Cetak Laporan
                    </button>
                </div>

                <div className="px-4 pb-2 print:hidden">
                    <SearchFilter routeName="/laporan/pelanggan" placeholder="Cari ID, nama, atau email pelanggan..." filters={filters} showDate={false} />
                </div>

                <div className="card-body p-3 p-md-5 bg-white">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Laporan Seluruh Data Pelanggan Terdaftar</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>

                    <div className="table-responsive shadow-none overflow-visible">
                        <table className="table table-striped table-hover w-100" style={{ fontSize: '11px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-3 px-3 border-0 text-center">NO</th>
                                    <th className="py-3 px-3 border-0">ID</th>
                                    <th className="py-3 px-3 border-0">NAMA LENGKAP</th>
                                    <th className="py-3 px-3 border-0">USERNAME</th>
                                    <th className="py-3 px-3 border-0">EMAIL</th>
                                    <th className="py-3 px-3 border-0">NO. HP</th>
                                    <th className="py-3 px-3 border-0">ALAMAT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pelanggans.length > 0 ? pelanggans.map((p, index) => (
                                    <tr key={p.id}>
                                        <td className="py-3 px-3 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-3 px-3 font-weight-bold text-primary">#{p.id}</td>
                                        <td className="py-3 px-3 font-weight-bold text-dark">{p.nama_lengkap}</td>
                                        <td className="py-3 px-3"><code>@{p.username}</code></td>
                                        <td className="py-3 px-3 text-muted">{p.email}</td>
                                        <td className="py-3 px-3">{p.nohp || '-'}</td>
                                        <td className="py-3 px-3 text-muted small" style={{ maxWidth: '250px' }}>{p.alamat}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-5 text-muted">Data pelanggan tidak ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Laporan Data Pelanggan - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
