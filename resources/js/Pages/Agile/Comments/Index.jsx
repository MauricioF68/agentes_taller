import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

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
                // Optionally reload to fetch updated item details if inertia doesn't automatically
                router.reload({ only: ['itemsWithComments'] });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Comentarios y Correcciones</h2>}
        >
            <Head title={`Comentarios - ${group.name}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {itemsWithComments.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 shadow-sm mt-4">
                            <div className="flex justify-center mb-4">
                                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-700">¡Todo al día!</h3>
                            <p className="text-gray-500 mt-2">No tienes comentarios pendientes del docente en el Backlog.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {itemsWithComments.map(item => (
                                <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                                    {/* Item Details */}
                                    <div className="p-6 md:w-1/2 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {item.type.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                                                item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                item.status === 'assigned' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                                {item.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description || 'Sin descripción'}</p>
                                        
                                        <div className="mt-auto">
                                            <button 
                                                onClick={() => openEditModal(item)}
                                                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                Corregir / Editar Ítem
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Comments List */}
                                    <div className="p-6 md:w-1/2 flex flex-col h-full bg-white max-h-80 overflow-y-auto">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                            Comentarios del Docente
                                        </h4>
                                        <div className="space-y-4">
                                            {item.comments.map(comment => (
                                                <div key={comment.id} className="bg-orange-50 border border-orange-100 p-4 rounded-xl relative">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-orange-800 text-sm">{comment.user?.name}</span>
                                                        <span className="text-xs text-orange-500 font-medium">
                                                            {new Date(comment.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-orange-900 whitespace-pre-wrap">{comment.content}</p>
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
                <div className="flex flex-col md:flex-row h-auto max-h-[85vh] overflow-hidden">
                    {/* LEFT COLUMN: EDIT FORM */}
                    <div className="w-full md:w-3/5 p-6 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                Corregir Ítem
                            </h2>
                            <button onClick={closeEditModal} className="md:hidden text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">✕</button>
                        </div>

                        <form onSubmit={submitEditItem} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título</label>
                                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={editData.title} onChange={e => setEditData('title', e.target.value)} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="4"
                                    value={editData.description} onChange={e => setEditData('description', e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Criterios de Aceptación</label>
                                <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3"
                                    value={editData.acceptance_criteria} onChange={e => setEditData('acceptance_criteria', e.target.value)} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Peso (Story Points)</label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={editData.story_points} onChange={e => setEditData('story_points', e.target.value)}>
                                        <option value="1">1 pt</option>
                                        <option value="2">2 pts</option>
                                        <option value="3">3 pts</option>
                                        <option value="4">4 pts</option>
                                        <option value="5">5 pts (Máx)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Asignar a</label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={editData.assigned_to} onChange={e => setEditData('assigned_to', e.target.value)}>
                                        <option value="">Sin Asignar</option>
                                        {members.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                                <button type="button" onClick={closeEditModal} className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-md border border-gray-300 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processingEdit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors">
                                    Aplicar Corrección
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: COMMENTS VIEW */}
                    <div className="w-full md:w-2/5 flex flex-col bg-gray-50/50">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                Feedback del Docente
                            </h3>
                            <button onClick={closeEditModal} className="hidden md:block text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">✕</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {selectedItem?.comments && selectedItem.comments.length > 0 ? (
                                selectedItem.comments.map(comment => (
                                    <div key={comment.id} className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-orange-800 text-sm">{comment.user?.name}</span>
                                            <span className="text-[10px] text-orange-500 font-bold uppercase">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-orange-900 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-sm font-medium">
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
