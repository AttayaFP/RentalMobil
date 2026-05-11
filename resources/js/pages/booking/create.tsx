import AdminLayout from '@/layouts/AdminLayout';
import TemplateLayout from '@/layouts/TemplateLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface AuthUser {
    id: number;
    nama_lengkap: string;
    role: string;
}

interface UserItem {
    id: number;
    nama_lengkap: string;
}

interface MobilItem {
    kdmobil: string;
    nama_mobil: string;
    plat_mobil: string;
    harga: number;
    foto: string | null;
    status: string;
}

interface Props {
    users: UserItem[];
    mobils: MobilItem[];
    selected_kdmobil?: string;
    next_kdbooking: string;
}

export default function Create({ users, mobils, selected_kdmobil, next_kdbooking }: Props) {
    const { auth } = usePage<any>().props;
    const user: AuthUser = auth.user;
    const isPelanggan = user.role === 'pelanggan';

    const { data, setData, post, processing, errors } = useForm({
        kdbooking:      next_kdbooking,
        tglbooking:     new Date().toISOString().split('T')[0],
        iduser:         isPelanggan ? user.id.toString() : '',
        kdmobil:        selected_kdmobil || '',
        harga:          '',
        tglmulai:       '',
        tglselesai:     '',
        lama_sewa:      '',
        total_bayar:    '',
        payment_method: 'Midtrans',
        status:         'Pending',
    });

    // Derived — selalu sinkron tanpa perlu state/useEffect tambahan
    const selectedMobil: MobilItem | null = mobils.find(m => m.kdmobil?.toString().trim() === data.kdmobil?.toString().trim()) ?? null;

    // Sync harga when car changes
    useEffect(() => {
        const m = mobils.find(x => x.kdmobil?.toString().trim() === data.kdmobil?.toString().trim()) ?? null;
        setData('harga', m ? m.harga.toString() : '');
    }, [data.kdmobil]);

    // Auto-calculate lama_sewa & total
    useEffect(() => {
        if (data.tglmulai && data.tglselesai && data.harga) {
            const start = new Date(data.tglmulai);
            const end   = new Date(data.tglselesai);
            if (end >= start) {
                const days  = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
                const total = days * parseFloat(data.harga);
                setData(prev => ({ ...prev, lama_sewa: days.toString(), total_bayar: total.toString() }));
            } else {
                setData(prev => ({ ...prev, lama_sewa: '', total_bayar: '' }));
            }
        }
    }, [data.tglmulai, data.tglselesai, data.harga]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/booking');
    };

    const formatCurrency = (v: any) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

    const today = new Date().toISOString().split('T')[0];

    /* ─────────────────────────────────────────────────────
       TAMPILAN PELANGGAN — menggunakan TemplateLayout
       Desain Checkout / E-Commerce Style
    ───────────────────────────────────────────────────── */
    if (isPelanggan) {
        return (
            <TemplateLayout showHero={false}>
                <section className="ftco-section bg-light py-5">
                    <div className="container">
                        <div className="row justify-content-center mb-4">
                            <div className="col-md-10 text-center" data-aos="fade-up">
                                <span className="subheading" style={{ color: '#f96d00', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Konfirmasi Pesanan</span>
                                <h2 className="mb-2 font-weight-bold" style={{ color: '#222831' }}>Lengkapi Detail Sewa Anda</h2>
                                <p className="text-muted">Pastikan data perjalanan Anda sudah benar sebelum melanjutkan ke pembayaran.</p>
                            </div>
                        </div>

                        <form onSubmit={submit}>
                            <div className="row">
                                {/* ── LEFT: Form Input ── */}
                                <div className="col-lg-7" data-aos="fade-right">
                                    <div className="bg-white p-4 p-md-5 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                                        <h4 className="mb-4 font-weight-bold" style={{ color: '#222831', borderLeft: '5px solid #f96d00', paddingLeft: '15px' }}>Data Perjalanan</h4>
                                        
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormField label="Pilihan Mobil">
                                                    <div style={{ position: 'relative' }}>
                                                        <i className="ion-ios-car" style={iconSt} />
                                                        <select
                                                            className={`form-control ${errors.kdmobil ? 'is-invalid' : ''}`}
                                                            value={data.kdmobil}
                                                            onChange={e => setData('kdmobil', e.target.value)}
                                                            required
                                                            style={selectSt}
                                                        >
                                                            <option value="">-- Pilih Mobil --</option>
                                                            {mobils.map(m => (
                                                                <option key={m.kdmobil} value={m.kdmobil}>
                                                                    {m.nama_mobil} ({formatCurrency(m.harga)} / hari)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {errors.kdmobil && <Err msg={errors.kdmobil} />}
                                                </FormField>
                                            </div>

                                            <div className="col-md-6 mt-3">
                                                <FormField label="Mulai Rental">
                                                    <div style={{ position: 'relative' }}>
                                                        <i className="ion-ios-calendar" style={iconSt} />
                                                        <input
                                                            type="date"
                                                            className={`form-control ${errors.tglmulai ? 'is-invalid' : ''}`}
                                                            value={data.tglmulai}
                                                            min={today}
                                                            onChange={e => setData('tglmulai', e.target.value)}
                                                            required
                                                            style={inputSt}
                                                        />
                                                    </div>
                                                    {errors.tglmulai && <Err msg={errors.tglmulai} />}
                                                </FormField>
                                            </div>

                                            <div className="col-md-6 mt-3">
                                                <FormField label="Selesai Rental">
                                                    <div style={{ position: 'relative' }}>
                                                        <i className="ion-ios-calendar" style={iconSt} />
                                                        <input
                                                            type="date"
                                                            className={`form-control ${errors.tglselesai ? 'is-invalid' : ''}`}
                                                            value={data.tglselesai}
                                                            min={data.tglmulai || today}
                                                            onChange={e => setData('tglselesai', e.target.value)}
                                                            required
                                                            style={inputSt}
                                                        />
                                                    </div>
                                                    {errors.tglselesai && <Err msg={errors.tglselesai} />}
                                                </FormField>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <h4 className="mb-4 font-weight-bold" style={{ color: '#222831', borderLeft: '5px solid #f96d00', paddingLeft: '15px' }}>Informasi Pelanggan</h4>
                                            <div className="p-3 rounded bg-light border d-flex align-items-center mb-3">
                                                <div className="mr-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                    <i className="ion-ios-person" />
                                                </div>
                                                <div>
                                                    <p className="mb-0 small text-muted">Atas Nama</p>
                                                    <p className="mb-0 font-weight-bold">{user.nama_lengkap}</p>
                                                </div>
                                            </div>
                                            <p className="small text-muted"><i className="ion-ios-information-circle mr-1" /> Data ini akan digunakan untuk dokumen penyewaan Anda.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── RIGHT: Summary & Preview ── */}
                                <div className="col-lg-5" data-aos="fade-left">
                                    <div className="bg-white shadow-sm overflow-hidden" style={{ borderRadius: '20px', position: 'sticky', top: '20px' }}>
                                        {/* Image Preview */}
                                        <div style={{ height: '240px', background: '#eee', position: 'relative' }}>
                                            {selectedMobil?.foto ? (
                                                <img 
                                                    src={`/storage/${selectedMobil.foto}`} 
                                                    alt={selectedMobil.nama_mobil}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                                                    <i className="ion-ios-car" style={{ fontSize: '60px' }} />
                                                    <p className="small mt-2">Pratinjau Mobil</p>
                                                </div>
                                            )}
                                            {selectedMobil && (
                                                <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                                    {selectedMobil.plat_mobil}
                                                </div>
                                            )}
                                        </div>

                                        {/* Summary Content */}
                                        <div className="p-4 p-md-5">
                                            <h5 className="font-weight-bold mb-1" style={{ color: '#222831' }}>{selectedMobil?.nama_mobil || 'Belum Memilih Mobil'}</h5>
                                            <p className="text-primary small font-weight-bold mb-4">{selectedMobil ? formatCurrency(selectedMobil.harga) + ' / hari' : '-'}</p>
                                            
                                            <hr />
                                            
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Durasi Sewa</span>
                                                <span className="font-weight-bold text-dark">{data.lama_sewa || 0} Hari</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-4">
                                                <span className="text-muted">Metode Pembayaran</span>
                                                <span className="badge badge-info px-3 py-2" style={{ borderRadius: '10px' }}>Otomatis (Midtrans)</span>
                                            </div>

                                            <div className="p-3 mb-4 d-flex justify-content-between align-items-center" style={{ background: '#f96d00', color: '#fff', borderRadius: '12px' }}>
                                                <span className="font-weight-bold">Total Pembayaran</span>
                                                <span className="h4 mb-0 font-weight-bold">{formatCurrency(data.total_bayar)}</span>
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={processing || !data.kdmobil || !data.tglmulai || !data.tglselesai}
                                                className="btn btn-primary btn-block py-3 font-weight-bold"
                                                style={{ borderRadius: '12px', fontSize: '16px', boxShadow: '0 5px 15px rgba(249, 109, 0, 0.3)' }}
                                            >
                                                {processing ? 'Sedang Memproses...' : 'SEWA SEKARANG'}
                                            </button>
                                            <button type="button" onClick={() => window.location.href = '/'} className="btn btn-link btn-block text-muted small mt-2">
                                                Kembali ke Beranda
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
                <style dangerouslySetInnerHTML={{ __html: `
                    .form-control { border-radius: 12px; padding: 15px 15px 15px 45px; height: auto; border: 1px solid #eee; background: #fbfbfb; transition: all 0.3s; }
                    .form-control:focus { background: #fff; border-color: #f96d00; box-shadow: none; }
                    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: bold; margin-bottom: 8px; display: block; }
                ` }} />
            </TemplateLayout>
        );
    }

    /* ─────────────────────────────────────────────────────
       TAMPILAN ADMIN / PIMPINAN — Seperti Semula
    ───────────────────────────────────────────────────── */
    return (
        <AdminLayout title="Buat Pesanan Baru">
            <div className="row justify-content-center">
                <div className="col-lg-11">
                    <form onSubmit={submit}>
                        <div className="row">
                            <div className="col-md-7">
                                <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '15px' }}>
                                    <h5 className="font-weight-bold mb-4">Informasi Penyewaan</h5>
                                    <div className="row">
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Kode Booking</label>
                                            <input type="text" className="form-control bg-light font-weight-bold" value={data.kdbooking} disabled />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Tanggal Transaksi</label>
                                            <input type="date" className="form-control" value={data.tglbooking} onChange={e => setData('tglbooking', e.target.value)} required />
                                        </div>
                                        <div className="col-md-12 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Pilih Pelanggan</label>
                                            <select className="form-control" value={data.iduser} onChange={e => setData('iduser', e.target.value)} required>
                                                <option value="">-- Pilih Pelanggan --</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.nama_lengkap}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-12 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase">Pilih Mobil</label>
                                            <select className="form-control" value={data.kdmobil} onChange={e => setData('kdmobil', e.target.value)} required>
                                                <option value="">-- Pilih Mobil --</option>
                                                {mobils.map(m => (
                                                    <option key={m.kdmobil} value={m.kdmobil}>
                                                        {m.nama_mobil} — {m.plat_mobil} ({formatCurrency(m.harga)}/hari)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase text-primary">Tanggal Mulai</label>
                                            <input type="date" className="form-control" value={data.tglmulai} onChange={e => setData('tglmulai', e.target.value)} required />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="small font-weight-bold text-uppercase text-danger">Tanggal Selesai</label>
                                            <input type="date" className="form-control" value={data.tglselesai} onChange={e => setData('tglselesai', e.target.value)} required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="card shadow-sm border-0 p-4 bg-dark text-white mb-4" style={{ borderRadius: '15px' }}>
                                    <h5 className="font-weight-bold mb-4" style={{ color: '#f96d00' }}>Ringkasan Pembayaran</h5>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="opacity-75">Harga Unit / Hari</span>
                                        <span className="font-weight-bold">{formatCurrency(data.harga)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="opacity-75">Durasi Sewa</span>
                                        <span className="font-weight-bold">{data.lama_sewa || 0} Hari</span>
                                    </div>
                                    <hr className="bg-white opacity-25" />
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <h4 className="mb-0 font-weight-bold">Total Bayar</h4>
                                        <h3 className="mb-0 font-weight-bold" style={{ color: '#f96d00' }}>{formatCurrency(data.total_bayar)}</h3>
                                    </div>
                                    <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '12px' }}>
                                        <i className="ion-ios-information-circle mr-2"></i> Pembayaran akan diproses secara otomatis melalui gerbang pembayaran Midtrans.
                                    </div>
                                </div>

                                <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
                                    <button type="submit" className="btn btn-primary btn-block py-3 font-weight-bold shadow-sm" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00', borderRadius: '10px' }}>
                                        <i className="ion-ios-checkmark-circle mr-2"></i>
                                        {processing ? 'Memproses...' : 'Konfirmasi Booking'}
                                    </button>
                                    <button type="button" onClick={() => window.location.href = '/booking'} className="btn btn-link btn-block text-muted small mt-2">
                                        Batal &amp; Kembali
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .form-control { border-radius: 8px; padding: 12px 15px; border: 1px solid #ddd; height: auto; font-size: 14px; }
                .form-control:focus { border-color: #f96d00; box-shadow: 0 0 0 0.2rem rgba(249,109,0,0.1); }
                .opacity-75 { opacity: 0.75; }
                .opacity-25 { opacity: 0.25; }
            `}} />
        </AdminLayout>
    );
}

/* ── Shared style constants ── */
const inputSt: React.CSSProperties = {
    borderRadius: '12px', padding: '11px 14px 11px 40px',
    height: 'auto', border: '1px solid #eee', fontSize: '14px',
};
const selectSt: React.CSSProperties = {
    ...{ borderRadius: '12px', padding: '11px 14px 11px 40px', height: 'auto', border: '1px solid #eee', fontSize: '14px' },
};
const iconSt: React.CSSProperties = {
    position: 'absolute', left: '13px', top: '50%',
    transform: 'translateY(-50%)', color: '#f96d00', fontSize: '17px', zIndex: 1,
};

/* ── Pelanggan sub-components ── */
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="form-group mb-0">
            <label className="label">
                {label}
            </label>
            {children}
        </div>
    );
}

function Err({ msg }: { msg: string }) {
    return <div style={{ color: '#dc3545', fontSize: '11px', fontWeight: 600, marginTop: '4px' }}>{msg}</div>;
}
