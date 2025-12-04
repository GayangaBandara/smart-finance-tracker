import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  ariaLabel,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Handle escape key to close modal
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Focus trap - keep focus within modal
    const handleTabKey = (event) => {
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="presentation"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-label={ariaLabel}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 id="modal-title" className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close dialog"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;