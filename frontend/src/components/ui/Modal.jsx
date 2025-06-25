import React from 'react';
import Button from './Button';

const Modal = ({ 
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  className = ''
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-4xl',
    xlarge: 'max-w-7xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className={`relative w-full ${sizeClasses[size]} mx-auto my-6 ${className}`}>
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none max-h-screen">
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
              {title && (
                <h3 className="text-xl font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-600 text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="bg-transparent text-gray-400 hover:text-gray-600 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="relative flex-auto overflow-y-auto max-h-96">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para el contenido del modal
const ModalContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Componente para el footer del modal
const ModalFooter = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end p-6 border-t border-gray-200 rounded-b space-x-2 ${className}`}>
    {children}
  </div>
);

// Componente de confirmación reutilizable
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar acción',
  message = '¿Estás seguro de que quieres realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger',
  loading = false
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
    <ModalContent>
      <p className="text-gray-600">{message}</p>
    </ModalContent>
    <ModalFooter>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button 
        variant={confirmVariant} 
        onClick={onConfirm}
        loading={loading}
      >
        {confirmText}
      </Button>
    </ModalFooter>
  </Modal>
);

export default Modal;
export { ModalContent, ModalFooter, ConfirmModal }; 