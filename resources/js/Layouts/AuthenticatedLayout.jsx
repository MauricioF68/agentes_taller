import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthenticatedLayout({ header, children }) {
    const { props } = usePage();
    const { user, activeGroupId } = props.auth;
    const flash = props.flash || {};
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash.success, flash.error]);

    return (
        <div className="flex h-screen bg-notion-bg text-notion-text overflow-hidden font-sans">
            <ToastContainer position="bottom-right" theme="colored" />
            
            {/* Sidebar para Escritorio */}
            <aside className="hidden md:flex flex-col w-64 bg-notion-sidebar border-r border-notion-border shadow-sm">
                {/* Cabecera Sidebar */}
                <div className="p-5 flex items-center space-x-3">
                    <Link href="/">
                        <ApplicationLogo className="block h-8 w-auto text-notion-blue" />
                    </Link>
                    <span className="font-bold text-lg tracking-wide text-notion-blue">Corporativo IA</span>
                </div>
                
                {/* Navegación Principal */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    <Link 
                        href={route('dashboard')} 
                        className={`flex items-center px-3 py-2 rounded-md transition-colors ${route().current('dashboard') ? 'bg-notion-hover font-bold text-notion-blue' : 'text-notion-textMuted hover:bg-notion-hover hover:text-notion-text'}`}
                    >
                        Panel de Control
                    </Link>
                    <Link 
                        href={route('groups.index')} 
                        className={`flex items-center px-3 py-2 rounded-md transition-colors ${route().current('groups.*') ? 'bg-notion-hover font-bold text-notion-blue' : 'text-notion-textMuted hover:bg-notion-hover hover:text-notion-text'}`}
                    >
                        Gestión de Grupos
                    </Link>

                    {user.role === 'alumno' && activeGroupId && (
                        <>
                            <div className="pt-4 pb-2">
                                <p className="px-3 text-xs font-semibold text-notion-textMuted uppercase tracking-wider">
                                    Agilidad (Grupo Actual)
                                </p>
                            </div>
                            <Link 
                                href={route('agile.backlog', activeGroupId)} 
                                className={`flex items-center px-3 py-2 rounded-md transition-colors ${route().current('agile.backlog') ? 'bg-notion-hover font-bold text-notion-blue' : 'text-notion-textMuted hover:bg-notion-hover hover:text-notion-text'}`}
                            >
                                📋 Backlog Kanban
                            </Link>
                            <Link 
                                href={route('agile.dailys', activeGroupId)} 
                                className={`flex items-center px-3 py-2 rounded-md transition-colors ${route().current('agile.dailys') ? 'bg-notion-hover font-bold text-notion-blue' : 'text-notion-textMuted hover:bg-notion-hover hover:text-notion-text'}`}
                            >
                                📅 Dailys
                            </Link>
                        </>
                    )}
                </nav>

                {/* Perfil y Salida */}
                <div className="p-4 border-t border-notion-border bg-gray-50">
                    <div className="mb-3 px-3">
                        <p className="text-sm font-bold text-notion-text">{user.name}</p>
                        <p className="text-xs text-notion-textMuted">{user.email}</p>
                    </div>
                    <Link 
                        href={route('profile.edit')} 
                        className="block px-3 py-2 text-sm text-notion-textMuted rounded-md hover:bg-notion-hover hover:text-notion-text transition-colors"
                    >
                        Configuración
                    </Link>
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button" 
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-red-50 transition-colors text-red-500 hover:text-red-700"
                    >
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* Menú Móvil (Hamburguesa) */}
            <div className="md:hidden fixed top-0 w-full bg-notion-sidebar border-b border-notion-border z-10 flex justify-between items-center p-4 shadow-sm">
                <span className="font-bold text-notion-blue">Corporativo IA</span>
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
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-20 flex" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-64 h-full bg-notion-sidebar p-4 flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-bold text-lg text-notion-blue">Menú</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-notion-textMuted hover:text-notion-text">✕</button>
                        </div>
                        <nav className="flex-1 space-y-2">
                            <Link href={route('dashboard')} className={`block px-3 py-3 rounded-md ${route().current('dashboard') ? 'bg-notion-hover font-bold text-notion-blue' : 'text-notion-textMuted hover:bg-notion-hover'}`}>Panel de Control</Link>
                            <Link href={route('groups.index')} className={`block px-3 py-3 rounded-md ${route().current('groups.*') ? 'bg-notion-hover font-bold text-notion-blue' : 'text-notion-textMuted hover:bg-notion-hover'}`}>Gestión de Grupos</Link>
                            
                            {user.role === 'alumno' && activeGroupId && (
                                <>
                                    <hr className="my-2 border-notion-border" />
                                    <Link href={route('agile.backlog', activeGroupId)} className={`block px-3 py-3 rounded-md ${route().current('agile.backlog') ? 'bg-notion-hover font-bold text-notion-blue' : 'text-notion-textMuted hover:bg-notion-hover'}`}>📋 Backlog</Link>
                                    <Link href={route('agile.dailys', activeGroupId)} className={`block px-3 py-3 rounded-md ${route().current('agile.dailys') ? 'bg-notion-hover font-bold text-notion-blue' : 'text-notion-textMuted hover:bg-notion-hover'}`}>📅 Dailys</Link>
                                </>
                            )}
                            
                            <hr className="my-2 border-notion-border" />
                            <Link href={route('profile.edit')} className="block px-3 py-3 rounded-md text-notion-textMuted hover:bg-notion-hover">Perfil</Link>
                            <Link href={route('logout')} method="post" as="button" className="w-full text-left px-3 py-3 rounded-md hover:bg-red-50 text-red-500">Cerrar Sesión</Link>
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