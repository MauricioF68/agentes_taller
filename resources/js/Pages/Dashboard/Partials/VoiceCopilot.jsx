import useVoiceAssistant from '@/Hooks/useVoiceAssistant';

export default function VoiceCopilot({ groups, categories, onQuestionCaptured }) {
    // Extraemos la lógica limpia desde nuestro Hook
    const { status, transcript, assistantMessage, toggleMicrophone } = useVoiceAssistant({
        groups,
        categories,
        onQuestionCaptured
    });

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Brillo de fondo dinámico */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 ${status === 'SLEEPING' ? 'bg-blue-500' : status === 'SPEAKING' ? 'bg-purple-500' : status === 'PROCESSING' ? 'bg-yellow-500' : status === 'OFF' ? 'bg-transparent' : 'bg-green-500'}`}></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                
                {/* BOTÓN DEL MICRÓFONO */}
                <button 
                    onClick={toggleMicrophone}
                    className={`relative flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 focus:outline-none ${status === 'OFF' ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-800 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]'}`}
                >
                    {/* Indicador visual de escucha mejorado: se mantiene estable si está despierto o durmiendo */}
                    {(status === 'SLEEPING' || status.startsWith('WAITING')) && (
                        <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-20"></div>
                    )}
                    
                    <svg className={`w-8 h-8 ${status !== 'OFF' ? 'text-blue-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    </svg>
                </button>

                {/* ESTADO VISUAL TEXTUAL */}
                <h3 className="text-xl font-semibold text-gray-100 mb-1 tracking-wide">
                    {status === 'OFF' && 'Asistente Desactivado'}
                    {status === 'SLEEPING' && 'Modo Reposo (Ey Sistema)'}
                    {status.startsWith('WAITING') && 'Escuchando...'}
                    {status === 'SPEAKING' && 'IA Hablando...'}
                    {status === 'PROCESSING' && 'Procesando...'}
                </h3>
                
                <p className="text-sm text-gray-400 h-10 italic max-w-sm">
                    "{assistantMessage}"
                </p>

                {transcript && status !== 'OFF' && (
                    <div className="mt-4 w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <p className="text-xs text-blue-300 font-mono text-left">
                            <span className="text-gray-500">Transcripción {'>'}</span> {transcript}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}