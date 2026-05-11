import { Link } from '@inertiajs/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="ftco-footer ftco-bg-dark ftco-section">
            <div className="container">
                <div className="row mb-5">
                    <div className="col-md">
                        <div className="ftco-footer-widget mb-4">
                            <h2 className="ftco-heading-2"><Link href="/" className="logo">Car<span>Book</span></Link></h2>
                            <p>Solusi transportasi terbaik untuk kebutuhan perjalanan Anda. Kami menyediakan berbagai pilihan mobil berkualitas dengan harga yang sangat bersaing.</p>
                            <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                                <li><a href="#"><span className="icon-twitter"></span></a></li>
                                <li><a href="#"><span className="icon-facebook"></span></a></li>
                                <li><a href="#"><span className="icon-instagram"></span></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="ftco-footer-widget mb-4 ml-md-5">
                            <h2 className="ftco-heading-2">Informasi</h2>
                            <ul className="list-unstyled">
                                <li><Link href="/" className="py-2 d-block">Tentang Kami</Link></li>
                                <li><Link href="/mobil" className="py-2 d-block">Mobil</Link></li>
                                <li><Link href="#" className="py-2 d-block">Syarat & Ketentuan</Link></li>
                                <li><Link href="#" className="py-2 d-block">Kebijakan Privasi</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="ftco-footer-widget mb-4">
                            <h2 className="ftco-heading-2">Bantuan Pelanggan</h2>
                            <ul className="list-unstyled">
                                <li><Link href="#" className="py-2 d-block">Cara Pemesanan</Link></li>
                                <li><Link href="#" className="py-2 d-block">Pembayaran</Link></li>
                                <li><Link href="#" className="py-2 d-block">Hubungi Kami</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="ftco-footer-widget mb-4">
                            <h2 className="ftco-heading-2">Hubungi Kami</h2>
                            <div className="block-23 mb-3">
                                <ul>
                                    <li><span className="icon icon-map-marker"></span><span className="text">Jl. Raya Rental No. 123, Jakarta Selatan</span></li>
                                    <li><a href="#"><span className="icon icon-phone"></span><span className="text">+62 812 3456 7890</span></a></li>
                                    <li><a href="#"><span className="icon icon-envelope"></span><span className="text">info@carbook.com</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <p>
                            Copyright &copy; {currentYear} All rights reserved | CarBook Rental Management System
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
