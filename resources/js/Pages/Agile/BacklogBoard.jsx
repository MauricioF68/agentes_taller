import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import TableView from '@/Components/Kanban/TableView';
import BoardView from '@/Components/Kanban/BoardView';
import { motion, AnimatePresence } from 'framer-motion';

export default function BacklogBoard({ auth, group, items, members, sprints }) {
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'board'
    const [isAdding, setIsAdding] = useState(false);
    const [isAddingSprint, setIsAddingSprint] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        acceptance_criteria: '',
        type: 'user_story',
        sprint_id: sprints?.length > 0 ? sprints[0].id : '',
        assigned_to: '',
        story_points: 1,
        due_date: ''
    });

    const { data: sprintData, setData: setSprintData, post: postSprint, processing: processingSprint, reset: resetSprint } = useForm({
        name: '',
        start_date: '',
        end_date: ''
    });

    const [selectedItem, setSelectedItem] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

    const columns = [
        { id: 'backlog', title: 'Por Hacer (To Do)' },
        { id: 'assigned', title: 'Asignadas' },
        { id: 'in_progress', title: 'En Proceso' },
        { id: 'completed', title: 'Culminadas' }
    ];

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        
        const itemId = active.id;
        const newStatus = over.id;
        const item = items.find(i => i.id === itemId);
        
        if (item && item.status !== newStatus) {
            router.patch(route('agile.backlog.status', { group: group.id, item: itemId }), {
                status: newStatus
            }, {
                preserveScroll: true
            });
        }
    };

    const submitNewItem = (e) => {
        e.preventDefault();
        post(route('agile.backlog.store', group.id), {
            onSuccess: () => {
                setIsAdding(false);
                reset();
            }
        });
    };

    const submitNewSprint = (e) => {
        e.preventDefault();
        postSprint(route('agile.sprints.store', group.id), {
            onSuccess: () => {
                setIsAddingSprint(false);
                resetSprint();
            }
        });
    };

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
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setTimeout(() => {
            setSelectedItem(null);
            resetEdit();
        }, 200);
    };

    const submitEditItem = (e) => {
        e.preventDefault();
        putEdit(route('agile.backlog.update', { group: group.id, item: selectedItem.id }), {
            onSuccess: () => closeViewModal()
        });
    };

    const deleteItem = (itemId) => {
        if (confirm('¿Estás seguro de que deseas eliminar este ítem?')) {
            router.delete(route('agile.backlog.delete', { group: group.id, item: itemId }), {
                onSuccess: () => {
                    if (selectedItem && selectedItem.id === itemId) {
                        closeViewModal();
                    }
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Backlog: {group.name}</h2>}
        >
            <Head title={`Backlog - ${group.name}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Toolbar and View Toggles */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
                            <button 
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                Tabla
                            </button>
                            <button 
                                onClick={() => setViewMode('board')}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'board' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
                                Tablero
                            </button>
                        </div>
                        
                        <div className="flex space-x-3">
                            <button 
                                onClick={() => { setIsAdding(!isAdding); setIsAddingSprint(false); }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-2"
                            >
                                {isAdding ? (
                                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Cancelar</>
                                ) : (
                                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> Nueva Tarea</>
                                )}
                            </button>
                            <button 
                                onClick={() => { setIsAddingSprint(!isAddingSprint); setIsAdding(false); }}
                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-4 rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-2"
                            >
                                {isAddingSprint ? (
                                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Cancelar</>
                                ) : (
                                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> Nuevo Sprint</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Views */}
                    <AnimatePresence mode="wait">
                        {viewMode === 'table' ? (
                            <TableView 
                                key="table"
                                items={items} 
                                openEditModal={openEditModal} 
                            />
                        ) : (
                            <BoardView 
                                key="board"
                                items={items} 
                                columns={columns} 
                                onDragEnd={handleDragEnd} 
                                openEditModal={openEditModal}
                                deleteItem={deleteItem}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Modal show={isViewModalOpen} onClose={closeViewModal} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Editar Ítem
                        </h2>
                        <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={submitEditItem} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Título</label>
                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={editData.title} onChange={e => setEditData('title', e.target.value)} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3"
                                value={editData.description} onChange={e => setEditData('description', e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Criterios de Aceptación</label>
                            <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3" placeholder="Ej. Dado que [condición], cuando [acción], entonces [resultado]"
                                value={editData.acceptance_criteria} onChange={e => setEditData('acceptance_criteria', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento (Opcional)</label>
                                <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={editData.due_date} onChange={e => setEditData('due_date', e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={editData.type} onChange={e => setEditData('type', e.target.value)}>
                                    <option value="user_story">User Story</option>
                                    <option value="spike">Spike</option>
                                    <option value="enabler">Enabler</option>
                                    <option value="nfr">NFR</option>
                                    <option value="issue">Issue</option>
                                </select>
                            </div>
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
                                <label className="block text-sm font-medium text-gray-700">Sprint</label>
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={editData.sprint_id} onChange={e => setEditData('sprint_id', e.target.value)}>
                                    <option value="">(Sin Sprint)</option>
                                    {sprints?.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
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

                        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
                            <button type="button" onClick={() => deleteItem(selectedItem.id)} className="text-red-600 hover:text-red-800 font-bold px-4 py-2 transition-colors">
                                Eliminar Tarea
                            </button>
                            <div className="flex gap-3">
                                <button type="button" onClick={closeViewModal} className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-md border border-gray-300 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processingEdit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors">
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal para Crear Nuevo Sprint */}
            <Modal show={isAddingSprint} onClose={() => setIsAddingSprint(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Nuevo Sprint
                        </h2>
                        <button onClick={() => setIsAddingSprint(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <form onSubmit={submitNewSprint} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre del Sprint</label>
                            <input type="text" placeholder="Ej. Sprint 1" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                value={sprintData.name} onChange={e => setSprintData('name', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                                <input type="date" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                    value={sprintData.start_date} onChange={e => setSprintData('start_date', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                                <input type="date" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                    value={sprintData.end_date} onChange={e => setSprintData('end_date', e.target.value)} />
                            </div>
                        </div>

                        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAddingSprint(false)} className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl border border-gray-300 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" disabled={processingSprint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors active:scale-95">
                                Crear Sprint
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal para Crear Nueva Tarea */}
            <Modal show={isAdding} onClose={() => setIsAdding(false)} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Nueva Tarea
                        </h2>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <form onSubmit={submitNewItem} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Título</label>
                            <input type="text" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                value={data.title} onChange={e => setData('title', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                            <textarea className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3" rows="3"
                                value={data.description} onChange={e => setData('description', e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Criterios de Aceptación</label>
                            <textarea className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3" rows="3" placeholder="Ej. Dado que [condición], cuando [acción], entonces [resultado]"
                                value={data.acceptance_criteria} onChange={e => setData('acceptance_criteria', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento (Opcional)</label>
                                <input type="date" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                    value={data.due_date} onChange={e => setData('due_date', e.target.value)} />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                    value={data.type} onChange={e => setData('type', e.target.value)}>
                                    <option value="user_story">User Story</option>
                                    <option value="spike">Spike</option>
                                    <option value="enabler">Enabler</option>
                                    <option value="nfr">NFR</option>
                                    <option value="issue">Issue</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Peso (Story Pts)</label>
                                <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                    value={data.story_points} onChange={e => setData('story_points', e.target.value)}>
                                    <option value="1">1 pt</option>
                                    <option value="2">2 pts</option>
                                    <option value="3">3 pts</option>
                                    <option value="4">4 pts</option>
                                    <option value="5">5 pts (Máx)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sprint</label>
                                <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                    value={data.sprint_id} onChange={e => setData('sprint_id', e.target.value)}>
                                    <option value="">(Sin Sprint)</option>
                                    {sprints?.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Asignar a</label>
                                <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3"
                                    value={data.assigned_to} onChange={e => setData('assigned_to', e.target.value)}>
                                    <option value="">Sin Asignar</option>
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAdding(false)} className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl border border-gray-300 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors active:scale-95">
                                Crear Tarea
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
