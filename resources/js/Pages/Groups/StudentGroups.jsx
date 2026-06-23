import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import JoinGroupForm from '../Dashboard/Partials/JoinGroupForm';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentGroups({ auth, myGroup, availableGroups }) {
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [editProjectName, setEditProjectName] = useState(myGroup?.project_name || '');
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const saveProjectName = () => {
        if (!myGroup) return;
        router.patch(route('groups.project.update', myGroup.id), { project_name: editProjectName }, {
            preserveScroll: true,
            onSuccess: () => setIsEditingProject(false)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight flex items-center gap-2">👥 Mi Grupo de Trabajo</h2>}
        >
            <Head title="Mi Grupo" />

            <div className="max-w-7xl mx-auto space-y-6 pb-12">
                {!myGroup ? (
                    <JoinGroupForm availableGroups={availableGroups} />
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Header Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Detalle de tu Equipo</h2>
                                <p className="text-gray-500 mt-1">Aquí puedes ver la información de tu proyecto, integrantes y evaluación.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsJoinModalOpen(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all shadow-sm active:scale-95"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg> 
                                    Unirse a otro grupo
                                </button>
                            </div>
                        </div>

                        {/* Tabla Central con estilo de Docentes */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                            <th className="p-4 pl-6 w-1/6">Grupo</th>
                                            <th className="p-4 w-1/6">Aula</th>
                                            <th className="p-4 w-1/3">Nombre del Proyecto</th>
                                            <th className="p-4 w-1/6">Integrantes</th>
                                            <th className="p-4 w-1/6">Evaluación</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="bg-indigo-50/50 border-y border-indigo-100">
                                            <td colSpan="5" className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                                    <span className="text-xs font-extrabold text-indigo-800 uppercase tracking-widest">
                                                        {myGroup.academic_cycle ? `Año ${myGroup.academic_cycle.year} • Ciclo ${myGroup.academic_cycle.period} • Turno: ${myGroup.shift}` : 'Sin Ciclo Asignado'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr className="hover:bg-gray-50/50 group/row bg-white transition-colors">
                                            <td className="p-4 whitespace-nowrap pl-6">
                                                <div className="font-bold text-gray-800">{myGroup.name || '-'}</div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-600 bg-gray-100 inline-flex px-2 py-1 rounded-md text-xs">{myGroup.classroom || '-'}</div>
                                            </td>
                                            <td className="p-4">
                                                {isEditingProject ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            type="text" autoFocus
                                                            value={editProjectName} onChange={e => setEditProjectName(e.target.value)}
                                                            className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 py-1 px-2 shadow-sm"
                                                            onKeyDown={(e) => e.key === 'Enter' && saveProjectName()}
                                                        />
                                                        <button onClick={saveProjectName} className="text-green-600 hover:bg-green-100 p-1.5 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></button>
                                                        <button onClick={() => setIsEditingProject(false)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 group/edit cursor-pointer" onClick={() => setIsEditingProject(true)}>
                                                        <span className={`text-sm font-medium ${myGroup.project_name ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                                            {myGroup.project_name || 'Sin nombre (click para editar)'}
                                                        </span>
                                                        <svg className="w-4 h-4 text-gray-300 group-hover/edit:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        {myGroup.students?.slice(0, 3).map((student) => (
                                                            <div key={student.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold z-10" title={student.name}>
                                                                {student.name.charAt(0)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-500">({myGroup.students?.length || 0})</span>
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                {myGroup.evaluation?.color_status ? (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                                        ${myGroup.evaluation.color_status === 'verde' ? 'bg-green-100 text-green-800' : 
                                                        myGroup.evaluation.color_status === 'rojo' ? 'bg-red-100 text-red-800' : 
                                                        myGroup.evaluation.color_status === 'amarillo' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                                                    >
                                                        <span className={`w-2 h-2 rounded-full bg-${myGroup.evaluation.color_status === 'verde' ? 'green-500' : myGroup.evaluation.color_status === 'rojo' ? 'red-500' : myGroup.evaluation.color_status === 'amarillo' ? 'yellow-500' : 'gray-500'}`}></span>
                                                        Evaluado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                                                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                                        Pendiente
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: Unirse a Grupo */}
                {isJoinModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                    Unirse a otro grupo
                                </h3>
                                <button onClick={() => setIsJoinModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <JoinGroupForm availableGroups={availableGroups} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}