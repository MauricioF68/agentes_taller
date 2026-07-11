import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#f8fafc] text-slate-800 font-sans">
            <div className="relative z-10 w-full max-w-md px-6 py-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-8"
                >
                    <Link href="/" className="group flex flex-col items-center">
                        <div className="bg-slate-900 p-3 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <span className="mt-4 text-xl font-semibold text-slate-900 tracking-tight">
                            Taller Integrador I
                        </span>
                    </Link>
                </motion.div>

                {/* Panel Central */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-slate-200 p-8 shadow-sm rounded-2xl w-full"
                >
                    {children}
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 text-center"
                >
                    <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                        Desarrollado por: Mauricio Terrones Alayo (Grupo 65)
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
