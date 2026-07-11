import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Info, Filter, Activity, Inbox, User, ArrowRight } from 'lucide-react';

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
                        <Link href={route('agile.teacher_backlog', group.id)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-full transition-colors" title="Volver al Backlog">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-slate-800 leading-tight flex items-center gap-2">Tracking General <span className="text-indigo-600 ml-1">{group.name}</span></h2>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Tracking General - ${group.name}`} />

            <div className="py-8 font-sans">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {filters.is_default && (
                        <div className="mb-6 bg-indigo-50/80 text-indigo-800 p-4 rounded-xl border border-indigo-100 flex items-start sm:items-center gap-3 shadow-sm">
                            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0 text-indigo-500" />
                            <p className="text-sm font-medium leading-snug">Por defecto, se muestran los movimientos de los <strong className="font-bold">últimos 10 días</strong>. Puedes usar los filtros abajo para buscar fechas más antiguas.</p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                        <div className="p-5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Desde</label>
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-medium py-2.5 px-3" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hasta</label>
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-medium py-2.5 px-3" 
                                />
                            </div>
                            <button 
                                onClick={applyFilters}
                                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-5 rounded-xl text-sm shadow-sm transition-colors flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Filtrar
                            </button>
                        </div>
                        <div className="p-5 flex justify-between items-center border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-600" />
                                Línea de Tiempo del Grupo
                            </h3>
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">{histories.length} movimientos</span>
                        </div>

                        <div className="p-8">
                            {histories.length === 0 ? (
                                <div className="text-center py-16">
                                    <Inbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-700">Sin Actividad</h3>
                                    <p className="text-slate-500 mt-2 font-medium text-sm">Aún no se han registrado movimientos en este grupo.</p>
                                </div>
                            ) : (
                                <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8">
                                    {histories.map((history, index) => (
                                        <div key={history.id} className="relative">
                                            <div className="absolute -left-[33px] bg-indigo-500 w-4 h-4 rounded-full mt-1.5 border-4 border-white shadow-sm"></div>
                                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                                                    <div>
                                                        <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                                                                {(history.user?.name || 'Sis').charAt(0)}
                                                            </div>
                                                            {history.user?.name || 'Sistema'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                                                        {new Date(history.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <span className="text-sm text-slate-600 font-medium">Modificó el ítem: </span>
                                                    <span className="text-sm font-bold text-indigo-700">{history.backlog_item?.title || 'Ítem Eliminado'}</span>
                                                </div>

                                                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-sm">
                                                    <div className="mb-2">
                                                        <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                            {history.action.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    
                                                    {history.action === 'status_change' ? (
                                                        <div className="flex items-center gap-2.5 mt-2">
                                                            <span className="line-through text-slate-400 font-semibold">{history.old_value}</span>
                                                            <ArrowRight className="w-4 h-4 text-slate-300" />
                                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{history.new_value}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2 text-slate-700 font-medium">
                                                            <span className="text-slate-500 mr-2 text-xs uppercase tracking-wider font-bold">Detalle:</span>
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
            </div>
        </AuthenticatedLayout>
    );
}
