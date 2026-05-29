import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import VoiceCopilot from './Partials/VoiceCopilot';
import EvaluationModal from './Partials/EvaluationModal';
import NotionCard from '@/Components/NotionCard';
import StatusBadge from '@/Components/StatusBadge';

export default function TeacherView({ groups, categories }) {
    const [activeGroup, setActiveGroup] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [aiAnswer, setAiAnswer] = useState(null);
    const [loadingRAG, setLoadingRAG] = useState(false);
    
    // NUEVO ESTADO: Control del modal de calificación
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Formulario de Evaluación de Inertia
    const { data: evalData, setData: setEvalData, post: postEval, processing: processingEval, errors: evalErrors, reset: resetEval } = useForm({
        group_id: '',
        score: '',
        feedback: ''
    });

    const handleGroupSelected = (group) => {
        setActiveGroup(group);
        setEvalData('group_id', group.id); 
        setAiAnswer(null); 
    };

    const handleCategorySelected = (category) => {
        setActiveCategory(category);
    };

    const handleQuestionCaptured = async (foundGroup, foundCategory, question, onRAGComplete) => {
        setActiveGroup(foundGroup);
        setActiveCategory(foundCategory);
        setEvalData('group_id', foundGroup.id); 
        
        setLoadingRAG(true);
        setAiAnswer(null);

        try {
            const response = await axios.post(route('agent.chat'), {
                group_id: foundGroup.id, 
                category_slug: foundCategory.slug,
                message: question
            });

            const reply = response.data.reply;
            setAiAnswer(reply);

            let fraseVoz = reply.includes("No encontré") 
                ? "Lo siento, no encontré esa información en el documento." 
                : "Análisis completado. He mostrado la evidencia en la pantalla.";

            const utterance = new SpeechSynthesisUtterance(fraseVoz);
            utterance.lang = 'es-ES';
            
            const voices = window.speechSynthesis.getVoices();
            const betterVoice = voices.find(v => v.name.includes('Google español') || v.name.includes('es-ES'));
            if (betterVoice) utterance.voice = betterVoice;

            utterance.onend = () => {
                if (onRAGComplete) onRAGComplete(); 
            };
            window.speechSynthesis.speak(utterance);

        } catch (error) {
            console.error("Error consultando a la IA:", error);
            setAiAnswer("⚠️ Ocurrió un error al consultar el motor RAG.");
            if (onRAGComplete) onRAGComplete();
        } finally {
            setLoadingRAG(false);
        }
    };

    const submitEvaluation = (e) => {
        e.preventDefault();
        postEval(route('groups.evaluate'), {
            onSuccess: () => {
                alert("¡Calificación guardada exitosamente!");
                setIsModalOpen(false); // Cerramos el modal tras el éxito
                resetEval();
            }
        });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            
            {/* BARRA SUPERIOR E ACCIONES DE NAVEGACIÓN */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Consola de Control RAG</h2>
                    <p className="text-xs text-gray-400">Panel operativo centralizado con comandos e interacción por voz en tiempo real.</p>
                </div>
                
                {/* BOTÓN PREMIM PARA LANZAR EL MODAL ADMINISTRATIVO */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-gray-200 active:scale-95"
                >
                    <span>📊</span> Evaluar Equipos y Notas
                </button>
            </div>

            {/* SECCIÓN PRINCIPAL: EL ASISTENTE OCUPA EL 100% DE LA PANTALLA */}
            <div className="space-y-6">
                
                {/* Asistente de Voz Robusto (Ocupa todo el ancho) */}
                <VoiceCopilot 
                    groups={groups} 
                    categories={categories}
                    onQuestionCaptured={handleQuestionCaptured}
                />

                {/* Gran Pantalla Holográfica de Evidencias */}
                <NotionCard className="min-h-[40vh] flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-lg font-medium text-notion-text flex items-center gap-2">
                            <span>🖥️</span> Terminal de Evidencias e Insights IA
                        </h3>
                        {activeGroup && <StatusBadge status="docente" />}
                    </div>

                    {!activeGroup ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                            <span className="text-6xl mb-4 animate-pulse opacity-40">🤖</span>
                            <p className="italic text-sm">Di "Ey Sistema" para iniciar o presiona el botón superior para ver listados.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 flex-1 flex flex-col">
                            {/* Tags de estado actuales de la consulta de voz */}
                            <div className="flex flex-wrap gap-3">
                                <div className="bg-gray-50 border px-3 py-2 rounded-xl text-xs">
                                    <span className="font-semibold text-gray-400 uppercase tracking-wider block">Target Grupo</span>
                                    <span className="text-sm font-medium text-gray-700">{activeGroup.name}</span>
                                </div>
                                <div className="bg-gray-50 border px-3 py-2 rounded-xl text-xs">
                                    <span className="font-semibold text-gray-400 uppercase tracking-wider block">Target Entregable</span>
                                    <span className="text-sm font-medium text-gray-700">{activeCategory ? activeCategory.name : 'Escaneando...'}</span>
                                </div>
                            </div>

                            {/* Canvas de Respuesta Vectorial */}
                            <div className="mt-4 flex-1 flex flex-col">
                                <h4 className="font-semibold text-sm text-blue-600 mb-3 tracking-wide">
                                    ✨ Fragmento RAG Recuperado (Gemini 2.5 Flash)
                                </h4>
                                
                                {loadingRAG && (
                                    <div className="flex-1 bg-blue-50/30 border border-blue-100 rounded-xl p-8 flex flex-col items-center justify-center space-y-3 min-h-[20vh]">
                                        <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs text-blue-700 animate-pulse font-medium">Buscando vectores de proximidad armónica en ChromaDB...</p>
                                    </div>
                                )}

                                {aiAnswer && !loadingRAG && (
                                    <div className="flex-1 bg-white border border-gray-200 p-6 rounded-xl text-sm text-gray-800 whitespace-pre-wrap shadow-inner leading-relaxed font-sans">
                                        {aiAnswer}
                                    </div>
                                )}

                                {!aiAnswer && !loadingRAG && (
                                    <div className="flex-1 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-8 flex items-center justify-center text-xs text-gray-400 italic min-h-[20vh]">
                                        La transcripción de las respuestas y cláusulas de los archivos aparecerán aquí tras la consulta de voz.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </NotionCard>
            </div>

            {/* INYECCIÓN DEL MODAL SEPARADO */}
            <EvaluationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                groups={groups}
                categories={categories}
                activeGroup={activeGroup}
                onGroupSelected={handleGroupSelected}
                evalData={evalData}
                setEvalData={setEvalData}
                submitEvaluation={submitEvaluation}
                processingEval={processingEval}
                evalErrors={evalErrors}
            />

        </div>
    );
}