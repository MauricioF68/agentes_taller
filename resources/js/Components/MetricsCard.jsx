import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function MetricsCard({ data }) {
    if (!data || !data.global || !data.weekly) return null;

    const [view, setView] = useState(data.default_view || 'global');
    const currentMetrics = data[view];
    const { velocity, status_distribution, overdue_alerts } = currentMetrics;

    // Datos para la distribución
    const statusData = [
        { name: 'Por Hacer', value: status_distribution.todo, color: '#94a3b8' }, // slate-400
        { name: 'En Proceso', value: status_distribution.in_progress, color: '#3b82f6' }, // blue-500
        { name: 'Completado', value: status_distribution.completed, color: '#22c55e' } // green-500
    ].filter(item => item.value > 0);

    return (
        <div className="w-full mt-4 space-y-4 relative">
            
            {/* Selector de Rango de Tiempo */}
            <div className="absolute -top-12 right-0 bg-white shadow-sm border border-gray-200 rounded-lg flex overflow-hidden">
                <button 
                    onClick={() => setView('global')}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === 'global' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Histórico
                </button>
                <button 
                    onClick={() => setView('weekly')}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === 'weekly' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Esta Semana
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Avance (Velocity) */}
                <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            Avance ({view === 'global' ? 'Total' : 'Semanal'})
                        </h4>
                        <p className="text-xs text-gray-400 mb-4">Basado en Story Points quemados</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <svg className="w-20 h-20 transform -rotate-90">
                                <circle className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
                                <circle 
                                    className="text-indigo-500 transition-all duration-1000 ease-out" 
                                    strokeWidth="8" 
                                    strokeDasharray={32 * 2 * Math.PI} 
                                    strokeDashoffset={32 * 2 * Math.PI - (velocity.percentage / 100) * 32 * 2 * Math.PI}
                                    strokeLinecap="round" 
                                    stroke="currentColor" 
                                    fill="transparent" 
                                    r="32" cx="40" cy="40" 
                                />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <span className="font-extrabold text-indigo-700 text-sm">{velocity.percentage}%</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-800">{velocity.completed_points} <span className="text-sm font-medium text-gray-400">/ {velocity.total_points} pts</span></div>
                            <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block mt-1">Velocidad Actual</div>
                        </div>
                    </div>
                </div>

                {/* 2. Distribución del Esfuerzo */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        Distribución de Tareas
                    </h4>
                    
                    <div className="h-32 w-full">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={50}
                                        paddingAngle={5}
                                        dataKey="value"
                                        isAnimationActive={true}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">Sin datos</div>
                        )}
                    </div>
                    <div className="flex justify-center gap-3 mt-2 text-[10px] font-bold text-gray-600">
                        {statusData.map(item => (
                            <div key={item.name} className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                {item.name} ({item.value})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Alertas de Inactividad y Tareas Atrasadas */}
            {overdue_alerts && overdue_alerts.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Rendimiento de Fechas ({overdue_alerts.length} alertas)
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {overdue_alerts.map((alert, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-red-50">
                                <span className="font-semibold text-gray-800 text-sm truncate max-w-[70%]">{alert.title}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${alert.type === 'late_delivery' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                    {alert.message}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
