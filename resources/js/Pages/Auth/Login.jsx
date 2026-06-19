import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

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
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
                    {status}
                </div>
            )}

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h2>
                <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para acceder</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-600" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all px-4 py-3 bg-white/50"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@correo.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contraseña" className="text-gray-600" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all px-4 py-3 bg-white/50"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center group cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 group-hover:border-blue-400 transition-colors"
                        />
                        <span className="ms-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                            Recordarme
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
                    >
                        Ingresar al Sistema
                    </button>
                </div>
                
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-500">¿No tienes cuenta? </span>
                    <Link href={route('register')} className="text-sm font-bold text-blue-600 hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
