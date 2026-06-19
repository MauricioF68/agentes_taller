import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Taller Integrador I" />
            
            <div className="min-h-screen relative overflow-hidden bg-[#f0f4f8] text-gray-800 font-sans selection:bg-blue-500 selection:text-white">
                
                {/* --- Fondo Animado (Mesh Gradient Claro) --- */}
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-300/30 rounded-full blur-3xl animate-pulse mix-blend-multiply" style={{ animationDuration: '10s' }}></div>
                <div className="absolute bottom-[-10%] right-[-20%] w-[70vw] h-[70vw] bg-purple-300/20 rounded-full blur-3xl animate-pulse mix-blend-multiply" style={{ animationDuration: '12s' }}></div>
                <div className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] bg-cyan-200/30 rounded-full blur-3xl animate-pulse mix-blend-multiply" style={{ animationDuration: '8s' }}></div>
                
                {/* --- Emojis Flotantes Decorativos --- */}
                <div className="absolute top-[20%] left-[10%] text-7xl opacity-20 drop-shadow-xl animate-bounce" style={{ animationDuration: '6s' }}>🟢</div>
                <div className="absolute bottom-[20%] left-[15%] text-6xl opacity-20 drop-shadow-xl animate-bounce" style={{ animationDuration: '8s' }}>🔵</div>
                <div className="absolute top-[15%] right-[15%] text-6xl opacity-20 drop-shadow-xl animate-pulse" style={{ animationDuration: '5s' }}>🤖</div>
                <div className="absolute bottom-[30%] right-[10%] text-5xl opacity-10 drop-shadow-xl animate-bounce" style={{ animationDuration: '7s' }}>✨</div>

                {/* --- Navbar Principal --- */}
                <header className="relative z-20 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-gray-800">Taller Integrador I</span>
                    </div>
                    
                    <nav className="flex gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all"
                            >
                                Ir al Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-5 py-2.5 rounded-xl bg-white text-gray-700 font-bold text-sm shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all"
                                >
                                    Regístrate Ahora
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* --- Hero Section Principal --- */}
                <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/50 backdrop-blur-md mb-8 shadow-sm animate-fade-in-up">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Plataforma Activa</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 mb-6 drop-shadow-sm leading-tight">
                        Taller Integrador I
                    </h1>
                    
                    <p className="max-w-2xl text-xl md:text-2xl text-gray-600 font-medium leading-relaxed mb-10">
                        Gestiona, audita y evalúa el rendimiento de tus equipos ágiles con Inteligencia Artificial.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-300 hover:bg-blue-700 hover:scale-105 transition-all transform hover:-translate-y-1">
                                Continuar al Dashboard →
                            </Link>
                        ) : (
                            <Link href={route('register')} className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-300 hover:bg-blue-700 hover:scale-105 transition-all transform hover:-translate-y-1">
                                Empezar Ahora
                            </Link>
                        )}
                        
                        <a href="#features" className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-md text-gray-700 border border-white font-bold text-lg shadow-lg hover:bg-white hover:scale-105 transition-all transform hover:-translate-y-1">
                            Saber Más
                        </a>
                    </div>

                    {/* Fila Glassmorphism de Créditos */}
                    <div className="mt-8 bg-white/60 backdrop-blur-2xl border border-white/50 px-8 py-6 rounded-3xl shadow-xl max-w-lg w-full transform transition-all hover:scale-105">
                        <div className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Desarrollado Por</div>
                        <div className="text-xl font-extrabold text-gray-800">Mauricio Terrones Alayo</div>
                        <div className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-lg border border-blue-200">
                            Grupo 65
                        </div>
                    </div>
                    
                </main>

                {/* Footer simple */}
                <footer className="relative z-10 text-center py-6 text-sm font-medium text-gray-500">
                    Laravel v{laravelVersion} (PHP v{phpVersion}) • Construido con React e Inertia.js
                </footer>
            </div>
        </>
    );
}
