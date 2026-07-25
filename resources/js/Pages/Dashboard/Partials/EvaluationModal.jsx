import React from 'react';
import NotionInput from '@/Components/NotionInput';
import NotionButton from '@/Components/NotionButton';
import { Skull, Frown, CircleDot, AlertCircle, Smile, CheckCircle, BarChart3, X, Users, Folder, Check, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import VoiceToTextButton from '@/Components/VoiceToTextButton';

const COLOR_OPTIONS = [
    { value: 'calavera', icon: Skull, label: 'Crítico', colorClass: 'bg-slate-800 text-white border-slate-900 hover:bg-slate-900', iconColor: 'text-slate-100' },
    { value: 'enojado', icon: Frown, label: 'Deficiente', colorClass: 'bg-red-800 text-white border-red-900 hover:bg-red-900', iconColor: 'text-red-100' },
    { value: 'rojo', icon: AlertTriangle, label: 'Alerta', colorClass: 'bg-red-500 text-white border-red-600 hover:bg-red-600', iconColor: 'text-white' },
    { value: 'naranja', icon: AlertCircle, label: 'Precaución', colorClass: 'bg-orange-500 text-white border-orange-600 hover:bg-orange-600', iconColor: 'text-white' },
    { value: 'amarillo', icon: CircleDot, label: 'Regular', colorClass: 'bg-yellow-400 text-slate-900 border-yellow-500 hover:bg-yellow-500', iconColor: 'text-slate-900' },
    { value: 'verde', icon: CheckCircle, label: 'Óptimo', colorClass: 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600', iconColor: 'text-white' }
];

const getGroupIcon = (colorValue) => {
    const opt = COLOR_OPTIONS.find(o => o.value === colorValue);
    if (!opt) return <CircleDot className="w-4 h-4 text-slate-300" />;
    const Icon = opt.icon;
    return <Icon className={`w-4 h-4 ${opt.value === 'amarillo' ? 'text-yellow-600' : opt.iconColor}`} />;
};

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm font-sans">
            {/* Contenedor del Modal */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            >
                
                {/* Cabecera */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-600" />
                            Centro de Calificaciones y Auditoría
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">Selecciona un grupo para revisar sus entregables e ingresar la nota final.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

               
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
                    
                    
                    <div className="w-full md:w-1/3 border-r border-slate-100 p-5 overflow-y-auto bg-slate-50/30">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Equipos Asignados</h4>
                        <div className="space-y-2.5">
                            {groups && groups.map((group) => {
                                const evalColor = group.evaluation?.color_status;
                                return (
                                    <div 
                                        key={group.id} 
                                        onClick={() => onGroupSelected(group)}
                                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${activeGroup?.id === group.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                                    >
                                        <div className="font-semibold text-sm flex items-center gap-2.5">
                                            {getGroupIcon(evalColor)}
                                            {group.name}
                                        </div>
                                        <div className={`text-[11px] font-medium flex items-center gap-1.5 ${activeGroup?.id === group.id ? 'text-indigo-100' : 'text-slate-500'}`}>
                                            <Users className="w-3 h-3" />
                                            Integrantes: {group.students?.length || 0}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Columna Derecha: Detalle y Formulario */}
                    <div className="w-full md:w-2/3 p-8 overflow-y-auto flex flex-col justify-between">
                        {!activeGroup ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <BarChart3 className="w-12 h-12 mb-4 text-slate-300 opacity-50" />
                                <span className="text-sm font-medium">Por favor, selecciona un grupo de la izquierda para proceder con la evaluación.</span>
                            </div>
                        ) : (
                            <div className="space-y-8 flex-1 flex flex-col justify-between">
                                <div className="space-y-8">
                                    {/* Participantes desplegados */}
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Participantes del Grupo</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {activeGroup.students?.map(student => (
                                                <div key={student.id} className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs text-slate-700 flex flex-col gap-1">
                                                    <span className="font-bold text-slate-800">{student.name}</span>
                                                    <span className="text-slate-500 font-medium">{student.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Títulos de documentos con estados */}
                                    <div>
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Historial de Documentos</h4>
                                        <div className="space-y-2.5">
                                            {categories && categories.map((cat) => {
                                                const uploadedDoc = activeGroup.documents?.find(d => d.category_id === cat.id);
                                                return (
                                                    <div key={cat.id} className="flex justify-between items-center bg-white border border-slate-200 p-3.5 rounded-xl text-xs shadow-sm">
                                                        <div className="flex items-start gap-3">
                                                            <Folder className="w-4 h-4 text-slate-400 mt-0.5" />
                                                            <div>
                                                                <span className="font-bold text-slate-800 block mb-0.5">{cat.name}</span>
                                                                <span className="text-slate-500 font-medium">{uploadedDoc ? uploadedDoc.original_name : 'Sin archivos cargados'}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {uploadedDoc?.status_ai === 'vectorized' && (
                                                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                                                                    <Check className="w-3 h-3" /> Indexado
                                                                </span>
                                                            )}
                                                            {uploadedDoc?.status_ai === 'pending' && (
                                                                <span className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 animate-pulse">
                                                                    <Clock className="w-3 h-3" /> Procesando
                                                                </span>
                                                            )}
                                                            {!uploadedDoc && (
                                                                <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg font-medium border border-slate-200">
                                                                    Pendiente
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario de Calificación */}
                                <form onSubmit={submitEvaluation} className="pt-6 mt-6 space-y-6">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Evaluación (Estado de Salud del Proyecto)</label>
                                        <div className="flex flex-wrap gap-2.5">
                                            {COLOR_OPTIONS.map((opt) => {
                                                const Icon = opt.icon;
                                                const isSelected = evalData.color_status === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setEvalData('color_status', opt.value)}
                                                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center gap-2.5 transition-all shadow-sm ${
                                                            isSelected 
                                                                ? `${opt.colorClass} ring-2 ring-offset-2 ring-indigo-400 scale-105` 
                                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <Icon className={`w-4 h-4 ${isSelected ? opt.iconColor : 'text-slate-400'}`} />
                                                        <span>{opt.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        {evalErrors.color_status && <div className="text-red-500 text-xs mt-2 font-medium">{evalErrors.color_status}</div>}
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Veredicto de la Auditoría / Feedback</label>
                                            <VoiceToTextButton 
                                                onTranscription={(text) => setEvalData('feedback', (evalData.feedback ? evalData.feedback + ' ' : '') + text)} 
                                            />
                                        </div>
                                        <textarea 
                                            name="feedback"
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl shadow-sm h-24 resize-none p-3.5 text-sm font-medium transition-colors" 
                                            value={evalData.feedback} 
                                            onChange={(e) => setEvalData('feedback', e.target.value)} 
                                            placeholder="Escribe el veredicto técnico aquí..." 
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                        <NotionButton variant="secondary" type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold">Cancelar</NotionButton>
                                        <NotionButton variant="primary" type="submit" disabled={processingEval || !evalData.color_status} className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                                            {processingEval ? 'Guardando...' : 'Aprobar y Guardar Nota'}
                                        </NotionButton>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
        </div>
    );
}