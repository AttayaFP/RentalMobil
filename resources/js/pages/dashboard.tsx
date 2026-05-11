import AdminLayout from '@/layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

interface StatProps {
    total_mobil: number;
    total_pelanggan: number;
    booking_aktif: number;
    total_pendapatan: number;
    mobil_tersedia: number;
    mobil_disewa: number;
    mobil_perawatan: number;
}

interface Booking {
    kdbooking: string;
    iduser: number;
    kdmobil: string;
    total_bayar: number;
    status: string;
    user: { nama_lengkap: string };
    mobil: { nama_mobil: string };
}

interface Props {
    stats: StatProps;
    recent_bookings: Booking[];
}

export default function Dashboard({ stats, recent_bookings }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string; nama_lengkap?: string; name?: string } } }>().props;
    const user = auth.user;
    const userName = user?.nama_lengkap || user?.name || 'User';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

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
                            <h3 className="font-weight-bold mb-0">{stats.total_mobil}</h3>
                        </div>
                        <div className="small text-uppercase opacity-75 font-weight-bold">Total Mobil</div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-4 text-white" style={{ borderRadius: '15px', backgroundColor: '#393e46' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="ion-ios-people" style={{ fontSize: '32px', color: '#f96d00' }}></i>
                            <h3 className="font-weight-bold mb-0">{stats.total_pelanggan}</h3>
                        </div>
                        <div className="small text-uppercase opacity-75 font-weight-bold">Total Pelanggan</div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="ion-ios-calendar" style={{ fontSize: '32px', color: '#f96d00' }}></i>
                            <h3 className="font-weight-bold mb-0 text-dark">{stats.booking_aktif}</h3>
                        </div>
                        <div className="small text-uppercase text-muted font-weight-bold">Booking Aktif</div>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-4 bg-white" style={{ borderRadius: '15px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="ion-ios-cash" style={{ fontSize: '32px', color: '#2ecc71' }}></i>
                            <h3 className="font-weight-bold mb-0 text-dark">{formatCurrency(stats.total_pendapatan)}</h3>
                        </div>
                        <div className="small text-uppercase text-muted font-weight-bold">Total Pendapatan</div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-8 mb-4">
                    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px', minHeight: '400px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="font-weight-bold mb-0">Pemesanan Terbaru</h5>
                            <button onClick={() => window.location.href = '/booking'} className="btn btn-link btn-sm text-primary p-0">Lihat Semua</button>
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
                                    {recent_bookings.length > 0 ? (
                                        recent_bookings.map((booking) => (
                                            <tr key={booking.kdbooking} className="border-bottom">
                                                <td className="py-3 font-weight-bold">{booking.user?.nama_lengkap}</td>
                                                <td className="py-3">{booking.mobil?.nama_mobil}</td>
                                                <td className="py-3">
                                                    <span className={`badge px-2 py-1 ${
                                                        booking.status === 'Selesai' ? 'badge-success' : 
                                                        booking.status === 'Pending' ? 'badge-warning text-white' : 
                                                        'badge-info text-white'
                                                    }`}>
                                                        {booking.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center py-5 text-muted">Belum ada pemesanan terbaru</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm border-0 p-4 text-white text-center h-100" style={{ borderRadius: '15px', backgroundColor: '#f96d00' }}>
                        <h5 className="font-weight-bold mb-4">Status Mobil</h5>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3 p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                            <div className="text-left">
                                <div className="small font-weight-bold text-uppercase">Tersedia</div>
                                <h4 className="mb-0 font-weight-bold">{stats.mobil_tersedia}</h4>
                            </div>
                            <i className="ion-ios-checkmark-circle" style={{ fontSize: '24px' }}></i>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3 p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                            <div className="text-left">
                                <div className="small font-weight-bold text-uppercase">Sedang Disewa</div>
                                <h4 className="mb-0 font-weight-bold">{stats.mobil_disewa}</h4>
                            </div>
                            <i className="ion-ios-timer" style={{ fontSize: '24px' }}></i>
                        </div>

                        <div className="d-flex justify-content-between align-items-center p-3" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                            <div className="text-left">
                                <div className="small font-weight-bold text-uppercase">Perawatan</div>
                                <h4 className="mb-0 font-weight-bold">{stats.mobil_perawatan}</h4>
                            </div>
                            <i className="ion-ios-build" style={{ fontSize: '24px' }}></i>
                        </div>

                        <div className="mt-auto pt-4">
                            <button onClick={() => window.location.href = '/mobil'} className="btn btn-white btn-block font-weight-bold text-primary py-2" style={{ borderRadius: '10px', backgroundColor: '#fff' }}>
                                Kelola Mobil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .opacity-75 { opacity: 0.75; }
                .btn-white:hover { background-color: #f8f9fa !important; }
            `}} />
        </AdminLayout>
    );
}
