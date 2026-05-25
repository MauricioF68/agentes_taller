import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function NotionInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const inputRef = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                `bg-notion-sidebar border-notion-border text-notion-text placeholder-notion-textMuted focus:border-notion-blue focus:ring-1 focus:ring-notion-blue rounded-md shadow-sm transition-colors ` +
                className
            }
            ref={inputRef}
        />
    );
});