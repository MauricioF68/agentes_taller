import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';

export default function BacklogBoard({ auth, group, items, members, sprints }) {
    const [isAdding, setIsAdding] = useState(false);
    const [isAddingSprint, setIsAddingSprint] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        acceptance_criteria: '',
        type: 'user_story',
        sprint_id: sprints?.length > 0 ? sprints[0].id : '',
        assigned_to: ''
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
        assigned_to: ''
    });

    const columns = [
        { id: 'backlog', title: 'Backlog' },
        { id: 'assigned', title: 'Asignadas' },
        { id: 'in_progress', title: 'En Proceso' },
        { id: 'completed', title: 'Culminadas' }
    ];

    const handleDrop = (e, status) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('itemId');
        
        router.patch(route('agile.backlog.status', { group: group.id, item: itemId }), {
            status: status
        }, {
            preserveScroll: true
        });
    };

    const handleDragStart = (e, itemId) => {
        e.dataTransfer.setData('itemId', itemId);
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

    const openViewModal = (item) => {
        setSelectedItem(item);
        setEditData({
            title: item.title,
            description: item.description || '',
            acceptance_criteria: item.acceptance_criteria || '',
            type: item.type,
            sprint_id: item.sprint_id || '',
            assigned_to: item.assigned_to || ''
        });
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedItem(null);
        resetEdit();
    };

    const submitEditItem = (e) => {
        e.preventDefault();
        putEdit(route('agile.backlog.update', { group: group.id, item: selectedItem.id }), {
            onSuccess: () => closeViewModal()
        });
    };

    const deleteItem = (itemId) => {
        if (confirm('¿Estás seguro de que deseas eliminar este ítem? Esta acción no se puede deshacer.')) {
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex space-x-4">
                        <button 
                            onClick={() => setIsAdding(!isAdding)}
                            className="bg-notion-blue hover:bg-blue-900 text-white font-bold py-2 px-4 rounded shadow-sm"
                        >
                            {isAdding ? 'Cancelar' : '+ Agregar Ítem'}
                        </button>
                        <button 
                            onClick={() => setIsAddingSprint(!isAddingSprint)}
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-4 rounded shadow-sm"
                        >
                            {isAddingSprint ? 'Cancelar' : '+ Crear Sprint'}
                        </button>
                    </div>

                    {isAddingSprint && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                            <h3 className="font-bold text-gray-800 mb-4">Nuevo Sprint</h3>
                            <form onSubmit={submitNewSprint} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre del Sprint</label>
                                    <input type="text" placeholder="Ej. Sprint 1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={sprintData.name} onChange={e => setSprintData('name', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                                    <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={sprintData.start_date} onChange={e => setSprintData('start_date', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                                    <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={sprintData.end_date} onChange={e => setSprintData('end_date', e.target.value)} />
                                </div>
                                <div>
                                    <button type="submit" disabled={processingSprint} className="bg-notion-blue hover:bg-blue-900 text-white font-bold py-2 px-4 rounded w-full">
                                        Guardar Sprint
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {isAdding && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                            <form onSubmit={submitNewItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Título</label>
                                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={data.title} onChange={e => setData('title', e.target.value)} required />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                                    <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="1"
                                        value={data.description} onChange={e => setData('description', e.target.value)} />
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">Criterios de Aceptación (Opcional)</label>
                                    <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows="2"
                                        value={data.acceptance_criteria} onChange={e => setData('acceptance_criteria', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={data.type} onChange={e => setData('type', e.target.value)}>
                                        <option value="user_story">User Story</option>
                                        <option value="spike">Spike</option>
                                        <option value="enabler">Enabler</option>
                                        <option value="nfr">NFR</option>
                                        <option value="issue">Issue</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sprint</label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={data.sprint_id} onChange={e => setData('sprint_id', e.target.value)}>
                                        <option value="">(Sin Sprint)</option>
                                        {sprints?.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Asignar a</label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        value={data.assigned_to} onChange={e => setData('assigned_to', e.target.value)}>
                                        <option value="">Sin Asignar</option>
                                        {members.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-4 mt-4">
                                    <button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                                        Guardar Ítem
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {columns.map(col => (
                            <div 
                                key={col.id} 
                                className="bg-gray-100 rounded-lg p-4 min-h-[500px]"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, col.id)}
                            >
                                <h3 className="font-bold text-gray-700 mb-4">{col.title} ({items.filter(i => i.status === col.id).length})</h3>
                                
                                {items.filter(i => i.status === col.id).map(item => (
                                    <div 
                                        key={item.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item.id)}
                                        className="bg-white p-4 rounded shadow mb-3 cursor-move border-l-4 border-blue-500"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded text-gray-700 uppercase">
                                                {item.type.replace('_', ' ')}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {item.sprint && (
                                                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                        {item.sprint.name}
                                                    </span>
                                                )}
                                                <Dropdown>
                                                    <Dropdown.Trigger>
                                                        <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                    </Dropdown.Trigger>
                                                    <Dropdown.Content align="right" width="48">
                                                        <button onClick={() => openViewModal(item)} className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                                                            Ver / Editar
                                                        </button>
                                                        <button onClick={() => deleteItem(item.id)} className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 hover:bg-red-50 focus:outline-none transition duration-150 ease-in-out">
                                                            Eliminar
                                                        </button>
                                                    </Dropdown.Content>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <p className="font-medium text-gray-900">{item.title}</p>
                                        {item.assignee && (
                                            <div className="mt-3 text-sm text-gray-600 flex items-center">
                                                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs mr-2">
                                                    {item.assignee.name.charAt(0)}
                                                </div>
                                                {item.assignee.name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal show={isViewModalOpen} onClose={closeViewModal} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Editar Ítem
                        </h2>
                        <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={submitEditItem} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Título</label>
                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={editData.title} onChange={e => setEditData('title', e.target.value)} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
                            <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3"
                                value={editData.description} onChange={e => setEditData('description', e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Criterios de Aceptación (Opcional)</label>
                            <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3"
                                value={editData.acceptance_criteria} onChange={e => setEditData('acceptance_criteria', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => deleteItem(selectedItem.id)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded border border-red-200">
                                Eliminar
                            </button>
                            <button type="button" onClick={closeViewModal} className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded border border-gray-300">
                                Cancelar
                            </button>
                            <button type="submit" disabled={processingEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
