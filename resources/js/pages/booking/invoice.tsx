import AdminLayout from '@/layouts/AdminLayout';
import TemplateLayout from '@/layouts/TemplateLayout';
import { Head, Link, usePage } from '@inertiajs/react';

interface Booking {
    kdbooking: string;
    tglbooking: string;
    tglmulai: string;
    tglselesai: string;
    lama_sewa: number;
    total_bayar: number;
    payment_method: string;
    status: string;
    transaction_time: string;
}

interface User {
    nama_lengkap: string;
    alamat: string;
    nohp: string;
}

interface Mobil {
    nama_mobil: string;
    plat_mobil: string;
    stnk_mobil: string;
}

interface Props {
    booking: Booking;
    user: User;
    mobil: Mobil;
}

const ORANGE = '#f96d00';
const DARK = '#222831';
const GRAY = '#6c757d';

export default function Invoice({ booking, user, mobil }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const authUser = auth?.user;
    const isPelanggan = authUser?.role === 'pelanggan';

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(n);

    const formatDate = (s: string) => {
        if (!s) return '-';
        const d = new Date(s);
        const names = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return `${names[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

    const formatShort = (s: string) => {
        if (!s) return '-';
        const d = new Date(s);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

    const txTime = booking.transaction_time || booking.tglbooking;

    const badge = (() => {
        const s = (booking.status ?? '').toLowerCase();
        if (['sukses', 'success', 'berhasil', 'selesai'].includes(s))
            return { bg: '#d4edda', color: '#155724' };
        if (s === 'pending') return { bg: '#fff3cd', color: '#856404' };
        return { bg: '#f8d7da', color: '#721c24' };
    })();

    const content = (
        <>
            <div className="inv-toolbar row justify-content-center mb-3 no-print">
                <div className="col-xl-10 d-flex justify-content-between align-items-center">
                    <Link href={isPelanggan ? "/" : "/booking"} className="btn btn-link text-muted p-0" style={{ fontWeight: 500 }}>
                        <i className="ion-ios-arrow-back mr-2" />Kembali
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="btn px-4"
                        style={{ borderRadius: '8px', background: DARK, color: '#fff', fontWeight: 600, fontSize: '13px' }}
                    >
                        <i className="ion-ios-printer mr-2" />Cetak Faktur
                    </button>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-xl-10">
                    <div
                        id="inv"
                        style={{
                            background: '#fff',
                            borderRadius: '14px',
                            boxShadow: '0 6px 32px rgba(0,0,0,0.10)',
                            overflow: 'hidden',
                            fontFamily: "'Poppins','Segoe UI',sans-serif",
                        }}
                    >
                        <div style={{
                            background: `linear-gradient(135deg, ${DARK} 0%, #393e46 55%, ${ORANGE} 100%)`,
                            padding: '18px 28px',
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <div style={{ position: 'absolute', top: '-28px', right: '-28px', width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(249,109,0,0.18)' }} />
                            <div style={{ position: 'absolute', bottom: '-18px', right: '80px', width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '2px', lineHeight: 1 }}>
                                    Car<span style={{ color: ORANGE }}>Book</span>
                                </div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>
                                    PT. Nabil Rental Mobil Padang
                                </div>
                            </div>

                            <div style={{ position: 'relative', zIndex: 1, textAlign: 'right' }}>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Faktur Pembayaran
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '1px' }}>
                                    #{booking.kdbooking}
                                </div>
                                <span style={{
                                    display: 'inline-block', marginTop: '3px',
                                    padding: '2px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.5px',
                                    background: badge.bg, color: badge.color,
                                }}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>

                        <div style={{ padding: '18px 28px' }}>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                                <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '8px', padding: '11px 14px', borderLeft: `3px solid ${ORANGE}` }}>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
                                        <i className="ion-ios-person mr-1" />Informasi Pelanggan
                                    </div>
                                    <Row label="Nama" value={user.nama_lengkap} />
                                    <Row label="Alamat" value={user.alamat || '-'} />
                                    <Row label="No. HP" value={user.nohp || '-'} />
                                </div>

                                <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '8px', padding: '11px 14px', borderLeft: `3px solid ${DARK}` }}>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: DARK, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
                                        <i className="ion-ios-time mr-1" />Detail Transaksi
                                    </div>
                                    <Row label="Waktu" value={formatDate(txTime)} />
                                    <Row label="Status" value={booking.status} />
                                    <Row label="Metode" value={booking.payment_method || '-'} />
                                </div>
                            </div>

                            <div style={{ borderTop: '1.5px dashed #dee2e6', margin: '2px 0 12px' }} />

                            <div style={{ fontSize: '9px', fontWeight: 700, color: GRAY, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>
                                <i className="ion-ios-car mr-1" />Detail Kendaraan &amp; Sewa
                            </div>

                            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1.5px solid #e9ecef', marginBottom: '12px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: DARK }}>
                                            {['Nama Mobil', 'Plat Mobil', 'STNK Mobil', 'Lama Rental', 'Tgl Rental', 'Tgl Selesai'].map((c) => (
                                                <th key={c} style={{
                                                    padding: '9px 10px', color: '#fff', fontSize: '10px',
                                                    fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap',
                                                }}>
                                                    {c}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <Td>{mobil.nama_mobil}</Td>
                                            <Td>{mobil.plat_mobil}</Td>
                                            <Td>{mobil.stnk_mobil}</Td>
                                            <Td extra={{ color: ORANGE, fontWeight: 700 }}>{booking.lama_sewa} Hari</Td>
                                            <Td>{formatShort(booking.tglmulai)}</Td>
                                            <Td>{formatShort(booking.tglselesai)}</Td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
                                <div style={{ minWidth: '290px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid #e9ecef' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderBottom: '1px solid #e9ecef' }}>
                                        <span style={{ fontSize: '11px', color: GRAY, fontWeight: 600 }}>
                                            <i className="ion-ios-card mr-1" style={{ color: ORANGE }} />Metode Pembayaran
                                        </span>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: DARK }}>{booking.payment_method || '-'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: `linear-gradient(135deg, ${DARK}, #393e46)` }}>
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Total Pembayaran</span>
                                        <span style={{ fontSize: '16px', fontWeight: 800, color: ORANGE }}>{formatCurrency(booking.total_bayar)}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                <Sig top="Mengetahui," role="Pelanggan" name={user.nama_lengkap} />
                                <Sig
                                    top={`Padang, ${new Date(txTime).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`}
                                    role="Petugas"
                                    name="PT. Nabil Rental Mobil"
                                />
                            </div>

                            <div style={{ marginTop: '12px', padding: '9px 14px', borderRadius: '7px', background: '#fff8f3', border: '1px solid #fde8d8', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '10px', color: '#9a6033', fontWeight: 500 }}>
                                    <i className="ion-ios-information-circle mr-1" />
                                    Terima kasih atas kepercayaan Anda. Simpan faktur ini sebagai bukti pengambilan kendaraan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

                @media print {
                    /* ── Sembunyikan semua elemen Admin & Website, hanya tampilkan invoice ── */
                    .inv-toolbar,
                    .admin-sidebar,
                    nav.navbar,
                    .sticky-top,
                    .no-print,
                    footer { display: none !important; }

                    /* ── Reset layout admin & website ── */
                    .admin-wrapper, .template-wrapper { display: block !important; background: #fff !important; }
                    .main-panel    { margin-left: 0 !important; width: 100% !important; }
                    .content-body  { padding: 0 !important; margin: 0 !important; }
                    main { padding-top: 0 !important; }

                    html, body {
                        margin: 0 !important; padding: 0 !important;
                        background: #fff !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 6mm;
                    }

                    #inv {
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        zoom: 0.78;
                        page-break-after: avoid;
                        page-break-before: avoid;
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}} />
        </>
    );

    if (isPelanggan) {
        return (
            <TemplateLayout showHero={false}>
                <Head title={`Faktur #${booking.kdbooking}`} />
                <section className="ftco-section bg-light py-5">
                    <div className="container">
                        {content}
                    </div>
                </section>
            </TemplateLayout>
        );
    }

    return (
        <AdminLayout title={`Faktur ${booking.kdbooking}`}>
            <Head title={`Faktur #${booking.kdbooking}`} />
            {content}
        </AdminLayout>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: GRAY, width: '52px', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: '10px', color: GRAY, margin: '0 5px' }}>:</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: DARK, wordBreak: 'break-word' }}>{value}</span>
        </div>
    );
}

function Sig({ top, role, name }: { top: string; role: string; name: string }) {
    return (
        <div style={{ textAlign: 'center', minWidth: '160px' }}>
            <p style={{ margin: 0, fontSize: '10px', color: GRAY }}>{top}</p>
            <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '11px', color: DARK }}>{role}</p>
            <div style={{ height: '40px' }} />
            <div style={{ borderTop: `1.5px solid ${DARK}`, paddingTop: '4px', fontSize: '10px', fontWeight: 700, color: DARK }}>
                ( {name} )
            </div>
        </div>
    );
}

function Td({ children, extra = {} }: { children: React.ReactNode; extra?: React.CSSProperties }) {
    return (
        <td style={{
            padding: '10px 9px', textAlign: 'center',
            fontSize: '11px', fontWeight: 500, color: DARK,
            ...extra,
        }}>
            {children}
        </td>
    );
}
