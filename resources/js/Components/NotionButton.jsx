export default function NotionButton({ variant = 'primary', className = '', disabled, children, ...props }) {
    // Corregido el cursor-not-allowed
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Variantes adaptadas para el Dark Mode
    const variants = {
        primary: 'bg-notion-blue text-white hover:bg-blue-600 shadow-sm border border-transparent',
        secondary: 'bg-notion-sidebar text-notion-text border border-notion-border hover:bg-notion-hover shadow-sm',
        ghost: 'bg-transparent text-notion-textMuted hover:text-white hover:bg-notion-hover border border-transparent',
    };

    return (
        <button
            {...props}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}