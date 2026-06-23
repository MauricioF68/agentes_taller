import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

// Componente interno para el UX de selección estilo Jira (Pills)
const ItemSelector = ({ activeItems, selectedIds, onChange }) => {
    const handleSelect = (e) => {
        const id = parseInt(e.target.value);
        if (id && !selectedIds.includes(id)) {
            onChange([...selectedIds, id]);
        }
        e.target.value = ""; 
    };

    const handleRemove = (id) => {
        onChange(selectedIds.filter(itemId => itemId !== id));
    };

    return (
        <div className="mt-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <select className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2.5 px-3" onChange={handleSelect} defaultValue="">
                <option value="" disabled>🔍 Buscar y añadir tarea vinculada...</option>
                {activeItems.filter(item => !selectedIds.includes(item.id)).map(item => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                ))}
            </select>
            
            <div className="flex flex-wrap gap-2 mt-3">
                {selectedIds.length === 0 && <span className="text-xs text-gray-500 italic">No hay tareas seleccionadas.</span>}
                {selectedIds.map(id => {
                    const item = activeItems.find(i => i.id === id);
                    if (!item) return null;
                    return (
                        <div key={id} className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-indigo-200 shadow-sm">
                            <span className="truncate max-w-[200px]">{item.title}</span>
                            <button type="button" onClick={() => handleRemove(id)} className="ml-2 bg-indigo-200 hover:bg-indigo-300 rounded-full w-4 h-4 flex items-center justify-center text-indigo-800 focus:outline-none transition-colors">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function DailysList({ auth, group, dailys, activeItems }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        achievements_text: '',
        plans_text: '',
        impediments: '',
        yesterday_items: [],
        today_items: []
    });

    const submitDaily = (e) => {
        e.preventDefault();
        post(route('agile.dailys.store', group.id), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight flex items-center gap-2">🔄 Historial de Dailys</h2>}
        >
            <Head title={`Dailys - ${group.name}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dailys: {group.name}</h2>
                            <p className="text-gray-500 mt-1">Revisa el progreso progresivo de tu equipo día a día.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
                            >
                                <svg className="w-5 h-5 text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                Registrar Daily
                            </button>
                        </div>
                    </div>

                    {/* Tabla Progresiva de Dailys */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                        <th className="p-4 pl-6 w-1/5">Fecha y Autor</th>
                                        <th className="p-4 w-1/3">Logros de Ayer</th>
                                        <th className="p-4 w-1/3">Planes para Hoy</th>
                                        <th className="p-4 w-1/6 text-center">Impedimentos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {dailys.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-12 text-center">
                                                <div className="flex justify-center mb-4">
                                                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </div>
                                                <p className="text-gray-500 font-medium">Aún no hay dailys registrados en este grupo.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        dailys.map(daily => (
                                            <tr key={daily.id} className="hover:bg-gray-50/50 transition-colors group align-top">
                                                <td className="p-5 pl-6 border-l-4 border-transparent hover:border-indigo-500 transition-all">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="inline-flex items-center gap-2 font-black text-gray-900 text-sm">
                                                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                            {daily.date}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                                                {daily.user?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-500 truncate max-w-[120px]">{daily.user?.name}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{daily.achievements_text}</p>
                                                    {daily.backlog_items?.filter(i => i.pivot.type === 'yesterday').length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {daily.backlog_items.filter(i => i.pivot.type === 'yesterday').map(i => (
                                                                <span key={i.id} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                    {i.title}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{daily.plans_text}</p>
                                                    {daily.backlog_items?.filter(i => i.pivot.type === 'today').length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {daily.backlog_items.filter(i => i.pivot.type === 'today').map(i => (
                                                                <span key={i.id} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                                                    {i.title}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    {daily.impediments ? (
                                                        <div className="bg-red-50 text-red-800 text-xs p-3 rounded-xl border border-red-100 font-medium leading-relaxed">
                                                            {daily.impediments}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-300">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Creación de Daily */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <div className="bg-indigo-50 p-2 rounded-lg">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            Registrar Nuevo Daily
                        </h2>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <form onSubmit={submitDaily} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">¿Qué lograste ayer?</label>
                            <textarea className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3" rows="2" placeholder="Desarrollé el componente X..."
                                value={data.achievements_text} onChange={e => setData('achievements_text', e.target.value)} required />
                            
                            <ItemSelector 
                                activeItems={activeItems} 
                                selectedIds={data.yesterday_items} 
                                onChange={(newItems) => setData('yesterday_items', newItems)} 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">¿Qué vas a lograr hoy?</label>
                            <textarea className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3" rows="2" placeholder="Revisaré las pruebas del módulo Y..."
                                value={data.plans_text} onChange={e => setData('plans_text', e.target.value)} required />
                            
                            <ItemSelector 
                                activeItems={activeItems} 
                                selectedIds={data.today_items} 
                                onChange={(newItems) => setData('today_items', newItems)} 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Impedimentos</label>
                            <textarea className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3" rows="2" placeholder="Bloqueos, dependencias o dudas..."
                                value={data.impediments} onChange={e => setData('impediments', e.target.value)} />
                        </div>

                        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl border border-gray-300 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" disabled={processing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors active:scale-95">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Guardar Daily
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
