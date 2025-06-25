import { useState, useEffect } from 'react';
import promptService from '../services/promptService';

const GeneratedPromptsList = ({ productId = null, userId = null, limit = 10 }) => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cargar prompts
  const loadPrompts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      if (productId) {
        response = await promptService.getProductPrompts(productId);
        // Para prompts de producto, no hay paginación
        setPrompts(response);
        setTotalPages(1);
      } else if (userId) {
        response = await promptService.getUserPrompts(userId);
        setPrompts(response);
        setTotalPages(1);
      } else {
        response = await promptService.getAll({
          page: pageNum,
          limit,
          sortBy: 'created_at',
          sortOrder: 'desc'
        });
        setPrompts(response.prompts || []);
        setTotalPages(response.pagination?.pages || 1);
      }

      setPage(pageNum);
    } catch (err) {
      console.error('Error cargando prompts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, [productId, userId, limit]);

  // Eliminar prompt
  const handleDelete = async (promptId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este prompt?')) {
      return;
    }

    try {
      await promptService.delete(promptId);
      await loadPrompts(page); // Recargar la página actual
    } catch (err) {
      console.error('Error eliminando prompt:', err);
      alert(`Error eliminando prompt: ${err.message}`);
    }
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Obtener texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'failed':
        return 'Fallido';
      case 'generating':
        return 'Generando...';
      default:
        return 'Pendiente';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando prompts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="text-center">
          <div className="text-red-600 mb-2">❌ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadPrompts()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>No se encontraron prompts generados</p>
          {productId && (
            <p className="text-sm mt-1">Aún no se han creado anuncios para este producto.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Prompts Generados {productId && '(Producto)'}
        </h3>
        <span className="text-sm text-gray-500">
          {prompts.length} prompts
        </span>
      </div>

      {/* Lista de prompts */}
      <div className="space-y-3">
        {prompts.map((prompt) => {
          const product = promptService.getFirstProduct(prompt);
          const isCompleted = promptService.isCompleted(prompt);
          const isFailed = promptService.isFailed(prompt);
          const isGenerating = promptService.isGenerating(prompt);

          return (
            <div
              key={prompt.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Header del prompt */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {prompt.title || 'Sin título'}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(prompt.generationStatus)}`}>
                      {getStatusText(prompt.generationStatus)}
                    </span>
                  </div>
                  {prompt.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {prompt.description}
                    </p>
                  )}
                </div>
                
                {/* Acciones */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setSelectedPrompt(selectedPrompt === prompt.id ? null : prompt.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {selectedPrompt === prompt.id ? 'Ocultar' : 'Ver más'}
                  </button>
                  <button
                    onClick={() => handleDelete(prompt.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Información básica */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-4">
                  {product && (
                    <span>Producto: {product.name}</span>
                  )}
                  <span>{promptService.getFormattedDate(prompt)}</span>
                  {prompt.processingTime && (
                    <span>Tiempo: {promptService.getProcessingDuration(prompt)}</span>
                  )}
                </div>
              </div>

              {/* Imagen generada */}
              {isCompleted && prompt.imageUrl && (
                <div className="mb-3">
                  <img
                    src={prompt.imageUrl}
                    alt={prompt.title || 'Anuncio generado'}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Error si falló */}
              {isFailed && prompt.errorMessage && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Error:</strong> {prompt.errorMessage}
                  </p>
                </div>
              )}

              {/* Información detallada (expandible) */}
              {selectedPrompt === prompt.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  {/* Configuración del anuncio */}
                  {(prompt.targetAudience || prompt.adStyle || prompt.colorScheme) && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Configuración</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {prompt.targetAudience && (
                          <div>
                            <span className="text-gray-500">Audiencia:</span>
                            <span className="ml-1">{prompt.targetAudience}</span>
                          </div>
                        )}
                        {prompt.adStyle && (
                          <div>
                            <span className="text-gray-500">Estilo:</span>
                            <span className="ml-1">{prompt.adStyle}</span>
                          </div>
                        )}
                        {prompt.colorScheme && (
                          <div>
                            <span className="text-gray-500">Colores:</span>
                            <span className="ml-1">{prompt.colorScheme}</span>
                          </div>
                        )}
                        {prompt.imageSize && (
                          <div>
                            <span className="text-gray-500">Tamaño:</span>
                            <span className="ml-1">{prompt.imageSize}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Prompt final */}
                  {prompt.finalPrompt && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Prompt Generado</h5>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {prompt.finalPrompt}
                      </p>
                    </div>
                  )}

                  {/* Prompt limpio enviado a DALL-E */}
                  {prompt.cleanedPrompt && prompt.cleanedPrompt !== prompt.finalPrompt && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Prompt Enviado a DALL-E</h5>
                      <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                        {prompt.cleanedPrompt}
                      </p>
                    </div>
                  )}

                  {/* Instrucciones adicionales */}
                  {prompt.additionalInstructions && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Instrucciones Adicionales</h5>
                      <p className="text-sm text-gray-700">
                        {prompt.additionalInstructions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => loadPrompts(page - 1)}
            disabled={page <= 1}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          
          <button
            onClick={() => loadPrompts(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default GeneratedPromptsList; 