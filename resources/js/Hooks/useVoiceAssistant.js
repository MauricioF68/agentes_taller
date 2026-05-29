// resources/js/Hooks/useVoiceAssistant.js
import { useState, useRef, useEffect, useCallback } from 'react';
import { VoiceBrain } from '@/Utils/VoiceBrain';

export default function useVoiceAssistant({ groups, categories, onQuestionCaptured }) {
    const [status, setStatus] = useState('OFF'); 
    const [transcript, setTranscript] = useState('');
    const [assistantMessage, setAssistantMessage] = useState('Sistema apagado. Enciende el micrófono para comenzar.');
    
    const statusRef = useRef('OFF');
    const groupsRef = useRef(groups);
    const categoriesRef = useRef(categories);
    const recognitionRef = useRef(null);
    
    const activeGroupRef = useRef(null);
    const activeCategoryRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        groupsRef.current = groups;
        categoriesRef.current = categories;
    }, [groups, categories]);

    const updateStatus = useCallback((newStatus) => {
        setStatus(newStatus);
        statusRef.current = newStatus;
    }, []);

    const resetInactivityTimer = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (statusRef.current !== 'OFF') {
                console.log('⏰ [TIMEOUT] Inactividad detectada. Durmiendo micrófono...');
                speak("Sistema en reposo por inactividad.", 'SLEEPING');
            }
        }, 60000); 
    }, []);

    const speak = useCallback((text, nextStatus = 'SLEEPING') => {
        console.log(`🗣️ [SISTEMA HABLA]: "${text}"`);
        updateStatus('SPEAKING');
        setAssistantMessage(text);
        
        try { recognitionRef.current?.stop(); } catch (e) {}

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        
        const voices = window.speechSynthesis.getVoices();
        const betterVoice = voices.find(v => v.name.includes('Google español') || v.name.includes('es-ES'));
        if (betterVoice) utterance.voice = betterVoice;
        
        utterance.rate = 1.0; 
        utterance.pitch = 1.0; 

        utterance.onend = () => {
            updateStatus(nextStatus);
            if (nextStatus !== 'PROCESSING' && nextStatus !== 'OFF') {
                try { recognitionRef.current?.start(); } catch (e) {}
                resetInactivityTimer();
            } else if (nextStatus === 'OFF') {
                try { recognitionRef.current?.stop(); } catch (e) {}
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }
        };

        window.speechSynthesis.speak(utterance);
    }, [updateStatus, resetInactivityTimer]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true; 
            recognition.lang = 'es-ES';
            recognition.interimResults = false;

            recognition.onstart = () => resetInactivityTimer();
            
            recognition.onresult = (event) => {
                const currentTranscript = event.results[event.results.length - 1][0].transcript.trim();
                const currentStatus = statusRef.current; 
                
                console.log(`👂 [MIC] Captura: "${currentTranscript}" | Estado: ${currentStatus}`);
                setTranscript(currentTranscript);
                resetInactivityTimer(); 
                
                if (currentTranscript.toLowerCase().includes('apágate') || currentTranscript.toLowerCase().includes('apagate')) {
                    activeGroupRef.current = null;
                    activeCategoryRef.current = null;
                    speak('Sistema apagado.', 'OFF');
                    return;
                }
                
                if (currentStatus === 'SLEEPING') {
                    if (currentTranscript.toLowerCase().includes('sistema')) {
                        startConversation();
                    }
                } else if (currentStatus.startsWith('WAITING') || currentStatus.startsWith('CONFIRMING')) {
                    processVoiceInput(currentTranscript, currentStatus);
                }
            };

            recognition.onerror = () => {};

            recognition.onend = () => {
                const s = statusRef.current;
                if (s === 'SLEEPING' || s.startsWith('WAITING') || s === 'CONFIRMING_GROUP') {
                    try { recognition.start(); } catch (e) {}
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            try { recognitionRef.current?.stop(); } catch(e) {}
        };
    }, [speak, updateStatus, resetInactivityTimer]); 

    const startConversation = () => {
        updateStatus('WAKING_UP');
        window.speechSynthesis.cancel(); 
        speak("Hola. Estoy lista, ¿qué grupo vamos a auditar?", 'WAITING_GROUP');
    };

    const processVoiceInput = (rawText, currentStatus) => {
        
        // FASE 1: BÚSQUEDA DE GRUPO
        if (currentStatus === 'WAITING_GROUP') {
            const foundGroup = groupsRef.current.find(g => VoiceBrain.normalize(rawText).includes(VoiceBrain.normalize(g.name)));
            if (foundGroup) {
                activeGroupRef.current = foundGroup;
                speak(`Seleccioné ${foundGroup.name}. ¿Está bien o prefieres cambiar de grupo?`, 'CONFIRMING_GROUP');
            } else {
                speak("No reconocí ese grupo en la base de datos. Por favor, repítelo.", 'WAITING_GROUP');
            }
        } 
        
        // FASE 1.5: CONFIRMACIÓN DE GRUPO
        else if (currentStatus === 'CONFIRMING_GROUP') {
            if (VoiceBrain.isNegativeOrChange(rawText)) {
                activeGroupRef.current = null;
                speak("De acuerdo. ¿A qué grupo quieres cambiar?", 'WAITING_GROUP');
            } 
            else if (VoiceBrain.isAffirmative(rawText)) {
                speak("Perfecto. ¿Qué entregable revisamos?", 'WAITING_CATEGORY');
            } else {
                speak("No te entendí bien. ¿Continuamos con este grupo o prefieres cambiar?", 'CONFIRMING_GROUP');
            }
        }

        // FASE 2: SELECCIÓN DE CATEGORÍA (CON MATCH PARCIAL)
        else if (currentStatus === 'WAITING_CATEGORY') {
            if (VoiceBrain.isChangeGroup(rawText)) {
                activeGroupRef.current = null;
                speak("Cambiando de equipo. ¿A qué grupo pasamos?", 'WAITING_GROUP');
                return;
            }

            if (VoiceBrain.isHelp(rawText)) {
                const helpText = VoiceBrain.generateCategoryHelpText(categoriesRef.current);
                speak(helpText, 'WAITING_CATEGORY');
                return;
            }

            // Aplicamos coincidencia parcial inteligente
            const foundCategory = VoiceBrain.findPartialCategory(rawText, categoriesRef.current);
            
            if (foundCategory) {
                const hasDocument = activeGroupRef.current?.documents?.some(d => d.category_id === foundCategory.id);
                
                if (hasDocument) {
                    activeCategoryRef.current = foundCategory;
                    speak(`Excelente. Abriendo ${foundCategory.name}. ¿Cuál es tu consulta para la auditoría?`, 'WAITING_QUESTION');
                } else {
                    speak(`El equipo no tiene un archivo en ${foundCategory.name}. Elige otra categoría o di 'ver opciones'.`, 'WAITING_CATEGORY');
                }
            } else {
                speak("No entendí la categoría. Puedes decir 'listar' para ayudarte.", 'WAITING_CATEGORY');
            }
        }

        // FASE 3: CAPTURA DE PREGUNTA DIRECTA
        else if (currentStatus === 'WAITING_QUESTION') {
            if (VoiceBrain.isChangeCategory(rawText)) {
                activeCategoryRef.current = null;
                speak("Cambiando entregable. ¿Cuál revisamos ahora?", 'WAITING_CATEGORY');
                return;
            }
            if (VoiceBrain.isChangeGroup(rawText)) {
                activeGroupRef.current = null;
                activeCategoryRef.current = null;
                speak("Cambiando de grupo. ¿Qué número de equipo auditamos?", 'WAITING_GROUP');
                return;
            }

            // Es una pregunta real para el RAG
            updateStatus('PROCESSING');
            setAssistantMessage("Consultando base de datos vectorial...");
            try { recognitionRef.current?.stop(); } catch(e) {} 
            if (timeoutRef.current) clearTimeout(timeoutRef.current); 
            
            onQuestionCaptured(
                activeGroupRef.current, 
                activeCategoryRef.current, 
                rawText, 
                (nextStatus = 'WAITING_NEXT_ACTION') => { 
                    updateStatus(nextStatus); 
                    if (nextStatus !== 'OFF') {
                        try { recognitionRef.current?.start(); } catch(e) {}
                        resetInactivityTimer();
                    }
                }
            ); 
        }

        // FASE 4: BUCLE FLUIDO POST-RAG (La gran mejora)
        else if (currentStatus === 'WAITING_NEXT_ACTION') {
            if (VoiceBrain.isChangeGroup(rawText)) {
                activeGroupRef.current = null;
                activeCategoryRef.current = null;
                speak("Entendido. ¿Qué grupo pasamos a auditar?", 'WAITING_GROUP');
            }
            else if (VoiceBrain.isChangeCategory(rawText)) {
                activeCategoryRef.current = null;
                speak("Perfecto. ¿Qué entregable revisamos ahora?", 'WAITING_CATEGORY');
            }
            else {
                // ¡MÁGICA RETENCIÓN DIRECTA! Si el usuario no pidió cambiar de grupo ni de archivo,
                // procesamos sus palabras directamente como una nueva PREGUNTA sobre el mismo archivo.
                console.log("🔥 Ejecutando consulta directa en bucle fluido:", rawText);
                
                updateStatus('PROCESSING');
                setAssistantMessage("Procesando consulta continua...");
                try { recognitionRef.current?.stop(); } catch(e) {}
                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                onQuestionCaptured(
                    activeGroupRef.current,
                    activeCategoryRef.current,
                    rawText, // El texto hablado es la pregunta inmediata
                    (nextStatus = 'WAITING_NEXT_ACTION') => {
                        updateStatus(nextStatus);
                        if (nextStatus !== 'OFF') {
                            try { recognitionRef.current?.start(); } catch(e) {}
                            resetInactivityTimer();
                        }
                    }
                );
            }
        }
    };

    const toggleMicrophone = () => {
        if (statusRef.current === 'OFF') {
            updateStatus('SLEEPING');
            setAssistantMessage('Escuchando en segundo plano. Di "Ey Sistema" para despertar.');
            setTranscript('');
            resetInactivityTimer();
            try { recognitionRef.current?.start(); } catch(e) {}
        } else {
            updateStatus('OFF');
            setAssistantMessage('Sistema apagado.');
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            try { recognitionRef.current?.stop(); } catch(e) {}
        }
    };

    return { status, transcript, assistantMessage, toggleMicrophone };
}