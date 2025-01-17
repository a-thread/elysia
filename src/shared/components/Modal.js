import React from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';

function Modal({ children, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                    <XMarkIcon className="w-6 h-6" title="Close Modal" />
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
