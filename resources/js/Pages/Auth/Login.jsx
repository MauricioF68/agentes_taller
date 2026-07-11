import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Acceder al Sistema" />

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    {status}
                </div>
            )}

            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Bienvenido de nuevo</h2>
                <p className="text-sm text-slate-500 mt-2">Ingresa tus credenciales para acceder</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-slate-700 font-medium mb-1.5" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-slate-900 focus:ring focus:ring-slate-900/10 transition-all px-4 py-2.5 text-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@correo.com"
                    />
                    <InputError message={errors.email} className="mt-2 text-red-500" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contraseña" className="text-slate-700 font-medium mb-1.5" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-slate-900 focus:ring focus:ring-slate-900/10 transition-all px-4 py-2.5 text-sm"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-2 text-red-500" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center group cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-slate-300 text-slate-900 shadow-sm focus:ring-slate-900/20 transition-colors"
                        />
                        <span className="ms-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                            Recordarme
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-all"
                    >
                        <LogIn className="w-4 h-4" />
                        Ingresar al Sistema
                    </button>
                </div>
                
                <div className="text-center mt-6">
                    <span className="text-sm text-slate-500">¿No tienes cuenta? </span>
                    <Link href={route('register')} className="text-sm font-medium text-slate-900 hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
