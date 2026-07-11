import React from 'react';
import { motion } from 'framer-motion';
import { CircleDot } from 'lucide-react';

export default function TableView({ items, openEditModal }) {
    const getStatusBadge = (status) => {
        switch(status) {
            case 'backlog': return <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border border-slate-200">Por Hacer</span>;
            case 'assigned': return <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border border-blue-100">Asignadas</span>;
            case 'in_progress': return <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border border-amber-100">En Proceso</span>;
            case 'completed': return <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border border-emerald-100">Completadas</span>;
            default: return null;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200 font-sans"
        >
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                    <tr>
                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Título & Tipo</th>
                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Puntos (Peso)</th>
                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sprint</th>
                        <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => openEditModal(item)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{item.type.replace('_', ' ')}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                    <CircleDot className="w-3 h-3 mr-1.5 text-slate-400" /> {item.story_points || 1} pts
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-slate-600">{item.sprint ? item.sprint.name : '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {item.assignee ? (
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] mr-2.5 font-bold shadow-sm border border-indigo-200">
                                            {item.assignee.name.charAt(0)}
                                        </div>
                                        <span className="text-sm text-slate-700 font-medium">{item.assignee.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-slate-400 italic">Sin asignar</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {items.length === 0 && (
                <div className="p-16 text-center">
                    <p className="text-sm font-semibold text-slate-700 mb-1">Tu Backlog está vacío</p>
                    <p className="text-xs text-slate-500 font-medium">Agrega nuevas tareas para comenzar a planificar.</p>
                </div>
            )}
        </motion.div>
    );
}
