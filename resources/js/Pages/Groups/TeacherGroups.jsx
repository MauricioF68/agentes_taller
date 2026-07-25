import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import EvaluationModal from '../Dashboard/Partials/EvaluationModal';

export default function TeacherGroups({ auth, groups, cycles, categories }) {
    // --- FILTERS STATE ---
    const [yearFilter, setYearFilter] = useState('');
    const [periodFilter, setPeriodFilter] = useState('');
    const [searchFilter, setSearchFilter] = useState('');

    // --- MODAL STATES ---
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);

    // --- NEW GROUP FORM ---
    const { data: groupData, setData: setGroupData, post: postGroup, processing: procGroup, errors: errGroup, reset: resetGroup } = useForm({
        name: '',
        project_name: '',
        academic_cycle_id: cycles.length > 0 ? cycles[0].id : '',
        classroom: '',
        shift: 'Día'
    });

    const submitGroup = (e) => {
        e.preventDefault();
        postGroup(route('groups.store'), { 
            onSuccess: () => {
                resetGroup();
                setIsGroupModalOpen(false);
            } 
        });
    };

    // --- NEW CYCLE FORM ---
    const { data: cycleData, setData: setCycleData, post: postCycle, processing: procCycle, errors: errCycle, reset: resetCycle } = useForm({
        year: new Date().getFullYear(),
        period: 1
    });
    
    const submitCycle = (e) => {
        e.preventDefault();
        postCycle(route('cycles.store'), { 
            onSuccess: () => {
                resetCycle();
                setIsCycleModalOpen(false);
            } 
        });
    };

    // --- EDIT PROJECT NAME STATE ---
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [editProjectName, setEditProjectName] = useState('');

    const startEditingProject = (group) => {
        setEditingGroupId(group.id);
        setEditProjectName(group.project_name || '');
    };

    const saveProjectName = (group) => {
        router.patch(route('groups.project.update', group.id), { project_name: editProjectName }, {
            preserveScroll: true,
            onSuccess: () => setEditingGroupId(null)
        });
    };

    // --- EVALUATION MODAL ---
    const [activeGroup, setActiveGroup] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: evalData, setData: setEvalData, post: postEval, processing: processingEval, errors: evalErrors, reset: resetEval } = useForm({
        group_id: '',
        color_status: '',
        feedback: ''
    });

    const openEvaluationModal = (group = null) => {
        if (group) {
            setActiveGroup(group);
            setEvalData('group_id', group.id);
        }
        setIsModalOpen(true);
    };

    // --- FILTERING LOGIC ---
    const filteredGroups = useMemo(() => {
        return groups.filter(g => {
            const matchYear = yearFilter ? g.academic_cycle?.year?.toString() === yearFilter : true;
            const matchPeriod = periodFilter ? g.academic_cycle?.period?.toString() === periodFilter : true;
            const searchLower = searchFilter.toLowerCase();
            const matchSearch = searchFilter ? 
                (g.name?.toLowerCase().includes(searchLower) || g.project_name?.toLowerCase().includes(searchLower) || g.classroom?.toLowerCase().includes(searchLower)) 
                : true;
            return matchYear && matchPeriod && matchSearch;
        });
    }, [groups, yearFilter, periodFilter, searchFilter]);

    // Unique years for the filter
    const uniqueYears = useMemo(() => {
        const years = cycles.map(c => c.year);
        return [...new Set(years)].sort((a, b) => b - a);
    }, [cycles]);

    // --- GROUPING LOGIC ---
    // Group by Year -> Period -> Shift
    const groupedGroups = useMemo(() => {
        const grouped = {};
        
        filteredGroups.forEach(group => {
            const year = group.academic_cycle?.year || 'Sin Asignar';
            const period = group.academic_cycle?.period || 'Sin Asignar';
            const shift = group.shift || 'Sin Turno';

            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][period]) grouped[year][period] = {};
            if (!grouped[year][period][shift]) grouped[year][period][shift] = [];

            grouped[year][period][shift].push(group);
        });

        return grouped;
    }, [filteredGroups]);

    // --- ACCORDION STATE ---
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
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight flex items-center gap-2">👥 Gestión de Grupos</h2>}
        >
            <Head title="Mis Grupos" />

            <div className="flex flex-col gap-6 pb-12 max-w-7xl mx-auto">
                
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mis Grupos</h2>
                        <p className="text-gray-500 mt-1">Administra tus aulas por ciclo académico y evalúa a tus equipos.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsCycleModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all shadow-sm active:scale-95"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 
                            Nuevo Ciclo
                        </button>
                        <button 
                            onClick={() => setIsGroupModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
                        >
                            <svg className="w-5 h-5 text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Nuevo Grupo
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="text" placeholder="Buscar por proyecto o aula..."
                            value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
                            className="pl-10 w-full bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2 text-sm transition-all"
                        />
                    </div>
                    <select 
                        value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}
                        className="w-full sm:w-32 bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-3 py-2 text-sm text-gray-600 font-medium"
                    >
                        <option value="">Todos (Año)</option>
                        {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select 
                        value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}
                        className="w-full sm:w-32 bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-3 py-2 text-sm text-gray-600 font-medium"
                    >
                        <option value="">Todos (Ciclo)</option>
                        <option value="1">Ciclo 1</option>
                        <option value="2">Ciclo 2</option>
                        <option value="0">Verano</option>
                    </select>
                </div>

                {/* Tabla Central */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                    <th className="p-4 w-1/6">Grupo</th>
                                    <th className="p-4 w-1/6">Aula</th>
                                    <th className="p-4 w-1/3">Nombre del Proyecto</th>
                                    <th className="p-4 w-1/6">Integrantes</th>
                                    <th className="p-4 w-1/6">Evaluación</th>
                                    <th className="p-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredGroups.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center">
                                            <div className="flex justify-center mb-4">
                                                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                            </div>
                                            <p className="text-gray-500 font-medium">No se encontraron grupos con estos filtros.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    Object.keys(groupedGroups).sort((a,b) => b.localeCompare(a)).map(year => (
                                        Object.keys(groupedGroups[year]).sort((a,b) => b.localeCompare(a)).map(period => (
                                            Object.keys(groupedGroups[year][period]).sort().map(shift => {
                                                const groupKey = `${year}-${period}-${shift}`;
                                                const isCollapsed = collapsedGroups.has(groupKey);
                                                
                                                return (
                                                <React.Fragment key={groupKey}>
                                                    
                                                    {/* Fila Encabezado de Agrupación (Clickable) */}
                                                    <tr 
                                                        className="bg-indigo-50/50 border-y border-indigo-100 cursor-pointer hover:bg-indigo-100/50 transition-colors"
                                                        onClick={() => toggleGroup(groupKey)}
                                                    >
                                                        <td colSpan="6" className="px-5 py-3">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                                                    <span className="text-xs font-extrabold text-indigo-800 uppercase tracking-widest">
                                                                        {year === 'Sin Asignar' ? 'Grupos Antiguos (Sin Ciclo)' : `Año ${year} • Ciclo ${period} • Turno: ${shift}`}
                                                                    </span>
                                                                    <span className="ml-2 text-xs font-bold text-indigo-400 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                                                                        {groupedGroups[year][period][shift].length}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <svg className={`w-5 h-5 text-indigo-500 transform transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Filas de Grupos */}
                                                    <AnimatePresence>
                                                        {!isCollapsed && groupedGroups[year][period][shift].map((group, idx) => (
                                                            <motion.tr 
                                                                key={group.id} 
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
                                                                transition={{ duration: 0.2, delay: idx * 0.03 }}
                                                                className="hover:bg-gray-50/50 group/row bg-white"
                                                            >
                                                                <td className="p-4 whitespace-nowrap pl-6">
                                                                    <div className="font-bold text-gray-800">{group.name || '-'}</div>
                                                                </td>
                                                                <td className="p-4 whitespace-nowrap">
                                                                    <div className="font-medium text-gray-600 bg-gray-100 inline-flex px-2 py-1 rounded-md text-xs">{group.classroom || '-'}</div>
                                                                </td>
                                                                <td className="p-4">
                                                                    {editingGroupId === group.id ? (
                                                                        <div className="flex items-center gap-2">
                                                                            <input 
                                                                                type="text" autoFocus
                                                                                value={editProjectName} onChange={e => setEditProjectName(e.target.value)}
                                                                                className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 py-1 px-2 shadow-sm"
                                                                                onKeyDown={(e) => e.key === 'Enter' && saveProjectName(group)}
                                                                            />
                                                                            <button onClick={() => saveProjectName(group)} className="text-green-600 hover:bg-green-100 p-1.5 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></button>
                                                                            <button onClick={() => setEditingGroupId(null)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2 group/edit">
                                                                            <span className={`text-sm font-medium ${group.project_name ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                                                                {group.project_name || 'Sin nombre (click para editar)'}
                                                                            </span>
                                                                            <button 
                                                                                onClick={() => startEditingProject(group)}
                                                                                className="text-gray-300 hover:text-indigo-600 opacity-0 group-hover/edit:opacity-100 transition-opacity p-1"
                                                                                title="Editar nombre del proyecto"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="p-4 whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex -space-x-2">
                                                                            {group.students?.slice(0, 3).map((student) => (
                                                                                <div key={student.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold z-10" title={student.name}>
                                                                                    {student.name.charAt(0)}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-xs font-bold text-gray-500">({group.students?.length || 0})</span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 whitespace-nowrap">
                                                                    {group.evaluation?.color_status ? (
                                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                                                            ${group.evaluation.color_status === 'verde' ? 'bg-green-100 text-green-800' : 
                                                                            group.evaluation.color_status === 'rojo' ? 'bg-red-100 text-red-800' : 
                                                                            group.evaluation.color_status === 'amarillo' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                                                                        >
                                                                            <span className={`w-2 h-2 rounded-full bg-${group.evaluation.color_status === 'verde' ? 'green-500' : group.evaluation.color_status === 'rojo' ? 'red-500' : group.evaluation.color_status === 'amarillo' ? 'yellow-500' : 'gray-500'}`}></span>
                                                                            Evaluado
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                                                                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                                                            Pendiente
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="p-4 whitespace-nowrap text-center">
                                                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover/row:opacity-100 focus-within:opacity-100 transition-opacity">
                                                                        <button 
                                                                            id="btn-evaluar"
                                                                            onClick={() => openEvaluationModal(group)}
                                                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                                                            Evaluar
                                                                        </button>
                                                                        
                                                                        <Link 
                                                                            href={route('agile.teacher_backlog', group.id)}
                                                                            className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                                                            Backlog
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </AnimatePresence>
                                                </React.Fragment>
                                                );
                                            })
                                        ))
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL: Crear Grupo */}
                {isGroupModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-xl font-extrabold text-gray-900">Crear Nuevo Grupo</h3>
                                <button onClick={() => setIsGroupModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <form onSubmit={submitGroup} className="flex flex-col gap-4">
                                    {cycles.length === 0 && (
                                        <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                                            Debes crear un Ciclo Académico primero.
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Ciclo Académico</label>
                                        <select
                                            name="academic_cycle_id"
                                            value={groupData.academic_cycle_id}
                                            onChange={(e) => setGroupData('academic_cycle_id', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2.5 transition-all"
                                            required
                                        >
                                            <option value="">Selecciona un ciclo...</option>
                                            {cycles.map(c => (
                                                <option key={c.id} value={c.id}>{c.year} - {c.period}</option>
                                            ))}
                                        </select>
                                        {errGroup.academic_cycle_id && <div className="text-red-500 text-sm mt-1">{errGroup.academic_cycle_id}</div>}
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Aula</label>
                                            <input
                                                type="text" placeholder="Ej. G402" name="classroom"
                                                value={groupData.classroom} onChange={(e) => setGroupData('classroom', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2.5 transition-all" required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Turno</label>
                                            <select
                                                name="shift" value={groupData.shift} onChange={(e) => setGroupData('shift', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2.5 transition-all" required
                                            >
                                                <option value="Día">Día</option>
                                                <option value="Noche">Noche</option>
                                                <option value="Virtual">Virtual</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Grupo (Opcional)</label>
                                        <input
                                            type="text" placeholder="Si se deja vacío, se autogenera" name="name"
                                            value={groupData.name} onChange={(e) => setGroupData('name', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2.5 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Proyecto (Opcional)</label>
                                        <input
                                            type="text" placeholder="Lo pueden llenar los alumnos..." name="project_name"
                                            value={groupData.project_name} onChange={(e) => setGroupData('project_name', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2.5 transition-all"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button type="button" onClick={() => setIsGroupModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
                                        <button 
                                            type="submit" disabled={procGroup || cycles.length === 0}
                                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                                        >
                                            {procGroup ? 'Creando...' : 'Crear Grupo'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* MODAL: Crear Ciclo */}
                {isCycleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-xl font-extrabold text-gray-900">Crear Ciclo</h3>
                                <button onClick={() => setIsCycleModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <form onSubmit={submitCycle} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Año Académico</label>
                                        <input
                                            type="number" min="2020" max="2100" name="year"
                                            value={cycleData.year} onChange={(e) => setCycleData('year', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2.5 transition-all" required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Periodo</label>
                                        <select
                                            name="period" value={cycleData.period} onChange={(e) => setCycleData('period', e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-2.5 transition-all" required
                                        >
                                            <option value="1">1 (Marzo - Julio)</option>
                                            <option value="2">2 (Agosto - Diciembre)</option>
                                            <option value="0">Verano</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button type="button" onClick={() => setIsCycleModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
                                        <button 
                                            type="submit" disabled={procCycle}
                                            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                                        >
                                            {procCycle ? 'Creando...' : 'Crear Ciclo'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}

                <EvaluationModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    groups={groups}
                    categories={categories || []}
                    activeGroup={activeGroup}
                    onGroupSelected={(group) => {
                        setActiveGroup(group);
                        setEvalData('group_id', group.id);
                    }}
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
        </AuthenticatedLayout>
    );
}