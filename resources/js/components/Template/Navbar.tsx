import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const { auth, url } = usePage<any>().props;
    const user = auth?.user;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const isActive = (path: string) => url === path;

    return (
        <nav className={`navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light ${scrolled ? 'scrolled sleep' : ''}`} id="ftco-navbar" 
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 1000, 
                background: scrolled ? 'rgba(34, 40, 49, 0.9) !important' : 'transparent !important',
                padding: '15px 0',
                transition: 'all 0.3s'
            }}>
            <div className="container">
                <Link className="navbar-brand" href="/" style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '1px' }}>
                    CAR<span style={{ color: '#01d28e' }}>BOOK</span>
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="oi oi-menu"></span> Menu
                </button>

                <div className="collapse navbar-collapse" id="ftco-nav">
                    <ul className="navbar-nav ml-auto">
                        <li className={`nav-item ${isActive('/') ? 'active' : ''}`}><Link href="/" className="nav-link">Home</Link></li>
                        <li className={`nav-item ${isActive('/about') ? 'active' : ''}`}><Link href="/about" className="nav-link">About</Link></li>
                        <li className={`nav-item ${isActive('/services') ? 'active' : ''}`}><Link href="#" className="nav-link">Services</Link></li>
                        <li className={`nav-item ${isActive('/pricing') ? 'active' : ''}`}><Link href="/pricing" className="nav-link">Pricing</Link></li>
                        <li className={`nav-item ${isActive('/cars') ? 'active' : ''}`}><Link href="/cars" className="nav-link">Cars</Link></li>
                        <li className={`nav-item ${isActive('/blog') ? 'active' : ''}`}><Link href="#" className="nav-link">Blog</Link></li>
                        <li className={`nav-item ${isActive('/contact') ? 'active' : ''}`}><Link href="/contact" className="nav-link">Contact</Link></li>
                        
                        {user ? (
                            <>
                                {user.role !== 'pelanggan' && (
                                    <li className="nav-item"><Link href="/dashboard" className="nav-link">Dashboard</Link></li>
                                )}
                                <li className="nav-item">
                                    <form onSubmit={handleLogout} className="d-inline">
                                        <button type="submit" className="nav-link border-0 bg-transparent text-left w-100" style={{ cursor: 'pointer' }}>
                                            Logout
                                        </button>
                                    </form>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link href="/login" className="nav-link">Login</Link></li>
                                <li className="nav-item"><Link href="/register" className="nav-link" style={{ color: '#01d28e', fontWeight: 'bold' }}>Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .nav-item.active .nav-link { color: #01d28e !important; }
                .ftco-navbar-light .navbar-nav > .nav-item > .nav-link:hover { color: #01d28e !important; }
            `}} />
        </nav>
    );
}
