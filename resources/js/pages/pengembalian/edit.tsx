import AdminLayout from '@/layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

interface Booking {
    kdbooking: string;
    tglmulai: string;
    tglselesai: string;
    iduser: number;
    harga: number;
}

interface Pengembalian {
    kdpengembalian: string;
    kdbooking: string;
    iduser: number;
    tglmulai: string;
    tglselesai: string;
    tglpengembalian: string;
    keterlambatan: number;
    denda: number;
}

interface Props {
    pengembalian: Pengembalian;
    bookings: Booking[];
}

export default function Edit({ pengembalian, bookings }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        kdbooking: pengembalian.kdbooking,
        iduser: pengembalian.iduser.toString(),
        tglmulai: pengembalian.tglmulai,
        tglselesai: pengembalian.tglselesai,
        tglpengembalian: pengembalian.tglpengembalian,
        keterlambatan: pengembalian.keterlambatan.toString(),
        denda: pengembalian.denda.toString(),
    });

    const calculateLateFees = (tglSelesai: string, tglKembali: string, kdBooking: string) => {
        if (!tglSelesai || !tglKembali || !kdBooking) return { keterlambatan: '0', denda: '0' };
        const booking = bookings.find(b => b.kdbooking.trim() === kdBooking.trim());
        const harga = booking ? Number(booking.harga) : 0;
        const selesai = new Date(tglSelesai);
        const riil = new Date(tglKembali);
        selesai.setHours(0, 0, 0, 0);
        riil.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((riil.getTime() - selesai.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? { keterlambatan: diffDays.toString(), denda: (diffDays * harga).toString() } : { keterlambatan: '0', denda: '0' };
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/pengembalian/${pengembalian.kdpengembalian}`);
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    const formatCurrency = (amount: any) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);
    };

    return (
        <AdminLayout title={`Edit Pengembalian: ${pengembalian.kdpengembalian}`}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form onSubmit={submit}>
                        <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                            <div className="mb-4 d-flex align-items-center">
                                <button type="button" onClick={() => forceNavigate('/pengembalian')} className="btn btn-link text-muted p-0 mr-3">
                                    <i className="ion-ios-arrow-back" style={{ fontSize: '24px' }}></i>
                                </button>
                                <h4 className="font-weight-bold mb-0">Ubah Data Serah Terima</h4>
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group mb-4">
                                    <label className="font-weight-bold text-dark small text-uppercase">Kode Pengembalian (Tetap)</label>
                                    <input type="text" className="form-control bg-light" value={pengembalian.kdpengembalian} disabled />
                                </div>
                                <div className="col-md-6 form-group mb-4">
                                    <label className="font-weight-bold text-dark small text-uppercase">Referensi Booking</label>
                                    <select className="form-control" value={data.kdbooking} onChange={e => {
                                        const b = bookings.find(x => x.kdbooking === e.target.value);
                                        if(b) {
                                            const fees = calculateLateFees(b.tglselesai, data.tglpengembalian, e.target.value);
                                            setData(prev => ({ ...prev, kdbooking: e.target.value, iduser: b.iduser.toString(), tglmulai: b.tglmulai, tglselesai: b.tglselesai, keterlambatan: fees.keterlambatan, denda: fees.denda }));
                                        }
                                    }} required>
                                        {bookings.map(b => <option key={b.kdbooking} value={b.kdbooking}>{b.kdbooking}</option>)}
                                    </select>
                                </div>
                                
                                <div className="col-md-12 mb-4">
                                    <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                        <div className="small">
                                            <span className="text-muted text-uppercase font-weight-bold mr-2">Durasi Sewa:</span>
                                            <span className="font-weight-bold">{data.tglmulai} s/d {data.tglselesai}</span>
                                        </div>
                                        <div className="small">
                                            <span className="text-muted text-uppercase font-weight-bold mr-2">User ID:</span>
                                            <span className="font-weight-bold">#{data.iduser}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 form-group mb-4">
                                    <label className="font-weight-bold text-dark small text-uppercase text-primary">Update Tanggal Pengembalian</label>
                                    <input type="date" className="form-control form-control-lg font-weight-bold" value={data.tglpengembalian} onChange={e => {
                                        const fees = calculateLateFees(data.tglselesai, e.target.value, data.kdbooking);
                                        setData(prev => ({ ...prev, tglpengembalian: e.target.value, keterlambatan: fees.keterlambatan, denda: fees.denda }));
                                    }} required />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 shadow-none p-3 h-100" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                                        <label className="small text-muted text-uppercase font-weight-bold mb-1">Status Terlambat</label>
                                        <h4 className="font-weight-bold mb-0">{data.keterlambatan} Hari</h4>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 shadow-none p-3 h-100" style={{ backgroundColor: '#fff4e5', borderRadius: '10px' }}>
                                        <label className="small text-muted text-uppercase font-weight-bold mb-1 text-primary">Kalkulasi Denda</label>
                                        <h4 className="font-weight-bold mb-0" style={{ color: '#f96d00' }}>{formatCurrency(data.denda)}</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-top">
                                <button type="submit" className="btn btn-primary btn-block py-3 font-weight-bold shadow-sm" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00' }}>
                                    {processing ? 'Menyimpan...' : 'Perbarui Data Pengembalian'}
                                </button>
                                <button type="button" onClick={() => forceNavigate('/pengembalian')} className="btn btn-link btn-block text-muted small mt-2">Batal & Kembali</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .form-control { border-radius: 8px; padding: 12px 15px; border: 1px solid #ddd; height: auto; }
                .form-control:focus { border-color: #f96d00; box-shadow: 0 0 0 0.2rem rgba(249, 109, 0, 0.1); }
            `}} />
        </AdminLayout>
    );
}
