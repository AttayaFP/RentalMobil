import AdminLayout from '@/layouts/AdminLayout';

interface Pelanggan {
    id: number;
    nama_lengkap: string;
    username: string;
    email: string;
    jenis_kelamin: string;
    nohp: string;
    alamat: string;
}

interface Props {
    pelanggans: Pelanggan[];
}

export default function PelangganReport({ pelanggans }: Props) {
    const handlePrint = () => window.print();

    return (
        <AdminLayout title="Database Pelanggan">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center print:hidden">
                    <h5 className="font-weight-bold mb-0 text-dark">
                        <i className="ion-ios-contacts mr-2 text-primary"></i> Laporan Data Pelanggan
                    </h5>
                    <button onClick={handlePrint} className="btn btn-dark px-4" style={{ borderRadius: '8px' }}>
                        <i className="ion-ios-printer mr-2"></i> Cetak Database
                    </button>
                </div>

                <div className="card-body p-3 p-md-4 bg-white">
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold mb-1" style={{ color: '#222831' }}>RentalMobil</h2>
                        <p className="mb-4 text-muted">Daftar Seluruh Pelanggan Terdaftar Dalam Sistem</p>
                        <div className="mx-auto" style={{ height: '3px', width: '60px', backgroundColor: '#f96d00' }}></div>
                    </div>

                    <div className="table-responsive shadow-none" style={{ overflowX: 'visible' }}>
                        <table className="table table-striped table-hover table-sm w-100" style={{ fontSize: '11px' }}>
                            <thead style={{ backgroundColor: '#222831', color: '#fff' }}>
                                <tr>
                                    <th className="py-2 px-1 border-0 text-center" width="40">NO</th>
                                    <th className="py-2 border-0">NAMA LENGKAP</th>
                                    <th className="py-2 border-0">USERNAME</th>
                                    <th className="py-2 border-0">EMAIL</th>
                                    <th className="py-2 border-0 text-center" width="80">GENDER</th>
                                    <th className="py-2 border-0">ALAMAT</th>
                                    <th className="py-2 px-1 border-0" width="110">NO. WA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pelanggans.map((p, index) => (
                                    <tr key={p.id}>
                                        <td className="py-2 px-1 text-center text-muted font-weight-bold">{index + 1}</td>
                                        <td className="py-2 font-weight-bold" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.nama_lengkap}</td>
                                        <td className="py-2 text-primary" style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>@{p.username}</td>
                                        <td className="py-2" style={{ whiteSpace: 'normal', wordBreak: 'break-all' }}>{p.email}</td>
                                        <td className="py-2 text-center">{p.jenis_kelamin === 'L' ? 'L' : 'P'}</td>
                                        <td className="py-2" style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.2' }}>{p.alamat}</td>
                                        <td className="py-2 px-1 font-weight-bold text-dark">{p.nohp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 text-right opacity-75 small italic print:block d-none">
                        Database Pelanggan Resmi - Dicetak pada: {new Date().toLocaleString('id-ID')}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
