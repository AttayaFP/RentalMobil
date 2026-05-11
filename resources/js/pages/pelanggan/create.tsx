import AdminLayout from '@/layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        jenis_kelamin: '',
        alamat: '',
        nohp: '',
        role: 'pelanggan',
        foto: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/pelanggan');
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    return (
        <AdminLayout title="Tambah Pengguna Baru">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                        <div className="mb-4 d-flex align-items-center">
                            <button onClick={() => forceNavigate('/pelanggan')} className="btn btn-link text-muted p-0 mr-3">
                                <i className="ion-ios-arrow-back" style={{ fontSize: '24px' }}></i>
                            </button>
                            <h4 className="font-weight-bold mb-0">Informasi Profil Pengguna</h4>
                        </div>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-md-3 mb-4 text-center">
                                    <label className="font-weight-bold text-dark small text-uppercase d-block mb-3">Foto Profil</label>
                                    <div className="position-relative mx-auto" style={{ width: '150px', height: '150px' }}>
                                        <div className="rounded-circle border d-flex align-items-center justify-content-center overflow-hidden bg-light" style={{ width: '100%', height: '100%', border: '2px dashed #ddd' }}>
                                            {preview ? (
                                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <i className="ion-ios-person text-muted" style={{ fontSize: '60px' }}></i>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            className="position-absolute w-100 h-100" 
                                            style={{ top: 0, left: 0, opacity: 0, cursor: 'pointer' }}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        <div className="position-absolute bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ bottom: '5px', right: '5px', width: '35px', height: '35px', border: '3px solid #fff' }}>
                                            <i className="ion-ios-camera"></i>
                                        </div>
                                    </div>
                                    {errors.foto && <div className="text-danger small mt-2">{errors.foto}</div>}
                                </div>

                                <div className="col-md-9">
                                    <div className="row">
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Nama Lengkap</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.nama_lengkap ? 'is-invalid' : ''}`}
                                                value={data.nama_lengkap}
                                                onChange={e => setData('nama_lengkap', e.target.value)}
                                                required
                                            />
                                            {errors.nama_lengkap && <div className="invalid-feedback">{errors.nama_lengkap}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Role / Hak Akses</label>
                                            <select 
                                                className="form-control"
                                                value={data.role}
                                                onChange={e => setData('role', e.target.value)}
                                                required
                                            >
                                                <option value="pelanggan">Pelanggan</option>
                                                <option value="admin">Administrator</option>
                                                <option value="pimpinan">Pimpinan</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Username</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                                value={data.username}
                                                onChange={e => setData('username', e.target.value)}
                                                required
                                            />
                                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Email</label>
                                            <input 
                                                type="email" 
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                required
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Nomor HP / WhatsApp</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.nohp ? 'is-invalid' : ''}`}
                                                value={data.nohp}
                                                onChange={e => setData('nohp', e.target.value)}
                                                required
                                            />
                                            {errors.nohp && <div className="invalid-feedback">{errors.nohp}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Jenis Kelamin</label>
                                            <select 
                                                className={`form-control ${errors.jenis_kelamin ? 'is-invalid' : ''}`}
                                                value={data.jenis_kelamin}
                                                onChange={e => setData('jenis_kelamin', e.target.value)}
                                                required
                                            >
                                                <option value="">Pilih</option>
                                                <option value="L">Laki-laki</option>
                                                <option value="P">Perempuan</option>
                                            </select>
                                            {errors.jenis_kelamin && <div className="invalid-feedback">{errors.jenis_kelamin}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Password</label>
                                            <input 
                                                type="password" 
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                required
                                            />
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Konfirmasi Password</label>
                                            <input 
                                                type="password" 
                                                className="form-control"
                                                value={data.password_confirmation}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-12 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Alamat Lengkap</label>
                                            <textarea 
                                                className={`form-control ${errors.alamat ? 'is-invalid' : ''}`}
                                                rows={3}
                                                value={data.alamat}
                                                onChange={e => setData('alamat', e.target.value)}
                                                required
                                            ></textarea>
                                            {errors.alamat && <div className="invalid-feedback">{errors.alamat}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-top d-flex justify-content-end">
                                <button type="button" onClick={() => forceNavigate('/pelanggan')} className="btn btn-light px-4 mr-2">Batal</button>
                                <button type="submit" className="btn btn-primary px-5 py-2 font-weight-bold" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00' }}>
                                    {processing ? 'Menyimpan...' : 'Simpan Profil'}
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
