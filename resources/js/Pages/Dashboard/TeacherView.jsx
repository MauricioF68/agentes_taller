import { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import EvaluationModal from './Partials/EvaluationModal';
import NotionCard from '@/Components/NotionCard';

export default function TeacherView({ groups, categories }) {
    const [activeGroup, setActiveGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    
    // Control del modal de calificación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: evalData, setData: setEvalData, post: postEval, processing: processingEval, errors: evalErrors, reset: resetEval } = useForm({
        group_id: '',
        color_status: '',
        feedback: ''
    });

    // Control de dictado de voz (Estilo Gemini)
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'es-ES';

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setInputText(transcript);
            };

            recognition.onerror = (event) => {
                console.error("Error en dictado:", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleDictation = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInputText('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim() || !activeGroup) return;

        const userMsg = inputText.trim();
        setInputText('');
        if (isListening) recognitionRef.current?.stop();

        const newHistory = [...messages, { role: 'user', content: userMsg }];
        setMessages(newHistory);
        setIsThinking(true);

        try {
            // Transformar el historial para el backend (filtrando los nulls u otros campos si hubiera)
            const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));

            const response = await axios.post(route('agent.chat'), {
                group_id: activeGroup.id,
                category_slug: null, // Ya no dependemos de una categoría obligatoria
                message: userMsg,
                history: historyPayload
            });

            const reply = response.data.reply;
            setMessages(prev => [...prev, { role: 'model', content: reply }]);

        } catch (error) {
            console.error("Error consultando a la IA:", error);
            setMessages(prev => [...prev, { role: 'model', content: "⚠️ Ocurrió un error al conectar con el servidor RAG. Verifica tu conexión a Python." }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            
            {/* Cabecera / Controles Superiores */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm mb-4 shrink-0">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            <span>🤖</span> Consola RAG
                        </h2>
                    </div>
                    {/* Selector de Grupo */}
                    <select 
                        className="ml-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm"
                        value={activeGroup ? activeGroup.id : ''}
                        onChange={(e) => {
                            const group = groups.find(g => g.id === parseInt(e.target.value));
                            setActiveGroup(group);
                            setMessages([]); // Limpiar chat al cambiar de grupo
                        }}
                    >
                        <option value="" disabled>Seleccione un grupo a auditar...</option>
                        {groups.map(g => {
                            const evalColor = g.evaluation?.color_status;
                            const emojiMap = { calavera: '💀', enojado: '😡', rojo: '🔴', naranja: '🟠', amarillo: '🟡', verde: '🟢' };
                            const emoji = evalColor ? emojiMap[evalColor] : '⚪';
                            return (
                                <option key={g.id} value={g.id}>{emoji} {g.name}</option>
                            );
                        })}
                    </select>
                </div>
                
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-gray-200 active:scale-95 whitespace-nowrap"
                >
                    <span>📊</span> Evaluar Equipo
                </button>
            </div>

            {/* Ventana de Chat Principal */}
            <NotionCard className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 relative border-gray-200">
                
                {!activeGroup ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <span className="text-6xl mb-4 animate-pulse opacity-40">🏢</span>
                        <p className="font-medium text-gray-500">Selecciona un grupo en la parte superior para iniciar la auditoría.</p>
                    </div>
                ) : (
                    <>
                        {/* Área de Historial */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
                                    <span className="text-5xl mb-4">💬</span>
                                    <p>Pregúntame sobre el Backlog, Dailys o entregables del {activeGroup.name}</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed font-sans">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 rounded-2xl p-4 rounded-tl-sm shadow-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Barra de Input Inferior */}
                        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto relative">
                                <button
                                    type="button"
                                    onClick={toggleDictation}
                                    className={`p-3 rounded-full transition-colors flex-shrink-0 ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    title="Dictar por voz"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                    </svg>
                                </button>
                                
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={isListening ? "Escuchando..." : "Consulta avances, dailys o documentos..."}
                                    className="flex-1 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full px-6 py-3 text-sm shadow-inner transition-all outline-none"
                                    disabled={isThinking}
                                />

                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isThinking}
                                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-200 flex-shrink-0"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </NotionCard>

            <EvaluationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                groups={groups}
                categories={categories}
                activeGroup={activeGroup}
                onGroupSelected={setActiveGroup}
                evalData={evalData}
                setEvalData={setEvalData}
                submitEvaluation={(e) => {
                    e.preventDefault();
                    postEval(route('groups.evaluate'), {
                        onSuccess: () => {
                            alert("¡Calificación guardada exitosamente!");
                            setIsModalOpen(false);
                            resetEval();
                        }
                    });
                }}
                processingEval={processingEval}
                evalErrors={evalErrors}
            />
        </div>
    );
}