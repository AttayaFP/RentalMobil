import Navbar from '@/components/Template/Navbar';
import Footer from '@/components/Template/Footer';
import { ReactNode, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    pesan: string;
    is_read: boolean;
}

interface Props {
    children: ReactNode;
    showHero?: boolean;
}

export default function TemplateLayout({ children, showHero = true }: Props) {
    const { auth, flash } = usePage<{ 
        auth: { 
            user: { id: number; role: string } | null; 
            notifications?: NotificationItem[] | null 
        }; 
        flash: { success?: string; error?: string } 
    }>().props;
    
    const notifications = auth?.notifications || [];

    const markAsRead = (id: number) => {
        router.post(`/notifikasi/${id}/read`, {}, {
            preserveScroll: true
        });
    };

    useEffect(() => {
        const win = window as unknown as Window & { AOS?: { init: () => void } };
        if (typeof win.AOS !== 'undefined') {
            win.AOS.init();
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

            {(flash?.success || flash?.error || notifications.length > 0) && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: '100px', 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        zIndex: 9999, 
                        width: '90%', 
                        maxWidth: '800px' 
                    }}
                >
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="alert alert-success alert-dismissible fade show mb-3 shadow-sm" role="alert" style={{ borderRadius: '10px', borderLeft: '5px solid #28a745', backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' }}>
                            <i className="ion-ios-checkmark-circle mr-2"></i> {flash.success}
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close" style={{ background: 'none', border: 'none', float: 'right', fontSize: '20px', lineHeight: '1', color: '#155724', opacity: '.7', outline: 'none' }} onClick={(e) => (e.target as HTMLElement).closest('.alert')?.remove()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="alert alert-danger alert-dismissible fade show mb-3 shadow-sm" role="alert" style={{ borderRadius: '10px', borderLeft: '5px solid #dc3545', backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' }}>
                            <i className="ion-ios-alert mr-2"></i> {flash.error}
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close" style={{ background: 'none', border: 'none', float: 'right', fontSize: '20px', lineHeight: '1', color: '#721c24', opacity: '.7', outline: 'none' }} onClick={(e) => (e.target as HTMLElement).closest('.alert')?.remove()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    )}

                    {/* Database Notifications shown as alert banners on Customer Layout (limit to top 3 to prevent screen clutter) */}
                    {notifications.slice(0, 3).map(notif => (
                        <div key={notif.id} className="alert alert-success alert-dismissible fade show mb-3 shadow-sm" role="alert" style={{ borderRadius: '10px', borderLeft: '5px solid #28a745', backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' }}>
                            <i className="ion-ios-notifications mr-2"></i> {notif.pesan}
                            <button 
                                type="button" 
                                className="close" 
                                data-dismiss="alert" 
                                aria-label="Close" 
                                style={{ background: 'none', border: 'none', float: 'right', fontSize: '20px', lineHeight: '1', color: '#155724', opacity: '.7', outline: 'none' }} 
                                onClick={(e) => {
                                    markAsRead(notif.id);
                                    (e.target as HTMLElement).closest('.alert')?.remove();
                                }}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <main>{children}</main>

            <Footer />
        </div>
    );
}
