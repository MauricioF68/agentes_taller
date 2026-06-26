import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeetingMinutes({ auth, group, minutes }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    
    const [currentMinute, setCurrentMinute] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingBacklog, setIsGeneratingBacklog] = useState(false);
    
    // Modal states for Meeting Minute
    const [showModal, setShowModal] = useState(false);
    const [structuredText, setStructuredText] = useState('');
    const [minuteTitle, setMinuteTitle] = useState('');

    // Modal states for Backlog Review
    const [showBacklogModal, setShowBacklogModal] = useState(false);
    const [backlogSuggestions, setBacklogSuggestions] = useState({ new_items: [], updated_items: [] });

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                audioChunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error al acceder al micrófono:', error);
            toast.error('No se pudo acceder al micrófono. Verifica los permisos.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const uploadAudio = async () => {
        if (!audioBlob) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('audio', audioBlob, 'meeting_audio.webm');

        try {
            const response = await axios.post(route('agile.minutes.upload', group.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCurrentMinute(response.data.minute);
            toast.success('Audio transcrito correctamente');
            router.reload({ only: ['minutes'] }); 
        } catch (error) {
            console.error(error);
            toast.error('Error al procesar el audio');
        } finally {
            setIsUploading(false);
            setAudioBlob(null);
        }
    };

    const generateStructuredMinute = async (minuteId) => {
        setIsGenerating(true);
        try {
            const response = await axios.post(route('agile.minutes.generate', [group.id, minuteId]));
            setStructuredText(response.data.structured_minute);
            setMinuteTitle('Acta - ' + new Date().toLocaleDateString());
            setCurrentMinute({id: minuteId});
            setShowModal(true);
            toast.success('Acta generada con IA');
        } catch (error) {
            console.error("Error en generateStructuredMinute:", error.response?.data || error.message);
            const serverError = error.response?.data?.error || 'Error al generar el acta estructurada. Revisa tu OpenAI API Key.';
            toast.error(serverError);
        } finally {
            setIsGenerating(false);
        }
    };

    const saveStructuredMinute = async () => {
        if (!currentMinute) return;
        
        try {
            await axios.put(route('agile.minutes.save', [group.id, currentMinute.id]), {
                title: minuteTitle,
                structured_minute: structuredText
            });
            toast.success('Acta guardada correctamente');
            setShowModal(false);
            setCurrentMinute(null);
            router.reload({ only: ['minutes'] });
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar el acta');
        }
    };

    const generateBacklog = async (minuteId) => {
        setIsGeneratingBacklog(true);
        try {
            const response = await axios.post(route('agile.minutes.generate_backlog', [group.id, minuteId]));
            setBacklogSuggestions({
                new_items: (response.data.new_items || []).map(item => ({...item, selected: true})),
                updated_items: (response.data.updated_items || []).map(item => ({...item, selected: true}))
            });
            setCurrentMinute({id: minuteId});
            setShowBacklogModal(true);
            toast.success('Sugerencias de Backlog generadas');
        } catch (error) {
            console.error(error);
            toast.error('Error al generar el backlog con IA.');
        } finally {
            setIsGeneratingBacklog(false);
        }
    };

    const applyBacklog = async () => {
        try {
            await axios.post(route('agile.minutes.apply_backlog', [group.id, currentMinute.id]), {
                new_items: backlogSuggestions.new_items.filter(i => i.selected),
                updated_items: backlogSuggestions.updated_items.filter(i => i.selected)
            });
            toast.success('Backlog actualizado correctamente');
            setShowBacklogModal(false);
            setCurrentMinute(null);
            router.visit(route('agile.backlog', group.id)); // Redirigir al backlog para ver los cambios
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar el backlog');
        }
    };

    const openExistingMinute = (minute) => {
        setCurrentMinute(minute);
        setMinuteTitle(minute.title || '');
        setStructuredText(minute.structured_minute || minute.transcription || '');
        setShowModal(true);
    };

    const updateSuggestionItem = (type, index, field, value) => {
        const newSuggestions = { ...backlogSuggestions };
        newSuggestions[type][index][field] = value;
        setBacklogSuggestions(newSuggestions);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Actas y Acuerdos - {group.name}</h2>}
        >
            <Head title={`Actas - ${group.name}`} />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
                
                {/* Panel de Grabación */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Nueva Acta de Reunión</h3>
                    <p className="text-gray-600 mb-6 text-sm">
                        Graba la conversación de tu reunión. El sistema transcribirá el audio y generará un acta estructurada automáticamente usando IA.
                    </p>

                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        {!isRecording && !audioBlob && !currentMinute && (
                            <button
                                onClick={startRecording}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg hover:bg-red-700 transition-all hover:scale-105"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                Iniciar Grabación
                            </button>
                        )}

                        {isRecording && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-3 text-red-600 font-bold animate-pulse">
                                    <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                                    Grabando...
                                </div>
                                <button
                                    onClick={stopRecording}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-bold shadow-lg hover:bg-gray-900 transition-all hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path></svg>
                                    Detener Grabación
                                </button>
                            </div>
                        )}

                        {audioBlob && !isUploading && !currentMinute && (
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-green-600 font-bold flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Grabación Finalizada
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setAudioBlob(null)}
                                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg font-bold hover:bg-gray-50"
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        onClick={uploadAudio}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        Transcribir Audio
                                    </button>
                                </div>
                            </div>
                        )}

                        {isUploading && (
                            <div className="text-indigo-600 font-bold flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Transcribiendo con Deepgram...
                            </div>
                        )}

                        {currentMinute && !showModal && !showBacklogModal && currentMinute.status === 'pending' && (
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 w-full text-center">
                                    <p className="font-bold">¡Audio transcrito con éxito!</p>
                                </div>
                                <div className="w-full bg-white p-4 rounded border text-sm text-gray-600 max-h-40 overflow-y-auto italic">
                                    "{currentMinute.transcription}"
                                </div>
                                <button
                                    onClick={() => generateStructuredMinute(currentMinute.id)}
                                    disabled={isGenerating}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 shadow flex items-center gap-2 disabled:opacity-50 mt-4"
                                >
                                    {isGenerating ? 'Analizando con IA...' : 'Generar Acta Estructurada'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lista de Actas */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Actas</h3>
                        {minutes.length === 0 ? (
                            <p className="text-gray-500 text-sm">No hay actas registradas para este grupo.</p>
                        ) : (
                            <div className="space-y-4">
                                {minutes.map((minute) => (
                                    <div key={minute.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition gap-4">
                                        <div>
                                            <h4 className="font-bold text-indigo-600">{minute.title || 'Acta sin título'}</h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Fecha: {new Date(minute.created_at).toLocaleDateString()} | Estado: 
                                                <span className={`ml-1 uppercase font-bold text-[10px] px-2 py-1 rounded-full ${minute.status === 'completed' || minute.status === 'backlog_generated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {minute.status}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {minute.status === 'pending' && (
                                                <button 
                                                    onClick={() => generateStructuredMinute(minute.id)}
                                                    className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded hover:bg-purple-100"
                                                >
                                                    Generar con IA
                                                </button>
                                            )}
                                            {minute.status === 'completed' && (
                                                <button 
                                                    onClick={() => generateBacklog(minute.id)}
                                                    disabled={isGeneratingBacklog}
                                                    className="text-sm font-bold text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700 shadow disabled:opacity-50 flex items-center gap-1"
                                                >
                                                    {isGeneratingBacklog ? 'Procesando...' : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                                            Generar Backlog IA
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => openExistingMinute(minute)}
                                                className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                                            >
                                                Ver Acta
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal para Revisión del Acta */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Revisión del Acta</h3>
                                    <p className="text-sm text-gray-500">Edita el contenido generado por la IA antes de guardar.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            
                            <div className="p-6 flex-1 overflow-y-auto space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Título del Acta</label>
                                    <input 
                                        type="text" 
                                        value={minuteTitle}
                                        onChange={(e) => setMinuteTitle(e.target.value)}
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Contenido Estructurado (Markdown)</label>
                                    <textarea 
                                        value={structuredText}
                                        onChange={(e) => setStructuredText(e.target.value)}
                                        className="w-full h-64 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm font-mono text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition"
                                >
                                    Cerrar
                                </button>
                                <button 
                                    onClick={saveStructuredMinute}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md transition"
                                >
                                    Guardar Acta
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal para Revisión del Backlog (Fase 3) */}
            <AnimatePresence>
                {showBacklogModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
                                <div>
                                    <h3 className="text-xl font-black text-indigo-900 flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                        Visto Bueno del Product Backlog
                                    </h3>
                                    <p className="text-sm text-indigo-700">La IA ha analizado el acta y sugiere los siguientes cambios. Modifícalos si es necesario.</p>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 overflow-y-auto space-y-8 bg-gray-50">
                                
                                {/* Nuevas Historias */}
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm">+{backlogSuggestions.new_items.length}</span>
                                        Nuevas Historias Sugeridas
                                    </h4>
                                    {backlogSuggestions.new_items.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">No hay historias nuevas sugeridas.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {backlogSuggestions.new_items.map((item, index) => (
                                                <div key={index} className={`bg-white p-4 rounded-xl shadow-sm border ${item.selected ? 'border-green-400' : 'border-gray-200 opacity-60'}`}>
                                                    <div className="flex justify-between items-start mb-3 border-b pb-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={item.selected} 
                                                                onChange={(e) => updateSuggestionItem('new_items', index, 'selected', e.target.checked)}
                                                                className="rounded text-green-600 focus:ring-green-500 w-5 h-5"
                                                            />
                                                            <span className="font-bold text-gray-700">Aprobar creación de esta historia</span>
                                                        </label>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="md:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Título</label>
                                                            <input 
                                                                type="text" 
                                                                value={item.title} 
                                                                onChange={(e) => updateSuggestionItem('new_items', index, 'title', e.target.value)}
                                                                className="w-full text-sm border-gray-300 rounded" 
                                                                disabled={!item.selected}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Tipo</label>
                                                            <select 
                                                                value={item.type} 
                                                                onChange={(e) => updateSuggestionItem('new_items', index, 'type', e.target.value)}
                                                                className="w-full text-sm border-gray-300 rounded"
                                                                disabled={!item.selected}
                                                            >
                                                                <option value="user_story">Historia de Usuario</option>
                                                                <option value="spike">Spike</option>
                                                                <option value="enabler">Habilitador (Enabler)</option>
                                                                <option value="nfr">Req. No Funcional (NFR)</option>
                                                                <option value="issue">Problema / Issue</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Puntos</label>
                                                            <input 
                                                                type="number" 
                                                                value={item.story_points || 1} 
                                                                onChange={(e) => updateSuggestionItem('new_items', index, 'story_points', parseInt(e.target.value))}
                                                                className="w-full text-sm border-gray-300 rounded"
                                                                disabled={!item.selected}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-4">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Descripción</label>
                                                            <textarea 
                                                                value={item.description} 
                                                                onChange={(e) => updateSuggestionItem('new_items', index, 'description', e.target.value)}
                                                                className="w-full text-sm border-gray-300 rounded h-16" 
                                                                disabled={!item.selected}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-3">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Criterios de Aceptación</label>
                                                            <textarea 
                                                                value={item.acceptance_criteria || ''} 
                                                                onChange={(e) => updateSuggestionItem('new_items', index, 'acceptance_criteria', e.target.value)}
                                                                className="w-full text-sm border-gray-300 rounded h-16" 
                                                                disabled={!item.selected}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-1">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">F. Vencimiento</label>
                                                            <input 
                                                                type="date" 
                                                                value={item.due_date || ''} 
                                                                onChange={(e) => updateSuggestionItem('new_items', index, 'due_date', e.target.value)}
                                                                className="w-full text-sm border-gray-300 rounded"
                                                                disabled={!item.selected}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actualizaciones */}
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">~{backlogSuggestions.updated_items.length}</span>
                                        Historias a Modificar
                                    </h4>
                                    {backlogSuggestions.updated_items.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">No hay modificaciones sugeridas.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {backlogSuggestions.updated_items.map((item, index) => (
                                                <div key={index} className={`bg-white p-4 rounded-xl shadow-sm border ${item.selected ? 'border-blue-400' : 'border-gray-200 opacity-60'}`}>
                                                    <div className="flex justify-between items-start mb-3 border-b pb-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={item.selected} 
                                                                onChange={(e) => updateSuggestionItem('updated_items', index, 'selected', e.target.checked)}
                                                                className="rounded text-blue-600 focus:ring-blue-500 w-5 h-5"
                                                            />
                                                            <span className="font-bold text-gray-700">Aprobar modificaciones de IA</span>
                                                        </label>
                                                        <span className="text-xs bg-blue-50 text-blue-700 font-bold p-1 px-2 rounded">Razón: {item.reason || 'Inferido de la reunión'}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="md:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Nuevo Título</label>
                                                            <input 
                                                                type="text" 
                                                                value={item.title} 
                                                                onChange={(e) => updateSuggestionItem('updated_items', index, 'title', e.target.value)}
                                                                className="w-full text-sm border-gray-300 rounded bg-blue-50/30" 
                                                                disabled={!item.selected}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Tipo</label>
                                                            <select 
                                                                value={item.type || 'user_story'} 
                                                                onChange={(e) => updateSuggestionItem('updated_items', index, 'type', e.target.value)}
                                                                className="w-full text-sm border-gray-300 rounded bg-blue-50/30"
                                                                disabled={!item.selected}
                                                            >
                                                                <option value="user_story">Historia de Usuario</option>
                                                                <option value="spike">Spike</option>
                                                                <option value="enabler">Habilitador</option>
                                                                <option value="nfr">Req. No Funcional (NFR)</option>
                                                                <option value="issue">Problema / Issue</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Puntos</label>
                                                            <input 
                                                                type="number" 
                                                                value={item.story_points || ''} 
                                                                onChange={(e) => updateSuggestionItem('updated_items', index, 'story_points', parseInt(e.target.value))}
                                                                className="w-full text-sm border-gray-300 rounded bg-blue-50/30"
                                                                placeholder="Mantener"
                                                                disabled={!item.selected}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-4">
                                                            <label className="block text-xs font-bold text-gray-500 uppercase">Criterios de Aceptación (Nuevos)</label>
                                                            <textarea 
                                                                value={item.acceptance_criteria} 
                                                                onChange={(e) => updateSuggestionItem('updated_items', index, 'acceptance_criteria', e.target.value)}
                                                                className="w-full text-sm border-gray-300 rounded h-16 bg-blue-50/30" 
                                                                disabled={!item.selected}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                            
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                                <button 
                                    onClick={() => setShowBacklogModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition"
                                >
                                    Cancelar Cambios
                                </button>
                                <button 
                                    onClick={applyBacklog}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md transition"
                                >
                                    Aprobar y Actualizar Backlog
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </AuthenticatedLayout>
    );
}
