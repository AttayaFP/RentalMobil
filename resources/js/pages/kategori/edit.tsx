import AdminLayout from '@/layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Kategori {
    kdkategori: string;
    nama_kategori: string;
}

interface Props {
    kategori: Kategori;
}

export default function Edit({ kategori }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kategori: kategori.nama_kategori,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/kategori/${kategori.kdkategori}`);
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    return (
        <AdminLayout title={`Edit Kategori: ${kategori.kdkategori}`}>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                        <div className="mb-4 d-flex align-items-center">
                            <button onClick={() => forceNavigate('/kategori')} className="btn btn-link text-muted p-0 mr-3">
                                <i className="ion-ios-arrow-back" style={{ fontSize: '24px' }}></i>
                            </button>
                            <h4 className="font-weight-bold mb-0">Ubah Nama Kategori</h4>
                        </div>

                        <form onSubmit={submit}>
                            <div className="form-group mb-4">
                                <label className="font-weight-bold text-dark small text-uppercase">Kode Kategori (Tetap)</label>
                                <div className="form-control bg-light d-flex align-items-center font-weight-bold" style={{ cursor: 'default', userSelect: 'none', minHeight: '50px' }}>
                                    {kategori.kdkategori}
                                </div>
                            </div>
                            
                            <div className="form-group mb-4">
                                <label className="font-weight-bold text-dark small text-uppercase">Nama Kategori</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.nama_kategori ? 'is-invalid' : ''}`}
                                    value={data.nama_kategori}
                                    onChange={e => setData('nama_kategori', e.target.value)}
                                    required
                                />
                                {errors.nama_kategori && <div className="invalid-feedback">{errors.nama_kategori}</div>}
                            </div>

                            <div className="mt-5 pt-4 border-top">
                                <button type="submit" className="btn btn-primary btn-block py-3 font-weight-bold" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00' }}>
                                    {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                                </button>
                                <button type="button" onClick={() => forceNavigate('/kategori')} className="btn btn-link btn-block text-muted small mt-2">Batal</button>
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
