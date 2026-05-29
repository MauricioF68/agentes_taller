import NotionCard from '@/Components/NotionCard';

export default function DocumentList({ documents, categories }) {
    const renderCategorySection = (title, categoryId) => {
        // Gracias al backend, docs solo traerá la última versión o nada.
        const latestDoc = documents.find(doc => doc.category_id === categoryId);

        return (
            <div className="mb-6 last:mb-0">
                <h4 className="font-semibold text-sm text-notion-text border-b border-notion-border pb-2 mb-3">
                    {title}
                </h4>
                {latestDoc ? (
                    <div className="border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50/30 transition-colors shadow-sm">
                        <div className="flex flex-col mb-2 sm:mb-0">
                            <span className="font-semibold text-sm text-blue-700">{latestDoc.original_name}</span>
                            <span className="text-xs text-blue-400 mt-0.5">Última versión activa sincronizada con IA</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {latestDoc.status_ai === 'pending' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-yellow-600 animate-pulse border border-yellow-200 shadow-sm">
                                    ⏳ Procesando en Motor IA...
                                </span>
                            )}
                            {latestDoc.status_ai === 'vectorized' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-sm shadow-green-200">
                                    ✅ Indexado en ChromaDB
                                </span>
                            )}
                            {latestDoc.status_ai === 'failed' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                                    ❌ Error - Volver a subir
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500 italic">Aún no se ha subido ningún archivo para este entregable.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <NotionCard>
            <h3 className="text-lg font-medium text-notion-text mb-6">Estado de los Entregables</h3>
            <div className="space-y-4">
                {categories && categories.map((cat) => (
                    <div key={cat.id}>
                        {renderCategorySection(cat.name, cat.id)}
                    </div>
                ))}
            </div>
        </NotionCard>
    );
}