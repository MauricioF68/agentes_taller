import { useState, useRef, useEffect, useCallback } from 'react';

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
    
    // Nueva variable de memoria para la tolerancia a fallos
    const failedDocAttemptsRef = useRef(0);
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
                console.log('⏰ [TIMEOUT] 60 segundos sin actividad. Apagando sistema...');
                speak("Sistema apagado por inactividad.", 'OFF');
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

            recognition.onstart = () => {
                resetInactivityTimer();
            };
            
            recognition.onresult = (event) => {
                const currentTranscript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
                const currentStatus = statusRef.current; 
                
                console.log(`👂 [MIC] Captura: "${currentTranscript}" | Estado: ${currentStatus}`);
                setTranscript(currentTranscript);
                resetInactivityTimer(); 
                
                // COMANDO UNIVERSAL: APÁGATE
                if (currentTranscript.includes('apágate') || currentTranscript.includes('apagate')) {
                    activeGroupRef.current = null;
                    activeCategoryRef.current = null;
                    failedDocAttemptsRef.current = 0;
                    speak('Sistema apagado.', 'OFF');
                    return;
                }
                
                if (currentStatus === 'SLEEPING') {
                    if (currentTranscript.includes('sistema')) {
                        startConversation();
                    }
                } else if (currentStatus.startsWith('WAITING') || currentStatus.startsWith('CONFIRMING')) {
                    processVoiceInput(currentTranscript, currentStatus);
                }
            };

            recognition.onerror = (event) => {
                if (event.error === 'not-allowed') {
                    updateStatus('OFF');
                    setAssistantMessage("Permiso de micrófono denegado.");
                }
            };

            recognition.onend = () => {
                if (statusRef.current === 'SLEEPING' || statusRef.current.startsWith('WAITING') || statusRef.current.startsWith('CONFIRMING')) {
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

    // --------------------------------------------------------
    // ÁRBOL LÓGICO CONVERSACIONAL (Refactorizado)
    // --------------------------------------------------------
    const startConversation = () => {
        updateStatus('WAKING_UP');
        window.speechSynthesis.cancel(); 
        speak("Hola. Estoy lista, ¿qué grupo vamos a auditar?", 'WAITING_GROUP');
    };

    const processVoiceInput = (lowerText, currentStatus) => {
        
        // FASE 1: BÚSQUEDA DE GRUPO
        if (currentStatus === 'WAITING_GROUP') {
            const foundGroup = groupsRef.current.find(g => lowerText.includes(g.name.toLowerCase()));
            if (foundGroup) {
                activeGroupRef.current = foundGroup;
                speak(`Seleccioné ${foundGroup.name}. ¿Está bien o prefieres cambiar de grupo?`, 'CONFIRMING_GROUP');
            } else {
                speak("No reconocí ese grupo en la base de datos. Por favor, repítelo.", 'WAITING_GROUP');
            }
        } 
        
        // FASE 1.5: CONFIRMACIÓN DE GRUPO
        else if (currentStatus === 'CONFIRMING_GROUP') {
            // Si el usuario quiere cambiar
            if (lowerText.includes('cambiar') || lowerText.includes('no') || lowerText.includes('otro')) {
                // ¿Mencionó el grupo nuevo en la misma frase? (Ej: "No, cambiar al grupo 2")
                const foundGroup = groupsRef.current.find(g => lowerText.includes(g.name.toLowerCase()));
                if (foundGroup) {
                    activeGroupRef.current = foundGroup;
                    speak(`Entendido, cambié a ${foundGroup.name}. ¿Continuamos con este?`, 'CONFIRMING_GROUP');
                } else {
                    speak("De acuerdo. ¿A qué grupo quieres cambiar?", 'WAITING_GROUP');
                }
            } 
            // Si el usuario acepta
            else if (lowerText.includes('sí') || lowerText.includes('si') || lowerText.includes('bien') || lowerText.includes('ok') || lowerText.includes('correcto') || lowerText.includes('avanza')) {
                failedDocAttemptsRef.current = 0; // Reiniciamos fallos
                speak("Perfecto. ¿Qué entregable revisamos?", 'WAITING_CATEGORY');
            } else {
                speak("No te entendí bien. ¿Continuamos con este grupo o cambiamos?", 'CONFIRMING_GROUP');
            }
        }

        // FASE 2: BÚSQUEDA DE DOCUMENTO
        else if (currentStatus === 'WAITING_CATEGORY') {
            // Escape Hatch: Cambiar de grupo en medio del proceso
            if (lowerText.includes('cambiar de grupo') || lowerText.includes('otro grupo')) {
                // ¿Mencionó el grupo?
                const foundGroup = groupsRef.current.find(g => lowerText.includes(g.name.toLowerCase()));
                if (foundGroup) {
                    activeGroupRef.current = foundGroup;
                    speak(`Entendido, saltamos a ${foundGroup.name}. ¿Qué documento revisamos de este equipo?`, 'WAITING_CATEGORY');
                } else {
                    speak("De acuerdo, abortando búsqueda de documento. ¿A qué grupo cambiamos?", 'WAITING_GROUP');
                }
                return;
            }

            const foundCategory = categoriesRef.current.find(c => lowerText.includes(c.name.toLowerCase()));
            
            if (foundCategory) {
                // VALIDACIÓN CRÍTICA: ¿El alumno subió el archivo?
                const hasDocument = activeGroupRef.current?.documents?.some(d => d.category_id === foundCategory.id);
                
                if (hasDocument) {
                    activeCategoryRef.current = foundCategory;
                    failedDocAttemptsRef.current = 0; 
                    speak(`Excelente. Abriendo ${foundCategory.name}. ¿Cuál es tu consulta para la auditoría?`, 'WAITING_QUESTION');
                } else {
                    failedDocAttemptsRef.current += 1;
                    let msg = `El equipo no ha subido el documento de ${foundCategory.name}. Por favor, busca otro entregable.`;
                    if (failedDocAttemptsRef.current >= 2) {
                        msg += " Si lo prefieres, dime 'Cambiar de grupo'.";
                    }
                    speak(msg, 'WAITING_CATEGORY');
                }
            } else {
                failedDocAttemptsRef.current += 1;
                let msg = "No encontré esa categoría de documento.";
                if (failedDocAttemptsRef.current >= 2) {
                    msg += " Recuerda que puedes decir 'Cambiar de grupo' para evaluar a otro equipo.";
                }
                speak(msg, 'WAITING_CATEGORY');
            }
        }

        // FASE 3: PREGUNTA (RAG)
        else if (currentStatus === 'WAITING_QUESTION') {
            updateStatus('PROCESSING');
            setAssistantMessage("Consultando base de datos vectorial...");
            try { recognitionRef.current?.stop(); } catch(e) {} 
            if (timeoutRef.current) clearTimeout(timeoutRef.current); 
            
            onQuestionCaptured(
                activeGroupRef.current, 
                activeCategoryRef.current, 
                lowerText, 
                () => {
                    updateStatus('SLEEPING'); 
                    try { recognitionRef.current?.start(); } catch(e) {}
                    resetInactivityTimer();
                }
            ); 
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

    return {
        status,
        transcript,
        assistantMessage,
        toggleMicrophone
    };
}