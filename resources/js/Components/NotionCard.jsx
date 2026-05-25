export default function NotionCard({ children, className = '' }) {
    return (
        <div className={`bg-notion-sidebar border border-notion-border rounded-md shadow-sm p-6 ${className}`}>
            {children}
        </div>
    );
}