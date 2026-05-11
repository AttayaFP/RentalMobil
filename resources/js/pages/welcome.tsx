import TemplateLayout from '@/layouts/TemplateLayout';
import { usePage, router, Link } from '@inertiajs/react';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    harga: number;
    kdkategori: string;
    status: string;
    foto: string | null;
}

interface Props {
    mobils: Mobil[];
}

export default function Welcome({ mobils = [] }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number; role: string; nama_lengkap?: string; name?: string } } }>().props;
    const user = auth?.user;

    const formatCurrency = (amount: number) => {
        try {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
        } catch {
            return amount;
        }
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    const handleSewaClick = (kdmobil?: string) => {
        if (!user) {
            forceNavigate('/login');
        } else if (user.role === 'pelanggan') {
            forceNavigate(`/booking/create${kdmobil ? '?kdmobil=' + kdmobil : ''}`);
        } else {
            forceNavigate('/booking');
        }
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };



    return (
        <TemplateLayout showHero={false}>
            <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/assets/template/images/bg_1.jpg')", opacity: 1, position: 'relative', minHeight: '100vh' }}>
                <div className="overlay"></div>
                <div style={{
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    zIndex: 1100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '10px'
                }} className="no-print">
                    <div style={{
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(15px)',
                        padding: '10px 25px',
                        borderRadius: '40px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}>
                        <Link href="/" className="nav-link-custom active">Home</Link>
                        <Link href="/about" className="nav-link-custom">Tentang</Link>
                        <Link href="/services" className="nav-link-custom">Layanan</Link>
                        <Link href="/pricing" className="nav-link-custom">Harga</Link>
                        <Link href="/cars" className="nav-link-custom">Mobil</Link>
                        <Link href="/contact" className="nav-link-custom">Kontak</Link>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {!user ? (
                            <div className="d-flex gap-2">
                                <button 
                                    onClick={() => forceNavigate('/login')} 
                                    className="btn px-4 py-2"
                                    style={{ 
                                        background: 'rgba(255,255,255,0.1)', 
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: '#fff',
                                        borderRadius: '30px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => forceNavigate('/register')} 
                                    className="btn px-4 py-2"
                                    style={{ 
                                        background: '#01d28e', 
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '30px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 15px rgba(1, 210, 142, 0.3)'
                                    }}
                                >
                                    Daftar
                                </button>
                            </div>
                        ) : (
                            <div style={{ 
                                background: 'rgba(255,255,255,0.15)', 
                                backdropFilter: 'blur(10px)',
                                padding: '8px 20px',
                                borderRadius: '40px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                color: '#fff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                            }}>
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: '#01d28e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '10px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 0 10px rgba(1, 210, 142, 0.4)'
                                    }}>
                                        {user.nama_lengkap?.charAt(0) || user.name?.charAt(0)}
                                    </div>
                                    <span className="small font-weight-bold">{user.nama_lengkap || user.name}</span>
                                </div>
                                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />
                                {user.role !== 'pelanggan' && (
                                    <Link href="/dashboard" className="text-white small font-weight-bold" style={{ textDecoration: 'none' }}>
                                        Dashboard
                                    </Link>
                                )}
                                <form onSubmit={handleLogout}>
                                    <button type="submit" className="btn btn-link text-white p-0 small font-weight-bold" style={{ textDecoration: 'none', color: '#ff4b2b' }}>
                                        Logout
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <div className="container">
                    <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                        <div className="col-lg-8">
                            <div className="text w-100 text-center mb-md-5 pb-md-5" data-aos="fade-up" data-aos-duration="1000">
                                <h1 className="mb-4" style={{ color: '#fff', fontWeight: 800, fontSize: '60px' }}>Cara Cepat &amp; Mudah Menyewa Mobil</h1>
                                <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 40px' }}>Temukan mobil terbaik untuk perjalanan Anda dengan harga yang sangat kompetitif dan pelayanan prima.</p>
                                <div className="d-flex justify-content-center mt-4" data-aos="fade-up" data-aos-delay="200">
                                    <button onClick={() => handleSewaClick()} className="btn btn-primary py-4 px-5 mr-2" style={{ cursor: 'pointer', borderRadius: '50px', fontWeight: 'bold', fontSize: '16px', backgroundColor: '#01d28e', border: 'none' }}>
                                        Pesan Mobil Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .nav-link-custom {
                    color: rgba(255,255,255,0.8);
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: all 0.3s;
                }
                .nav-link-custom:hover {
                    color: #01d28e;
                }
                .nav-link-custom.active {
                    color: #01d28e;
                }
            `}} />

            <section className="ftco-section ftco-no-pt bg-light">
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col-md-12 featured-top">
                            <div className="row no-gutters">
                                <div className="col-md-4 d-flex align-items-center" data-aos="fade-up" data-aos-delay="100">
                                    <div className="request-form bg-primary w-100 p-4" style={{ backgroundColor: '#01d28e !important' }}>
                                        <h2 className="h4 text-white mb-4">Rencanakan Perjalanan</h2>
                                        <div className="form-group">
                                            <label className="label text-white">Lokasi Penjemputan</label>
                                            <input type="text" className="form-control" placeholder="Kota, Bandara, Stasiun" />
                                        </div>
                                        <div className="form-group mt-3">
                                            <button onClick={() => handleSewaClick()} className="btn btn-secondary py-3 px-4 w-100">
                                                Cek Ketersediaan Mobil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8 d-flex align-items-center" data-aos="fade-up" data-aos-delay="200">
                                    <div className="services-wrap rounded-right w-100 bg-white p-4 shadow-sm">
                                        <h3 className="heading-section mb-4">Sewa Mobil Impian Anda Sekarang</h3>
                                        <div className="row mb-4">
                                            <div className="col-md-4 text-center" data-aos="fade-up" data-aos-delay="300">
                                                <span className="flaticon-route" style={{ fontSize: '40px', color: '#01d28e' }}></span>
                                                <h3 className="h6 mt-2">Pilih Lokasi</h3>
                                            </div>
                                            <div className="col-md-4 text-center" data-aos="fade-up" data-aos-delay="400">
                                                <span className="flaticon-handshake" style={{ fontSize: '40px', color: '#01d28e' }}></span>
                                                <h3 className="h6 mt-2">Penawaran Terbaik</h3>
                                            </div>
                                            <div className="col-md-4 text-center" data-aos="fade-up" data-aos-delay="500">
                                                <span className="flaticon-rent" style={{ fontSize: '40px', color: '#01d28e' }}></span>
                                                <h3 className="h6 mt-2">Pesan Mobil</h3>
                                            </div>
                                        </div>
                                        <button onClick={() => handleSewaClick()} className="btn btn-primary py-3 px-4" style={{ backgroundColor: '#01d28e', border: 'none' }}>Mulai Sewa Sekarang</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12 heading-section text-center mb-5" data-aos="fade-up">
                            <h2 className="mb-2">Mobil Unggulan</h2>
                        </div>
                    </div>
                    <div className="row">
                        {mobils && mobils.length > 0 ? mobils.slice(0, 6).map((mobil, index) => (
                            <div key={mobil.kdmobil} className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="car-wrap rounded shadow-sm bg-white overflow-hidden" style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        left: '15px',
                                        zIndex: 10,
                                        background: mobil.status === 'Tersedia' ? '#01d28e' : '#ff4b2b',
                                        color: '#fff',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        {mobil.status}
                                    </div>
                                    <div className="img d-flex align-items-end" style={{ backgroundImage: `url(${mobil.foto ? '/storage/' + mobil.foto : '/assets/template/images/car-1.jpg'})`, height: '240px', backgroundSize: 'cover' }}>
                                    </div>
                                    <div className="p-4 text-center">
                                        <h2 className="mb-2 h5 font-weight-bold">{mobil.nama_mobil}</h2>
                                        <p className="price text-primary font-weight-bold" style={{ color: '#01d28e !important' }}>{formatCurrency(mobil.harga)}</p>
                                        <button 
                                            onClick={() => mobil.status === 'Tersedia' && handleSewaClick(mobil.kdmobil)} 
                                            className="btn btn-primary py-2 w-100" 
                                            style={{ 
                                                backgroundColor: mobil.status === 'Tersedia' ? '#01d28e' : '#6c757d', 
                                                border: 'none',
                                                cursor: mobil.status === 'Tersedia' ? 'pointer' : 'not-allowed',
                                                opacity: mobil.status === 'Tersedia' ? 1 : 0.6
                                            }}
                                            disabled={mobil.status !== 'Tersedia'}
                                        >
                                            {mobil.status === 'Tersedia' ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-md-12 text-center py-5 text-muted">Tidak ada mobil tersedia saat ini.</div>
                        )}
                    </div>
                </div>
            </section>
        </TemplateLayout>
    );
}
