import { useForm } from '@inertiajs/react';
import NotionCard from '@/Components/NotionCard';
import NotionInput from '@/Components/NotionInput';
import NotionButton from '@/Components/NotionButton';
import StatusBadge from '@/Components/StatusBadge';

export default function TeacherView({ groups }) {
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
        <div className="space-y-6">
            <NotionCard>
                <h3 className="text-lg font-medium text-notion-text mb-4">Crear Nuevo Grupo</h3>
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
                        Crear Grupo
                    </NotionButton>
                </form>
            </NotionCard>

            <NotionCard>
                <h3 className="text-lg font-medium text-notion-text mb-4">Mis Grupos Creados</h3>
                {groups && groups.length > 0 ? (
                    <div className="space-y-4">
                        {groups.map((group) => (
                            <div key={group.id} className="border border-notion-border rounded-md p-4 flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-notion-text">{group.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">Integrantes: {group.students ? group.students.length : 0} / 5</p>
                                </div>
                                <StatusBadge status="docente" className="hidden sm:inline-flex" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Aún no has creado ningún grupo.</p>
                )}
            </NotionCard>
        </div>
    );
}