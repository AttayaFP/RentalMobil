import AdminLayout from '@/layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Kategori {
    kdkategori: string;
    nama_kategori: string;
}

interface Mobil {
    kdmobil: string;
    nama_mobil: string;
    thn_mobil: number;
    plat_mobil: string;
    warna_mobil: string;
    stnk_mobil: string;
    harga: number;
    kdkategori: string;
    status: string;
    foto: string | null;
}

interface Props {
    mobil: Mobil;
    kategoris: Kategori[];
}

export default function Edit({ mobil, kategoris }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nama_mobil: mobil.nama_mobil,
        thn_mobil: mobil.thn_mobil,
        plat_mobil: mobil.plat_mobil,
        warna_mobil: mobil.warna_mobil,
        stnk_mobil: mobil.stnk_mobil,
        harga: mobil.harga,
        kdkategori: mobil.kdkategori,
        status: mobil.status,
        foto: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(mobil.foto ? `/storage/${mobil.foto}` : null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/mobil/${mobil.kdmobil}`);
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    return (
        <AdminLayout title={`Edit Mobil: ${mobil.nama_mobil}`}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                        <div className="mb-4 d-flex align-items-center">
                            <button onClick={() => forceNavigate('/mobil')} className="btn btn-link text-muted p-0 mr-3">
                                <i className="ion-ios-arrow-back" style={{ fontSize: '24px' }}></i>
                            </button>
                            <h4 className="font-weight-bold mb-0">Ubah Informasi Mobil</h4>
                        </div>

                        <form onSubmit={submit}>
                            <div className="row">
                                <div className="col-md-4 mb-4">
                                    <label className="font-weight-bold text-dark small text-uppercase">Foto Mobil</label>
                                    <div className="image-upload-wrapper mt-2 position-relative" style={{ 
                                        height: '220px', 
                                        border: '2px dashed #ddd', 
                                        borderRadius: '12px',
                                        backgroundColor: '#fbfbfb',
                                        overflow: 'hidden'
                                    }}>
                                        {preview ? (
                                            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                                                <i className="ion-ios-camera mb-2" style={{ fontSize: '40px' }}></i>
                                                <small>Klik untuk ganti foto</small>
                                            </div>
                                        )}
                                        <input 
                                            type="file" 
                                            className="position-absolute w-100 h-100" 
                                            style={{ top: 0, left: 0, opacity: 0, cursor: 'pointer' }}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    <small className="text-muted mt-2 d-block text-center italic">Kosongkan jika tidak ingin ganti foto</small>
                                </div>

                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Kode Mobil (Tetap)</label>
                                            <input type="text" className="form-control bg-light" value={mobil.kdmobil} disabled />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Nama Mobil</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.nama_mobil ? 'is-invalid' : ''}`}
                                                value={data.nama_mobil}
                                                onChange={e => setData('nama_mobil', e.target.value)}
                                                required
                                            />
                                            {errors.nama_mobil && <div className="invalid-feedback">{errors.nama_mobil}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Plat Nomor</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.plat_mobil ? 'is-invalid' : ''}`}
                                                value={data.plat_mobil}
                                                onChange={e => setData('plat_mobil', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Warna Mobil</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.warna_mobil ? 'is-invalid' : ''}`}
                                                value={data.warna_mobil}
                                                onChange={e => setData('warna_mobil', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Nomor STNK</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.stnk_mobil ? 'is-invalid' : ''}`}
                                                value={data.stnk_mobil}
                                                onChange={e => setData('stnk_mobil', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Kategori</label>
                                            <select 
                                                className="form-control"
                                                value={data.kdkategori}
                                                onChange={e => setData('kdkategori', e.target.value)}
                                                required
                                            >
                                                {kategoris.map(k => (
                                                    <option key={k.kdkategori} value={k.kdkategori}>{k.nama_kategori}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Status</label>
                                            <select 
                                                className="form-control"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                required
                                            >
                                                <option value="Tersedia">Tersedia</option>
                                                <option value="Disewa">Disewa</option>
                                                <option value="Perawatan">Perawatan</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Harga Sewa / Hari</label>
                                            <input 
                                                type="number" 
                                                className="form-control font-weight-bold text-primary"
                                                value={data.harga}
                                                onChange={e => setData('harga', e.target.value ? parseInt(e.target.value) : 0)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Tahun</label>
                                            <input 
                                                type="number" 
                                                className="form-control"
                                                value={data.thn_mobil}
                                                onChange={e => setData('thn_mobil', e.target.value ? parseInt(e.target.value) : new Date().getFullYear())}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-top d-flex justify-content-end">
                                <button type="button" onClick={() => forceNavigate('/mobil')} className="btn btn-light px-4 mr-2">Batal</button>
                                <button type="submit" className="btn btn-primary px-5 py-2 font-weight-bold" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00' }}>
                                    {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
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
