import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f0f4f8]">
            {/* Fondo animado y decorativo (Opción B: Claro/Limpio) */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/40 rounded-full blur-3xl animate-pulse mix-blend-multiply" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-200/40 rounded-full blur-3xl animate-pulse mix-blend-multiply" style={{ animationDuration: '10s' }}></div>
            <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-cyan-200/30 rounded-full blur-3xl animate-pulse mix-blend-multiply" style={{ animationDuration: '12s' }}></div>
            
            {/* Emojis flotantes en el fondo (Opcional decorativo) */}
            <div className="absolute top-[15%] left-[10%] text-6xl opacity-20 drop-shadow-lg animate-bounce" style={{ animationDuration: '6s' }}>🟢</div>
            <div className="absolute bottom-[20%] left-[20%] text-5xl opacity-20 drop-shadow-lg animate-bounce" style={{ animationDuration: '7s' }}>🔵</div>
            <div className="absolute top-[30%] right-[15%] text-7xl opacity-10 drop-shadow-lg animate-pulse">🤖</div>

            <div className="relative z-10 w-full max-w-md px-6 py-10">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="group flex flex-col items-center">
                        <div className="bg-white p-3 rounded-2xl shadow-lg border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <span className="mt-3 text-xl font-bold text-gray-800 tracking-tight">Taller Integrador I</span>
                    </Link>
                </div>

                {/* Panel Glassmorphism */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-8 shadow-2xl rounded-3xl w-full">
                    {children}
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 font-medium tracking-wide">
                        HECHO POR: MAURICIO TERRONES ALAYO (GRUPO 65)
                    </p>
                </div>
            </div>
        </div>
    );
}
