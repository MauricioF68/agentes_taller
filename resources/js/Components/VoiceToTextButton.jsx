import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function VoiceToTextButton({ onTranscription, className = '' }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleToggleRecording = async (e) => {
        // Prevenir que el clic cierre modales accidentalmente o haga submits
        e.preventDefault();
        e.stopPropagation();

        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                audioChunksRef.current = [];
                await uploadAndTranscribe(blob);
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

    const uploadAndTranscribe = async (audioBlob) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice_note.webm');

        try {
            const response = await axios.post(route('voice.transcribe'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.text) {
                // Agregar un espacio inicial si ya hay texto en el destino puede ser útil, pero 
                // aquí solo devolvemos el texto puro. El padre decide cómo concatenarlo.
                onTranscription(response.data.text);
                toast.success('Dictado convertido a texto');
            }
        } catch (error) {
            console.error('Error detallado de dictado:', error.response?.data || error.message);
            const serverError = error.response?.data?.error || 'Error al transcribir la voz';
            toast.error(serverError);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggleRecording}
            disabled={isProcessing}
            title={isRecording ? "Detener grabación" : "Dictar por voz"}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all focus:outline-none ${
                isRecording 
                    ? 'bg-red-100 text-red-600 animate-pulse hover:bg-red-200' 
                    : isProcessing 
                        ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-110'
            } ${className}`}
        >
            {isProcessing ? (
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : isRecording ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path>
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
            )}
        </button>
    );
}
