const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

/**
 * Servicio para manejar autenticación
 */
class AuthService {
  
  /**
   * Registrar nuevo usuario
   */
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error HTTP ${response.status}`);
      }

      // Guardar token y usuario en localStorage
      if (result.data.token) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error HTTP ${response.status}`);
      }

      // Guardar token y usuario en localStorage
      if (result.data.token) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      // Limpiar datos locales independientemente de la respuesta del servidor
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (response.ok) {
        const result = await response.json();
        return result;
      }

      return { success: true, message: 'Sesión cerrada localmente' };
    } catch (error) {
      // Limpiar datos locales aunque haya error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.error('Error en logout:', error);
      return { success: true, message: 'Sesión cerrada localmente' };
    }
  }

  /**
   * Obtener información del usuario actual
   */
  static async getMe() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const result = await response.json();
      
      // Actualizar usuario en localStorage
      if (result.data) {
        localStorage.setItem('user', JSON.stringify(result.data));
      }

      return result.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  }

  /**
   * Obtener token del localStorage
   */
  static getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Obtener usuario del localStorage
   */
  static getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    
    if (!token || !user) {
      return false;
    }

    // Verificar si el token no ha expirado (simple check del payload)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  static hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  }

  /**
   * Verificar si el usuario es admin
   */
  static isAdmin() {
    return this.hasRole('ADMIN');
  }

  /**
   * Verificar si el usuario es admin o manager
   */
  static isAdminOrManager() {
    return this.hasRole('ADMIN') || this.hasRole('MANAGER');
  }

  /**
   * Limpiar datos de autenticación
   */
  static clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Obtener headers de autorización para requests
   */
  static getAuthHeaders() {
    const token = this.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }
}

export default AuthService; 