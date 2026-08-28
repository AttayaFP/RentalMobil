import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, router } from '@inertiajs/react';
import { KeyRound, Loader2, Mail, ArrowLeft, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type Step = 'email' | 'password' | 'success';

export default function ForgotPassword({ status }: { status?: string }) {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleEmailSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        setEmailError('');

        if (!email) {
            setEmailError('Email wajib diisi.');
            return;
        }

        setProcessing(true);

        try {
            const response = await fetch('/forgot-password/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok && result.exists) {
                setStep('password');
            } else {
                setEmailError(result.message || 'Email tidak terdaftar.');
            }
        } catch {
            setEmailError('Terjadi kesalahan. Coba lagi.');
        } finally {
            setProcessing(false);
        }
    };

    const handlePasswordSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setPasswordError('');
        setConfirmError('');

        let valid = true;

        if (!password) {
            setPasswordError('Password baru wajib diisi.');
            valid = false;
        } else if (password.length < 8) {
            setPasswordError('Password minimal 8 karakter.');
            valid = false;
        }

        if (!passwordConfirmation) {
            setConfirmError('Konfirmasi password wajib diisi.');
            valid = false;
        } else if (password !== passwordConfirmation) {
            setConfirmError('Konfirmasi password tidak cocok.');
            valid = false;
        }

        if (!valid) return;

        setProcessing(true);

        router.post(
            '/forgot-password/reset-direct',
            {
                email,
                password,
                password_confirmation: passwordConfirmation,
            },
            {
                onError: (errors) => {
                    if (errors.password) setPasswordError(errors.password);
                    if (errors.email) setEmailError(errors.email);
                    setProcessing(false);
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
            <Head title="Lupa Sandi" />

            <Card className="w-full max-w-md rounded-none border-white/10 bg-[#202020]">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-[#FFC000]/30 bg-[#181818]">
                        {step === 'success' ? (
                            <CheckCircle2 className="h-7 w-7 text-[#FFC000]" />
                        ) : step === 'password' ? (
                            <ShieldCheck className="h-7 w-7 text-[#FFC000]" />
                        ) : (
                            <KeyRound className="h-7 w-7 text-[#FFC000]" />
                        )}
                    </div>

                    <CardTitle className="text-2xl uppercase text-white">
                        {step === 'email' && 'Lupa Sandi'}
                        {step === 'password' && 'Buat Password Baru'}
                        {step === 'success' && 'Password Diubah'}
                    </CardTitle>
                    <CardDescription className="text-[#7D7D7D]">
                        {step === 'email' && 'Masukkan email yang terdaftar untuk melanjutkan'}
                        {step === 'password' && (
                            <span>
                                Akun ditemukan untuk{' '}
                                <span className="font-medium text-[#FFC000]">{email}</span>
                            </span>
                        )}
                        {step === 'success' && 'Silakan masuk menggunakan password baru Anda'}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {status && (
                        <div className="mb-4 border border-[#FFC000]/30 bg-[#181818] p-3 text-center text-sm text-[#FFC000]">
                            {status}
                        </div>
                    )}

                    <div className="mb-5 flex items-center gap-3">
                        <div
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                step === 'email'
                                    ? 'bg-[#FFC000] text-black'
                                    : 'bg-[#FFC000] text-black'
                            }`}
                        >
                            1
                        </div>
                        <div
                            className={`h-px flex-1 transition-colors ${
                                step !== 'email' ? 'bg-[#FFC000]' : 'bg-white/10'
                            }`}
                        />
                        <div
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                step === 'password' || step === 'success'
                                    ? 'bg-[#FFC000] text-black'
                                    : 'border border-white/20 bg-transparent text-[#7D7D7D]'
                            }`}
                        >
                            2
                        </div>
                    </div>

                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">
                                    Alamat Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D7D7D]" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError('');
                                        }}
                                        autoFocus
                                        autoComplete="email"
                                        placeholder="email@anda.com"
                                        className={`rounded-none bg-black pl-10 text-white placeholder:text-[#7D7D7D] ${
                                            emailError ? 'border-red-500 focus-visible:ring-red-500' : 'border-white/10'
                                        }`}
                                    />
                                </div>
                                {emailError && (
                                    <p className="flex items-center gap-1.5 text-sm text-red-400">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                                        {emailError}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-none bg-[#FFC000] text-black hover:bg-[#917300]"
                                disabled={processing}
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Mail className="h-4 w-4" />
                                )}
                                {processing ? 'Memverifikasi...' : 'VERIFIKASI EMAIL'}
                            </Button>
                        </form>
                    )}

                    {step === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">
                                    Password Baru
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        autoFocus
                                        autoComplete="new-password"
                                        placeholder="Minimal 8 karakter"
                                        className={`rounded-none bg-black pr-10 text-white placeholder:text-[#7D7D7D] ${
                                            passwordError ? 'border-red-500 focus-visible:ring-red-500' : 'border-white/10'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D7D7D] hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="flex items-center gap-1.5 text-sm text-red-400">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-white">
                                    Konfirmasi Password Baru
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirm ? 'text' : 'password'}
                                        value={passwordConfirmation}
                                        onChange={(e) => {
                                            setPasswordConfirmation(e.target.value);
                                            setConfirmError('');
                                        }}
                                        autoComplete="new-password"
                                        placeholder="Ulangi password baru"
                                        className={`rounded-none bg-black pr-10 text-white placeholder:text-[#7D7D7D] ${
                                            confirmError ? 'border-red-500 focus-visible:ring-red-500' : 'border-white/10'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D7D7D] hover:text-white"
                                    >
                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {confirmError && (
                                    <p className="flex items-center gap-1.5 text-sm text-red-400">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
                                        {confirmError}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-none border-white/10 bg-transparent text-[#7D7D7D] hover:border-white/20 hover:bg-white/5 hover:text-white"
                                    onClick={() => {
                                        setStep('email');
                                        setPassword('');
                                        setPasswordConfirmation('');
                                        setPasswordError('');
                                        setConfirmError('');
                                    }}
                                    disabled={processing}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 rounded-none bg-[#FFC000] text-black hover:bg-[#917300]"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <ShieldCheck className="h-4 w-4" />
                                    )}
                                    {processing ? 'Menyimpan...' : 'UBAH PASSWORD'}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-[#7D7D7D]">
                        Ingat password Anda?{' '}
                        <Link href="/login" className="font-semibold text-[#FFC000] hover:text-[#917300] hover:underline">
                            Masuk Sekarang
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
