import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function TeacherTracking({ auth, group, histories, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const applyFilters = () => {
        router.get(route('agile.teacher_tracking', group.id), {
            start_date: startDate,
            end_date: endDate
        }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('agile.teacher_backlog', group.id)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600 rounded-full transition-colors" title="Volver al Backlog">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </Link>
                        <div>
                            <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Tracking General <span className="text-indigo-600">{group.name}</span></h2>
                            <p className="text-sm text-gray-500 font-medium">Actividad reciente del Backlog</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Tracking General - ${group.name}`} />

            <div className="pb-12 max-w-4xl mx-auto mt-6 px-4 sm:px-0">
                {filters.is_default && (
                    <div className="mb-4 bg-indigo-50 text-indigo-800 p-4 rounded-xl border border-indigo-200 flex items-center gap-3 shadow-sm">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-sm font-medium">Por defecto, se muestran los movimientos de los <strong>últimos 10 días</strong>. Puedes usar los filtros abajo para buscar fechas más antiguas.</p>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Desde</label>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Hasta</label>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
                            />
                        </div>
                        <button 
                            onClick={applyFilters}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-sm transition-colors"
                        >
                            Filtrar
                        </button>
                    </div>
                    <div className="p-4 flex justify-between items-center border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Línea de Tiempo del Grupo
                        </h3>
                        <span className="text-sm font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{histories.length} movimientos encontrados</span>
                    </div>

                    <div className="p-8">
                        {histories.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h3 className="text-xl font-bold text-gray-700">Sin Actividad</h3>
                                <p className="text-gray-500 mt-2">Aún no se han registrado movimientos en este grupo.</p>
                            </div>
                        ) : (
                            <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8">
                                {histories.map((history, index) => (
                                    <div key={history.id} className="relative">
                                        <div className="absolute -left-[33px] bg-indigo-500 w-4 h-4 rounded-full mt-1.5 border-4 border-white shadow-sm"></div>
                                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                                                <div>
                                                    <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                                                            {(history.user?.name || 'Sis').charAt(0)}
                                                        </div>
                                                        {history.user?.name || 'Sistema'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                                                    {new Date(history.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            <div className="mb-2">
                                                <span className="text-sm text-gray-600">modificó el ítem: </span>
                                                <span className="text-sm font-bold text-indigo-700">{history.backlog_item?.title || 'Ítem Eliminado'}</span>
                                            </div>

                                            <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-100 text-sm">
                                                <div className="mb-1">
                                                    <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[10px] font-bold uppercase tracking-wider">
                                                        {history.action.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                
                                                {history.action === 'status_change' ? (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="line-through text-gray-400 font-medium">{history.old_value}</span>
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                                        <span className="font-bold text-green-600">{history.new_value}</span>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 text-gray-700 italic">
                                                        <span className="font-medium text-gray-500 mr-2">Detalle:</span>
                                                        "{history.new_value}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
