const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

/**
 * Servicio para gestionar productos
 */
class ProductService {
  
  /**
   * Obtener todos los productos
   */
  static async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  }

  /**
   * Obtener producto por ID
   */
  static async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo producto
   */
  static async create(productData) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  }

  /**
   * Actualizar producto
   */
  static async update(id, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  }

  /**
   * Eliminar producto
   */
  static async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  }
}

export default ProductService; 