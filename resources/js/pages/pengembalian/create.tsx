import AdminLayout from '@/layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

interface Booking {
    kdbooking: string;
    tglmulai: string;
    tglselesai: string;
    iduser: number;
    harga: number;
}

interface Props {
    bookings: Booking[];
    next_kdpengembalian: string;
}

export default function Create({ bookings, next_kdpengembalian }: Props) {
    const { data, setData, post, processing } = useForm({
        kdpengembalian: next_kdpengembalian,
        kdbooking: '',
        iduser: '',
        tglmulai: '',
        tglselesai: '',
        tglpengembalian: new Date().toISOString().split('T')[0],
        keterlambatan: '0',
        denda: '0',
    });

    const calculateLateFees = (tglSelesai: string, tglKembali: string, kdBooking: string) => {
        if (!tglSelesai || !tglKembali || !kdBooking) return { keterlambatan: '0', denda: '0' };
        
        const booking = bookings.find(b => b.kdbooking.trim() === kdBooking.trim());
        const harga = booking ? Number(booking.harga) : 0;
        
        const selesai = new Date(tglSelesai);
        const riil = new Date(tglKembali);
        selesai.setHours(0, 0, 0, 0);
        riil.setHours(0, 0, 0, 0);

        const diffTime = riil.getTime() - selesai.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            return { keterlambatan: diffDays.toString(), denda: (diffDays * harga).toString() };
        }
        return { keterlambatan: '0', denda: '0' };
    };

    const handleBookingChange = (kdbooking: string) => {
        const booking = bookings.find(b => b.kdbooking.trim() === kdbooking.trim());
        if (booking) {
            const fees = calculateLateFees(booking.tglselesai, data.tglpengembalian, kdbooking);
            setData(prev => ({
                ...prev,
                kdbooking,
                iduser: booking.iduser.toString(),
                tglmulai: booking.tglmulai,
                tglselesai: booking.tglselesai,
                keterlambatan: fees.keterlambatan,
                denda: fees.denda,
            }));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pengembalian');
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount) || 0);
    };

    return (
        <AdminLayout title="Input Pengembalian Mobil">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form onSubmit={submit}>
                        <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                            <div className="mb-4 d-flex align-items-center">
                                <button type="button" onClick={() => forceNavigate('/pengembalian')} className="btn btn-link text-muted p-0 mr-3">
                                    <i className="ion-ios-arrow-back" style={{ fontSize: '24px' }}></i>
                                </button>
                                <h4 className="font-weight-bold mb-0">Form Serah Terima Unit</h4>
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group mb-4">
                                    <label className="font-weight-bold text-dark small text-uppercase">Kode Pengembalian</label>
                                    <div className="form-control bg-light d-flex align-items-center font-weight-bold" style={{ cursor: 'default', userSelect: 'none', minHeight: '50px' }}>
                                        {data.kdpengembalian}
                                    </div>
                                </div>
                                <div className="col-md-6 form-group mb-4">
                                    <label className="font-weight-bold text-dark small text-uppercase">Referensi Booking</label>
                                    <select className="form-control" value={data.kdbooking} onChange={e => handleBookingChange(e.target.value)} required>
                                        <option value="">-- Pilih Booking Aktif --</option>
                                        {bookings.map(b => <option key={b.kdbooking} value={b.kdbooking}>{b.kdbooking} ({b.tglmulai})</option>)}
                                    </select>
                                </div>
                                
                                <div className="col-md-12 mb-4">
                                    <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                                        <div className="small">
                                            <span className="text-muted text-uppercase font-weight-bold mr-2">Status Sewa:</span>
                                            <span className="font-weight-bold">{data.tglmulai || '-'} s/d {data.tglselesai || '-'}</span>
                                        </div>
                                        <div className="small">
                                            <span className="text-muted text-uppercase font-weight-bold mr-2">User ID:</span>
                                            <span className="font-weight-bold">#{data.iduser || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 form-group mb-4">
                                    <label className="font-weight-bold text-dark small text-uppercase">Tanggal Pengembalian Riil</label>
                                    <input type="date" className="form-control form-control-lg font-weight-bold" style={{ border: '2px solid #f96d00' }} value={data.tglpengembalian} onChange={e => {
                                        const fees = calculateLateFees(data.tglselesai, e.target.value, data.kdbooking);
                                        setData(prev => ({ ...prev, tglpengembalian: e.target.value, keterlambatan: fees.keterlambatan, denda: fees.denda }));
                                    }} required />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 shadow-none p-3 h-100" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                                        <label className="small text-muted text-uppercase font-weight-bold mb-1">Keterlambatan</label>
                                        <h4 className="font-weight-bold mb-0 text-dark">{data.keterlambatan} <small>Hari</small></h4>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 shadow-none p-3 h-100" style={{ backgroundColor: '#fff4e5', borderRadius: '10px' }}>
                                        <label className="small text-muted text-uppercase font-weight-bold mb-1 text-primary">Denda yang Harus Dibayar</label>
                                        <h4 className="font-weight-bold mb-0" style={{ color: '#f96d00' }}>{formatCurrency(data.denda)}</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-top">
                                <button type="submit" className="btn btn-primary btn-block py-3 font-weight-bold" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00' }}>
                                    {processing ? 'Menyimpan...' : 'Konfirmasi Pengembalian'}
                                </button>
                                <button type="button" onClick={() => forceNavigate('/pengembalian')} className="btn btn-link btn-block text-muted small mt-2">Batal</button>
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
