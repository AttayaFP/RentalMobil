import TemplateLayout from '@/layouts/TemplateLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    const inputStyle: React.CSSProperties = {
        borderRadius: '10px',
        padding: '12px 15px',
        height: 'auto',
        border: '1px solid #ddd',
        fontSize: '14px',
    };

    return (
        <TemplateLayout showHero={false}>
            <Head title="Masuk Akun" />

            <section
                className="ftco-section"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundImage: "url('/assets/template/images/bg_3.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.62)', zIndex: 0,
                    }}
                />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="row justify-content-center">
                        <div className="col-md-5 col-lg-4">
                            <div className="bg-white shadow-lg p-5" style={{ borderRadius: '20px' }}>

                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '1.5px', color: '#222831' }}>
                                        Car<span style={{ color: '#f96d00' }}>Book</span>
                                    </div>
                                    <h5 className="font-weight-bold mt-2 mb-1" style={{ color: '#222831' }}>
                                        Selamat Datang
                                    </h5>
                                    <p className="text-muted small mb-0">Masuk untuk mengelola pesanan Anda</p>
                                    <div className="mx-auto mt-2" style={{ height: '3px', width: '36px', backgroundColor: '#f96d00', borderRadius: '2px' }} />
                                </div>

                                {/* Status */}
                                {status && (
                                    <div className="alert alert-success small py-2 mb-3" style={{ borderRadius: '8px' }}>
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit}>
                                    {/* Username / Email */}
                                    <div className="form-group mb-3">
                                        <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                            Username atau Email
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <i
                                                className="ion-ios-person"
                                                style={{
                                                    position: 'absolute', left: '14px', top: '50%',
                                                    transform: 'translateY(-50%)', color: '#aaa', fontSize: '18px',
                                                }}
                                            />
                                            <input
                                                id="login"
                                                type="text"
                                                className={`form-control pl-5 ${errors.login ? 'is-invalid' : ''}`}
                                                value={data.login}
                                                onChange={(e) => setData('login', e.target.value)}
                                                required
                                                autoFocus
                                                autoComplete="username"
                                                style={{ ...inputStyle, paddingLeft: '40px' }}
                                                placeholder="username atau email@anda.com"
                                            />
                                        </div>
                                        {errors.login && (
                                            <div className="invalid-feedback d-block font-weight-bold small mt-1">
                                                {errors.login}
                                            </div>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="form-group mb-4">
                                        <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                            Kata Sandi
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <i
                                                className="ion-ios-lock"
                                                style={{
                                                    position: 'absolute', left: '14px', top: '50%',
                                                    transform: 'translateY(-50%)', color: '#aaa', fontSize: '18px',
                                                }}
                                            />
                                            <input
                                                id="password"
                                                type="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                autoComplete="current-password"
                                                style={{ ...inputStyle, paddingLeft: '40px' }}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {errors.password && (
                                            <div className="invalid-feedback d-block font-weight-bold small mt-1">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>

                                    {/* Remember + Forgot */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                            />
                                            <label className="custom-control-label small text-muted" htmlFor="remember">
                                                Ingat Saya
                                            </label>
                                        </div>
                                        {canResetPassword && (
                                            <a href="/forgot-password" className="small" style={{ color: '#f96d00' }}>
                                                Lupa sandi?
                                            </a>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-block py-3 font-weight-bold shadow-sm"
                                        disabled={processing}
                                        style={{
                                            backgroundColor: '#f96d00', borderColor: '#f96d00',
                                            color: '#fff', borderRadius: '10px', fontSize: '15px',
                                        }}
                                    >
                                        {processing ? (
                                            <><i className="ion-ios-refresh mr-2" />Menyambungkan...</>
                                        ) : (
                                            <><i className="ion-ios-log-in mr-2" />MASUK SEKARANG</>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="text-muted small mb-1">Belum memiliki akun?</p>
                                    <a href="/register" className="font-weight-bold" style={{ color: '#f96d00' }}>
                                        Daftar Akun Baru
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </TemplateLayout>
    );
}
