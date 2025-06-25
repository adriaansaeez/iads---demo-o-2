import React from 'react';
import { Package, Calendar, Zap, ExternalLink, Plus } from 'lucide-react';

const UserProductsList = ({ products, onCreateAdForProduct }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes productos creados
        </h3>
        <p className="text-gray-500 mb-4">
          Crea tu primer producto para comenzar a generar anuncios
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Mis Productos ({products.length})
        </h2>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                  </div>
                  
                  {product.desc && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {product.desc}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Creado {formatDate(product.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4" />
                      <span>
                        {product.productPrompts?.length || 0} anuncios
                      </span>
                    </div>
                    
                    {product.website && (
                      <a 
                        href={product.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Sitio web</span>
                      </a>
                    )}
                  </div>

                  {/* Últimos anuncios del producto */}
                  {product.productPrompts && product.productPrompts.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Últimos anuncios:
                      </h4>
                      <div className="space-y-1">
                        {product.productPrompts.slice(0, 2).map((pp) => (
                          <div key={pp.id} className="text-sm text-gray-600">
                            • {pp.prompt.title || `Anuncio del ${formatDate(pp.created_at)}`}
                          </div>
                        ))}
                        {product.productPrompts.length > 2 && (
                          <div className="text-sm text-gray-500">
                            ... y {product.productPrompts.length - 2} más
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="ml-4 flex flex-col gap-2">
                  <button
                    onClick={() => onCreateAdForProduct(product)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Anuncio
                  </button>
                  
                  {product.productPrompts && product.productPrompts.length > 0 && (
                    <button
                      onClick={() => window.location.href = `/prompts?productId=${product.id}`}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Ver Anuncios ({product.productPrompts.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProductsList; 