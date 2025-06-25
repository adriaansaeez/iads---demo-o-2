import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePermissions, PAGE_PERMISSIONS } from './ProtectedRoute';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const { canAccess } = usePermissions();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', requiredRoles: PAGE_PERMISSIONS.DASHBOARD },
    { path: '/create-ad', label: 'Crear Anuncio', requiredRoles: PAGE_PERMISSIONS.CREATE_AD },
    { path: '/products', label: 'Productos', requiredRoles: PAGE_PERMISSIONS.PRODUCTS },
    { path: '/prompts', label: 'Prompts', requiredRoles: PAGE_PERMISSIONS.PROMPTS },
    { path: '/users', label: 'Usuarios', requiredRoles: PAGE_PERMISSIONS.USERS }
  ];

  // Filtrar elementos de navegación basado en permisos
  const allowedNavItems = navItems.filter(item => canAccess(item.requiredRoles));

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">SpeedAD</h1>
            <nav className="flex space-x-6">
              {allowedNavItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Hola, {user?.username || user?.email || user?.name}
            </span>
            <button
              onClick={onLogout}
              className="text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation; 