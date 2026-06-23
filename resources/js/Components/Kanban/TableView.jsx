import React from 'react';
import { motion } from 'framer-motion';

export default function TableView({ items, openEditModal }) {
    const getStatusBadge = (status) => {
        switch(status) {
            case 'backlog': return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Por Hacer</span>;
            case 'assigned': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Asignadas</span>;
            case 'in_progress': return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">En Proceso</span>;
            case 'completed': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Completadas</span>;
            default: return null;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200"
        >
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Título & Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Puntos (Peso)</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sprint</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Responsable</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => openEditModal(item)}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{item.type.replace('_', ' ')}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {item.story_points || 1} pts
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.sprint ? item.sprint.name : '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {item.assignee ? (
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs mr-2 font-bold shadow-sm">
                                            {item.assignee.name.charAt(0)}
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">{item.assignee.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Sin asignar</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {items.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    <p className="text-lg font-medium text-gray-900 mb-1">Tu Backlog está vacío</p>
                    <p>Agrega nuevas tareas para comenzar a planificar.</p>
                </div>
            )}
        </motion.div>
    );
}
