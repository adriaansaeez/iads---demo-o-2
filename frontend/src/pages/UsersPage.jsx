import React from 'react';
import CrudManager from '../components/crud/CrudManager';
import UserService from '../services/userService';
import AuthService from '../services/authService';
import Navigation from '../components/Navigation';

const UsersPage = ({ user, onLogout }) => {
  // Verificar permisos del usuario actual
  const currentUser = AuthService.getUser();
  const isAdmin = AuthService.isAdmin();
  const isAdminOrManager = AuthService.isAdminOrManager();
  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '100px',
      render: (value) => value.slice(-8) // Mostrar solo los últimos 8 caracteres
    },
    {
      key: 'username',
      label: 'Usuario',
      searchable: true,
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      searchable: true,
      sortable: true
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      render: (value) => {
        const roleColors = {
          ADMIN: 'bg-red-100 text-red-800',
          MANAGER: 'bg-blue-100 text-blue-800',
          USER: 'bg-green-100 text-green-800'
        };
        const roleLabels = {
          ADMIN: 'Administrador',
          MANAGER: 'Manager',
          USER: 'Usuario'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {roleLabels[value] || value}
          </span>
        );
      }
    },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Fecha de Creación',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ];

  // Configuración de campos del formulario
  const formFields = [
    {
      name: 'username',
      label: 'Nombre de Usuario',
      type: 'text',
      placeholder: 'Ingresa el nombre de usuario',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Ingresa el email',
      required: true
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Ingresa la contraseña',
      required: true,
      minLength: 6,
      showOnEdit: false // No mostrar en edición por seguridad
    },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [
        { value: 'USER', label: 'Usuario' },
        { value: 'MANAGER', label: 'Manager' },
        { value: 'ADMIN', label: 'Administrador' }
      ]
    },
    {
      name: 'isActive',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' }
      ]
    }
  ];

  // Reglas de validación
  const validationRules = {
    username: {
      required: 'El nombre de usuario es requerido',
      minLength: { value: 3, message: 'Mínimo 3 caracteres' },
      maxLength: { value: 50, message: 'Máximo 50 caracteres' }
    },
    email: {
      required: 'El email es requerido',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Email inválido'
      }
    },
    password: {
      required: 'La contraseña es requerida',
      minLength: { value: 6, message: 'Mínimo 6 caracteres' }
    }
  };

  // API service adaptado para CrudManager
  const apiService = {
    getAll: UserService.getAll,
    create: UserService.create,
    update: UserService.update,
    delete: UserService.delete
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} currentPage="users" />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CrudManager
          apiService={apiService}
          title="Usuarios"
          columns={columns}
          formFields={formFields}
          validationRules={validationRules}
          pageSize={15}
          searchable={true}
          canCreate={isAdmin}
          canEdit={isAdmin}
          canDelete={isAdmin}
          createButtonText="Nuevo Usuario"
          editButtonText="Editar"
          deleteButtonText="Eliminar"
        />
      </div>
    </div>
  );
};

export default UsersPage; 