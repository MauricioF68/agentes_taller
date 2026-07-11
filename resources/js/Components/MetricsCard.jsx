import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart as PieChartIcon, AlertCircle, Activity, ChevronRight } from 'lucide-react';

export default function MetricsCard({ data }) {
    if (!data || !data.global || !data.weekly) return null;

    const [view, setView] = useState(data.default_view || 'global');
    const currentMetrics = data[view];
    const { velocity, status_distribution, overdue_alerts } = currentMetrics;

    // Datos para la distribución
    const statusData = [
        { name: 'Por Hacer', value: status_distribution.todo, color: '#94a3b8' }, // slate-400
        { name: 'En Proceso', value: status_distribution.in_progress, color: '#3b82f6' }, // blue-500
        { name: 'Completado', value: status_distribution.completed, color: '#10b981' } // emerald-500
    ].filter(item => item.value > 0);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-4 space-y-4 relative font-sans"
        >
            
            {/* Selector de Rango de Tiempo */}
            <div className="absolute -top-12 right-0 bg-white shadow-sm border border-slate-200 rounded-lg flex overflow-hidden">
                <button 
                    onClick={() => setView('global')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'global' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    Histórico
                </button>
                <button 
                    onClick={() => setView('weekly')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'weekly' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    Esta Semana
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Avance (Velocity) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-slate-500" />
                            Avance ({view === 'global' ? 'Total' : 'Semanal'})
                        </h4>
                        <p className="text-xs text-slate-500 mb-6 font-medium">Basado en Story Points quemados</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <svg className="w-24 h-24 transform -rotate-90">
                                <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                                <circle 
                                    className="text-slate-900 transition-all duration-1000 ease-out" 
                                    strokeWidth="8" 
                                    strokeDasharray={40 * 2 * Math.PI} 
                                    strokeDashoffset={40 * 2 * Math.PI - (velocity.percentage / 100) * 40 * 2 * Math.PI}
                                    strokeLinecap="round" 
                                    stroke="currentColor" 
                                    fill="transparent" 
                                    r="40" cx="48" cy="48" 
                                />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <span className="font-bold text-slate-900 text-lg">{velocity.percentage}%</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-slate-900 tracking-tight">
                                {velocity.completed_points} <span className="text-sm font-medium text-slate-400">/ {velocity.total_points} pts</span>
                            </div>
                            <div className="text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md inline-block mt-2">
                                Velocidad Actual
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Distribución del Esfuerzo */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <PieChartIcon className="w-4 h-4 text-slate-500" />
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
                                        innerRadius={35}
                                        outerRadius={55}
                                        paddingAngle={5}
                                        dataKey="value"
                                        isAnimationActive={true}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '500' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs text-slate-400 font-medium">Sin datos</div>
                        )}
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-[11px] font-medium text-slate-600">
                        {statusData.map(item => (
                            <div key={item.name} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                {item.name} <span className="text-slate-400">({item.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Alertas de Inactividad y Tareas Atrasadas */}
            {overdue_alerts && overdue_alerts.length > 0 && (
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 shadow-sm">
                    <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-4">
                        <AlertCircle className="w-4 h-4" />
                        Rendimiento de Fechas ({overdue_alerts.length} alertas)
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                        {overdue_alerts.map((alert, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-3.5 rounded-xl shadow-sm border border-red-50 hover:border-red-100 transition-colors">
                                <span className="font-medium text-slate-800 text-sm truncate max-w-[70%]">{alert.title}</span>
                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide ${alert.type === 'late_delivery' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {alert.message}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Métricas de Tracking Avanzadas (Si están disponibles) */}
            {currentMetrics.tracking && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-500" />
                            Métricas de Comportamiento (Tracking)
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        {/* Tendencia / Línea de tiempo */}
                        <div className="p-6 md:col-span-2">
                            <h5 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-6">Tendencia de Actividad (Movimientos)</h5>
                            <div className="h-40 w-full">
                                {currentMetrics.tracking.timeline.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={currentMetrics.tracking.timeline} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                            <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '500' }} />
                                            <Area type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-slate-400 font-medium">Sin movimientos registrados</div>
                                )}
                            </div>
                        </div>

                        {/* Indicadores Clave */}
                        <div className="p-6 flex flex-col justify-center space-y-8 bg-slate-50/30">
                            <div>
                                <div className="text-3xl font-bold text-slate-900 flex items-baseline gap-2 tracking-tight">
                                    {currentMetrics.tracking.volatility_count}
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cambios</span>
                                </div>
                                <div className="text-xs font-medium text-slate-600 mt-1">Volatilidad (Alcance modificado)</div>
                                {currentMetrics.tracking.volatility_count > 5 && (
                                    <div className="mt-2 text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-1 rounded-md inline-flex items-center gap-1">
                                        <ChevronRight className="w-3 h-3" /> Mucha volatilidad detectada
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <div className="text-3xl font-bold text-slate-900 flex items-baseline gap-2 tracking-tight">
                                    {currentMetrics.tracking.backwards_count}
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Retrocesos</span>
                                </div>
                                <div className="text-xs font-medium text-slate-600 mt-1">Cuellos de botella (Pasos atrás)</div>
                                {currentMetrics.tracking.backwards_count > 3 && (
                                    <div className="mt-2 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-100 px-2 py-1 rounded-md inline-flex items-center gap-1">
                                        <ChevronRight className="w-3 h-3" /> Posible bloqueo en el flujo
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
