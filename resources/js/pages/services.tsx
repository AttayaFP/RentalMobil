import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Services() {
    const services = [
        { title: 'Antar Jemput Bandara', icon: 'ion-ios-airplane', desc: 'Layanan penjemputan dan pengantaran ke bandara tepat waktu.' },
        { title: 'Sewa Mobil Harian', icon: 'ion-ios-car', desc: 'Pilihan sewa mobil harian dengan tarif yang sangat kompetitif.' },
        { title: 'Sewa Mobil Pengantin', icon: 'ion-ios-heart', desc: 'Pilihan mobil mewah untuk momen spesial pernikahan Anda.' },
        { title: 'City Tour', icon: 'ion-ios-map', desc: 'Paket perjalanan wisata keliling kota dengan driver profesional.' },
        { title: 'Sewa Jangka Panjang', icon: 'ion-ios-calendar', desc: 'Solusi transportasi untuk kebutuhan bulanan atau tahunan perusahaan.' },
        { title: 'Layanan Darurat 24/7', icon: 'ion-ios-help-buoy', desc: 'Bantuan darurat di jalan siap melayani Anda kapan saja.' },
    ];

    return (
        <TemplateLayout showHero={false}>
            <Head title="Layanan Kami - CarBook" />
            
            <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/assets/template/images/bg_1.jpg')", height: '400px' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center" style={{ height: '400px' }}>
                        <div className="col-lg-8 text-center" data-aos="fade-up">
                            <h1 className="mb-3 text-white font-weight-bold">Layanan Kami</h1>
                            <p className="breadcrumbs text-white">
                                <span><a href="/" className="text-white">Beranda</a></span> / <span>Layanan</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section">
                <div className="container">
                    <div className="row justify-content-center mb-5">
                        <div className="col-md-7 text-center heading-section" data-aos="fade-up">
                            <span className="subheading" style={{ color: '#01d28e' }}>Apa yang Kami Tawarkan</span>
                            <h2 className="mb-3">Layanan Transportasi Terbaik</h2>
                        </div>
                    </div>
                    <div className="row">
                        {services.map((item, index) => (
                            <div key={index} className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="services-wrap rounded bg-white p-4 shadow-sm text-center border-bottom border-success">
                                    <div className="icon d-flex align-items-center justify-content-center mb-4 mx-auto" style={{ width: '80px', height: '80px', background: '#f8f9fa', borderRadius: '50%' }}>
                                        <i className={`${item.icon}`} style={{ fontSize: '40px', color: '#01d28e' }}></i>
                                    </div>
                                    <h3 className="h5 font-weight-bold">{item.title}</h3>
                                    <p className="text-muted small">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </TemplateLayout>
    );
}
