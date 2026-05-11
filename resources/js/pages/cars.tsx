import TemplateLayout from '@/layouts/TemplateLayout';
import { Head, Link } from '@inertiajs/react';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    harga: number;
    foto: string | null;
    status: string;
}

interface Props {
    mobils: Mobil[];
}

export default function Cars({ mobils }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <TemplateLayout showHero={false}>
            <Head title="Mobil Kami - CarBook" />
            
            <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/assets/template/images/bg_1.jpg')", height: '400px' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center" style={{ height: '400px' }}>
                        <div className="col-lg-8 text-center" data-aos="fade-up">
                            <h1 className="mb-3 text-white font-weight-bold">Mobil Kami</h1>
                            <p className="breadcrumbs text-white">
                                <span><a href="/" className="text-white">Beranda</a></span> / <span>Pilihan Mobil</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row">
                        {mobils.map((mobil, index) => (
                            <div key={mobil.kdmobil} className="col-md-4" data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="car-wrap rounded ftco-animate fadeInUp ftco-animated shadow-sm bg-white mb-4">
                                    <div className="img rounded d-flex align-items-end" style={{ backgroundImage: `url(${mobil.foto ? '/storage/' + mobil.foto : '/assets/template/images/car-1.jpg'})`, height: '240px', backgroundSize: 'cover' }}>
                                    </div>
                                    <div className="text p-4">
                                        <h2 className="mb-0"><a href="#">{mobil.nama_mobil}</a></h2>
                                        <div className="d-flex mb-3">
                                            <span className="cat">{mobil.plat_mobil}</span>
                                            <p className="price ml-auto">{formatCurrency(mobil.harga)} <span>/hari</span></p>
                                        </div>
                                        <p className="d-flex mb-0 d-block">
                                            <Link 
                                                href={mobil.status === 'Tersedia' ? `/booking/create?kdmobil=${mobil.kdmobil}` : '#'} 
                                                className={`btn py-2 ml-1 w-100 ${mobil.status === 'Tersedia' ? 'btn-primary' : 'btn-secondary disabled'}`}
                                                style={{ 
                                                    backgroundColor: mobil.status === 'Tersedia' ? '#01d28e' : '#6c757d', 
                                                    borderColor: mobil.status === 'Tersedia' ? '#01d28e' : '#6c757d',
                                                    cursor: mobil.status === 'Tersedia' ? 'pointer' : 'not-allowed'
                                                }}
                                            >
                                                {mobil.status === 'Tersedia' ? 'Sewa Sekarang' : 'Tidak Tersedia'}
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {mobils.length === 0 && (
                            <div className="col-md-12 text-center py-5 text-muted">
                                Maaf, saat ini tidak ada mobil yang tersedia untuk disewa.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </TemplateLayout>
    );
}
