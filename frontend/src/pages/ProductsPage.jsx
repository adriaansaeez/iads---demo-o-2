import React from 'react';
import CrudManager from '../components/crud/CrudManager';
import ProductService from '../services/productService';

const ProductsPage = ({ user, onLogout }) => {
  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '100px',
      render: (value) => value.slice(-8) // Mostrar solo los últimos 8 caracteres
    },
    {
      key: 'name',
      label: 'Nombre',
      searchable: true,
      sortable: true
    },
    {
      key: 'desc',
      label: 'Descripción',
      searchable: true,
      width: '300px',
      render: (value) => value ? (value.length > 100 ? value.substring(0, 100) + '...' : value) : 'Sin descripción'
    },
    {
      key: 'website',
      label: 'Website',
      render: (value) => value ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value.length > 40 ? value.substring(0, 40) + '...' : value}
        </a>
      ) : 'No especificado'
    },
    {
      key: 'producto_study',
      label: 'Estudio',
      searchable: true,
      width: '200px',
      render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'Sin estudio'
    }
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'name',
      label: 'Nombre del Producto',
      type: 'text',
      placeholder: 'Ingresa el nombre del producto',
      required: true
    },
    {
      name: 'desc',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Describe el producto...',
      rows: 4
    },
    {
      name: 'website',
      label: 'Website',
      type: 'url',
      placeholder: 'https://ejemplo.com'
    },
    {
      name: 'producto_study',
      label: 'Estudio del Producto',
      type: 'textarea',
      placeholder: 'Información del estudio de mercado...',
      rows: 3
    }
  ];

  // Reglas de validación
  const validationRules = {
    name: {
      required: 'El nombre del producto es requerido',
      minLength: { value: 2, message: 'Mínimo 2 caracteres' },
      maxLength: { value: 100, message: 'Máximo 100 caracteres' }
    },
    desc: {
      maxLength: { value: 1000, message: 'Máximo 1000 caracteres' }
    },
    website: {
      pattern: {
        value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        message: 'URL inválida'
      }
    },
    producto_study: {
      maxLength: { value: 2000, message: 'Máximo 2000 caracteres' }
    }
  };

  // API service adaptado para CrudManager
  const apiService = {
    getAll: ProductService.getAll,
    create: ProductService.create,
    update: ProductService.update,
    delete: ProductService.delete
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">SpeedAD</h1>
              <nav className="flex space-x-6">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </a>
                <a href="/users" className="text-gray-600 hover:text-gray-900">
                  Usuarios
                </a>
                <a href="/products" className="text-blue-600 font-medium">
                  Productos
                </a>
                <a href="/prompts" className="text-gray-600 hover:text-gray-900">
                  Prompts
                </a>
                <a href="/create-ad" className="text-gray-600 hover:text-gray-900">
                  Crear Anuncio
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hola, {user?.username || user?.email}</span>
              <button
                onClick={onLogout}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CrudManager
          apiService={apiService}
          title="Productos"
          columns={columns}
          formFields={formFields}
          validationRules={validationRules}
          pageSize={12}
          searchable={true}
          createButtonText="Nuevo Producto"
          editButtonText="Editar"
          deleteButtonText="Eliminar"
        />
      </div>
    </div>
  );
};

export default ProductsPage; 