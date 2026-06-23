import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import UploadDocumentForm from './Partials/UploadDocumentForm';
import DocumentList from './Partials/DocumentList';
import StatusBadge from '@/Components/StatusBadge';
import { motion } from 'framer-motion';

export default function StudentView({ myGroup, availableGroups, categories }) {
    const [documents, setDocuments] = useState(myGroup?.documents || []);

    useEffect(() => {
        if (myGroup?.documents) {
            setDocuments(myGroup.documents);
        }
    }, [myGroup?.documents]);

    useEffect(() => {
        if (!myGroup?.id) return;
        console.log(`📡 Conectando al canal: group-channel.${myGroup.id}`);
        const channel = window.Echo.channel(`group-channel.${myGroup.id}`)
            .listen('.document.status.updated', (event) => {
                console.log('⚡ ¡Evento de IA recibido!', event);
                setDocuments((prevDocs) =>
                    prevDocs.map((doc) =>
                        doc.id === event.documentId
                            ? { ...doc, status_ai: event.statusAi }
                            : doc
                    )
                );
            });
        return () => {
            window.Echo.leaveChannel(`group-channel.${myGroup.id}`);
        };
    }, [myGroup?.id]);

    if (!myGroup) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 shadow-sm"
            >
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-50 p-4 rounded-full text-yellow-500">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aún no tienes un equipo de trabajo asignado</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Para poder subir documentos y utilizar el Asistente de Auditoría de Inteligencia Artificial, primero debes unirte o crear un equipo.
                </p>
                <Link 
                    href={route('groups.index')} 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:bg-indigo-700 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Ir a Gestión de Grupos
                </Link>
            </motion.div>
        );
    }

    const STATUS_MAP = {
        calavera: { 
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>, 
            title: 'Estado Crítico (No hay avance)', bgClass: 'bg-gradient-to-r from-gray-900 to-black', textClass: 'text-white' 
        },
        enojado: { 
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
            title: 'Muy Deficiente', bgClass: 'bg-gradient-to-r from-red-600 to-red-800', textClass: 'text-white' 
        },
        rojo: { 
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
            title: 'Deficiente / Con Errores', bgClass: 'bg-gradient-to-r from-red-400 to-red-600', textClass: 'text-white' 
        },
        naranja: { 
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
            title: 'Regular / Incompleto', bgClass: 'bg-gradient-to-r from-orange-400 to-orange-500', textClass: 'text-white' 
        },
        amarillo: { 
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>, 
            title: 'Aceptable / Por Buen Camino', bgClass: 'bg-gradient-to-r from-yellow-300 to-yellow-500', textClass: 'text-gray-900' 
        },
        verde: { 
            icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>, 
            title: 'Excelente / Óptimo', bgClass: 'bg-gradient-to-r from-green-400 to-green-600', textClass: 'text-white' 
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            
            {/* Header del Equipo */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{myGroup.name}</h2>
                    </div>
                    {myGroup.project_name && (
                        <p className="text-indigo-600 font-bold ml-11">{myGroup.project_name}</p>
                    )}
                </div>
                <StatusBadge status="alumno" />
            </motion.div>

            {/* Banner de Estado de Salud (Evaluación) */}
            {myGroup.evaluation && myGroup.evaluation.color_status && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`rounded-2xl shadow-lg border-0 flex flex-col sm:flex-row items-center sm:items-start gap-6 overflow-hidden ${STATUS_MAP[myGroup.evaluation.color_status]?.bgClass || 'bg-gray-100'} ${STATUS_MAP[myGroup.evaluation.color_status]?.textClass || 'text-gray-800'}`}
                >
                    <div className="p-6 sm:p-8 flex items-center justify-center bg-white/10 backdrop-blur-sm self-stretch">
                        {STATUS_MAP[myGroup.evaluation.color_status]?.icon || <div className="w-10 h-10 bg-white/20 rounded-full" />}
                    </div>
                    <div className="flex flex-col justify-center py-6 pr-6 w-full text-center sm:text-left">
                        <h4 className="font-bold tracking-widest uppercase text-[10px] sm:text-xs opacity-75 mb-1">Veredicto del Docente</h4>
                        <h3 className="font-black text-2xl mb-3 drop-shadow-sm">{STATUS_MAP[myGroup.evaluation.color_status]?.title || 'Evaluación'}</h3>
                        <div className="bg-black/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-inner">
                            <p className="text-sm font-medium leading-relaxed opacity-95">
                                {myGroup.evaluation.feedback || 'Sin comentarios adicionales.'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario de subida (Columna izquierda) */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
                        <UploadDocumentForm myGroup={myGroup} categories={categories} />
                    </div>
                </motion.div>

                {/* Lista de documentos (Columna derecha, más ancha) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2"
                >
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 min-h-full">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-900">Entregables de la Auditoría</h3>
                                <p className="text-gray-500 text-sm mt-1">Sube tus documentos para que la IA los procese y formen parte del contexto.</p>
                            </div>
                        </div>
                        <DocumentList documents={documents} categories={categories} />
                    </div>
                </motion.div>
            </div>
            
        </div>
    );
}