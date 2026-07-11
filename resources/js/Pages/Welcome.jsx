import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogIn, UserPlus, ArrowRight, Activity, Users, ShieldCheck } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Taller Integrador I" />
            
            <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-slate-800 selection:text-white">
                
                {/* --- Navbar Principal --- */}
                <header className="relative z-20 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="bg-slate-900 p-2 rounded-lg shadow-sm">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-slate-900">
                            Taller Integrador I
                        </span>
                    </motion.div>
                    
                    <motion.nav 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 items-center"
                    >
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm shadow-sm hover:bg-slate-800 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Ir al Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 font-medium text-sm hover:bg-slate-100 transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm shadow-sm hover:bg-slate-800 transition-colors"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Regístrate
                                </Link>
                            </>
                        )}
                    </motion.nav>
                </header>

                {/* --- Hero Section Principal --- */}
                <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center max-w-5xl mx-auto">
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-slate-600 tracking-wide">
                            Plataforma Activa
                        </span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight"
                    >
                        Gestión Ágil <br className="hidden md:block"/> a Nivel Profesional
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-2xl text-lg md:text-xl text-slate-600 font-normal leading-relaxed mb-12"
                    >
                        Organiza tareas, audita el rendimiento y evalúa a tus equipos con métricas claras y una interfaz diseñada para la máxima productividad.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 mb-16"
                    >
                        {auth.user ? (
                            <Link href={route('dashboard')} className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium text-base shadow-sm hover:bg-slate-800 hover:shadow-md transition-all">
                                Continuar al Dashboard
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <Link href={route('register')} className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium text-base shadow-sm hover:bg-slate-800 hover:shadow-md transition-all">
                                Empezar Ahora
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </motion.div>

                    {/* Características / Features rápidas */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left"
                    >
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <Activity className="w-8 h-8 text-slate-700 mb-4" />
                            <h3 className="font-semibold text-slate-900 mb-2">Métricas en Tiempo Real</h3>
                            <p className="text-sm text-slate-600">Visualiza el progreso y la velocidad de tu equipo con gráficas e indicadores precisos.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <Users className="w-8 h-8 text-slate-700 mb-4" />
                            <h3 className="font-semibold text-slate-900 mb-2">Colaboración Eficiente</h3>
                            <p className="text-sm text-slate-600">Gestión de roles y permisos estructurada para Docentes y Alumnos.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <ShieldCheck className="w-8 h-8 text-slate-700 mb-4" />
                            <h3 className="font-semibold text-slate-900 mb-2">Auditoría Completa</h3>
                            <p className="text-sm text-slate-600">Historial detallado de cada movimiento en el Backlog para mantener la trazabilidad.</p>
                        </div>
                    </motion.div>

                    {/* Fila de Créditos minimalista */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 flex items-center gap-4 text-sm text-slate-500"
                    >
                        <span>Desarrollado por <strong className="text-slate-800 font-medium">Mauricio Terrones Alayo</strong></span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium text-xs">Grupo 65</span>
                    </motion.div>
                    
                </main>

                {/* Footer simple */}
                <footer className="relative z-10 text-center py-8 text-xs font-medium text-slate-400 mt-10 border-t border-slate-200">
                    Laravel v{laravelVersion} (PHP v{phpVersion}) • Construido con React, Inertia.js y Tailwind CSS
                </footer>
            </div>
        </>
    );
}
