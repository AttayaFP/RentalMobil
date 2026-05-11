import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage<{ auth: { user: { role: string; nama_lengkap?: string; name?: string } } }>().props;
    const user = auth.user;
    const userName = user?.nama_lengkap || user?.name || 'User';

    return (
        <AdminLayout title={`Selamat Datang, ${userName}`}>
            <div className="row mb-5">
                <div className="col-md-12">
                    <div className="p-4 bg-white shadow-sm border-0" style={{ borderRadius: '15px', borderLeft: '5px solid #f96d00' }}>
                        <h4 className="font-weight-bold mb-1">Ringkasan Sistem RentalMobil</h4>
                        <p className="text-muted mb-0">Pantau seluruh aktivitas operasional Anda dari sini secara real-time.</p>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-4 text-white" style={{ borderRadius: '15px', backgroundColor: '#222831' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="ion-ios-car" style={{ fontSize: '32px', color: '#f96d00' }}></i>
                            <h3 className="font-weight-bold mb-0">15</h3>
                        </div>
                        <div className="small text-uppercase opacity-75 font-weight-bold">Total Mobil</div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-4 text-white" style={{ borderRadius: '15px', backgroundColor: '#393e46' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="ion-ios-people" style={{ fontSize: '32px', color: '#f96d00' }}></i>
                            <h3 className="font-weight-bold mb-0">120</h3>
                        </div>
                        <div className="small text-uppercase opacity-75 font-weight-bold">Total Pelanggan</div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="ion-ios-calendar" style={{ fontSize: '32px', color: '#f96d00' }}></i>
                            <h3 className="font-weight-bold mb-0 text-dark">45</h3>
                        </div>
                        <div className="small text-uppercase text-muted font-weight-bold">Booking Aktif</div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="ion-ios-cash" style={{ fontSize: '32px', color: '#2ecc71' }}></i>
                            <h3 className="font-weight-bold mb-0 text-dark">82%</h3>
                        </div>
                        <div className="small text-uppercase text-muted font-weight-bold">Tingkat Okupansi</div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-8 mb-4">
                    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="font-weight-bold mb-0">Pemesanan Terbaru</h5>
                            <button className="btn btn-link btn-sm text-primary p-0">Lihat Semua</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-borderless">
                                <thead>
                                    <tr className="text-muted small text-uppercase">
                                        <th className="pb-3 border-bottom">Pelanggan</th>
                                        <th className="pb-3 border-bottom">Mobil</th>
                                        <th className="pb-3 border-bottom">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom">
                                        <td className="py-3 font-weight-bold">Andi Wijaya</td>
                                        <td className="py-3">Avanza Veloz</td>
                                        <td className="py-3"><span className="badge badge-success px-2 py-1">SELESAI</span></td>
                                    </tr>
                                    <tr className="border-bottom">
                                        <td className="py-3 font-weight-bold">Siska Indah</td>
                                        <td className="py-3">Honda Civic</td>
                                        <td className="py-3"><span className="badge badge-warning px-2 py-1 text-white">PROSES</span></td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-weight-bold">Budi Santoso</td>
                                        <td className="py-3">Mitsubishi Xpander</td>
                                        <td className="py-3"><span className="badge badge-info px-2 py-1 text-white">PENDING</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-0 p-4 text-white text-center" style={{ borderRadius: '15px', backgroundColor: '#f96d00' }}>
                        <div className="rounded-circle mx-auto mb-3 bg-white d-flex align-items-center justify-content-center text-primary" style={{ width: '80px', height: '80px' }}>
                            <i className="ion-ios-ribbon" style={{ fontSize: '40px', color: '#f96d00' }}></i>
                        </div>
                        <h5 className="font-weight-bold mb-1">Status Keanggotaan</h5>
                        <p className="small mb-4 opacity-75">Anda login sebagai {user?.role?.toUpperCase()}</p>
                        <hr className="bg-white opacity-25" />
                        <div className="text-left mt-4">
                            <div className="small mb-1 font-weight-bold">KEAMANAN AKUN</div>
                            <p className="small mb-0">Password terakhir diubah 2 minggu lalu.</p>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .badge { font-weight: 800; font-size: 10px; border-radius: 4px; }
                .opacity-75 { opacity: 0.75; }
                .opacity-25 { opacity: 0.25; }
            `}} />
        </AdminLayout>
    );
}
