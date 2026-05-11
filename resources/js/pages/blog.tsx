import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Blog() {
    const posts = [
        { date: '25 Mei 2026', title: 'Tips Merawat Mobil Rental Agar Tetap Nyaman', img: '/assets/template/images/image_1.jpg' },
        { date: '12 Juni 2026', title: 'Destinasi Wisata Tersembunyi di Sumatera Barat', img: '/assets/template/images/image_2.jpg' },
        { date: '05 Juli 2026', title: 'Cara Memilih Mobil yang Tepat untuk Perjalanan Jauh', img: '/assets/template/images/image_3.jpg' },
    ];

    return (
        <TemplateLayout showHero={false}>
            <Head title="Blog - CarBook" />
            
            <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/assets/template/images/bg_1.jpg')", height: '400px' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center" style={{ height: '400px' }}>
                        <div className="col-lg-8 text-center" data-aos="fade-up">
                            <h1 className="mb-3 text-white font-weight-bold">Blog & Artikel</h1>
                            <p className="breadcrumbs text-white">
                                <span><a href="/" className="text-white">Beranda</a></span> / <span>Blog</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section">
                <div className="container">
                    <div className="row">
                        {posts.map((post, index) => (
                            <div key={index} className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className="blog-entry shadow-sm rounded overflow-hidden bg-white">
                                    <div className="block-20" style={{ backgroundImage: `url(${post.img})`, height: '250px', backgroundSize: 'cover' }}>
                                    </div>
                                    <div className="text p-4">
                                        <div className="meta mb-3">
                                            <div><span className="text-muted">{post.date}</span></div>
                                            <div><span className="text-primary">Admin</span></div>
                                        </div>
                                        <h3 className="heading h5 font-weight-bold"><a href="#" className="text-dark">{post.title}</a></h3>
                                        <p className="small text-muted">Pelajari lebih lanjut tentang tips perjalanan dan pemeliharaan kendaraan bersama kami.</p>
                                        <p><a href="#" className="btn btn-primary py-2 px-3">Baca Selengkapnya</a></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </TemplateLayout>
    );
}
