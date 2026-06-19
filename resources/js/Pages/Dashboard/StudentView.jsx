import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react'; // NUEVO: Importamos Link para la redirección limpia
import UploadDocumentForm from './Partials/UploadDocumentForm';
import DocumentList from './Partials/DocumentList';
import NotionCard from '@/Components/NotionCard';
import StatusBadge from '@/Components/StatusBadge';

export default function StudentView({ myGroup, availableGroups, categories }) {
    // Estado local para reaccionar a Pusher
    const [documents, setDocuments] = useState(myGroup?.documents || []);

    // Sincronizar si Inertia recarga la página por completo
    useEffect(() => {
        if (myGroup?.documents) {
            setDocuments(myGroup.documents);
        }
    }, [myGroup?.documents]);

    // Escucha en tiempo real de Pusher
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

    // Renderizado Condicional de resiliencia UX:
    // Si el alumno no tiene grupo, ya no cargamos JoinGroupForm aquí (evitando errores)
    // En su lugar, lo guiamos con un enlace limpio a la nueva pestaña de Gestión de Grupos.
    if (!myGroup) {
        return (
            <NotionCard>
                <div className="text-center py-8">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="text-lg font-medium text-notion-text mb-2">Aún no tienes un grupo asignado</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                        Para poder subir documentos y utilizar las bondades del Asistente de Auditoría de Inteligencia Artificial, primero debes unirte o crear un equipo de trabajo.
                    </p>
                    <Link 
                        href={route('groups.index')} 
                        className="inline-flex items-center px-4 py-2 bg-notion-blue border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-600 transition shadow-sm"
                    >
                        Ir a Gestión de Grupos
                    </Link>
                </div>
            </NotionCard>
        );
    }

    const EMOJI_MAP = {
        calavera: { emoji: '💀', title: 'Estado Crítico (No hay avance)', bgClass: 'bg-gray-900', textClass: 'text-white' },
        enojado: { emoji: '😡', title: 'Muy Deficiente', bgClass: 'bg-red-800', textClass: 'text-white' },
        rojo: { emoji: '🔴', title: 'Deficiente / Con Errores', bgClass: 'bg-red-500', textClass: 'text-white' },
        naranja: { emoji: '🟠', title: 'Regular / Incompleto', bgClass: 'bg-orange-500', textClass: 'text-white' },
        amarillo: { emoji: '🟡', title: 'Aceptable / Por Buen Camino', bgClass: 'bg-yellow-400', textClass: 'text-gray-900' },
        verde: { emoji: '🟢', title: 'Excelente / Óptimo', bgClass: 'bg-green-500', textClass: 'text-white' }
    };

    return (
        <div className="space-y-6">
            <NotionCard>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-notion-text">Mi Grupo: {myGroup.name}</h3>
                    <StatusBadge status="alumno" />
                </div>

                {/* Banner de Estado de Salud (Evaluación) */}
                {myGroup.evaluation && myGroup.evaluation.color_status && (
                    <div className={`mb-6 p-5 rounded-2xl shadow-sm border flex items-start gap-4 transition-all ${EMOJI_MAP[myGroup.evaluation.color_status]?.bgClass || 'bg-gray-100'} ${EMOJI_MAP[myGroup.evaluation.color_status]?.textClass || 'text-gray-800'}`}>
                        <div className="text-5xl drop-shadow-md bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            {EMOJI_MAP[myGroup.evaluation.color_status]?.emoji || '⚪'}
                        </div>
                        <div className="flex flex-col justify-center">
                            <h4 className="font-bold tracking-wide uppercase text-xs opacity-70 mb-1">Veredicto del Docente</h4>
                            <h3 className="font-extrabold text-xl mb-1">{EMOJI_MAP[myGroup.evaluation.color_status]?.title || 'Evaluación'}</h3>
                            <p className="text-sm font-medium leading-relaxed opacity-90 bg-black/10 p-3 rounded-lg mt-2">
                                {myGroup.evaluation.feedback || 'Sin comentarios adicionales.'}
                            </p>
                        </div>
                    </div>
                )}

                <hr className="border-notion-border mb-4" />
                
                {/* Hijo: Formulario de subida */}
                <UploadDocumentForm myGroup={myGroup} categories={categories} />
            </NotionCard>

            {/* Hijo: Lista de documentos */}
            <DocumentList documents={documents} categories={categories} />
        </div>
    );
}