import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-notion-bg text-notion-text overflow-hidden font-sans">
            
            {/* Sidebar para Escritorio */}
            <aside className="hidden md:flex flex-col w-64 bg-notion-sidebar border-r border-notion-border">
                {/* Cabecera Sidebar */}
                <div className="p-5 flex items-center space-x-3">
                    <Link href="/">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-notion-text" />
                    </Link>
                    <span className="font-semibold text-lg tracking-wide">Taller IA</span>
                </div>
                
                {/* Navegación Principal */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <Link 
                        href={route('dashboard')} 
                        className={`flex items-center px-3 py-2 rounded-md transition-colors ${route().current('dashboard') ? 'bg-notion-hover font-medium text-white' : 'text-notion-text hover:bg-notion-hover'}`}
                    >
                        Panel de Control
                    </Link>
                </nav>

                {/* Perfil y Salida */}
                <div className="p-4 border-t border-notion-border">
                    <div className="mb-3 px-3">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-notion-textMuted">{user.email}</p>
                    </div>
                    <Link 
                        href={route('profile.edit')} 
                        className="block px-3 py-2 text-sm text-notion-text rounded-md hover:bg-notion-hover transition-colors"
                    >
                        Configuración
                    </Link>
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-notion-hover transition-colors text-red-400 hover:text-red-300"
                    >
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* Menú Móvil (Hamburguesa) */}
            <div className="md:hidden fixed top-0 w-full bg-notion-sidebar border-b border-notion-border z-10 flex justify-between items-center p-4">
                <span className="font-semibold text-white">Taller IA</span>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="p-2 text-notion-text hover:bg-notion-hover rounded-md focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Overlay Menú Móvil */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-60 z-20 flex" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-64 h-full bg-notion-sidebar p-4 flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-semibold text-lg text-white">Menú</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-notion-textMuted hover:text-white">✕</button>
                        </div>
                        <nav className="flex-1 space-y-2">
                            <Link href={route('dashboard')} className="block px-3 py-3 rounded-md text-white bg-notion-hover">Dashboard</Link>
                            <Link href={route('profile.edit')} className="block px-3 py-3 rounded-md text-notion-text hover:bg-notion-hover">Perfil</Link>
                            <Link href={route('logout')} method="post" as="button" className="w-full text-left px-3 py-3 rounded-md hover:bg-notion-hover text-red-400">Cerrar Sesión</Link>
                        </nav>
                    </div>
                </div>
            )}

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col overflow-y-auto w-full pt-16 md:pt-0 bg-notion-bg">
                {header && (
                    <header className="px-8 py-6 max-w-5xl mx-auto w-full">
                        {header}
                    </header>
                )}
                <main className="px-8 pb-12 max-w-5xl mx-auto w-full flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}