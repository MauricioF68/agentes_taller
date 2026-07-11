import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Search, X, History, CalendarPlus, Inbox, Calendar, User, Target, AlertTriangle, CheckSquare, ListTodo } from 'lucide-react';

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
        <div className="mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                </div>
                <select className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2.5 pl-10 pr-3 font-medium text-slate-700" onChange={handleSelect} defaultValue="">
                    <option value="" disabled>Buscar y añadir tarea vinculada...</option>
                    {activeItems.filter(item => !selectedIds.includes(item.id)).map(item => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                    ))}
                </select>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
                {selectedIds.length === 0 && <span className="text-xs text-slate-500 font-medium italic">No hay tareas seleccionadas.</span>}
                {selectedIds.map(id => {
                    const item = activeItems.find(i => i.id === id);
                    if (!item) return null;
                    return (
                        <div key={id} className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-indigo-200 shadow-sm">
                            <span className="truncate max-w-[200px]">{item.title}</span>
                            <button type="button" onClick={() => handleRemove(id)} className="ml-2 bg-indigo-200 hover:bg-indigo-300 rounded-md w-4 h-4 flex items-center justify-center text-indigo-800 focus:outline-none transition-colors">
                                <X className="w-3 h-3" />
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
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight flex items-center gap-2"><History className="w-5 h-5 text-indigo-600" /> Historial de Dailys</h2>}
        >
            <Head title={`Dailys - ${group.name}`} />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dailys: {group.name}</h2>
                            <p className="text-slate-500 mt-1 font-medium text-sm">Revisa el progreso progresivo de tu equipo día a día.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-sm"
                            >
                                <CalendarPlus className="w-4 h-4" />
                                Registrar Daily
                            </button>
                        </div>
                    </div>

                    {/* Tabla Progresiva de Dailys */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                                        <th className="p-4 pl-6 w-1/5">Fecha y Autor</th>
                                        <th className="p-4 w-1/3">Logros de Ayer</th>
                                        <th className="p-4 w-1/3">Planes para Hoy</th>
                                        <th className="p-4 w-1/6 text-center">Impedimentos</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dailys.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-16 text-center">
                                                <div className="flex justify-center mb-4">
                                                    <Inbox className="w-12 h-12 text-slate-300" />
                                                </div>
                                                <p className="text-slate-500 font-medium text-sm">Aún no hay dailys registrados en este grupo.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        dailys.map(daily => (
                                            <tr key={daily.id} className="hover:bg-slate-50/50 transition-colors group align-top">
                                                <td className="p-5 pl-6 border-l-4 border-transparent hover:border-indigo-500 transition-all">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="inline-flex items-center gap-2 font-bold text-slate-800 text-sm">
                                                            <Calendar className="w-4 h-4 text-indigo-500" />
                                                            {daily.date}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-[10px] font-bold shadow-sm">
                                                                {daily.user?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <span className="text-xs font-semibold text-slate-600 truncate max-w-[120px]">{daily.user?.name}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <p className="text-slate-700 text-sm leading-relaxed mb-3">{daily.achievements_text}</p>
                                                    {daily.backlog_items?.filter(i => i.pivot.type === 'yesterday').length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {daily.backlog_items.filter(i => i.pivot.type === 'yesterday').map(i => (
                                                                <span key={i.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                                                    <CheckSquare className="w-3 h-3 text-emerald-500" />
                                                                    {i.title}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    <p className="text-slate-700 text-sm leading-relaxed mb-3">{daily.plans_text}</p>
                                                    {daily.backlog_items?.filter(i => i.pivot.type === 'today').length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {daily.backlog_items.filter(i => i.pivot.type === 'today').map(i => (
                                                                <span key={i.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                                                                    <Target className="w-3 h-3 text-blue-500" />
                                                                    {i.title}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    {daily.impediments ? (
                                                        <div className="bg-rose-50 text-rose-800 text-xs p-3 rounded-xl border border-rose-100 font-medium leading-relaxed">
                                                            {daily.impediments}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center mt-2">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-300 border border-slate-100">
                                                                <CheckSquare className="w-4 h-4" />
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
                <div className="p-6 font-sans">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ListTodo className="w-5 h-5 text-indigo-600" />
                            Registrar Nuevo Daily
                        </h2>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={submitDaily} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">¿Qué lograste ayer?</label>
                            <textarea className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 font-medium" rows="2" placeholder="Desarrollé el componente X..."
                                value={data.achievements_text} onChange={e => setData('achievements_text', e.target.value)} required />
                            
                            <ItemSelector 
                                activeItems={activeItems} 
                                selectedIds={data.yesterday_items} 
                                onChange={(newItems) => setData('yesterday_items', newItems)} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">¿Qué vas a lograr hoy?</label>
                            <textarea className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 font-medium" rows="2" placeholder="Revisaré las pruebas del módulo Y..."
                                value={data.plans_text} onChange={e => setData('plans_text', e.target.value)} required />
                            
                            <ItemSelector 
                                activeItems={activeItems} 
                                selectedIds={data.today_items} 
                                onChange={(newItems) => setData('today_items', newItems)} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Impedimentos (Opcional)</label>
                            <textarea className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 font-medium" rows="2" placeholder="Bloqueos, dependencias o dudas..."
                                value={data.impediments} onChange={e => setData('impediments', e.target.value)} />
                        </div>

                        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-5 rounded-xl border border-slate-300 transition-colors text-sm">
                                Cancelar
                            </button>
                            <button type="submit" disabled={processing} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors active:scale-95 text-sm">
                                <CalendarPlus className="w-4 h-4" />
                                Guardar Daily
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
