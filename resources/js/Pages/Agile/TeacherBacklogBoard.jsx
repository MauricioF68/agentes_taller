import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Activity, Users, Layers, MessageSquare, 
    History, Send, X, Clock, AlertCircle, CheckCircle2 
} from 'lucide-react';
import VoiceToTextButton from '@/Components/VoiceToTextButton';

const statusColumns = [
    { id: 'backlog', title: 'Backlog', icon: <Layers className="w-4 h-4 text-slate-500" /> },
    { id: 'assigned', title: 'Asignado', icon: <Users className="w-4 h-4 text-amber-500" /> },
    { id: 'in_progress', title: 'En Progreso', icon: <Activity className="w-4 h-4 text-blue-500" /> },
    { id: 'completed', title: 'Completado', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> }
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
                    <div className="flex items-center gap-4">
                        <Link href={route('groups.index')} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors" title="Volver a Grupos">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="font-semibold text-2xl text-slate-900 leading-tight tracking-tight">
                                Backlog de <span className="text-slate-500">{group.name}</span>
                            </h2>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">Modo Lectura - Supervisión y Comentarios</p>
                        </div>
                    </div>
                    <div>
                        <Link 
                            href={route('agile.teacher_tracking', group.id)} 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                        >
                            <Activity className="w-4 h-4" />
                            Ver Tracking General
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Supervisión - ${group.name}`} />

            <div className="pb-12 max-w-full overflow-x-hidden font-sans">
                {/* FILTERS & INFO */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 gap-4"
                >
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Users className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">{members.length} Alumnos</span>
                        </div>
                        <div className="h-5 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Layers className="w-5 h-5 text-slate-400" />
                            <span className="font-medium">{items.length} Ítems Totales</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select 
                            value={filterSprint} 
                            onChange={(e) => setFilterSprint(e.target.value)}
                            className="w-full sm:w-auto bg-slate-50 border-slate-200 text-sm rounded-lg focus:ring-slate-900 focus:border-slate-900 font-medium text-slate-700"
                        >
                            <option value="all">Todos los Sprints</option>
                            {sprints.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                            <option value="null">Sin Sprint Asignado</option>
                        </select>
                    </div>
                </motion.div>

                {/* KANBAN BOARD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {statusColumns.map((column, colIdx) => {
                        const columnItems = filteredItems.filter(i => i.status === column.id);
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: colIdx * 0.1 }}
                                key={column.id} 
                                className="flex flex-col rounded-xl overflow-hidden bg-slate-50 border border-slate-200"
                            >
                                <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        {column.icon}
                                        <h3 className="font-medium text-slate-800 text-sm">{column.title}</h3>
                                    </div>
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600">
                                        {columnItems.length}
                                    </span>
                                </div>
                                <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto" style={{ minHeight: '60vh' }}>
                                    {columnItems.length === 0 ? (
                                        <div className="text-center py-10 text-slate-400 text-sm">
                                            Vacio
                                        </div>
                                    ) : (
                                        columnItems.map((item, idx) => (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: (colIdx * 0.1) + (idx * 0.05) }}
                                                whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                key={item.id} 
                                                onClick={() => openDetailModal(item)}
                                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer transition-all group relative"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wide ${
                                                        item.type === 'user_story' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                                        item.type === 'task' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                                                        item.type === 'bug' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-50 text-slate-700 border border-slate-200'
                                                    }`}>
                                                        {item.type.replace('_', ' ')}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-slate-500 text-xs font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                        <Activity className="w-3 h-3" />
                                                        {item.story_points || 1}
                                                    </span>
                                                </div>
                                                <h4 className="font-medium text-slate-900 text-sm mb-2 group-hover:text-slate-600 transition-colors leading-snug">{item.title}</h4>
                                                
                                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                                                    {item.assignee ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-[10px] font-medium" title={item.assignee.name}>
                                                                {item.assignee.name.charAt(0)}
                                                            </div>
                                                            <span className="text-xs text-slate-500 truncate max-w-[100px]">{item.assignee.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Sin asignar</span>
                                                    )}

                                                    {/* Indicador de Comentarios/Historial */}
                                                    <div className="flex gap-3">
                                                        {item.comments && item.comments.length > 0 && (
                                                            <span className="text-slate-500 flex items-center gap-1 text-xs font-medium" title="Comentarios">
                                                                <MessageSquare className="w-3.5 h-3.5" />
                                                                {item.comments.length}
                                                            </span>
                                                        )}
                                                        {item.histories && item.histories.length > 0 && (
                                                            <span className="text-slate-500 flex items-center gap-1 text-xs font-medium" title="Historial (Tracking)">
                                                                <History className="w-3.5 h-3.5" />
                                                                {item.histories.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* DETAIL & COMMENT MODAL */}
            <AnimatePresence>
                {selectedItem && isDetailModalOpen && (
                    <Modal show={isDetailModalOpen} onClose={closeDetailModal} maxWidth="4xl">
                        <div className="flex flex-col md:flex-row h-[85vh] font-sans">
                            
                            {/* ITEM DETAILS & HISTORIAL (LEFT COLUMN) */}
                            <div className="w-full md:w-3/5 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto bg-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-2 py-1 rounded text-[10px] font-medium tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
                                                {selectedItem.type.replace('_', ' ')}
                                            </span>
                                            <span className="px-2 py-1 rounded text-[10px] font-medium tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
                                                {selectedItem.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{selectedItem.title}</h2>
                                    </div>
                                    <button onClick={closeDetailModal} className="text-slate-400 hover:text-slate-900 p-2 rounded-md hover:bg-slate-100 transition-colors md:hidden">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Descripción</h3>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedItem.description || <span className="text-slate-400 italic">Sin descripción</span>}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Criterios de Aceptación</h3>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedItem.acceptance_criteria || <span className="text-slate-400 italic">Sin criterios asignados</span>}
                                    </div>
                                </div>
                                
                                {/* TRACKING HISTORY SECTION */}
                                <div className="mt-12">
                                    <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
                                        <History className="w-4 h-4 text-slate-500" />
                                        Historial de Cambios
                                    </h3>
                                    
                                    {selectedItem.histories && selectedItem.histories.length > 0 ? (
                                        <div className="relative pl-4 border-l border-slate-200 space-y-6">
                                            {selectedItem.histories.map(history => (
                                                <div key={history.id} className="relative">
                                                    <div className="absolute -left-[21px] bg-white w-3 h-3 rounded-full mt-1.5 border-2 border-slate-300"></div>
                                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-medium text-slate-900 text-sm flex items-center gap-1.5">
                                                                {history.user?.name || 'Sistema'}
                                                                <span className="text-xs text-slate-500 font-normal">realizó un cambio</span>
                                                            </span>
                                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(history.created_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="mt-3 text-sm">
                                                            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium tracking-wide mb-2 uppercase">
                                                                Acción: {history.action.replace('_', ' ')}
                                                            </span>
                                                            
                                                            {history.action === 'status_change' && (
                                                                <div className="flex items-center gap-2 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 w-fit">
                                                                    <span className="line-through text-slate-400">{history.old_value}</span>
                                                                    <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                                                                    <span className="font-medium text-slate-900">{history.new_value}</span>
                                                                </div>
                                                            )}
                                                            {history.action !== 'status_change' && (
                                                                <p className="text-slate-600 italic border-l-2 border-slate-200 pl-3 py-1">"{history.new_value}"</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm bg-slate-50 p-6 rounded-xl border border-slate-100">
                                            <AlertCircle className="w-4 h-4" />
                                            No hay historial registrado aún.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COMMENTS (RIGHT COLUMN) */}
                            <div className="w-full md:w-2/5 flex flex-col h-full bg-[#f8fafc] relative">
                                <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-[#f8fafc]/90 backdrop-blur-sm z-10">
                                    <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-slate-500" />
                                        Comentarios y Revisiones
                                    </h3>
                                    <button onClick={closeDetailModal} className="hidden md:block text-slate-400 hover:text-slate-900 p-2 rounded-md hover:bg-slate-200 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {selectedItem.comments && selectedItem.comments.length > 0 ? (
                                        selectedItem.comments.map(comment => (
                                            <div key={comment.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-medium text-slate-900 text-sm">{comment.user?.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium tracking-wider">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 space-y-2">
                                            <MessageSquare className="w-8 h-8 opacity-20" />
                                            <span className="text-sm">No hay comentarios en este ítem.</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t border-slate-200 bg-white">
                                    <form onSubmit={submitComment}>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Añadir Revisión
                                            </label>
                                            <VoiceToTextButton onTranscription={(text) => setCommentData('content', (commentData.content ? commentData.content + ' ' : '') + text)} />
                                        </div>
                                        <textarea 
                                            id="comentario-textarea"
                                            className="w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-900 focus:ring-slate-900/10 resize-none text-sm p-3 transition-colors" 
                                            rows="3"
                                            placeholder="Escribe aquí las observaciones para el alumno..."
                                            value={commentData.content} 
                                            onChange={e => setCommentData('content', e.target.value)}
                                            required 
                                        />
                                        <div className="mt-4 flex justify-end">
                                            <button 
                                                type="submit" 
                                                disabled={processingComment} 
                                                className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 w-full justify-center text-sm"
                                            >
                                                <Send className="w-4 h-4" />
                                                {processingComment ? 'Enviando...' : 'Enviar y Notificar'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
