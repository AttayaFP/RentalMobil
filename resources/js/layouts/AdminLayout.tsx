import { Link, usePage, router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { Head } from '@inertiajs/react';

interface Props {
    children: ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: Props) {
    const props = usePage().props as any;
    const url = props.url || '';
    const auth = props.auth || { user: null };
    
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const user = auth?.user || { nama_lengkap: 'Admin', role: 'guest' };
    const isAdmin = user.role === 'admin' || user.role === 'pimpinan';

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const toggleMenu = (menu: string) => {
        setOpenMenus(prev => 
            prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
        );
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    return (
        <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Poppins', sans-serif" }}>
            <Head title={title ? `${title} - Admin CarBook` : 'Admin Dashboard'} />

            {/* SIDEBAR */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`} style={{
                width: isSidebarOpen ? '260px' : '0',
                backgroundColor: '#222831',
                color: '#fff',
                transition: 'all 0.3s',
                overflowX: 'hidden',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000,
                boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
            }}>
                <div className="sidebar-header p-4 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => forceNavigate('/')} className="navbar-brand text-white border-0 bg-transparent p-0" style={{ fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>
                        Car<span style={{ color: '#f96d00' }}>Book</span>
                    </button>
                </div>

                <div className="sidebar-menu mt-3">
                    <ul className="list-unstyled">
                        <li className="nav-item-admin">
                            <button onClick={() => forceNavigate('/dashboard')} className="nav-link-admin px-4 py-3 d-flex align-items-center text-white border-0 bg-transparent w-100 text-left" style={{ cursor: 'pointer' }}>
                                <i className="ion-ios-speedometer mr-3" style={{ fontSize: '20px' }}></i> 
                                <span style={{ fontWeight: 500 }}>Dashboard</span>
                            </button>
                        </li>

                        {isAdmin && (
                            <li className="nav-item-admin">
                                <div className="nav-link-admin px-4 py-3 d-flex justify-content-between align-items-center cursor-pointer text-white" 
                                     onClick={() => toggleMenu('master')}
                                     style={{ cursor: 'pointer' }}>
                                    <span><i className="ion-ios-filing mr-3" style={{ fontSize: '20px' }}></i> Master Data</span>
                                    <i className={`ion-ios-arrow-${openMenus.includes('master') ? 'down' : 'forward'}`}></i>
                                </div>
                                <ul className={`list-unstyled bg-dark ${openMenus.includes('master') ? 'd-block' : 'd-none'}`} style={{ backgroundColor: '#1a1e25' }}>
                                    <li><button onClick={() => forceNavigate('/mobil')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Data Mobil</button></li>
                                    <li><button onClick={() => forceNavigate('/pelanggan')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Data Pelanggan</button></li>
                                    <li><button onClick={() => forceNavigate('/kategori')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Kategori Mobil</button></li>
                                </ul>
                            </li>
                        )}

                        <li className="nav-item-admin">
                            <div className="nav-link-admin px-4 py-3 d-flex justify-content-between align-items-center cursor-pointer text-white" 
                                 onClick={() => toggleMenu('transaksi')}
                                 style={{ cursor: 'pointer' }}>
                                <span><i className="ion-ios-cart mr-3" style={{ fontSize: '20px' }}></i> Transaksi</span>
                                <i className={`ion-ios-arrow-${openMenus.includes('transaksi') ? 'down' : 'forward'}`}></i>
                            </div>
                            <ul className={`list-unstyled bg-dark ${openMenus.includes('transaksi') ? 'd-block' : 'd-none'}`}>
                                <li><button onClick={() => forceNavigate('/booking')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">{isAdmin ? 'Semua Booking' : 'Booking Saya'}</button></li>
                                {isAdmin && (
                                    <li><button onClick={() => forceNavigate('/pengembalian')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Pengembalian</button></li>
                                )}
                            </ul>
                        </li>

                        {isAdmin && (
                            <li className="nav-item-admin">
                                <div className="nav-link-admin px-4 py-3 d-flex justify-content-between align-items-center cursor-pointer text-white" 
                                     onClick={() => toggleMenu('laporan')}
                                     style={{ cursor: 'pointer' }}>
                                    <span><i className="ion-ios-paper mr-3" style={{ fontSize: '20px' }}></i> Laporan</span>
                                    <i className={`ion-ios-arrow-${openMenus.includes('laporan') ? 'down' : 'forward'}`}></i>
                                </div>
                                <ul className={`list-unstyled bg-dark ${openMenus.includes('laporan') ? 'd-block' : 'd-none'}`}>
                                    <li><button onClick={() => forceNavigate('/laporan/pelanggan')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Laporan Pelanggan</button></li>
                                    <li><button onClick={() => forceNavigate('/laporan/mobil')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Laporan Mobil</button></li>
                                    <li><button onClick={() => forceNavigate('/laporan/booking')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Laporan Booking</button></li>
                                    <li><button onClick={() => forceNavigate('/laporan/pengembalian')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Laporan Pengembalian</button></li>
                                    <li><button onClick={() => forceNavigate('/laporan/belum-kembali')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Mobil Belum Kembali</button></li>
                                    <li><button onClick={() => forceNavigate('/laporan/rental')} className="nav-link-admin pl-5 py-2 d-block text-white-50 small border-0 bg-transparent w-100 text-left">Rekapitulasi Rental</button></li>
                                </ul>
                            </li>
                        )}

                        <li className="nav-item-admin mt-4">
                            <form onSubmit={handleLogout} className="px-4 py-3">
                                <button type="submit" className="text-white border-0 bg-transparent w-100 text-left p-0" style={{ cursor: 'pointer' }}>
                                    <i className="ion-ios-log-out mr-3" style={{ fontSize: '20px' }}></i> Logout
                                </button>
                            </form>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="main-panel" style={{
                flex: 1,
                marginLeft: isSidebarOpen ? '260px' : '0',
                transition: 'all 0.3s',
                width: isSidebarOpen ? 'calc(100% - 260px)' : '100%'
            }}>
                {/* TOPBAR */}
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 d-flex justify-content-between sticky-top">
                    <button className="btn btn-link text-dark p-0" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        <i className="ion-ios-menu" style={{ fontSize: '28px' }}></i>
                    </button>
                    
                    <div className="d-flex align-items-center">
                        <div className="position-relative">
                            <div className="d-flex align-items-center" onClick={() => setShowProfileDropdown(!showProfileDropdown)} style={{ cursor: 'pointer' }}>
                                <div className="text-right mr-3 d-none d-md-block">
                                    <div className="font-weight-bold mb-0 text-dark" style={{ lineHeight: 1.2 }}>{user.nama_lengkap}</div>
                                    <small className="text-muted">{user.role === 'admin' ? 'Administrator' : 'Pelanggan'}</small>
                                </div>
                                <div className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                                     style={{ width: '40px', height: '40px', backgroundColor: '#f96d00', fontWeight: 600, fontSize: '18px' }}>
                                    {user.nama_lengkap.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {showProfileDropdown && (
                                <div className="position-absolute bg-white shadow-lg rounded mt-2 py-2 border" style={{ right: 0, width: '180px', zIndex: 1100 }}>
                                    <button onClick={() => forceNavigate('/')} className="dropdown-item py-2 px-3 text-dark border-0 bg-transparent w-100 text-left" style={{ cursor: 'pointer' }}>
                                        <i className="ion-ios-home mr-2 text-primary"></i> Ke Website
                                    </button>
                                    <hr className="my-1" />
                                    <form onSubmit={handleLogout}>
                                        <button type="submit" className="dropdown-item py-2 px-3 text-danger border-0 bg-transparent w-100 text-left">
                                            <i className="ion-ios-log-out mr-2"></i> Keluar
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="content-body p-4 p-md-5">
                    {/* Flash Messages */}
                    {props.flash?.success && (
                        <div className="alert alert-success alert-dismissible fade show mb-4 shadow-sm" role="alert" style={{ borderRadius: '10px', borderLeft: '5px solid #28a745' }}>
                            <i className="ion-ios-checkmark-circle mr-2"></i> {props.flash.success}
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )}
                    {props.flash?.error && (
                        <div className="alert alert-danger alert-dismissible fade show mb-4 shadow-sm" role="alert" style={{ borderRadius: '10px', borderLeft: '5px solid #dc3545' }}>
                            <i className="ion-ios-alert mr-2"></i> {props.flash.error}
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )}

                    {title && (
                        <div className="mb-5">
                            <h2 className="font-weight-bold text-dark" style={{ letterSpacing: '-1px' }}>{title}</h2>
                        </div>
                    )}
                    <div className="animate-fade-in">{children}</div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .nav-link-admin { transition: all 0.3s; border-left: 3px solid transparent; }
                .nav-link-admin:hover { background-color: rgba(249, 109, 0, 0.1); color: #f96d00 !important; border-left: 3px solid #f96d00; text-decoration: none; }
                .nav-item-admin.active > .nav-link-admin { background-color: rgba(249, 109, 0, 0.15); color: #f96d00 !important; border-left: 3px solid #f96d00; }
                .cursor-pointer { cursor: pointer; }

                @media print {
                    @page { size: A4 landscape; margin: 10mm; }

                    .admin-sidebar,
                    .navbar,
                    .sticky-top,
                    button,
                    .btn,
                    .print\\:hidden {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    .admin-wrapper {
                        display: block !important;
                    }

                    .main-panel {
                        margin-left: 0 !important;
                        width: 100% !important;
                        padding: 0 !important;
                    }

                    .content-body {
                        padding: 5mm !important;
                        margin: 0 !important;
                    }

                    .card {
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }

                    .card-body {
                        padding: 0 !important;
                    }

                    .card-header {
                        display: none !important;
                    }

                    .print\\:block {
                        display: block !important;
                    }

                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        font-size: 9pt !important;
                    }

                    th, td {
                        border: 1px solid #ccc !important;
                        padding: 3px 5px !important;
                        word-break: break-word !important;
                        white-space: normal !important;
                    }

                    thead {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    .table-responsive {
                        overflow: visible !important;
                    }

                    body, html {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}} />
        </div>
    );
}
