import React from 'react';
import AuthService from '../services/authService';

/**
 * Componente para proteger contenido basado en roles
 */
export const ProtectedContent = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true, 
  fallback = null 
}) => {
  // Verificar autenticación si es requerida
  if (requireAuth && !AuthService.isAuthenticated()) {
    return fallback;
  }

  // Si no se especifican roles, solo verificar autenticación
  if (allowedRoles.length === 0) {
    return children;
  }

  // Verificar roles específicos
  const user = AuthService.getUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }

  return children;
};

/**
 * Hook para verificar permisos
 */
export const usePermissions = () => {
  const user = AuthService.getUser();
  const isAuthenticated = AuthService.isAuthenticated();

  return {
    isAuthenticated,
    user,
    isAdmin: AuthService.isAdmin(),
    isAdminOrManager: AuthService.isAdminOrManager(),
    hasRole: (role) => AuthService.hasRole(role),
    canAccess: (requiredRoles = []) => {
      if (!isAuthenticated) return false;
      if (requiredRoles.length === 0) return true;
      return requiredRoles.includes(user?.role);
    }
  };
};

/**
 * Configuración de permisos por página
 */
export const PAGE_PERMISSIONS = {
  DASHBOARD: [],  // Todos los usuarios autenticados
  CREATE_AD: [], // Todos los usuarios autenticados
  PRODUCTS: ['ADMIN', 'MANAGER'], // Solo Admin y Manager
  PROMPTS: ['ADMIN', 'MANAGER'],  // Solo Admin y Manager  
  USERS: ['ADMIN'],               // Solo Admin
};

export default ProtectedContent; 