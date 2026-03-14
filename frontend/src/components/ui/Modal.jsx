import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`
            relative bg-white/80 dark:bg-[#181825]/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 dark:border-white/10
            w-full ${sizes[size]}
            transform transition-all overflow-hidden
          `}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-pink-500/5 pointer-events-none" />
                    
                    <div className="relative flex items-center justify-between px-8 py-6 border-b border-gray-200/50 dark:border-white/5">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative px-8 py-6">
                        {children}
                    </div>

                    {footer && (
                        <div className="relative flex items-center justify-end space-x-3 px-8 py-5 border-t border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;