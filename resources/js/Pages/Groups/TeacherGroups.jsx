import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import NotionCard from '@/Components/NotionCard';
import NotionInput from '@/Components/NotionInput';
import NotionButton from '@/Components/NotionButton';

export default function TeacherGroups({ auth, groups }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('groups.store'), {
            onSuccess: () => reset('name'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-notion-text leading-tight">Configuración de Grupos</h2>}
        >
            <Head title="Gestión de Grupos" />

            <div className="space-y-6">
                <NotionCard>
                    <h3 className="text-lg font-medium text-notion-text mb-4">Crear Nuevo Grupo</h3>
                    <p className="text-sm text-notion-textMuted mb-4">Define el nombre del nuevo equipo de trabajo para este ciclo.</p>
                    <form onSubmit={submit} className="flex gap-4 items-start">
                        <div className="flex-1">
                            <NotionInput
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ej. Grupo Alpha - Proyecto X"
                                className="w-full block"
                                required
                            />
                            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                        </div>
                        <NotionButton variant="primary" type="submit" disabled={processing}>
                            {processing ? 'Creando...' : 'Crear Grupo'}
                        </NotionButton>
                    </form>
                </NotionCard>

                <NotionCard>
                    <h3 className="text-lg font-medium text-notion-text mb-4">Grupos bajo mi supervisión</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groups.map((group) => (
                            <div key={group.id} className="border border-notion-border rounded-md p-4 bg-notion-bg">
                                <h4 className="font-semibold text-notion-text">{group.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Integrantes registrados: {group.students?.length || 0} / 5
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Activo</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </NotionCard>
            </div>
        </AuthenticatedLayout>
    );
}