import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TeacherView from './Dashboard/TeacherView.jsx'; 
import StudentView from './Dashboard/StudentView.jsx'; 

export default function Dashboard({ auth, role, teacherGroups, myGroup, availableGroups, categories}) {
    // Extraemos los mensajes flash (éxito/error) desde las props compartidas de Laravel
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-notion-text leading-tight">Panel de Control</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Alertas de Éxito / Error */}
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {flash.error}
                        </div>
                    )}

                    {/* Renderizado Condicional por Roles */}
                    {role === 'docente' && (
                        <TeacherView groups={teacherGroups} categories={categories} />
                    )}
                    
                    {role === 'alumno' && (
                        <StudentView myGroup={myGroup} availableGroups={availableGroups} categories={categories} />
                    )}
                    
                    {!role && (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                            Tu cuenta no tiene un rol asignado. Contacta al administrador.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}