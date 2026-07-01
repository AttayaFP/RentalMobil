import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface NotificationItem {
    id: number;
    pesan: string;
    is_read: boolean;
}

export default function Navbar() {
    const { auth, url } = usePage<{ auth: { user: { role: string } | null; notifications?: NotificationItem[] | null }; url: string }>().props;
    const user = auth?.user;
    const notifications = auth?.notifications || [];
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const markAsRead = (id: number) => {
        router.post(`/notifikasi/${id}/read`, {}, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



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
                <Link className="navbar-brand" href="/" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.5px' }}>
                    Rental Mobil <span style={{ color: '#01d28e' }}>Nabil Padang</span>
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
                                <li className="nav-item" style={{ position: 'relative' }}>
                                    <a 
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setShowDropdown(!showDropdown); }}
                                        className="nav-link border-0 bg-transparent text-left" 
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative', outline: 'none', padding: '15px 20px' }}
                                    >
                                        <i className="ion-ios-notifications" style={{ fontSize: '20px' }}></i>
                                        {notifications.length > 0 && (
                                            <span className="badge badge-danger" style={{ 
                                                position: 'absolute', 
                                                top: '8px', 
                                                right: '10px', 
                                                fontSize: '9px', 
                                                borderRadius: '50%', 
                                                padding: '2px 5px',
                                                background: '#dc3545',
                                                color: '#fff'
                                            }}>
                                                {notifications.length}
                                            </span>
                                        )}
                                    </a>
                                    
                                    {showDropdown && (
                                        <div className="dropdown-menu-custom shadow-lg border p-3" style={{ 
                                            position: 'absolute', 
                                            top: '100%', 
                                            right: '10px', 
                                            width: '320px', 
                                            backgroundColor: '#fff', 
                                            borderRadius: '15px', 
                                            zIndex: 2000,
                                            maxHeight: '350px',
                                            overflowY: 'auto',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                                        }}>
                                            <h6 className="font-weight-bold text-dark d-flex justify-content-between align-items-center mb-3" style={{ fontSize: '13px', margin: 0 }}>
                                                <span>Notifikasi</span>
                                                {notifications.length > 0 && (
                                                    <span className="badge badge-danger px-2 py-1" style={{ fontSize: '10px', borderRadius: '10px' }}>{notifications.length} Baru</span>
                                                )}
                                            </h6>
                                            <hr style={{ margin: '8px 0 12px 0' }} />
                                            {notifications.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {notifications.map(notif => (
                                                        <div key={notif.id} className="p-3 rounded border-left border-success" style={{ backgroundColor: '#f8f9fa', borderLeftWidth: '4px' }}>
                                                            <p className="small mb-2 text-dark font-weight-normal" style={{ lineHeight: '1.4', fontSize: '12px' }}>{notif.pesan}</p>
                                                            <button 
                                                                onClick={() => {
                                                                    markAsRead(notif.id);
                                                                    setShowDropdown(false);
                                                                }}
                                                                className="btn btn-link p-0 text-success small font-weight-bold" 
                                                                style={{ fontSize: '11px', textDecoration: 'none' }}
                                                            >
                                                                Tandai Dibaca
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-muted">
                                                    <p className="small mb-0">Tidak ada notifikasi baru.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>

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
