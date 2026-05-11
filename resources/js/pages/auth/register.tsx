import TemplateLayout from '@/layouts/TemplateLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        username: string;
        nama_lengkap: string;
        jenis_kelamin: string;
        alamat: string;
        nohp: string;
        password: string;
        password_confirmation: string;
        foto: File | null;
    }>({
        email: '',
        username: '',
        nama_lengkap: '',
        jenis_kelamin: '',
        alamat: '',
        nohp: '',
        password: '',
        password_confirmation: '',
        foto: null,
    });

    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const fotoRef = useRef<HTMLInputElement>(null);

    const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('foto', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setFotoPreview(null);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            forceFormData: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputStyle: React.CSSProperties = {
        borderRadius: '10px',
        padding: '11px 14px 11px 40px',
        height: 'auto',
        border: '1px solid #ddd',
        fontSize: '13px',
    };

    const iconStyle: React.CSSProperties = {
        position: 'absolute', left: '13px', top: '50%',
        transform: 'translateY(-50%)', color: '#aaa', fontSize: '17px',
    };

    return (
        <TemplateLayout showHero={false}>
            <Head title="Daftar Akun Baru" />

            <section
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundImage: "url('/assets/template/images/bg_2.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    padding: '40px 0',
                }}
            >
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.62)', zIndex: 0 }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="row justify-content-center">
                        <div className="col-md-9 col-lg-8">
                            <div className="bg-white shadow-lg p-5" style={{ borderRadius: '20px' }}>
                                <div className="text-center mb-4">
                                    <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '1.5px', color: '#222831' }}>
                                        Car<span style={{ color: '#f96d00' }}>Book</span>
                                    </div>
                                    <h5 className="font-weight-bold mt-2 mb-1" style={{ color: '#222831' }}>
                                        Bergabung Bersama Kami
                                    </h5>
                                    <p className="text-muted small mb-0">Daftarkan akun Anda untuk mulai menyewa mobil</p>
                                    <div className="mx-auto mt-2" style={{ height: '3px', width: '36px', backgroundColor: '#f96d00', borderRadius: '2px' }} />
                                </div>

                                <form onSubmit={submit} encType="multipart/form-data">
                                    <div className="row">
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <i className="ion-ios-mail" style={iconStyle} />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                    autoComplete="email"
                                                    style={inputStyle}
                                                    placeholder="email@anda.com"
                                                />
                                            </div>
                                            {errors.email && <div className="invalid-feedback d-block small font-weight-bold">{errors.email}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                Username <span className="text-danger">*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <i className="ion-ios-at" style={iconStyle} />
                                                <input
                                                    id="username"
                                                    type="text"
                                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                                    value={data.username}
                                                    onChange={(e) => setData('username', e.target.value)}
                                                    required
                                                    autoComplete="username"
                                                    style={inputStyle}
                                                    placeholder="username_anda"
                                                />
                                            </div>
                                            {errors.username && <div className="invalid-feedback d-block small font-weight-bold">{errors.username}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                Nama Lengkap <span className="text-danger">*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <i className="ion-ios-person" style={iconStyle} />
                                                <input
                                                    id="nama_lengkap"
                                                    type="text"
                                                    className={`form-control ${errors.nama_lengkap ? 'is-invalid' : ''}`}
                                                    value={data.nama_lengkap}
                                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                    required
                                                    style={inputStyle}
                                                    placeholder="Nama lengkap Anda"
                                                />
                                            </div>
                                            {errors.nama_lengkap && <div className="invalid-feedback d-block small font-weight-bold">{errors.nama_lengkap}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                Jenis Kelamin <span className="text-danger">*</span>
                                            </label>
                                            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                                {[
                                                    { val: 'L', label: '♂ Laki-laki' },
                                                    { val: 'P', label: '♀ Perempuan' },
                                                ].map(({ val, label }) => (
                                                    <label
                                                        key={val}
                                                        style={{
                                                            flex: 1, cursor: 'pointer', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            padding: '10px 8px', borderRadius: '10px',
                                                            border: `2px solid ${data.jenis_kelamin === val ? '#f96d00' : '#ddd'}`,
                                                            background: data.jenis_kelamin === val ? '#fff5ef' : '#fff',
                                                            fontWeight: 600, fontSize: '13px', color: '#222831',
                                                            transition: 'all .2s',
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="jenis_kelamin"
                                                            value={val}
                                                            checked={data.jenis_kelamin === val}
                                                            onChange={() => setData('jenis_kelamin', val)}
                                                            style={{ display: 'none' }}
                                                        />
                                                        {label}
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.jenis_kelamin && <div className="text-danger small font-weight-bold mt-1">{errors.jenis_kelamin}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                Alamat <span className="text-danger">*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <i className="ion-ios-home" style={iconStyle} />
                                                <input
                                                    id="alamat"
                                                    type="text"
                                                    className={`form-control ${errors.alamat ? 'is-invalid' : ''}`}
                                                    value={data.alamat}
                                                    onChange={(e) => setData('alamat', e.target.value)}
                                                    required
                                                    style={inputStyle}
                                                    placeholder="Jl. Contoh No. 1, Kota"
                                                />
                                            </div>
                                            {errors.alamat && <div className="invalid-feedback d-block small font-weight-bold">{errors.alamat}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                No. HP <span className="text-danger">*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <i className="ion-ios-call" style={iconStyle} />
                                                <input
                                                    id="nohp"
                                                    type="tel"
                                                    className={`form-control ${errors.nohp ? 'is-invalid' : ''}`}
                                                    value={data.nohp}
                                                    onChange={(e) => setData('nohp', e.target.value)}
                                                    required
                                                    style={inputStyle}
                                                    placeholder="08xxxxxxxxxx"
                                                    maxLength={15}
                                                />
                                            </div>
                                            {errors.nohp && <div className="invalid-feedback d-block small font-weight-bold">{errors.nohp}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                Kata Sandi <span className="text-danger">*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <i className="ion-ios-lock" style={iconStyle} />
                                                <input
                                                    id="password"
                                                    type="password"
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required
                                                    autoComplete="new-password"
                                                    style={inputStyle}
                                                    placeholder="Min. 8 karakter"
                                                />
                                            </div>
                                            {errors.password && <div className="invalid-feedback d-block small font-weight-bold">{errors.password}</div>}
                                        </div>
                                        <div className="col-md-6 form-group mb-3">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                Konfirmasi Sandi <span className="text-danger">*</span>
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <i className="ion-ios-lock" style={iconStyle} />
                                                <input
                                                    id="password_confirmation"
                                                    type="password"
                                                    className="form-control"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    required
                                                    autoComplete="new-password"
                                                    style={inputStyle}
                                                    placeholder="Ulangi kata sandi"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 form-group mb-4">
                                            <label className="font-weight-bold text-dark small text-uppercase mb-1">
                                                Foto Profil <span className="text-danger">*</span>
                                            </label>
                                            <div
                                                onClick={() => fotoRef.current?.click()}
                                                style={{
                                                    border: `2px dashed ${errors.foto ? '#dc3545' : fotoPreview ? '#f96d00' : '#ddd'}`,
                                                    borderRadius: '12px',
                                                    padding: '20px',
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    background: fotoPreview ? '#fff5ef' : '#fafafa',
                                                    transition: 'all .2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                }}
                                            >
                                                {fotoPreview ? (
                                                    <>
                                                        <img
                                                            src={fotoPreview}
                                                            alt="Preview"
                                                            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f96d00', flexShrink: 0 }}
                                                        />
                                                        <div style={{ textAlign: 'left' }}>
                                                            <div style={{ fontWeight: 700, color: '#222831', fontSize: '13px' }}>{data.foto?.name}</div>
                                                            <div style={{ fontSize: '12px', color: '#f96d00', marginTop: '2px' }}>Klik untuk ganti foto</div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div style={{ width: '100%' }}>
                                                        <i className="ion-ios-camera" style={{ fontSize: '36px', color: '#ccc' }} />
                                                        <p style={{ margin: '8px 0 2px', fontWeight: 600, color: '#555', fontSize: '13px' }}>
                                                            Klik untuk upload foto profil
                                                        </p>
                                                        <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>
                                                            JPG, PNG, GIF — Maks. 2 MB
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                ref={fotoRef}
                                                id="foto"
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                                onChange={handleFoto}
                                                style={{ display: 'none' }}
                                                required
                                            />
                                            {errors.foto && <div className="text-danger small font-weight-bold mt-1">{errors.foto}</div>}
                                        </div>
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
                                            <><i className="ion-ios-refresh mr-2" />Mendaftarkan...</>
                                        ) : (
                                            <><i className="ion-ios-person-add mr-2" />DAFTAR SEKARANG</>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="text-muted small mb-1">Sudah memiliki akun?</p>
                                    <a href="/login" className="font-weight-bold" style={{ color: '#f96d00' }}>
                                        Masuk ke Akun
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
