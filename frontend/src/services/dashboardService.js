import AuthService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

/**
 * Servicio para gestionar el dashboard
 */
class DashboardService {
  
  /**
   * Obtener estadísticas del dashboard del usuario
   */
  static async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas del dashboard:', error);
      throw error;
    }
  }

  /**
   * Obtener productos del usuario para el selector
   */
  static async getUserProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/products`, {
        headers: AuthService.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error obteniendo productos del usuario:', error);
      throw error;
    }
  }
}

export default DashboardService; 