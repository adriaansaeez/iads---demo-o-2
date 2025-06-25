import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

/**
 * Servicio para interactuar con la API de generación de anuncios
 */
class AdService {
  
  /**
   * Obtener headers con autenticación
   */
  static getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }
  
  /**
   * Generar un anuncio completo (análisis + prompts + imagen)
   */
  static async generateAd(formData) {
    try {
      console.log('🚀 Enviando solicitud para generar anuncio...');
      
      const response = await fetch(`${API_BASE_URL}/api/ads/generate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Anuncio generado exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error generando anuncio:', error);
      throw error;
    }
  }

  /**
   * Regenerar solo la imagen del anuncio
   */
  static async regenerateImage(prompt, size = '1024x1024') {
    try {
      console.log('🎨 Regenerando imagen...');
      
      const response = await fetch(`${API_BASE_URL}/api/ads/regenerate-image`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ prompt, size }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Imagen regenerada exitosamente');
      return result;

    } catch (error) {
      console.error('❌ Error regenerando imagen:', error);
      throw error;
    }
  }

  /**
   * Analizar solo la página web (útil para preview)
   */
  static async analyzeWebsite(brandName, website, description) {
    try {
      console.log('📊 Analizando página web...');
      
      const response = await fetch(`${API_BASE_URL}/api/ads/analyze-website`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ brandName, website, description }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Análisis completado');
      return result;

    } catch (error) {
      console.error('❌ Error analizando website:', error);
      throw error;
    }
  }

  /**
   * Verificar estado del servidor
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`Error de conectividad: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('❌ Error verificando estado del servidor:', error);
      throw new Error('No se puede conectar con el servidor. Verifica que esté ejecutándose en ' + API_BASE_URL);
    }
  }

  /**
   * Descargar imagen
   */
  static async downloadImage(imageUrl, filename) {
    try {
      console.log('📥 Descargando imagen...');
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Error descargando la imagen');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `anuncio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      console.log('✅ Imagen descargada');

    } catch (error) {
      console.error('❌ Error descargando imagen:', error);
      throw error;
    }
  }

  /**
   * Formatear errores para mostrar al usuario
   */
  static formatError(error) {
    if (error.message.includes('fetch')) {
      return 'Error de conexión. Verifica que el servidor esté ejecutándose.';
    }
    
    if (error.message.includes('OpenAI') || error.message.includes('API')) {
      return 'Error con la API de OpenAI. Verifica tu configuración.';
    }
    
    if (error.message.includes('prompt') || error.message.includes('contenido')) {
      return 'El contenido no cumple con las políticas de OpenAI. Modifica la descripción.';
    }
    
    if (error.message.includes('límite') || error.message.includes('429')) {
      return 'Límite de API alcanzado. Inténtalo de nuevo en unos minutos.';
    }
    
    return error.message || 'Error inesperado. Inténtalo de nuevo.';
  }
}

export default AdService; 