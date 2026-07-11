import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import Dropdown from '@/Components/Dropdown';
import { MoreHorizontal } from 'lucide-react';

function DroppableColumn({ id, title, items, children }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = {
        backgroundColor: isOver ? '#f1f5f9' : '#f8fafc',
    };

    return (
        <div ref={setNodeRef} style={style} className="rounded-2xl p-4 min-h-[500px] border border-slate-200 transition-colors duration-200 font-sans">
            <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">{items.length}</span>
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
        <div className="flex flex-col h-full font-sans">
            <div className="flex justify-between items-start mb-3">
                <span className="text-[9px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase tracking-widest border border-slate-200">
                    {item.type.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                        {item.story_points || 1} pts
                    </span>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="text-slate-400 hover:text-slate-700 focus:outline-none p-1 rounded-md hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48">
                            <button onClick={() => openEditModal(item)} className="block w-full px-4 py-2 text-left text-sm leading-5 text-slate-700 hover:bg-slate-50 focus:outline-none font-medium">
                                Ver / Editar
                            </button>
                            <button onClick={() => deleteItem(item.id)} className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 hover:bg-red-50 focus:outline-none font-medium">
                                Eliminar
                            </button>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
            <p className="font-semibold text-slate-800 mb-4 leading-snug text-sm">{item.title}</p>
            <div className="flex justify-between items-center mt-auto">
                {item.sprint ? (
                    <span className="text-[11px] font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                        {item.sprint.name}
                    </span>
                ) : <span />}
                {item.assignee && (
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[10px] font-bold shadow-sm" title={item.assignee.name}>
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
            className={`bg-white p-4 rounded-xl shadow-sm border ${isDragging ? 'border-dashed border-indigo-400 bg-indigo-50/50' : 'border-slate-200'} hover:border-slate-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative group`}
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
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
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
