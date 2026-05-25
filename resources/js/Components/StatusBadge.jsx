export default function StatusBadge({ status, className = '' }) {
    const getStyles = () => {
        switch (status?.toLowerCase()) {
            // Colores de Evaluación
            case 'verde':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'naranja':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'rojo':
                return 'bg-red-100 text-red-800 border-red-200';
            // Colores de Roles
            case 'docente':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'alumno':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles()} ${className}`}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
        </span>
    );
}