import authService from './authService';

const API_URL = 'http://localhost:3005/api';

// Función helper para obtener headers con autorización
const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función helper para manejar respuestas de la API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
  }
  return response.json();
};

const promptService = {
  // Obtener todos los prompts con filtros y paginación
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Añadir parámetros de consulta
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const url = `${API_URL}/prompts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo prompts:', error);
      throw error;
    }
  },

  // Obtener un prompt por ID
  async getById(id) {
    try {
      const response = await fetch(`${API_URL}/prompts/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo prompt:', error);
      throw error;
    }
  },

  // Obtener prompts de un usuario específico
  async getUserPrompts(userId = null) {
    try {
      const endpoint = userId ? `/prompts/user/${userId}` : '/prompts/user';
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo prompts del usuario:', error);
      throw error;
    }
  },

  // Obtener prompts de un producto específico
  async getProductPrompts(productId) {
    try {
      const response = await fetch(`${API_URL}/prompts/product/${productId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo prompts del producto:', error);
      throw error;
    }
  },

  // Obtener estadísticas de prompts
  async getStats() {
    try {
      const response = await fetch(`${API_URL}/prompts/stats`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo estadísticas de prompts:', error);
      throw error;
    }
  },

  // Actualizar un prompt (solo título y descripción)
  async update(id, data) {
    try {
      const response = await fetch(`${API_URL}/prompts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error actualizando prompt:', error);
      throw error;
    }
  },

  // Eliminar un prompt
  async delete(id) {
    try {
      const response = await fetch(`${API_URL}/prompts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error eliminando prompt:', error);
      throw error;
    }
  },

  // Funciones auxiliares para filtros y búsquedas
  
  // Buscar prompts por texto
  async search(searchTerm, filters = {}) {
    return this.getAll({
      search: searchTerm,
      ...filters
    });
  },

  // Obtener prompts por estado
  async getByStatus(status, page = 1, limit = 10) {
    return this.getAll({
      status,
      page,
      limit
    });
  },

  // Obtener prompts completados
  async getCompleted(page = 1, limit = 10) {
    return this.getByStatus('completed', page, limit);
  },

  // Obtener prompts fallidos
  async getFailed(page = 1, limit = 10) {
    return this.getByStatus('failed', page, limit);
  },

  // Obtener prompts en proceso
  async getGenerating(page = 1, limit = 10) {
    return this.getByStatus('generating', page, limit);
  },

  // Obtener prompts recientes
  async getRecent(limit = 5) {
    return this.getAll({
      limit,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  },

  // Funciones utilitarias para el estado de los prompts

  // Verificar si un prompt está completado
  isCompleted(prompt) {
    return prompt.generationStatus === 'completed';
  },

  // Verificar si un prompt falló
  isFailed(prompt) {
    return prompt.generationStatus === 'failed';
  },

  // Verificar si un prompt está generándose
  isGenerating(prompt) {
    return prompt.generationStatus === 'generating';
  },

  // Obtener duración legible del tiempo de procesamiento
  getProcessingDuration(prompt) {
    if (!prompt.processingTime) return 'N/A';
    
    const seconds = Math.floor(prompt.processingTime / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  },

  // Obtener el primer producto asociado al prompt
  getFirstProduct(prompt) {
    return prompt.productPrompts?.[0]?.product || null;
  },

  // Obtener todos los productos asociados al prompt
  getAllProducts(prompt) {
    return prompt.productPrompts?.map(pp => pp.product) || [];
  },

  // Formatear fecha de creación
  getFormattedDate(prompt) {
    return new Date(prompt.created_at).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export default promptService; 