import { useState } from 'react'
import { AlertCircle, Building, Globe, FileText } from 'lucide-react'

const ProductInfoForm = ({ 
  formData, 
  onFormDataChange, 
  onNext, 
  error 
}) => {
  const [localErrors, setLocalErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    onFormDataChange({
      ...formData,
      [name]: value
    })
    
    // Limpiar errores locales cuando el usuario empiece a escribir
    if (localErrors[name]) {
      setLocalErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.productName?.trim()) {
      errors.productName = 'El nombre del producto es requerido'
    }
    
    if (!formData.website?.trim()) {
      errors.website = 'La página web es requerida'
    } else if (!isValidUrl(formData.website)) {
      errors.website = 'Por favor ingresa una URL válida'
    }
    
    if (!formData.description?.trim()) {
      errors.description = 'La descripción es requerida'
    } else if (formData.description.trim().length < 20) {
      errors.description = 'La descripción debe tener al menos 20 caracteres'
    }
    
    setLocalErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const formatUrl = (url) => {
    if (!url) return ''
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`
    }
    return url
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
          <Building className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información del Producto
        </h2>
        <p className="text-gray-600">
          Cuéntanos sobre tu producto o servicio
        </p>
      </div>

      {/* Global Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="productName" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Building className="h-4 w-4" />
            <span>Nombre del Producto *</span>
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName || ''}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              localErrors.productName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: iPhone 15, Nike Air Max, Curso de Marketing..."
            required
          />
          {localErrors.productName && (
            <p className="mt-1 text-sm text-red-600">{localErrors.productName}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4" />
            <span>Página Web *</span>
          </label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website || ''}
            onChange={handleInputChange}
            onBlur={(e) => {
              if (e.target.value && !e.target.value.startsWith('http')) {
                onFormDataChange({
                  ...formData,
                  website: formatUrl(e.target.value)
                })
              }
            }}
            className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              localErrors.website ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ej: www.miempresa.com o miempresa.com"
            required
          />
          {localErrors.website && (
            <p className="mt-1 text-sm text-red-600">{localErrors.website}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Incluiremos el enlace a tu sitio web en el anuncio
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4" />
            <span>Descripción Breve *</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description || ''}
            onChange={handleInputChange}
            className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
              localErrors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe tu producto en 2-3 líneas. ¿Qué lo hace especial? ¿Qué problemas resuelve?"
            required
          />
          <div className="flex justify-between items-center mt-1">
            {localErrors.description ? (
              <p className="text-sm text-red-600">{localErrors.description}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Mínimo 20 caracteres para una descripción efectiva
              </p>
            )}
            <p className="text-xs text-gray-400">
              {formData.description?.length || 0}/200
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>Continuar al Diseño</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default ProductInfoForm 