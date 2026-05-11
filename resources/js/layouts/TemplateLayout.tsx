import Navbar from '@/components/Template/Navbar';
import Footer from '@/components/Template/Footer';
import { ReactNode, useEffect } from 'react';

interface Props {
    children: ReactNode;
    showHero?: boolean;
}

export default function TemplateLayout({ children, showHero = true }: Props) {
    // Memastikan skrip template diinisialisasi ulang saat navigasi Inertia
    useEffect(() => {
        if (typeof (window as any).AOS !== 'undefined') {
            (window as any).AOS.init();
        }
    }, []);

    return (
        <div className="template-wrapper">
            <Navbar />
            
            {showHero && (
                <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/assets/template/images/bg_1.jpg')" }} data-stellar-background-ratio="0.5">
                    <div className="overlay"></div>
                    <div className="container">
                        <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center">
                            <div className="col-lg-8">
                                <div className="text w-100 text-center mb-md-5 pb-md-5">
                                    <h1 className="mb-4">Cara Cepat &amp; Mudah Menyewa Mobil</h1>
                                    <p style={{ fontSize: '18px' }}>Temukan mobil terbaik untuk perjalanan Anda dengan harga yang sangat kompetitif dan pelayanan prima.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main>{children}</main>

            <Footer />
        </div>
    );
}
