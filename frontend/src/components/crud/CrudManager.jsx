import React from 'react';
import DataTable from './DataTable';
import CrudForm from './CrudForm';
import Modal, { ModalContent, ModalFooter, ConfirmModal } from '../ui/Modal';
import Button from '../ui/Button';
import useCrud from '../../hooks/useCrud';

const CrudManager = ({
  apiService,
  title = 'Gestión de datos',
  columns = [],
  formFields = [],
  validationRules = {},
  initialData = [],
  pageSize = 10,
  searchable = true,
  createButtonText = 'Crear nuevo',
  editButtonText = 'Editar',
  deleteButtonText = 'Eliminar',
  className = ''
}) => {
  const {
    data,
    loading,
    error,
    selectedItem,
    createModalOpen,
    editModalOpen,
    deleteModalOpen,
    create,
    update,
    remove,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModals,
    clearError
  } = useCrud(apiService, initialData);

  // Configurar acciones de la tabla
  const tableActions = [
    {
      label: editButtonText,
      variant: 'outline',
      onClick: openEditModal
    },
    {
      label: deleteButtonText,
      variant: 'danger',
      onClick: openDeleteModal
    }
  ];

  // Manejar creación
  const handleCreate = async (formData) => {
    const result = await create(formData);
    if (result.success) {
      // Opcionalmente mostrar notificación de éxito
      console.log('Elemento creado exitosamente');
    }
    return result;
  };

  // Manejar edición
  const handleEdit = async (formData) => {
    if (!selectedItem) return;
    
    const result = await update(selectedItem.id, formData);
    if (result.success) {
      // Opcionalmente mostrar notificación de éxito
      console.log('Elemento actualizado exitosamente');
    }
    return result;
  };

  // Manejar eliminación
  const handleDelete = async () => {
    if (!selectedItem) return;
    
    const result = await remove(selectedItem.id);
    if (result.success) {
      // Opcionalmente mostrar notificación de éxito
      console.log('Elemento eliminado exitosamente');
    }
    return result;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <Button onClick={openCreateModal} disabled={loading}>
          {createButtonText}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Tabla de datos */}
      <DataTable
        data={data}
        columns={columns}
        actions={tableActions}
        loading={loading}
        searchable={searchable}
        pageSize={pageSize}
        emptyMessage={`No hay ${title.toLowerCase()} para mostrar`}
      />

      {/* Modal de creación */}
      <Modal
        isOpen={createModalOpen}
        onClose={closeModals}
        title={`Crear ${title.slice(0, -1)}`} // Remover 's' del final
        size="medium"
      >
        <ModalContent>
          <CrudForm
            fields={formFields}
            validationRules={validationRules}
            onSubmit={handleCreate}
            onCancel={closeModals}
            loading={loading}
            submitText="Crear"
          />
        </ModalContent>
      </Modal>

      {/* Modal de edición */}
      <Modal
        isOpen={editModalOpen}
        onClose={closeModals}
        title={`Editar ${title.slice(0, -1)}`} // Remover 's' del final
        size="medium"
      >
        <ModalContent>
          <CrudForm
            fields={formFields}
            initialData={selectedItem || {}}
            validationRules={validationRules}
            onSubmit={handleEdit}
            onCancel={closeModals}
            loading={loading}
            submitText="Actualizar"
          />
        </ModalContent>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        loading={loading}
      />
    </div>
  );
};

export default CrudManager; 