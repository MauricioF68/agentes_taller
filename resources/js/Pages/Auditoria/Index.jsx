import { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NotionCard from '@/Components/NotionCard';
import axios from 'axios';
import { motion } from 'framer-motion';
import MetricsCard from '@/Components/MetricsCard';
import VoiceToTextButton from '@/Components/VoiceToTextButton';

export default function AuditoriaIndex({ auth, groups, categories }) {
    const [activeGroup, setActiveGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    
    const chatEndRef = useRef(null);

    // Si viene un grupo preseleccionado por parámetro URL (ej. desde Dashboard)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const groupId = urlParams.get('group_id');
        if (groupId && groups) {
            const group = groups.find(g => g.id === parseInt(groupId));
            if (group) setActiveGroup(group);
        }
    }, [groups]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);


    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim() || !activeGroup) return;

        const userMsg = inputText.trim();
        setInputText('');

        const newHistory = [...messages, { role: 'user', content: userMsg }];
        setMessages(newHistory);
        setIsThinking(true);

        try {
            const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));

            const response = await axios.post(route('agent.chat'), {
                group_id: activeGroup.id,
                category_slug: null,
                message: userMsg,
                history: historyPayload
            });

            const reply = response.data.reply;
            setMessages(prev => [...prev, { 
                role: 'model', 
                content: reply, 
                has_metrics: response.data.has_metrics, 
                metrics_data: response.data.metrics_data 
            }]);

        } catch (error) {
            console.error("Error consultando a la IA:", error);
            setMessages(prev => [...prev, { role: 'model', content: "⚠️ Ocurrió un error al conectar con el servidor RAG. Verifica tu conexión a Python." }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight flex items-center gap-2">🤖 Auditoría IA</h2>}
        >
            <Head title="Auditoría IA" />

            <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto">
                {/* Header Selector */}
                <div className="bg-white p-4 rounded-t-2xl shadow-sm border border-b-0 border-gray-200 flex justify-between items-center z-10 relative">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Asistente de Auditoría</h3>
                            <p className="text-xs text-gray-500">Consulta avances y documentos del equipo.</p>
                        </div>
                    </div>

                    <select 
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-gray-50"
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

                {/* Área de Chat */}
                <div className="flex-1 flex flex-col bg-gray-50 border border-gray-200 rounded-b-2xl shadow-sm overflow-hidden relative">
                    {!activeGroup ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <motion.div 
                                animate={{ y: [0, -10, 0] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mb-4 opacity-50"
                            >
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-600 mb-2">Bienvenido a la Auditoría RAG</h3>
                            <p className="font-medium text-gray-500">Selecciona un grupo en la parte superior para comenzar.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
                                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                        <p className="font-medium text-center">
                                            Soy tu asistente de IA.<br/>
                                            Pregúntame sobre el progreso de {activeGroup.name}
                                        </p>
                                    </div>
                                )}

                                {messages.map((msg, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                        key={idx} 
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                                            {msg.role === 'model' && <div className="text-[10px] uppercase font-bold text-indigo-500 mb-1">IA Assistant</div>}
                                            <p className="text-[15px] whitespace-pre-wrap leading-relaxed font-sans">
                                                {msg.content}
                                            </p>
                                            {msg.has_metrics && msg.metrics_data && (
                                                <div className="mt-4 border-t border-gray-100 pt-4">
                                                    <MetricsCard data={msg.metrics_data} />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {isThinking && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 rounded-2xl p-4 rounded-tl-sm shadow-sm flex items-center gap-2">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative">
                                    <VoiceToTextButton 
                                        onTranscription={(text) => setInputText(prev => prev + (prev ? ' ' : '') + text)} 
                                        className="w-12 h-12 flex-shrink-0"
                                        iconClassName="w-5 h-5"
                                    />
                                    
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder={`Consulta el estado de ${activeGroup.name}...`}
                                        className="flex-1 bg-gray-100/50 border-0 focus:ring-2 focus:ring-indigo-500 rounded-full px-6 py-4 text-[15px] shadow-inner transition-all outline-none"
                                        disabled={isThinking}
                                    />

                                    <button
                                        type="submit"
                                        disabled={!inputText.trim() || isThinking}
                                        className="p-3.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200 flex-shrink-0"
                                    >
                                        <svg className="w-5 h-5 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
