import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
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
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-green-100 p-3 rounded-full">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-notion-text">Ya perteneces a: {myGroup.name}</h3>
                                <p className="text-sm text-notion-textMuted">
                                    Tu registro está completo. Ahora puedes subir documentos y gestionar tu backlog.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href={route('agile.backlog', myGroup.id)} className="block p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-800">📋 Backlog (Kanban)</h4>
                                    <p className="text-sm text-gray-500">Gestiona historias de usuario, spikes e issues.</p>
                                </div>
                                <span className="text-blue-500">→</span>
                            </Link>
                            
                            <Link href={route('agile.dailys', myGroup.id)} className="block p-4 border rounded-lg hover:bg-gray-50 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-800">📅 Dailys</h4>
                                    <p className="text-sm text-gray-500">Registra el avance diario de tu equipo.</p>
                                </div>
                                <span className="text-blue-500">→</span>
                            </Link>
                        </div>
                    </NotionCard>
                )}
            </div>
        </AuthenticatedLayout>
    );
}