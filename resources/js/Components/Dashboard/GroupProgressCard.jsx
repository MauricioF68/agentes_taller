import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

export default function GroupProgressCard({ group }) {
    const metrics = group.agile_metrics || {
        total_points: 0,
        completed_points: 0,
        progress_percentage: 0,
        total_items: 0,
        completed_items: 0,
        in_progress_items: 0,
        issues_count: 0,
        active_sprints: 0
    };

    const colorMap = {
        rojo: 'bg-red-500',
        naranja: 'bg-orange-500',
        amarillo: 'bg-yellow-500',
        verde: 'bg-green-500',
        calavera: 'bg-black',
        enojado: 'bg-rose-600'
    };
    const evalBgColor = group.evaluation?.color_status ? colorMap[group.evaluation.color_status] || 'bg-gray-300' : 'bg-gray-200';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row items-start lg:items-center gap-6 relative overflow-hidden transition-all duration-300 w-full"
        >
            {/* Background SVG Decoration */}
            <div className="absolute -bottom-10 -right-10 text-gray-50 opacity-50 pointer-events-none transform -rotate-12 select-none w-48 h-48">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM12 22.27L3.27 17.5V7.73L12 2.96l8.73 4.77v9.77L12 22.27zM12 5l-7 4v6l7 4 7-4V9l-7-4z"></path></svg>
            </div>

            {/* Columna Izquierda: Info Básica */}
            <div className="flex-1 min-w-[250px] z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full shadow-sm ${evalBgColor}`} title="Estado de evaluación" />
                    <h3 className="text-xl font-bold text-gray-800 truncate">{group.name}</h3>
                </div>
                {group.project_name && (
                    <p className="text-sm font-semibold text-indigo-600 mb-1">{group.project_name}</p>
                )}
                <p className="text-xs text-gray-500 font-medium">{group.students?.length || 0} alumnos activos • {group.classroom} ({group.shift})</p>
            </div>

            {/* Columna Central: Progress Bar */}
            <div className="flex-1 w-full z-10">
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    <span>Avance (Esfuerzo)</span>
                    <span className="text-indigo-600">{metrics.progress_percentage}%</span>
                </div>
                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics.progress_percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1 uppercase">
                    <span>{metrics.completed_points} pts completados</span>
                    <span>{metrics.total_points} pts totales</span>
                </div>
            </div>

            {/* Columna Derecha: Métricas y Botón */}
            <div className="flex-1 flex flex-col sm:flex-row lg:justify-end items-center gap-6 z-10 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                
                <div className="flex gap-3 sm:gap-5 items-end">
                    <div className="flex flex-col items-center justify-end h-full">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5 whitespace-nowrap">Backlog</span>
                        <div className="bg-gray-50 px-3 sm:px-4 py-1 rounded-lg text-sm font-bold text-gray-700 border border-gray-200 shadow-sm">{metrics.total_items}</div>
                    </div>
                    <div className="flex flex-col items-center justify-end h-full">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5 whitespace-nowrap">En Proceso</span>
                        <div className="bg-blue-50 px-3 sm:px-4 py-1 rounded-lg text-sm font-bold text-blue-700 border border-blue-200 shadow-sm">{metrics.in_progress_items}</div>
                    </div>
                    <div className="flex flex-col items-center justify-end h-full">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5 whitespace-nowrap">Completadas</span>
                        <div className="bg-green-50 px-3 sm:px-4 py-1 rounded-lg text-sm font-bold text-green-700 border border-green-200 shadow-sm">{metrics.completed_items}</div>
                    </div>
                </div>

                <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>

                <Link 
                    href={`/auditoria?group_id=${group.id}`}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md active:scale-95 whitespace-nowrap"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    Auditar
                </Link>

            </div>
        </motion.div>
    );
}
