import TemplateLayout from '@/layouts/TemplateLayout';
import { Head, Link } from '@inertiajs/react';

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    plat_mobil: string;
    harga: number;
    foto: string | null;
    status?: string;
}

interface Props {
    mobils: Mobil[];
}

export default function Pricing({ mobils }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <TemplateLayout showHero={false}>
            <Head title="Daftar Harga - CarBook" />
            
            <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/assets/template/images/bg_1.jpg')", height: '400px' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center" style={{ height: '400px' }}>
                        <div className="col-lg-8 text-center" data-aos="fade-up">
                            <h1 className="mb-3 text-white font-weight-bold">Daftar Harga</h1>
                            <p className="breadcrumbs text-white">
                                <span><a href="/" className="text-white">Beranda</a></span> / <span>Daftar Harga</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-center mb-5">
                        <div className="col-md-7 text-center heading-section" data-aos="fade-up">
                            <span className="subheading" style={{ color: '#01d28e' }}>Tarif Rental</span>
                            <h2 className="mb-3">Harga Sewa Mobil Terbaik</h2>
                        </div>
                    </div>
                    <div className="row" data-aos="fade-up">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table className="table table-bordered bg-white shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                                    <thead className="thead-dark">
                                        <tr className="text-center">
                                            <th>Gambar</th>
                                            <th>Nama Mobil</th>
                                            <th>Tarif Per Jam</th>
                                            <th>Tarif Per Hari</th>
                                            <th>Sewa Sekarang</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mobils.map((mobil) => (
                                            <tr key={mobil.kdmobil} className="text-center align-middle">
                                                <td style={{ width: '150px' }}>
                                                    <img 
                                                        src={mobil.foto ? `/storage/${mobil.foto}` : '/assets/template/images/car-1.jpg'} 
                                                        alt={mobil.nama_mobil}
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: '80px' }}
                                                    />
                                                </td>
                                                <td className="align-middle font-weight-bold">{mobil.nama_mobil}</td>
                                                <td className="align-middle text-primary">{formatCurrency(mobil.harga / 10)}</td>
                                                <td className="align-middle font-weight-bold text-success">{formatCurrency(mobil.harga)}</td>
                                                <td className="align-middle">
                                                    {mobil.status === 'Tersedia' ? (
                                                        <Link href={`/booking/create?kdmobil=${mobil.kdmobil}`} className="btn btn-primary px-4 py-2" style={{ backgroundColor: '#01d28e', borderColor: '#01d28e' }}>Sewa</Link>
                                                    ) : (
                                                        <button className="btn btn-secondary px-4 py-2 disabled" style={{ cursor: 'not-allowed' }}>Habis</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </TemplateLayout>
    );
}
