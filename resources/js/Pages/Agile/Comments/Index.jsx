import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { MessageSquare, Inbox, Edit, X, PenTool, AlertCircle } from 'lucide-react';

export default function StudentCommentsIndex({ auth, group, itemsWithComments, members, sprints }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data: editData, setData: setEditData, put: putEdit, processing: processingEdit, reset: resetEdit } = useForm({
        title: '',
        description: '',
        acceptance_criteria: '',
        type: 'user_story',
        sprint_id: '',
        assigned_to: '',
        story_points: 1,
        due_date: ''
    });

    const openEditModal = (item) => {
        setSelectedItem(item);
        setEditData({
            title: item.title,
            description: item.description || '',
            acceptance_criteria: item.acceptance_criteria || '',
            type: item.type,
            sprint_id: item.sprint_id || '',
            assigned_to: item.assigned_to || '',
            story_points: item.story_points || 1,
            due_date: item.due_date ? item.due_date.split('T')[0] : ''
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setTimeout(() => {
            setSelectedItem(null);
            resetEdit();
        }, 200);
    };

    const submitEditItem = (e) => {
        e.preventDefault();
        putEdit(route('agile.backlog.update', { group: group.id, item: selectedItem.id }), {
            onSuccess: () => {
                closeEditModal();
                router.reload({ only: ['itemsWithComments'] });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-600" /> Comentarios y Correcciones</h2>}
        >
            <Head title={`Comentarios - ${group.name}`} />

            <div className="py-8 font-sans">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {itemsWithComments.length === 0 ? (
                        <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-slate-300 shadow-sm mt-4">
                            <div className="flex justify-center mb-4">
                                <Inbox className="w-16 h-16 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">¡Todo al día!</h3>
                            <p className="text-slate-500 mt-2 font-medium text-sm">No tienes comentarios pendientes del docente en el Backlog.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {itemsWithComments.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                                    {/* Item Details */}
                                    <div className="p-6 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-200 text-slate-700 tracking-wider">
                                                {item.type.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md tracking-wider border ${
                                                item.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                item.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                item.status === 'assigned' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                                {item.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-600 mb-6 line-clamp-3 font-medium leading-relaxed">{item.description || 'Sin descripción'}</p>
                                        
                                        <div className="mt-auto">
                                            <button 
                                                onClick={() => openEditModal(item)}
                                                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-slate-200 text-sm font-semibold rounded-xl shadow-sm text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 focus:outline-none transition-all"
                                            >
                                                <PenTool className="w-4 h-4 mr-2" />
                                                Corregir / Editar Ítem
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Comments List */}
                                    <div className="p-6 md:w-1/2 flex flex-col h-full bg-white max-h-[22rem] overflow-y-auto">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-orange-400" />
                                            Comentarios del Docente
                                        </h4>
                                        <div className="space-y-4">
                                            {item.comments.map(comment => (
                                                <div key={comment.id} className="bg-orange-50/50 border border-orange-100/50 p-4 rounded-xl relative">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                                                                {comment.user?.name?.charAt(0)}
                                                            </div>
                                                            {comment.user?.name}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                                                            {new Date(comment.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed pl-7">{comment.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={closeEditModal} maxWidth="5xl">
                <div className="flex flex-col md:flex-row h-auto max-h-[85vh] overflow-hidden font-sans">
                    {/* LEFT COLUMN: EDIT FORM */}
                    <div className="w-full md:w-3/5 p-6 border-b md:border-b-0 md:border-r border-slate-100 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <PenTool className="w-5 h-5 text-indigo-600" />
                                Corregir Ítem
                            </h2>
                            <button onClick={closeEditModal} className="md:hidden text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submitEditItem} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Título</label>
                                <input type="text" className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 text-sm font-medium"
                                    value={editData.title} onChange={e => setEditData('title', e.target.value)} required />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
                                <textarea className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 text-sm" rows="4"
                                    value={editData.description} onChange={e => setEditData('description', e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Criterios de Aceptación</label>
                                <textarea className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 text-sm" rows="3"
                                    value={editData.acceptance_criteria} onChange={e => setEditData('acceptance_criteria', e.target.value)} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Peso (Story Points)</label>
                                    <select className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 text-sm"
                                        value={editData.story_points} onChange={e => setEditData('story_points', e.target.value)}>
                                        <option value="1">1 pt</option>
                                        <option value="2">2 pts</option>
                                        <option value="3">3 pts</option>
                                        <option value="4">4 pts</option>
                                        <option value="5">5 pts (Máx)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Asignar a</label>
                                    <select className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 text-sm"
                                        value={editData.assigned_to} onChange={e => setEditData('assigned_to', e.target.value)}>
                                        <option value="">Sin Asignar</option>
                                        {members.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={closeEditModal} className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-5 rounded-xl border border-slate-300 transition-colors text-sm">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processingEdit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors text-sm">
                                    Aplicar Corrección
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: COMMENTS VIEW */}
                    <div className="w-full md:w-2/5 flex flex-col bg-slate-50/50">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-400" />
                                Feedback del Docente
                            </h3>
                            <button onClick={closeEditModal} className="hidden md:block text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-200 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {selectedItem?.comments && selectedItem.comments.length > 0 ? (
                                selectedItem.comments.map(comment => (
                                    <div key={comment.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                                                    {comment.user?.name?.charAt(0)}
                                                </div>
                                                {comment.user?.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-semibold uppercase">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed pl-7">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-sm font-medium">
                                    No hay comentarios disponibles.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
