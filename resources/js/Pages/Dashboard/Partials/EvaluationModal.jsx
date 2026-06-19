import NotionInput from '@/Components/NotionInput';
import NotionButton from '@/Components/NotionButton';

const EMOJI_MAP = {
    calavera: '💀',
    enojado: '😡',
    rojo: '🔴',
    naranja: '🟠',
    amarillo: '🟡',
    verde: '🟢'
};

const COLOR_OPTIONS = [
    { value: 'calavera', emoji: '💀', label: 'Calavera', colorClass: 'bg-gray-800 text-white border-gray-900 hover:bg-gray-900' },
    { value: 'enojado', emoji: '😡', label: 'Enojado', colorClass: 'bg-red-800 text-white border-red-900 hover:bg-red-900' },
    { value: 'rojo', emoji: '🔴', label: 'Rojo', colorClass: 'bg-red-500 text-white border-red-600 hover:bg-red-600' },
    { value: 'naranja', emoji: '🟠', label: 'Naranja', colorClass: 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600' },
    { value: 'amarillo', emoji: '🟡', label: 'Amarillo', colorClass: 'bg-yellow-400 text-gray-900 border-yellow-500 hover:bg-yellow-500' },
    { value: 'verde', emoji: '🟢', label: 'Verde', colorClass: 'bg-green-500 text-white border-green-600 hover:bg-green-600' }
];

export default function EvaluationModal({ 
    isOpen, 
    onClose, 
    groups, 
    categories, 
    activeGroup, 
    onGroupSelected, 
    evalData, 
    setEvalData, 
    submitEvaluation, 
    processingEval, 
    evalErrors 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* Contenedor del Modal */}
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Cabecera */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            📊 Centro de Calificaciones y Auditoría
                        </h3>
                        <p className="text-xs text-gray-500">Selecciona un grupo para revisar sus entregables e ingresar la nota final.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-xl font-medium p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

               
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    
                    <div className="w-full md:w-1/3 border-r border-gray-100 p-4 overflow-y-auto bg-gray-50/50">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Equipos Asignados</h4>
                        <div className="space-y-2">
                            {groups && groups.map((group) => {
                                const evalColor = group.evaluation?.color_status;
                                const emoji = evalColor ? EMOJI_MAP[evalColor] : '⚪';
                                return (
                                    <div 
                                        key={group.id} 
                                        onClick={() => onGroupSelected(group)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer ${activeGroup?.id === group.id ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-700'}`}
                                    >
                                        <div className="font-semibold text-sm flex items-center gap-2">
                                            <span>{emoji}</span> {group.name}
                                        </div>
                                        <div className={`text-xs mt-1 ${activeGroup?.id === group.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                            Integrantes: {group.students?.length || 0}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Columna Derecha: Detalle y Formulario */}
                    <div className="w-full md:w-2/3 p-6 overflow-y-auto flex flex-col justify-between">
                        {!activeGroup ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                                <span className="text-4xl mb-2">📋</span>
                                Por favor, selecciona un grupo de la izquierda para proceder con la evaluación.
                            </div>
                        ) : (
                            <div className="space-y-6 flex-1 flex flex-col justify-between">
                                <div className="space-y-5">
                                    {/* Participantes desplegados */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Participantes del Grupo</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {activeGroup.students?.map(student => (
                                                <div key={student.id} className="bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-xs text-gray-700 flex flex-col">
                                                    <span className="font-semibold text-gray-800">{student.name}</span>
                                                    <span className="text-gray-400 font-mono">{student.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Títulos de documentos con estados */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Títulos e Historial de Documentos</h4>
                                        <div className="space-y-2">
                                            {categories && categories.map((cat) => {
                                                // Buscamos si el grupo ya subió un documento para esta categoría
                                                const uploadedDoc = activeGroup.documents?.find(d => d.category_id === cat.id);
                                                return (
                                                    <div key={cat.id} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-xl text-xs shadow-sm">
                                                        <div>
                                                            <span className="font-semibold text-gray-700 block">{cat.name}</span>
                                                            <span className="text-gray-400">{uploadedDoc ? `📁 ${uploadedDoc.original_name}` : '❌ Sin archivos cargados'}</span>
                                                        </div>
                                                        <div>
                                                            {uploadedDoc?.status_ai === 'vectorized' && (
                                                                <span className="bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full font-medium">Indexado en VectorDB</span>
                                                            )}
                                                            {uploadedDoc?.status_ai === 'pending' && (
                                                                <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-2.5 py-1 rounded-full font-medium animate-pulse">Procesando...</span>
                                                            )}
                                                            {!uploadedDoc && (
                                                                <span className="bg-gray-100 text-gray-400 px-2.5 py-1 rounded-full">Pendiente entrega</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario de Calificación */}
                                <form onSubmit={submitEvaluation} className="border-t border-gray-100 pt-5 mt-auto space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Evaluación (Estado de Salud del Proyecto)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {COLOR_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setEvalData('color_status', opt.value)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 transition-all shadow-sm ${
                                                        evalData.color_status === opt.value 
                                                            ? `${opt.colorClass} ring-2 ring-offset-2 ring-blue-400 scale-105` 
                                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span className="text-lg">{opt.emoji}</span>
                                                    <span>{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                        {evalErrors.color_status && <div className="text-red-500 text-xs mt-2">{evalErrors.color_status}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Veredicto de la Auditoría / Feedback</label>
                                        <textarea 
                                            className="w-full bg-notion-bg border-notion-border text-notion-text focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm h-16 resize-none pt-2.5 px-3 text-sm" 
                                            value={evalData.feedback} 
                                            onChange={(e) => setEvalData('feedback', e.target.value)} 
                                            placeholder="Escribe el veredicto técnico aquí..." 
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-50">
                                        <NotionButton variant="secondary" type="button" onClick={onClose}>Cancelar</NotionButton>
                                        <NotionButton variant="primary" type="submit" disabled={processingEval || !evalData.color_status}>
                                            {processingEval ? 'Guardando...' : 'Aprobar y Guardar Nota'}
                                        </NotionButton>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}