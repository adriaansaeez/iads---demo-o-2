# Componentes CRUD Reutilizables

Este conjunto de componentes te permite crear interfaces CRUD completas de forma rápida y consistente. Incluye tabla de datos, formularios, modales y manejo de estado.

## 📦 Componentes Incluidos

### Componentes UI Base
- **Button**: Botón reutilizable con variantes y estados
- **Input**: Campo de entrada con validación
- **Modal**: Modal reutilizable con subcomponentes

### Componentes CRUD
- **DataTable**: Tabla de datos con búsqueda, paginación y acciones
- **CrudForm**: Formulario dinámico con validación
- **CrudManager**: Componente principal que integra todo

### Hook Personalizado
- **useCrud**: Hook para manejar operaciones CRUD y estado

## 🚀 Uso Rápido

### Importación
```javascript
import { CrudManager } from '../components/crud';
```

### Ejemplo Básico
```javascript
import React from 'react';
import { CrudManager } from '../components/crud';
import { userApiService } from '../services/userService';

const UserManagement = () => {
  const columns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Rol', accessor: 'role' }
  ];

  const formFields = [
    { name: 'name', label: 'Nombre', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'role', label: 'Rol', type: 'select', options: [
      { value: 'user', label: 'Usuario' },
      { value: 'admin', label: 'Administrador' }
    ]}
  ];

  const validationRules = {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    role: { required: true }
  };

  return (
    <CrudManager
      apiService={userApiService}
      title="Gestión de Usuarios"
      columns={columns}
      formFields={formFields}
      validationRules={validationRules}
    />
  );
};
```

## 📋 Configuración Detallada

### Servicio API Requerido
Tu servicio API debe implementar estos métodos:

```javascript
const apiService = {
  getAll: async () => { /* GET /api/resource */ },
  getById: async (id) => { /* GET /api/resource/:id */ },
  create: async (data) => { /* POST /api/resource */ },
  update: async (id, data) => { /* PUT /api/resource/:id */ },
  delete: async (id) => { /* DELETE /api/resource/:id */ }
};
```

### Configuración de Columnas
```javascript
const columns = [
  {
    header: 'Nombre de la columna',
    accessor: 'campoDelObjeto', // Campo del objeto de datos
    render: (item) => { // Función opcional para renderizado personalizado
      return <span>{item.campoDelObjeto}</span>;
    }
  }
];
```

### Campos de Formulario
```javascript
const formFields = [
  {
    name: 'nombreCampo',        // Nombre del campo (debe coincidir con la API)
    label: 'Etiqueta visible',  // Texto que ve el usuario
    type: 'text',               // Tipo de campo
    placeholder: 'Placeholder', // Texto de ayuda
    disabled: false,            // Si está deshabilitado
    options: [                  // Para campos tipo 'select'
      { value: 'valor', label: 'Etiqueta' }
    ],
    rows: 3                     // Para campos tipo 'textarea'
  }
];
```

#### Tipos de Campo Soportados
- `text` - Campo de texto
- `email` - Campo de email
- `password` - Campo de contraseña
- `number` - Campo numérico
- `textarea` - Área de texto
- `select` - Lista desplegable
- `checkbox` - Casilla de verificación

### Reglas de Validación
```javascript
const validationRules = {
  nombreCampo: {
    required: true,           // Campo obligatorio
    minLength: 5,            // Longitud mínima
    maxLength: 100,          // Longitud máxima
    email: true,             // Validación de email
    custom: (value, allData) => { // Validación personalizada
      if (condicion) {
        return 'Mensaje de error';
      }
      return null; // Sin error
    }
  }
};
```

## 🎛️ Props del CrudManager

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `apiService` | Object | - | Servicio API con métodos CRUD |
| `title` | String | 'Gestión de datos' | Título de la página |
| `columns` | Array | [] | Configuración de columnas |
| `formFields` | Array | [] | Configuración de campos del formulario |
| `validationRules` | Object | {} | Reglas de validación |
| `initialData` | Array | [] | Datos iniciales |
| `pageSize` | Number | 10 | Elementos por página |
| `searchable` | Boolean | true | Habilitar búsqueda |
| `createButtonText` | String | 'Crear nuevo' | Texto del botón crear |
| `editButtonText` | String | 'Editar' | Texto del botón editar |
| `deleteButtonText` | String | 'Eliminar' | Texto del botón eliminar |

## 🔧 Uso Avanzado

### Usando Componentes Individuales

#### DataTable
```javascript
import { DataTable } from '../components/crud';

<DataTable
  data={datos}
  columns={columnas}
  actions={acciones}
  loading={cargando}
  searchable={true}
  pageSize={15}
/>
```

#### CrudForm
```javascript
import { CrudForm } from '../components/crud';

<CrudForm
  fields={campos}
  initialData={datosIniciales}
  validationRules={reglas}
  onSubmit={manejarEnvio}
  onCancel={manejarCancelacion}
  loading={cargando}
/>
```

#### Hook useCrud
```javascript
import { useCrud } from '../components/crud';

const {
  data,
  loading,
  error,
  create,
  update,
  remove,
  openCreateModal,
  openEditModal,
  openDeleteModal,
  closeModals
} = useCrud(apiService);
```

## 🎨 Personalización de Estilos

Los componentes usan Tailwind CSS y son completamente personalizables:

```javascript
<CrudManager
  className="mi-clase-personalizada"
  // ... otras props
/>
```

Para personalizar componentes específicos, puedes crear wrappers o extender los componentes base.

## 📝 Ejemplos Adicionales

### CRUD de Productos
```javascript
const productColumns = [
  { header: 'Nombre', accessor: 'name' },
  { 
    header: 'Precio', 
    accessor: 'price',
    render: (item) => `$${item.price.toFixed(2)}`
  },
  { header: 'Stock', accessor: 'stock' },
  {
    header: 'Estado',
    accessor: 'active',
    render: (item) => (
      <span className={`badge ${item.active ? 'badge-success' : 'badge-danger'}`}>
        {item.active ? 'Activo' : 'Inactivo'}
      </span>
    )
  }
];

const productFields = [
  { name: 'name', label: 'Nombre del producto', type: 'text' },
  { name: 'price', label: 'Precio', type: 'number' },
  { name: 'description', label: 'Descripción', type: 'textarea' },
  { name: 'category', label: 'Categoría', type: 'select', options: categories },
  { name: 'active', label: 'Producto activo', type: 'checkbox' }
];
```

### Validaciones Avanzadas
```javascript
const validationRules = {
  price: {
    required: true,
    custom: (value) => {
      if (value <= 0) return 'El precio debe ser mayor a 0';
      if (value > 10000) return 'El precio no puede exceder $10,000';
      return null;
    }
  },
  email: {
    required: true,
    email: true,
    custom: async (value) => {
      // Validación asíncrona
      const exists = await checkEmailExists(value);
      return exists ? 'Este email ya está registrado' : null;
    }
  }
};
```

## 🚀 Próximas Mejoras

- [ ] Soporte para filtros avanzados
- [ ] Exportación de datos (CSV, Excel)
- [ ] Importación masiva
- [ ] Campos de tipo file/imagen
- [ ] Ordenamiento de columnas
- [ ] Acciones masivas (selección múltiple)
- [ ] Cache y optimizaciones de rendimiento

## 🤝 Contribuir

Para agregar nuevos tipos de campo o funcionalidades:

1. Extiende el componente `CrudForm` 
2. Agrega el nuevo tipo en el switch statement
3. Actualiza las PropTypes y documentación
4. Crea tests para la nueva funcionalidad

¡Los componentes están diseñados para ser flexibles y extensibles! 