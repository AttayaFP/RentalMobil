import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <TemplateLayout showHero={false}>
            <Head title="Tentang Kami - CarBook" />
            
            <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/assets/template/images/bg_1.jpg')", height: '400px' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center" style={{ height: '400px' }}>
                        <div className="col-lg-8 text-center" data-aos="fade-up">
                            <h1 className="mb-3 text-white font-weight-bold">Tentang Kami</h1>
                            <p className="breadcrumbs text-white">
                                <span><a href="/" className="text-white">Beranda</a></span> / <span>Tentang Kami</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section ftco-about">
                <div className="container">
                    <div className="row no-gutters">
                        <div className="col-md-6 p-md-5 img img-2 d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/assets/template/images/about.jpg')", minHeight: '400px' }} data-aos="fade-right">
                        </div>
                        <div className="col-md-6 wrap-about p-4 p-md-5" data-aos="fade-left">
                            <div className="heading-section">
                                <span className="subheading" style={{ color: '#01d28e' }}>Selamat Datang di CarBook</span>
                                <h2 className="mb-4">Perusahaan Rental Mobil Terpercaya</h2>
                                <p>Kami adalah penyedia layanan transportasi terkemuka yang berkomitmen untuk memberikan pengalaman berkendara yang aman, nyaman, dan terjangkau bagi semua pelanggan kami. Dengan mobil yang terawat dengan baik dan pelayanan pelanggan yang ramah, kami siap mendukung perjalanan Anda.</p>
                                <p>Visi kami adalah menjadi pilihan utama dalam layanan penyewaan kendaraan dengan mengedepankan kualitas dan integritas.</p>
                                <p><a href="/cars" className="btn btn-primary py-3 px-4">Lihat Mobil Kami</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section ftco-intro" style={{ backgroundImage: "url('/assets/template/images/bg_3.jpg')" }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row justify-content-end">
                        <div className="col-md-6 heading-section heading-section-white" data-aos="fade-up">
                            <h2 className="mb-3">Ingin Menjadi Bagian dari Perjalanan Kami?</h2>
                            <p>Hubungi kami sekarang untuk mendapatkan penawaran terbaik khusus untuk perjalanan Anda berikutnya.</p>
                            <a href="/contact" className="btn btn-primary btn-lg">Hubungi Kami</a>
                        </div>
                    </div>
                </div>
            </section>
        </TemplateLayout>
    );
}
