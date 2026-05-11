import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';

interface Pelanggan {
    id: number;
    nama_lengkap: string;
    username: string;
    email: string;
    jenis_kelamin: string;
    nohp: string;
    alamat: string;
    role: string;
    foto?: string;
}

interface Props {
    pelanggans: Pelanggan[];
}

export default function Index({ pelanggans }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
            router.delete(`/pelanggan/${id}`);
        }
    };

    const forceNavigate = (path: string) => {
        window.location.href = path;
    };

    return (
        <AdminLayout title="Manajemen Pengguna">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="font-weight-bold mb-0 text-dark">
                        <i className="ion-ios-people mr-2 text-primary"></i> Daftar Pengguna & Pelanggan
                    </h5>
                    <button onClick={() => forceNavigate('/pelanggan/create')} className="btn btn-primary px-4 py-2" style={{ borderRadius: '8px', fontWeight: 600 }}>
                        <i className="ion-ios-person-add mr-2"></i> Tambah Baru
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                            <tr>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold">Informasi User</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Username</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Email</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Alamat</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">Role</th>
                                <th className="border-0 py-3 text-muted small text-uppercase font-weight-bold">No. WhatsApp</th>
                                <th className="border-0 px-4 py-3 text-muted small text-uppercase font-weight-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pelanggans.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-4 py-4">
                                        <div className="d-flex align-items-center">
                                            <div className="mr-3 d-flex align-items-center justify-content-center text-white" 
                                                 style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: p.role === 'admin' ? '#e53e3e' : '#f96d00', fontWeight: 600 }}>
                                                {p.foto ? (
                                                    <img src={`/storage/${p.foto}`} alt={p.nama_lengkap} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    p.nama_lengkap.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-weight-bold text-dark mb-0">{p.nama_lengkap}</div>
                                                <small className="text-muted">{p.jenis_kelamin}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4"><code className="text-primary">@{p.username}</code></td>
                                    <td className="py-4 text-muted">{p.email}</td>
                                    <td className="py-4 small text-muted" style={{ maxWidth: '200px' }}>{p.alamat}</td>
                                    <td className="py-4">
                                        <span className={`badge px-3 py-2 text-uppercase`} style={{ 
                                            borderRadius: '20px', 
                                            backgroundColor: p.role === 'admin' ? '#ffe8e8' : '#e1f7ec',
                                            color: p.role === 'admin' ? '#e53e3e' : '#0d8a4f',
                                            fontSize: '10px',
                                            fontWeight: 800
                                        }}>
                                            {p.role}
                                        </span>
                                    </td>
                                    <td className="py-4 font-weight-bold">{p.nohp || '-'}</td>
                                    <td className="px-4 py-4 text-right">
                                        <button onClick={() => forceNavigate(`/pelanggan/${p.id}/edit`)} className="btn btn-sm btn-light mr-2" style={{ borderRadius: '5px' }}>
                                            <i className="ion-ios-create"></i>
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: '5px' }}>
                                            <i className="ion-ios-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
