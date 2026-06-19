import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
        <div className="mt-2 bg-gray-50 p-3 rounded border border-gray-200">
            <select className="block w-full rounded-md border-gray-300 shadow-sm text-sm" onChange={handleSelect} defaultValue="">
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
                        <div key={id} className="inline-flex items-center bg-blue-100 text-notion-blue text-xs font-semibold px-2.5 py-1.5 rounded border border-blue-200 shadow-sm">
                            <span className="truncate max-w-[200px]">{item.title}</span>
                            <button type="button" onClick={() => handleRemove(id)} className="ml-2 bg-blue-200 hover:bg-blue-300 rounded-full w-4 h-4 flex items-center justify-center text-blue-800 focus:outline-none transition-colors">
                                &times;
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function DailysList({ auth, group, dailys, activeItems }) {
    
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
            onSuccess: () => reset()
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dailys: {group.name}</h2>}
        >
            <Head title={`Dailys - ${group.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Formulario de Nuevo Daily */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
                        <h3 className="text-lg font-bold mb-4 text-notion-text">Registrar Daily</h3>
                        <form onSubmit={submitDaily} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">¿Qué se logró ayer?</label>
                                <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" rows="2" placeholder="Desarrollamos el componente X..."
                                    value={data.achievements_text} onChange={e => setData('achievements_text', e.target.value)} required />
                                
                                <ItemSelector 
                                    activeItems={activeItems} 
                                    selectedIds={data.yesterday_items} 
                                    onChange={(newItems) => setData('yesterday_items', newItems)} 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">¿Qué vas a lograr hoy?</label>
                                <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" rows="2" placeholder="Revisaré las pruebas del módulo Y..."
                                    value={data.plans_text} onChange={e => setData('plans_text', e.target.value)} required />
                                
                                <ItemSelector 
                                    activeItems={activeItems} 
                                    selectedIds={data.today_items} 
                                    onChange={(newItems) => setData('today_items', newItems)} 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">Impedimentos</label>
                                <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" rows="2" placeholder="Bloqueos, dependencias o dudas..."
                                    value={data.impediments} onChange={e => setData('impediments', e.target.value)} />
                            </div>

                            <button type="submit" disabled={processing} className="w-full bg-notion-blue hover:bg-blue-900 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors">
                                Guardar Daily
                            </button>
                        </form>
                    </div>

                    {/* Historial de Dailys */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-bold text-notion-text mb-4">Historial del Equipo</h3>
                        {dailys.length === 0 ? (
                            <div className="bg-white p-8 text-center rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500">Aún no hay dailys registrados en este grupo.</p>
                            </div>
                        ) : (
                            dailys.map(daily => (
                                <div key={daily.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-notion-blue hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                                        <div className="font-bold text-gray-800 text-lg">{daily.date}</div>
                                        <div className="text-sm font-medium text-gray-500">Reportado por: {daily.user?.name}</div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-bold text-green-700 text-xs uppercase tracking-wider mb-2">Logros de Ayer</h4>
                                            <p className="text-gray-700 text-sm mb-3 bg-green-50 p-3 rounded">{daily.achievements_text}</p>
                                            
                                            {daily.backlog_items?.filter(i => i.pivot.type === 'yesterday').length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {daily.backlog_items.filter(i => i.pivot.type === 'yesterday').map(i => (
                                                        <span key={i.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                            ✓ {i.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-blue-700 text-xs uppercase tracking-wider mb-2">Planes para Hoy</h4>
                                            <p className="text-gray-700 text-sm mb-3 bg-blue-50 p-3 rounded">{daily.plans_text}</p>
                                            
                                            {daily.backlog_items?.filter(i => i.pivot.type === 'today').length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {daily.backlog_items.filter(i => i.pivot.type === 'today').map(i => (
                                                        <span key={i.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                            ⚡ {i.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {daily.impediments && (
                                        <div className="mt-4 pt-4 border-t border-red-100 bg-red-50 p-4 rounded-b-md -mx-6 -mb-6">
                                            <h4 className="font-bold text-red-700 text-xs uppercase tracking-wider mb-1">Impedimentos</h4>
                                            <p className="text-red-900 text-sm">{daily.impediments}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
