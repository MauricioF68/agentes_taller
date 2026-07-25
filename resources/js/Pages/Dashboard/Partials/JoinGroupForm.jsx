import { useForm } from '@inertiajs/react';
import NotionCard from '@/Components/NotionCard';
import NotionButton from '@/Components/NotionButton';

export default function JoinGroupForm({ availableGroups }) {
    const { data, setData, post, processing, errors } = useForm({
        group_id: '',
    });

    const submitJoin = (e) => {
        e.preventDefault();
        post(route('groups.join'));
    };

    return (
        <NotionCard>
            <h3 className="text-lg font-medium text-notion-text mb-4">Unirse a un Grupo</h3>
            <p className="text-sm text-notion-textMuted mb-6">
                Selecciona el grupo al que perteneces. Recuerda que esta acción es irreversible y el límite es de 5 integrantes.
            </p>
            
            <form onSubmit={submitJoin} className="flex gap-4 items-start max-w-xl">
                <div className="flex-1">
                    <select
                        name="group_id"
                        className="bg-notion-bg border-notion-border text-notion-text focus:border-notion-blue focus:ring-1 focus:ring-notion-blue rounded-md shadow-sm w-full"
                        value={data.group_id}
                        onChange={(e) => setData('group_id', e.target.value)}
                        required
                    >
                        <option value="" disabled>Selecciona un grupo...</option>
                        {availableGroups && availableGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name} (Docente: {group.teacher?.name})
                            </option>
                        ))}
                    </select>
                    {errors.group_id && <div className="text-red-500 text-sm mt-1">{errors.group_id}</div>}
                </div>
                <NotionButton variant="primary" type="submit" disabled={processing || !data.group_id}>
                    Unirme
                </NotionButton>
            </form>
        </NotionCard>
    );
}