import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import JoinGroupForm from '../Dashboard/Partials/JoinGroupForm';
import NotionCard from '@/Components/NotionCard';

export default function StudentGroups({ auth, myGroup, availableGroups }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-notion-text leading-tight">Mi Grupo</h2>}
        >
            <Head title="Gestión de Grupo" />

            <div className="space-y-6">
                {!myGroup ? (
                    <JoinGroupForm availableGroups={availableGroups} />
                ) : (
                    <NotionCard>
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-notion-text">Ya perteneces a: {myGroup.name}</h3>
                                <p className="text-sm text-notion-textMuted">
                                    Tu registro está completo. Ahora puedes subir documentos en el Panel de Control.
                                </p>
                            </div>
                        </div>
                    </NotionCard>
                )}
            </div>
        </AuthenticatedLayout>
    );
}