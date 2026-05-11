import AdminLayout from '@/layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AdminLayout title="Keamanan Akun">
            <Head title="Ganti Password" />
            
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                        <div className="mb-4">
                            <h4 className="font-weight-bold mb-1">Perbarui Kata Sandi</h4>
                            <p className="text-muted small">Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.</p>
                        </div>

                        {recentlySuccessful && (
                            <div className="alert alert-success border-0 mb-4" style={{ borderRadius: '10px' }}>
                                <i className="ion-ios-checkmark-circle mr-2"></i> Kata sandi Anda berhasil diperbarui.
                            </div>
                        )}

                        <form onSubmit={updatePassword}>
                            <div className="form-group mb-4">
                                <label className="font-weight-bold text-dark small text-uppercase">Kata Sandi Saat Ini</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                {errors.current_password && <div className="invalid-feedback">{errors.current_password}</div>}
                            </div>

                            <div className="form-group mb-4">
                                <label className="font-weight-bold text-dark small text-uppercase">Kata Sandi Baru</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>

                            <div className="form-group mb-4">
                                <label className="font-weight-bold text-dark small text-uppercase">Konfirmasi Kata Sandi Baru</label>
                                <input 
                                    type="password" 
                                    className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                            </div>

                            <div className="mt-5 pt-4 border-top">
                                <button type="submit" className="btn btn-dark px-5 py-3 font-weight-bold shadow-sm" disabled={processing} style={{ borderRadius: '10px' }}>
                                    {processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .form-control { border-radius: 8px; padding: 12px 15px; border: 1px solid #ddd; height: auto; }
                .form-control:focus { border-color: #f96d00; box-shadow: 0 0 0 0.2rem rgba(249, 109, 0, 0.1); }
            `}} />
        </AdminLayout>
    );
}
