import AdminLayout from '@/layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Kategori {
    kdkategori: string;
    nama_kategori: string;
}

interface Props {
    kategoris: Kategori[];
    next_kdmobil: string;
}

export default function Create({ kategoris, next_kdmobil }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kdmobil: next_kdmobil,
        nama_mobil: '',
        thn_mobil: new Date().getFullYear(),
        plat_mobil: '',
        warna_mobil: '',
        stnk_mobil: '',
        harga: 0,
        kdkategori: '',
        status: 'Tersedia',
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
        post('/mobil');
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    return (
        <AdminLayout title="Tambah Mobil Baru">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-sm border-0 p-4 p-md-5" style={{ borderRadius: '15px' }}>
                        <div className="mb-4 d-flex align-items-center">
                            <button onClick={() => forceNavigate('/mobil')} className="btn btn-link text-muted p-0 mr-3">
                                <i className="ion-ios-arrow-back" style={{ fontSize: '24px' }}></i>
                            </button>
                            <h4 className="font-weight-bold mb-0">Lengkapi Data Mobil</h4>
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
                                                <small>Klik untuk pilih foto</small>
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
                                    {errors.foto && <div className="text-danger small mt-2">{errors.foto}</div>}
                                </div>

                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Kode Mobil</label>
                                            <div className="form-control bg-light d-flex align-items-center font-weight-bold" style={{ cursor: 'default', userSelect: 'none', minHeight: '50px' }}>
                                                {data.kdmobil}
                                            </div>
                                            {errors.kdmobil && <div className="invalid-feedback">{errors.kdmobil}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Nama Mobil</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.nama_mobil ? 'is-invalid' : ''}`}
                                                placeholder="Toyota Avanza"
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
                                                placeholder="B 1234 ABC"
                                                value={data.plat_mobil}
                                                onChange={e => setData('plat_mobil', e.target.value)}
                                                required
                                            />
                                            {errors.plat_mobil && <div className="invalid-feedback">{errors.plat_mobil}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Warna Mobil</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.warna_mobil ? 'is-invalid' : ''}`}
                                                placeholder="Hitam Metalik"
                                                value={data.warna_mobil}
                                                onChange={e => setData('warna_mobil', e.target.value)}
                                                required
                                            />
                                            {errors.warna_mobil && <div className="invalid-feedback">{errors.warna_mobil}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Nomor STNK</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${errors.stnk_mobil ? 'is-invalid' : ''}`}
                                                placeholder="12345678"
                                                value={data.stnk_mobil}
                                                onChange={e => setData('stnk_mobil', e.target.value)}
                                                required
                                            />
                                            {errors.stnk_mobil && <div className="invalid-feedback">{errors.stnk_mobil}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Kategori</label>
                                            <select 
                                                className={`form-control ${errors.kdkategori ? 'is-invalid' : ''}`}
                                                value={data.kdkategori}
                                                onChange={e => setData('kdkategori', e.target.value)}
                                                required
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {kategoris.map(k => (
                                                    <option key={k.kdkategori} value={k.kdkategori}>{k.nama_kategori}</option>
                                                ))}
                                            </select>
                                            {errors.kdkategori && <div className="invalid-feedback">{errors.kdkategori}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Harga Sewa / Hari</label>
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text bg-light border-right-0">Rp</span>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    className={`form-control ${errors.harga ? 'is-invalid' : ''}`}
                                                    value={data.harga}
                                                    onChange={e => setData('harga', e.target.value ? parseInt(e.target.value) : 0)}
                                                    required
                                                />
                                            </div>
                                            {errors.harga && <div className="text-danger small mt-1">{errors.harga}</div>}
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
                                        <div className="col-md-12 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase">Status</label>
                                            <select 
                                                className="form-control"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                required
                                            >
                                                <option value="Tersedia">Tersedia</option>
                                                <option value="Perawatan">Perawatan</option>
                                                <option value="Disewa">Disewa</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-top d-flex justify-content-end">
                                <button type="button" onClick={() => forceNavigate('/mobil')} className="btn btn-light px-4 mr-2">Batal</button>
                                <button type="submit" className="btn btn-primary px-5 py-2 font-weight-bold" disabled={processing} style={{ backgroundColor: '#f96d00', borderColor: '#f96d00' }}>
                                    {processing ? 'Menyimpan...' : 'Simpan Mobil'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .form-control {
                    border-radius: 8px;
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    height: auto;
                }
                .form-control:focus {
                    border-color: #f96d00;
                    box-shadow: 0 0 0 0.2rem rgba(249, 109, 0, 0.1);
                }
            `}} />
        </AdminLayout>
    );
}
