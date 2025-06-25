/**
 * EJEMPLO DE USO DE LOS COMPONENTES CRUD
 * 
 * Este archivo muestra cómo usar los componentes CRUD reutilizables
 * para crear un sistema completo de gestión de usuarios.
 * 
 * Para usar este ejemplo:
 * 1. Crea un servicio API para usuarios
 * 2. Importa este componente en tu aplicación
 * 3. Personaliza los campos y validaciones según tus necesidades
 */

import React from 'react';
import CrudManager from './CrudManager';

// Ejemplo de servicio API (debes implementar esto según tu backend)
const userApiService = {
  getAll: async () => {
    // Implementar llamada GET /api/users
    const response = await fetch('/api/users');
    return response.json();
  },
  
  getById: async (id) => {
    // Implementar llamada GET /api/users/:id
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  },
  
  create: async (userData) => {
    // Implementar llamada POST /api/users
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  update: async (id, userData) => {
    // Implementar llamada PUT /api/users/:id
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  delete: async (id) => {
    // Implementar llamada DELETE /api/users/:id
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

// Definir las columnas de la tabla
const userColumns = [
  {
    header: 'ID',
    accessor: 'id'
  },
  {
    header: 'Nombre',
    accessor: 'name'
  },
  {
    header: 'Email',
    accessor: 'email'
  },
  {
    header: 'Rol',
    accessor: 'role',
    render: (user) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        user.role === 'admin' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {user.role}
      </span>
    )
  },
  {
    header: 'Estado',
    accessor: 'active',
    render: (user) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        user.active 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {user.active ? 'Activo' : 'Inactivo'}
      </span>
    )
  },
  {
    header: 'Fecha de registro',
    accessor: 'createdAt',
    render: (user) => new Date(user.createdAt).toLocaleDateString('es-ES')
  }
];

// Definir los campos del formulario
const userFormFields = [
  {
    name: 'name',
    label: 'Nombre completo',
    type: 'text',
    placeholder: 'Ingresa el nombre completo'
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    type: 'email',
    placeholder: 'usuario@ejemplo.com'
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    placeholder: 'Mínimo 8 caracteres'
  },
  {
    name: 'role',
    label: 'Rol',
    type: 'select',
    options: [
      { value: 'user', label: 'Usuario' },
      { value: 'admin', label: 'Administrador' }
    ]
  },
  {
    name: 'active',
    label: 'Usuario activo',
    type: 'checkbox'
  },
  {
    name: 'bio',
    label: 'Biografía',
    type: 'textarea',
    placeholder: 'Información adicional sobre el usuario...',
    rows: 3
  }
];

// Definir las reglas de validación
const userValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    email: true
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value) => {
      // Validación personalizada para contraseña
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
      }
      return null;
    }
  },
  role: {
    required: true
  },
  bio: {
    maxLength: 500
  }
};

// Componente principal de gestión de usuarios
const UserManager = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <CrudManager
        apiService={userApiService}
        title="Gestión de Usuarios"
        columns={userColumns}
        formFields={userFormFields}
        validationRules={userValidationRules}
        pageSize={15}
        createButtonText="Crear Usuario"
        editButtonText="Editar"
        deleteButtonText="Eliminar"
      />
    </div>
  );
};

// EJEMPLO DE USO EN DIFERENTES CONTEXTOS

// Para productos:
const productColumns = [
  { header: 'Nombre', accessor: 'name' },
  { header: 'Precio', accessor: 'price', render: (item) => `$${item.price}` },
  { header: 'Stock', accessor: 'stock' },
  { header: 'Categoría', accessor: 'category' }
];

const productFormFields = [
  { name: 'name', label: 'Nombre del producto', type: 'text' },
  { name: 'price', label: 'Precio', type: 'number' },
  { name: 'description', label: 'Descripción', type: 'textarea' },
  { name: 'category', label: 'Categoría', type: 'select', options: [
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'books', label: 'Libros' }
  ]},
  { name: 'stock', label: 'Stock disponible', type: 'number' },
  { name: 'active', label: 'Producto activo', type: 'checkbox' }
];

const ProductManager = () => (
  <CrudManager
    apiService={productApiService}
    title="Gestión de Productos"
    columns={productColumns}
    formFields={productFormFields}
    validationRules={{
      name: { required: true, minLength: 3 },
      price: { required: true },
      stock: { required: true }
    }}
  />
);

export default UserManager;
export { ProductManager };

/**
 * NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. Servicios API:
 *    - Cada entidad necesita su propio servicio con métodos: getAll, getById, create, update, delete
 *    - Los servicios deben manejar errores y devolver respuestas consistentes
 * 
 * 2. Columnas personalizadas:
 *    - Usa la función 'render' para personalizar cómo se muestran los datos
 *    - Puedes incluir componentes React como badges, botones, etc.
 * 
 * 3. Validaciones:
 *    - Utiliza validaciones built-in: required, minLength, maxLength, email
 *    - Implementa validaciones personalizadas con la función 'custom'
 * 
 * 4. Campos de formulario:
 *    - Tipos soportados: text, email, password, number, textarea, select, checkbox
 *    - Personaliza options para selects y configuraciones específicas
 * 
 * 5. Extensibilidad:
 *    - Los componentes están diseñados para ser extendidos
 *    - Puedes agregar nuevos tipos de campo en CrudForm
 *    - Personaliza estilos mediante props className
 */ 