import AdminLayout from '@/layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Profile() {
    const { auth } = usePage<{ auth: { user: { nama_lengkap: string; email: string } } }>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        nama_lengkap: auth.user.nama_lengkap,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/profile');
    };

    return (
        <AdminLayout title="Pengaturan Akun">
            <Head title="Profil Saya" />
            
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                        <div className="mb-4">
                            <h4 className="font-weight-bold mb-1">Informasi Profil</h4>
                            <p className="text-muted small">Perbarui informasi dasar akun Anda di sini.</p>
                        </div>

                        {recentlySuccessful && (
                            <div className="alert alert-success border-0 mb-4" style={{ borderRadius: '10px' }}>
                                <i className="ion-ios-checkmark-circle mr-2"></i> Profil Anda berhasil diperbarui.
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="form-group mb-4">
                                <label className="font-weight-bold text-dark small text-uppercase">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.nama_lengkap ? 'is-invalid' : ''}`}
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    required
                                />
                                {errors.nama_lengkap && <div className="invalid-feedback">{errors.nama_lengkap}</div>}
                            </div>

                            <div className="form-group mb-4">
                                <label className="font-weight-bold text-dark small text-uppercase">Alamat Email</label>
                                <input 
                                    type="email" 
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="mt-5 pt-4 border-top">
                                <button type="submit" className="btn btn-primary px-5 py-3 font-weight-bold" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00', borderRadius: '10px' }}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
