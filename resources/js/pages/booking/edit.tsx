import AdminLayout from '@/layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

interface User {
    id: number;
    nama_lengkap: string;
}

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    harga: number;
}

interface Booking {
    kdbooking: string;
    tglbooking: string;
    iduser: number;
    kdmobil: string;
    harga: number;
    tglmulai: string;
    tglselesai: string;
    lama_sewa: number;
    total_bayar: number;
    status: string;
}

interface Props {
    booking: Booking;
    users: User[];
    mobils: Mobil[];
}

export default function Edit({ booking, users, mobils }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        tglbooking: booking.tglbooking,
        iduser: booking.iduser.toString(),
        kdmobil: booking.kdmobil,
        harga: booking.harga.toString(),
        tglmulai: booking.tglmulai,
        tglselesai: booking.tglselesai,
        lama_sewa: booking.lama_sewa.toString(),
        total_bayar: booking.total_bayar.toString(),
        status: booking.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/booking/${booking.kdbooking}`);
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    const formatCurrency = (amount: any) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
    };

    return (
        <AdminLayout title={`Edit Transaksi: ${booking.kdbooking}`}>
            <div className="row justify-content-center">
                <div className="col-lg-11">
                    <form onSubmit={submit}>
                        <div className="row">
                            <div className="col-md-7">
                                <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '15px' }}>
                                    <div className="d-flex align-items-center mb-4">
                                        <button type="button" onClick={() => forceNavigate('/booking')} className="btn btn-link text-muted p-0 mr-3">
                                            <i className="ion-ios-arrow-back" style={{ fontSize: '24px' }}></i>
                                        </button>
                                        <h5 className="font-weight-bold mb-0">Ubah Informasi Sewa</h5>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Kode Booking</label>
                                            <input type="text" className="form-control bg-light font-weight-bold" value={booking.kdbooking} disabled />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Tanggal Transaksi</label>
                                            <input type="date" className="form-control" value={data.tglbooking} onChange={e => setData('tglbooking', e.target.value)} required />
                                        </div>
                                        <div className="col-md-12 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Pelanggan</label>
                                            <select className="form-control" value={data.iduser} onChange={e => setData('iduser', e.target.value)} required>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.nama_lengkap}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-12 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Mobil</label>
                                            <select className="form-control" value={data.kdmobil} onChange={e => setData('kdmobil', e.target.value)} required>
                                                {mobils.map(m => <option key={m.kdmobil} value={m.kdmobil}>{m.nama_mobil}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Tgl Mulai</label>
                                            <input type="date" className="form-control" value={data.tglmulai} onChange={e => setData('tglmulai', e.target.value)} required />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Tgl Selesai</label>
                                            <input type="date" className="form-control" value={data.tglselesai} onChange={e => setData('tglselesai', e.target.value)} required />
                                        </div>
                                        <div className="col-md-12 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase text-primary">Status Transaksi</label>
                                            <select className="form-control font-weight-bold" value={data.status} onChange={e => setData('status', e.target.value)} required style={{ border: '2px solid #ddd' }}>
                                                <option value="Pending">PENDING</option>
                                                <option value="Proses">PROSES</option>
                                                <option value="Selesai">SELESAI</option>
                                                <option value="Batal">BATAL</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="card shadow-sm border-0 p-4 bg-dark text-white mb-4" style={{ borderRadius: '15px' }}>
                                    <h5 className="font-weight-bold mb-4" style={{ color: '#f96d00' }}>Rincian Biaya</h5>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="opacity-75">Harga / Hari</span>
                                        <span className="font-weight-bold">{formatCurrency(data.harga)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="opacity-75">Lama Sewa</span>
                                        <span className="font-weight-bold">{data.lama_sewa} Hari</span>
                                    </div>
                                    <hr className="bg-white opacity-25" />
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <h4 className="mb-0 font-weight-bold">Total Akhir</h4>
                                        <h3 className="mb-0 font-weight-bold" style={{ color: '#f96d00' }}>{formatCurrency(data.total_bayar)}</h3>
                                    </div>
                                </div>

                                <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
                                    <button type="submit" className="btn btn-primary btn-block py-3 font-weight-bold shadow-sm" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00', borderRadius: '10px' }}>
                                        <i className="ion-ios-save mr-2"></i> {processing ? 'Menyimpan...' : 'Perbarui Transaksi'}
                                    </button>
                                    <button type="button" onClick={() => forceNavigate('/booking')} className="btn btn-link btn-block text-muted small mt-2">Batal & Kembali</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .form-control { border-radius: 8px; padding: 12px 15px; border: 1px solid #ddd; height: auto; font-size: 14px; }
                .form-control:focus { border-color: #f96d00; box-shadow: 0 0 0 0.2rem rgba(249, 109, 0, 0.1); }
                .opacity-75 { opacity: 0.75; }
                .opacity-25 { opacity: 0.25; }
            `}} />
        </AdminLayout>
    );
}
