import { useForm } from '@inertiajs/react';
import NotionCard from '@/Components/NotionCard';
import NotionButton from '@/Components/NotionButton';
import StatusBadge from '@/Components/StatusBadge';

export default function StudentView({ myGroup, availableGroups }) {
    const { data: joinData, setData: setJoinData, post: postJoin, processing: processingJoin, errors: errorsJoin } = useForm({
        group_id: '',
    });

    const { data: docData, setData: setDocData, post: postDoc, processing: processingDoc, errors: errorsDoc, reset: resetDoc } = useForm({
        group_id: myGroup ? myGroup.id : '',
        category: 'project_charter',
        file: null,
    });

    const submitJoin = (e) => {
        e.preventDefault();
        postJoin(route('groups.join'));
    };

    const submitDoc = (e) => {
        e.preventDefault();
        postDoc(route('documents.store'), {
            onSuccess: () => resetDoc('file'),
        });
    };

    // Función auxiliar para renderizar cada categoría de forma separada
    const renderCategorySection = (title, categoryKey) => {
        const docs = myGroup.documents?.filter(doc => doc.category === categoryKey) || [];

        return (
            <div className="mb-6 last:mb-0">
                <h4 className="font-semibold text-sm text-notion-text border-b border-notion-border pb-2 mb-3">
                    {title}
                </h4>
                {docs.length > 0 ? (
                    <div className="space-y-2">
                        {docs.map((doc) => (
                            <div key={doc.id} className="border border-notion-border rounded-md p-3 flex justify-between items-center bg-notion-bg transition-colors hover:bg-notion-hover">
                                <span className="font-medium text-sm text-notion-text">{doc.original_name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-notion-textMuted italic">Aún no se han subido archivos aquí.</p>
                )}
            </div>
        );
    };

    if (!myGroup) {
        return (
            <NotionCard>
                <h3 className="text-lg font-medium text-notion-text mb-4">Unirse a un Grupo</h3>
                <p className="text-sm text-notion-textMuted mb-6">Selecciona el grupo al que perteneces. Recuerda que esta acción es irreversible y el límite es de 5 integrantes.</p>
                
                <form onSubmit={submitJoin} className="flex gap-4 items-start max-w-xl">
                    <div className="flex-1">
                        <select
                            className="bg-notion-bg border-notion-border text-notion-text focus:border-notion-blue focus:ring-1 focus:ring-notion-blue rounded-md shadow-sm w-full"
                            value={joinData.group_id}
                            onChange={(e) => setJoinData('group_id', e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecciona un grupo...</option>
                            {availableGroups && availableGroups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.name} (Docente: {group.teacher?.name})
                                </option>
                            ))}
                        </select>
                        {errorsJoin.group_id && <div className="text-red-500 text-sm mt-1">{errorsJoin.group_id}</div>}
                    </div>
                    <NotionButton variant="primary" type="submit" disabled={processingJoin || !joinData.group_id}>
                        Unirme
                    </NotionButton>
                </form>
            </NotionCard>
        );
    }

    return (
        <div className="space-y-6">
            <NotionCard>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-notion-text">Mi Grupo: {myGroup.name}</h3>
                    <StatusBadge status="alumno" />
                </div>
                
                <hr className="border-notion-border mb-4" />
                
                <h4 className="font-medium text-notion-text mb-3">Subir Documentación</h4>
                <form onSubmit={submitDoc} className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm font-medium text-notion-text mb-1">Categoría</label>
                        <select
                            className="bg-notion-bg border-notion-border text-notion-text focus:border-notion-blue focus:ring-1 focus:ring-notion-blue rounded-md shadow-sm w-full"
                            value={docData.category}
                            onChange={(e) => setDocData('category', e.target.value)}
                            required
                        >
                            <option value="project_charter">Project Charter</option>
                            <option value="presentacion_avances">Presentación de Avances</option>
                            <option value="ceremonias_acuerdos">Ceremonias y Acuerdos</option>
                        </select>
                        {errorsDoc.category && <div className="text-red-500 text-sm mt-1">{errorsDoc.category}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-notion-text mb-1">Archivo (PDF, Word, TXT - Máx 10MB)</label>
                        <input
                            type="file"
                            className="block w-full text-sm text-notion-textMuted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-notion-blue file:text-white hover:file:bg-blue-600 cursor-pointer"
                            onChange={(e) => setDocData('file', e.target.files[0])}
                            required
                            accept=".pdf,.doc,.docx,.txt"
                        />
                        {errorsDoc.file && <div className="text-red-500 text-sm mt-1">{errorsDoc.file}</div>}
                    </div>

                    <NotionButton variant="primary" type="submit" disabled={processingDoc || !docData.file}>
                        Subir Documento
                    </NotionButton>
                </form>
            </NotionCard>

            <NotionCard>
                <h3 className="text-lg font-medium text-notion-text mb-6">Documentos Subidos</h3>
                
                {/* Categorías divididas lógicamente */}
                {renderCategorySection('Project Charter', 'project_charter')}
                {renderCategorySection('Presentación de Avances', 'presentacion_avances')}
                {renderCategorySection('Ceremonias y Acuerdos', 'ceremonias_acuerdos')}
                
            </NotionCard>
        </div>
    );
}