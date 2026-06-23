import { useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import EvaluationModal from './Partials/EvaluationModal';
import GroupProgressCard from '@/Components/Dashboard/GroupProgressCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherView({ groups, categories }) {
    const [activeGroup, setActiveGroup] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { data: evalData, setData: setEvalData, post: postEval, processing: processingEval, errors: evalErrors, reset: resetEval } = useForm({
        group_id: '',
        color_status: '',
        feedback: ''
    });

    // --- GROUPING LOGIC ---
    // Group by Year -> Period
    const groupedGroups = useMemo(() => {
        const grouped = {};
        
        groups.forEach(group => {
            const year = group.academic_cycle?.year || 'Sin Asignar';
            const period = group.academic_cycle?.period || 'Sin Asignar';

            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][period]) grouped[year][period] = [];

            grouped[year][period].push(group);
        });

        return grouped;
    }, [groups]);

    const [collapsedGroups, setCollapsedGroups] = useState(new Set());
    const toggleGroup = (groupKey) => {
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupKey)) next.delete(groupKey);
            else next.add(groupKey);
            return next;
        });
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-12">
            
            {/* KPI Summary / Header */}
            <div className="flex flex-col justify-between items-start gap-2">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Métricas y Avances</h2>
                <p className="text-gray-500">Supervisa el avance y esfuerzo de todos tus grupos en tiempo real agrupados por ciclo.</p>
            </div>

            {/* Dashboard Vertical Stack */}
            {groups.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 shadow-sm mt-4">
                    <div className="flex justify-center mb-4">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700">No tienes grupos asignados</h3>
                    <p className="text-gray-500 mt-2 mb-6">Crea un grupo para comenzar a ver sus métricas de avance.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    {Object.keys(groupedGroups).sort((a,b) => b.localeCompare(a)).map(year => (
                        Object.keys(groupedGroups[year]).sort((a,b) => b.localeCompare(a)).map(period => {
                            const groupKey = `${year}-${period}`;
                            const isCollapsed = collapsedGroups.has(groupKey);
                            
                            return (
                                <div key={groupKey} className="flex flex-col gap-4">
                                    
                                    {/* Section Header */}
                                    <div 
                                        className="flex items-center gap-3 pb-2 border-b-2 border-indigo-50 cursor-pointer hover:bg-indigo-50/50 transition-colors rounded-lg px-2"
                                        onClick={() => toggleGroup(groupKey)}
                                    >
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">
                                            {year === 'Sin Asignar' ? 'Grupos Sin Ciclo' : `Año ${year} • Ciclo ${period}`}
                                        </h3>
                                        <span className="ml-auto bg-white border border-gray-200 text-gray-500 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            {groupedGroups[year][period].length} Equipos
                                        </span>
                                        <svg className={`w-5 h-5 text-indigo-500 transform transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>

                                    {/* Vertical Card List */}
                                    <AnimatePresence initial={false}>
                                        {!isCollapsed && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="flex flex-col gap-4 overflow-hidden"
                                            >
                                                {groupedGroups[year][period].map(g => (
                                                    <GroupProgressCard 
                                                        key={g.id} 
                                                        group={g} 
                                                    />
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })
                    ))}
                </div>
            )}

            <EvaluationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                groups={groups}
                categories={categories}
                activeGroup={activeGroup}
                onGroupSelected={setActiveGroup}
                evalData={evalData}
                setEvalData={setEvalData}
                submitEvaluation={(e) => {
                    e.preventDefault();
                    postEval(route('groups.evaluate'), {
                        onSuccess: () => {
                            alert("¡Calificación guardada exitosamente!");
                            setIsModalOpen(false);
                            resetEval();
                        }
                    });
                }}
                processingEval={processingEval}
                evalErrors={evalErrors}
            />
        </div>
    );
}