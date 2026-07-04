import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';

const statusColumns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-50', headerColor: 'border-gray-200 bg-gray-100 text-gray-800' },
    { id: 'assigned', title: 'Asignado', color: 'bg-yellow-50', headerColor: 'border-yellow-200 bg-yellow-100 text-yellow-800' },
    { id: 'in_progress', title: 'En Progreso', color: 'bg-blue-50', headerColor: 'border-blue-200 bg-blue-100 text-blue-800' },
    { id: 'completed', title: 'Completado', color: 'bg-green-50', headerColor: 'border-green-200 bg-green-100 text-green-800' }
];

export default function TeacherBacklogBoard({ auth, group, items, sprints, members }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Filter state
    const [filterSprint, setFilterSprint] = useState('all');

    const { data: commentData, setData: setCommentData, post: postComment, processing: processingComment, reset: resetComment } = useForm({
        content: ''
    });

    const openDetailModal = (item) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        resetComment();
        setTimeout(() => setSelectedItem(null), 200);
    };

    const submitComment = (e) => {
        e.preventDefault();
        postComment(route('backlog.comments.store', { item: selectedItem.id }), {
            preserveScroll: true,
            onSuccess: () => {
                resetComment();
                closeDetailModal();
                router.reload({ only: ['items'] });
            }
        });
    };

    // Filter items
    const filteredItems = items.filter(item => {
        if (filterSprint !== 'all') return item.sprint_id === parseInt(filterSprint);
        return true;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href={route('groups.index')} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600 rounded-full transition-colors" title="Volver a Grupos">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </Link>
                        <div>
                            <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Backlog de <span className="text-indigo-600">{group.name}</span></h2>
                            <p className="text-sm text-gray-500 font-medium">Modo Lectura - Supervisión y Comentarios</p>
                        </div>
                    </div>
                    <div>
                        <Link 
                            href={route('agile.teacher_tracking', group.id)} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            Ver Tracking General
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Supervisión - ${group.name}`} />

            <div className="pb-12 max-w-full overflow-x-hidden">
                {/* FILTERS & INFO */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 gap-4">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            <span className="font-bold">{members.length} Alumnos</span>
                        </div>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            <span className="font-bold">{items.length} Ítems Totales</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <select 
                            value={filterSprint} 
                            onChange={(e) => setFilterSprint(e.target.value)}
                            className="bg-gray-50 border-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                        >
                            <option value="all">Todos los Sprints</option>
                            {sprints.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                            <option value="null">Sin Sprint Asignado</option>
                        </select>
                    </div>
                </div>

                {/* KANBAN BOARD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {statusColumns.map(column => {
                        const columnItems = filteredItems.filter(i => i.status === column.id);
                        return (
                            <div key={column.id} className={`flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-200 ${column.color}`}>
                                <div className={`p-4 border-b ${column.headerColor} flex justify-between items-center sticky top-0 z-10`}>
                                    <h3 className="font-bold uppercase tracking-wider text-sm">{column.title}</h3>
                                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">
                                        {columnItems.length}
                                    </span>
                                </div>
                                <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto" style={{ minHeight: '60vh' }}>
                                    {columnItems.length === 0 ? (
                                        <div className="text-center py-10 text-gray-400 font-medium text-sm">
                                            No hay ítems aquí
                                        </div>
                                    ) : (
                                        columnItems.map(item => (
                                            <div 
                                                key={item.id} 
                                                onClick={() => openDetailModal(item)}
                                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                        item.type === 'user_story' ? 'bg-indigo-100 text-indigo-700' :
                                                        item.type === 'task' ? 'bg-cyan-100 text-cyan-700' :
                                                        item.type === 'bug' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {item.type.replace('_', ' ')}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-400 text-xs font-bold bg-gray-50 px-1.5 py-0.5 rounded">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {item.story_points || 1} pts
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                                                
                                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                                    {item.assignee ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" title={item.assignee.name}>
                                                                {item.assignee.name.charAt(0)}
                                                            </div>
                                                            <span className="text-xs text-gray-500 truncate max-w-[100px]">{item.assignee.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Sin asignar</span>
                                                    )}

                                                    {/* Indicador de Comentarios/Historial */}
                                                    <div className="flex gap-2">
                                                        {item.comments && item.comments.length > 0 && (
                                                            <span className="text-orange-500 flex items-center gap-1 text-xs font-bold" title="Comentarios">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                                                {item.comments.length}
                                                            </span>
                                                        )}
                                                        {item.histories && item.histories.length > 0 && (
                                                            <span className="text-blue-500 flex items-center gap-1 text-xs font-bold" title="Historial (Tracking)">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                {item.histories.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* DETAIL & COMMENT MODAL */}
            {selectedItem && (
                <Modal show={isDetailModalOpen} onClose={closeDetailModal} maxWidth="4xl">
                    <div className="flex flex-col md:flex-row h-[85vh]">
                        
                        {/* ITEM DETAILS & HISTORIAL (LEFT COLUMN) */}
                        <div className="w-full md:w-3/5 p-6 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto bg-gray-50/50">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                                            {selectedItem.type.replace('_', ' ')}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-gray-200 text-gray-800">
                                            {selectedItem.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                                </div>
                                <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors md:hidden">✕</button>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Descripción</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedItem.description || 'Sin descripción'}</p>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Criterios de Aceptación</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedItem.acceptance_criteria || 'Sin criterios'}</p>
                            </div>
                            
                            {/* TRACKING HISTORY SECTION */}
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Historial de Cambios (Tracking)
                                </h3>
                                
                                {selectedItem.histories && selectedItem.histories.length > 0 ? (
                                    <div className="relative pl-4 border-l-2 border-indigo-100 space-y-6">
                                        {selectedItem.histories.map(history => (
                                            <div key={history.id} className="relative">
                                                <div className="absolute -left-[21px] bg-indigo-500 w-3 h-3 rounded-full mt-1.5 border-2 border-white"></div>
                                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-gray-800 text-sm flex items-center gap-1">
                                                            {history.user?.name || 'Sistema'}
                                                            <span className="text-xs text-gray-500 font-normal ml-1">realizó un cambio</span>
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            {new Date(history.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="mt-2 text-sm">
                                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold mb-2">
                                                            Acción: {history.action.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                        
                                                        {history.action === 'status_change' && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="line-through text-gray-400">{history.old_value}</span>
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                                                <span className="font-bold text-indigo-600">{history.new_value}</span>
                                                            </div>
                                                        )}
                                                        {history.action !== 'status_change' && (
                                                            <p className="text-gray-700 italic">"{history.new_value}"</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic bg-gray-100 p-4 rounded-xl text-center">No hay historial registrado aún.</p>
                                )}
                            </div>
                        </div>

                        {/* COMMENTS (RIGHT COLUMN) */}
                        <div className="w-full md:w-2/5 flex flex-col h-full bg-white relative">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                    Comentarios
                                </h3>
                                <button onClick={closeDetailModal} className="hidden md:block text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">✕</button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                                {selectedItem.comments && selectedItem.comments.length > 0 ? (
                                    selectedItem.comments.map(comment => (
                                        <div key={comment.id} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 shadow-sm relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-orange-800 text-sm">{comment.user?.name}</span>
                                                <span className="text-[10px] text-orange-400 font-bold uppercase">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400 text-sm font-medium">
                                        No hay comentarios en este ítem.
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white">
                                <form onSubmit={submitComment}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Añadir Corrección / Comentario</label>
                                    <textarea 
                                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none" 
                                        rows="3"
                                        placeholder="Escribe aquí las observaciones para el alumno..."
                                        value={commentData.content} 
                                        onChange={e => setCommentData('content', e.target.value)}
                                        required 
                                    />
                                    <div className="mt-3 flex justify-end">
                                        <button 
                                            type="submit" 
                                            disabled={processingComment} 
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 w-full justify-center"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                            {processingComment ? 'Enviando...' : 'Enviar y Notificar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
