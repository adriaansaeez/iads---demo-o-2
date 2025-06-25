import { useState, useEffect, useCallback } from 'react';

const useCrud = (apiService, initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados para modales
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Cargar datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getAll();
      setData(response.data || response);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  // Crear nuevo elemento
  const create = async (newItem) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.create(newItem);
      const createdItem = response.data || response;
      
      setData(prevData => [...prevData, createdItem]);
      setCreateModalOpen(false);
      
      return { success: true, data: createdItem };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear el elemento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar elemento
  const update = async (id, updatedItem) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.update(id, updatedItem);
      const updated = response.data || response;
      
      setData(prevData => 
        prevData.map(item => item.id === id ? updated : item)
      );
      setEditModalOpen(false);
      setSelectedItem(null);
      
      return { success: true, data: updated };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar el elemento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar elemento
  const remove = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiService.delete(id);
      
      setData(prevData => prevData.filter(item => item.id !== id));
      setDeleteModalOpen(false);
      setSelectedItem(null);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el elemento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Obtener elemento por ID
  const getById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getById(id);
      return { success: true, data: response.data || response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener el elemento';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar modales
  const openCreateModal = () => {
    setSelectedItem(null);
    setCreateModalOpen(true);
    setError(null);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
    setError(null);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
    setError(null);
  };

  const closeModals = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedItem(null);
    setError(null);
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (apiService && typeof apiService.getAll === 'function') {
      fetchData();
    }
  }, [fetchData, apiService]);

  return {
    // Datos
    data,
    loading,
    error,
    selectedItem,

    // Estados de modales
    createModalOpen,
    editModalOpen,
    deleteModalOpen,

    // Operaciones CRUD
    create,
    update,
    remove,
    getById,
    fetchData,

    // Funciones de modales
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModals,

    // Utilidades
    clearError,
    
    // Setters directos (para casos especiales)
    setData,
    setSelectedItem,
    setLoading,
    setError
  };
};

export default useCrud; 