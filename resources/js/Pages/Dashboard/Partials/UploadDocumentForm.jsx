import { useForm } from '@inertiajs/react';
import NotionButton from '@/Components/NotionButton';

export default function UploadDocumentForm({ myGroup, categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        group_id: myGroup.id,
        category_id: categories?.length > 0 ? categories[0].id : '',
        file: null,
    });

    const submitDoc = (e) => {
        e.preventDefault();
        
        console.log("🚀 Enviando documento a Laravel:", data);

        post(route('documents.store'), {
            forceFormData: true, // Vital para enviar el archivo binario
            onSuccess: () => {
                console.log("✅ Laravel respondió con ÉXITO");
                reset('file');
                document.getElementById('file-input').value = '';
            },
            onError: (errs) => {
                console.error("❌ Laravel rechazó la petición. Errores de validación:", errs);
            }
        });
    };

    return (
        <>
            <h4 className="font-medium text-notion-text mb-3">Subir Documentación</h4>
            <form onSubmit={submitDoc} className="space-y-4 max-w-xl">
                <div>
                    <label className="block text-sm font-medium text-notion-text mb-1">Categoría</label>
                    <select
                        className="bg-notion-bg border-notion-border text-notion-text focus:border-notion-blue focus:ring-1 focus:ring-notion-blue rounded-md shadow-sm w-full"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        required
                    >
                        {categories && categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-notion-text mb-1">Archivo (PDF, Word, TXT - Máx 10MB)</label>
                    <input
                        id="file-input"
                        type="file"
                        className="block w-full text-sm text-notion-textMuted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-notion-blue file:text-white hover:file:bg-blue-600 cursor-pointer"
                        onChange={(e) => setData('file', e.target.files[0])}
                        required
                        accept=".pdf,.doc,.docx,.txt"
                    />
                    {errors.file && <div className="text-red-500 text-sm mt-1">{errors.file}</div>}
                </div>

                <NotionButton variant="primary" type="submit" disabled={processing || !data.file}>
                    {processing ? 'Subiendo...' : 'Subir Documento'}
                </NotionButton>
            </form>
        </>
    );
}