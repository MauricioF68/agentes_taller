import { useForm } from '@inertiajs/react';

export default function UploadDocumentForm({ myGroup, categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        group_id: myGroup.id,
        category_id: categories?.length > 0 ? categories[0].id : '',
        file: null,
    });

    const submitDoc = (e) => {
        e.preventDefault();
        
        post(route('documents.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset('file');
                document.getElementById('file-input').value = '';
            }
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-50 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg">Subir Archivo</h4>
            </div>

            <form onSubmit={submitDoc} className="space-y-5 flex-grow flex flex-col">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Categoría del Entregable</label>
                    <select
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm transition-colors"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                        required
                    >
                        {categories && categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <div className="text-red-500 text-xs font-bold mt-1">{errors.category_id}</div>}
                </div>

                <div className="flex-grow flex flex-col justify-center">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Archivo (PDF, Word, TXT - Máx 20MB)</label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="file-input" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${data.file ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {data.file ? (
                                    <>
                                        <svg className="w-8 h-8 mb-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <p className="text-sm font-bold text-indigo-600 px-4 text-center truncate w-full max-w-[250px]">{data.file.name}</p>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                        <p className="mb-1 text-sm text-gray-500 font-medium"><span className="font-bold text-indigo-600">Haz clic para subir</span> o arrastra</p>
                                        <p className="text-xs text-gray-400 font-medium">PDF, DOCX, TXT</p>
                                    </>
                                )}
                            </div>
                            <input
                                id="file-input"
                                type="file"
                                className="hidden"
                                onChange={(e) => setData('file', e.target.files[0])}
                                required
                                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                            />
                        </label>
                    </div>
                    {errors.file && <div className="text-red-500 text-xs font-bold mt-1 text-center">{errors.file}</div>}
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={processing || !data.file}
                        className={`w-full flex items-center justify-center gap-2 font-bold rounded-xl text-sm px-5 py-3 text-center shadow-sm transition-all duration-200 active:scale-95 ${processing || !data.file ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'}`}
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                Enviar a la Inteligencia Artificial
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}