import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import Dropdown from '@/Components/Dropdown';

function DroppableColumn({ id, title, items, children }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = {
        backgroundColor: isOver ? '#e0e7ff' : '#f8fafc',
    };

    return (
        <div ref={setNodeRef} style={style} className="rounded-xl p-4 min-h-[500px] border border-gray-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">{title}</h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">{items.length}</span>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

// Componente puro de presentación de la tarjeta
function CardContent({ item, openEditModal, deleteItem }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 uppercase tracking-widest">
                    {item.type.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full shadow-sm">
                        {item.story_points || 1} pts
                    </span>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48">
                            <button onClick={() => openEditModal(item)} className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none">
                                Ver / Editar
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 hover:bg-red-50 focus:outline-none">
                                Eliminar
                            </button>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
            <p className="font-semibold text-gray-800 mb-4 leading-tight">{item.title}</p>
            <div className="flex justify-between items-center mt-auto">
                {item.sprint ? (
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                        {item.sprint.name}
                    </span>
                ) : <span />}
                {item.assignee && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-sm" title={item.assignee.name}>
                        {item.assignee.name.charAt(0)}
                    </div>
                )}
            </div>
        </div>
    );
}

function DraggableCard({ item, openEditModal, deleteItem }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: item.id,
        data: { item }
    });
    
    const style = {
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <motion.div
            layout
            ref={setNodeRef} style={style} {...listeners} {...attributes}
            className={`bg-white p-4 rounded-xl shadow-sm border ${isDragging ? 'border-dashed border-indigo-400 bg-indigo-50/50' : 'border-gray-200'} hover:border-indigo-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative group`}
        >
            <CardContent item={item} openEditModal={openEditModal} deleteItem={deleteItem} />
        </motion.div>
    );
}

export default function BoardView({ items, columns, onDragEnd, openEditModal, deleteItem }) {
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        setActiveId(null);
        onDragEnd(event);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const activeItem = items.find(item => item.id === activeId);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                {columns.map(col => {
                    const colItems = items.filter(i => i.status === col.id);
                    return (
                        <DroppableColumn key={col.id} id={col.id} title={col.title} items={colItems}>
                            {colItems.map(item => (
                                <DraggableCard 
                                    key={item.id} 
                                    item={item} 
                                    openEditModal={openEditModal} 
                                    deleteItem={deleteItem} 
                                />
                            ))}
                        </DroppableColumn>
                    );
                })}

                <DragOverlay>
                    {activeItem ? (
                        <div className="bg-white p-4 rounded-xl shadow-2xl border border-indigo-400 cursor-grabbing opacity-95 scale-[1.02] transform transition-transform">
                            <CardContent item={activeItem} openEditModal={openEditModal} deleteItem={deleteItem} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </motion.div>
    );
}
