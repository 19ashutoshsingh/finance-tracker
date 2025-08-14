import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        // Main overlay
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
            onClick={onClose} // Close modal on overlay click
        >
            {/* Modal content */}
            <div 
                className="bg-theme-background rounded-lg shadow-xl w-full max-w-lg p-6 pb-10 mx-4 relative"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-gray-500 pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-theme-primary">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={20} />
                    </button>
                </div>
                
                {/* Modal Body */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;