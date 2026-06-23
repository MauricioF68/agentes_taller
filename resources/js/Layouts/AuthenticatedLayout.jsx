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

    const teacherLinks = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
            )
        },
        {
            name: 'Auditoría IA',
            href: route('audit.index'),
            active: route().current('audit.*'),
            icon: (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
            )
        },
        {
            name: 'Mis Grupos',
            href: route('groups.index'),
            active: route().current('groups.*'),
            icon: (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
            )
        }
    ];

    const studentLinks = [
        {
            name: 'Panel de Control',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
            )
        },
        {
            name: 'Mis Grupos',
            href: route('groups.index'),
            active: route().current('groups.*'),
            icon: (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
            )
        }
    ];

    const currentLinks = user.role === 'docente' ? teacherLinks : studentLinks;

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden font-sans">
            <ToastContainer position="bottom-right" theme="colored" />
            
            {/* Sidebar para Escritorio */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-20">
                {/* Cabecera Sidebar */}
                <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
                    <Link href="/">
                        <ApplicationLogo className="block h-8 w-auto text-indigo-600" />
                    </Link>
                    <span className="font-extrabold text-lg tracking-wide text-gray-900">Agentes Taller</span>
                </div>
                
                {/* Navegación Principal */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {currentLinks.map(link => (
                        <Link 
                            key={link.name}
                            href={link.href} 
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${link.active ? 'bg-indigo-50 font-bold text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    ))}

                    {user.role === 'alumno' && activeGroupId && (
                        <>
                            <div className="pt-6 pb-2">
                                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Agilidad (Equipo)
                                </p>
                            </div>
                            <Link 
                                href={route('agile.backlog', activeGroupId)} 
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${route().current('agile.backlog') ? 'bg-indigo-50 font-bold text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                Backlog
                            </Link>
                            <Link 
                                href={route('agile.dailys', activeGroupId)} 
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${route().current('agile.dailys') ? 'bg-indigo-50 font-bold text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Dailys
                            </Link>
                        </>
                    )}
                </nav>

                {/* Perfil y Salida */}
                <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                    <div className="mb-4 px-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link 
                            href={route('profile.edit')} 
                            className="flex-1 text-center px-3 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Perfil
                        </Link>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="flex-1 text-center px-3 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                        >
                            Salir
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Menú Móvil (Hamburguesa) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-30 flex justify-between items-center p-4 shadow-sm">
                <span className="font-bold text-indigo-600">Agentes Taller</span>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                    </svg>
                </button>
            </div>

            {/* Overlay Menú Móvil */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-64 h-full bg-white flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-extrabold text-lg text-indigo-600">Menú</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">✕</button>
                        </div>
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {currentLinks.map(link => (
                                <Link 
                                    key={link.name}
                                    href={link.href} 
                                    className={`flex items-center px-4 py-3 rounded-xl ${link.active ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                            
                            {user.role === 'alumno' && activeGroupId && (
                                <>
                                    <hr className="my-4 border-gray-100" />
                                    <Link href={route('agile.backlog', activeGroupId)} className={`flex items-center px-4 py-3 rounded-xl ${route().current('agile.backlog') ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>📋 Backlog</Link>
                                    <Link href={route('agile.dailys', activeGroupId)} className={`flex items-center px-4 py-3 rounded-xl ${route().current('agile.dailys') ? 'bg-indigo-50 font-bold text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>📅 Dailys</Link>
                                </>
                            )}
                            
                        </nav>
                        <div className="p-4 border-t border-gray-100">
                            <Link href={route('profile.edit')} className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 mb-2">Perfil</Link>
                            <Link href={route('logout')} method="post" as="button" className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-bold">Cerrar Sesión</Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col overflow-y-auto w-full pt-16 md:pt-0 bg-gray-50/50">
                {header && (
                    <header className="px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
                        {header}
                    </header>
                )}
                <main className="px-4 sm:px-8 pb-12 max-w-7xl mx-auto w-full flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}