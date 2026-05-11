import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Contact() {
    return (
        <TemplateLayout showHero={false}>
            <Head title="Kontak - CarBook" />
            
            <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/assets/template/images/bg_1.jpg')", height: '400px' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center" style={{ height: '400px' }}>
                        <div className="col-lg-8 text-center" data-aos="fade-up">
                            <h1 className="mb-3 text-white font-weight-bold">Hubungi Kami</h1>
                            <p className="breadcrumbs text-white">
                                <span><a href="/" className="text-white">Beranda</a></span> / <span>Kontak</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section contact-section">
                <div className="container">
                    <div className="row d-flex mb-5 contact-info">
                        <div className="col-md-12">
                            <h2 className="h3 font-weight-bold">Informasi Pengembang</h2>
                        </div>
                        <div className="w-100"></div>
                        <div className="col-md-4 d-flex" data-aos="fade-up">
                            <div className="info bg-white p-4 shadow-sm rounded w-100">
                                <p><span className="font-weight-bold" style={{ color: '#01d28e' }}>Nama Pengembang:</span> <br /> Attaya Fiqri Pradana</p>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex" data-aos="fade-up" data-aos-delay="100">
                            <div className="info bg-white p-4 shadow-sm rounded w-100">
                                <p><span className="font-weight-bold" style={{ color: '#01d28e' }}>NoBP / NIM:</span> <br /> 2210019</p>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex" data-aos="fade-up" data-aos-delay="200">
                            <div className="info bg-white p-4 shadow-sm rounded w-100">
                                <p><span className="font-weight-bold" style={{ color: '#01d28e' }}>Tujuan Website:</span> <br /> Skripsi S1 Sistem Informasi</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row block-9">
                        <div className="col-md-6 order-md-last d-flex" data-aos="fade-left">
                            <form action="#" className="bg-light p-5 contact-form shadow-sm rounded">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Nama Anda" />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Email Anda" />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Subjek" />
                                </div>
                                <div className="form-group">
                                    <textarea name="" id="" cols={30} rows={7} className="form-control" placeholder="Pesan"></textarea>
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Kirim Pesan" className="btn btn-primary py-3 px-5" />
                                </div>
                            </form>
                        </div>

                        <div className="col-md-6 d-flex" data-aos="fade-right">
                            <div className="bg-white p-5 shadow-sm rounded w-100">
                                <h3 className="h4 mb-4 font-weight-bold">Lokasi Kami</h3>
                                <div id="map" className="bg-light" style={{ height: '300px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyItems: 'center', textAlign: 'center', padding: '20px' }}>
                                    <p className="w-100 text-muted">Peta lokasi kantor rental mobil akan ditampilkan di sini.</p>
                                </div>
                                <div className="mt-4">
                                    <p>Jl. Jenderal Sudirman No. 123, Kota Padang, Sumatera Barat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </TemplateLayout>
    );
}
