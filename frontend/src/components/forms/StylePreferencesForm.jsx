import { useState } from 'react'
import { 
  AlertCircle, 
  Palette, 
  Users, 
  Image as ImageIcon, 
  Wand2,
  ArrowLeft,
  Type,
  Monitor
} from 'lucide-react'

const StylePreferencesForm = ({ 
  formData, 
  onFormDataChange, 
  onBack, 
  onSubmit, 
  isGenerating,
  error 
}) => {
  const [localErrors, setLocalErrors] = useState({})

  // Opciones preconfiguradas mejoradas
  const targetAudiences = [
    { value: 'jovenes', label: 'Jóvenes (18-25 años)', icon: '🔥', description: 'Dinámico y actual' },
    { value: 'adultos-jovenes', label: 'Adultos Jóvenes (25-35 años)', icon: '💼', description: 'Profesional y aspiracional' },
    { value: 'profesionales', label: 'Profesionales (30-45 años)', icon: '👔', description: 'Serio y confiable' },
    { value: 'familias', label: 'Familias con Niños', icon: '👨‍👩‍👧‍👦', description: 'Cálido y familiar' },
    { value: 'seniors', label: 'Seniors (55+ años)', icon: '👴', description: 'Clásico y accesible' },
    { value: 'estudiantes', label: 'Estudiantes', icon: '🎓', description: 'Fresco y económico' },
    { value: 'emprendedores', label: 'Emprendedores', icon: '🚀', description: 'Innovador y motivador' },
    { value: 'general', label: 'Público General', icon: '🌍', description: 'Universal y inclusivo' }
  ]

  const adStyles = [
    { value: 'minimalista', label: 'Minimalista', icon: '⚪', description: 'Limpio, espacios en blanco, tipografía simple' },
    { value: 'elegante', label: 'Elegante y Sofisticado', icon: '✨', description: 'Colores neutros, tipografía serif, lujo' },
    { value: 'vibrante', label: 'Colorido y Vibrante', icon: '🌈', description: 'Colores brillantes, energético, llamativo' },
    { value: 'corporativo', label: 'Profesional Corporativo', icon: '🏢', description: 'Azul, gris, formal, confiable' },
    { value: 'juvenil', label: 'Juvenil y Dinámico', icon: '⚡', description: 'Gradientes, formas orgánicas, moderno' },
    { value: 'vintage', label: 'Vintage y Retro', icon: '📻', description: 'Colores tierra, texturas, nostálgico' },
    { value: 'futurista', label: 'Futurista y Tech', icon: '🤖', description: 'Neón, geometría, digital' },
    { value: 'natural', label: 'Natural y Orgánico', icon: '🌿', description: 'Verde, marrón, texturas naturales' }
  ]

  const colorSchemes = [
    { value: 'auto', label: 'Automático', description: 'Basado en tu marca y estilo' },
    { value: 'blue-purple', label: 'Azul y Púrpura', preview: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { value: 'green-teal', label: 'Verde y Turquesa', preview: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { value: 'orange-red', label: 'Naranja y Rojo', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'pink-purple', label: 'Rosa y Púrpura', preview: 'bg-gradient-to-r from-pink-500 to-purple-500' },
    { value: 'monochrome', label: 'Monocromático', preview: 'bg-gradient-to-r from-gray-400 to-gray-600' }
  ]

  const typography = [
    { value: 'auto', label: 'Automático', description: 'Basado en el estilo seleccionado' },
    { value: 'modern', label: 'Moderno Sans-serif', description: 'Limpio y legible' },
    { value: 'classic', label: 'Clásico Serif', description: 'Elegante y tradicional' },
    { value: 'bold', label: 'Bold y Impactante', description: 'Llamativo y fuerte' },
    { value: 'playful', label: 'Divertido', description: 'Creativo y juvenil' }
  ]

  const imageSizes = [
    { 
      value: '1024x1024', 
      label: 'Cuadrado', 
      description: 'Perfecto para Instagram, Facebook',
      dimensions: '1024x1024',
      price: '$0.04',
      icon: '⬜'
    },
    { 
      value: '1792x1024', 
      label: 'Horizontal', 
      description: 'Ideal para Facebook, LinkedIn, banners',
      dimensions: '1792x1024',
      price: '$0.08',
      icon: '▭'
    },
    { 
      value: '1024x1792', 
      label: 'Vertical', 
      description: 'Perfecto para Stories, Pinterest',
      dimensions: '1024x1792',
      price: '$0.08',
      icon: '▯'
    }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    onFormDataChange({
      ...formData,
      [name]: value
    })
    
    // Limpiar errores locales
    if (localErrors[name]) {
      setLocalErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.targetAudience) {
      errors.targetAudience = 'Selecciona un público objetivo'
    }
    
    if (!formData.adStyle) {
      errors.adStyle = 'Selecciona un estilo de anuncio'
    }
    
    setLocalErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
          <Palette className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Preferencias de Diseño
        </h2>
        <p className="text-gray-600">
          Personaliza el estilo visual de tu anuncio
        </p>
      </div>

      {/* Global Error */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Target Audience */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-4">
            <Users className="h-4 w-4" />
            <span>Público Objetivo *</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {targetAudiences.map((audience) => (
              <label
                key={audience.value}
                className={`relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-colors ${
                  formData.targetAudience === audience.value
                    ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="targetAudience"
                  value={audience.value}
                  checked={formData.targetAudience === audience.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{audience.icon}</span>
                  <div>
                    <span className="block text-sm font-medium text-gray-900">
                      {audience.label}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {audience.description}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {localErrors.targetAudience && (
            <p className="mt-2 text-sm text-red-600">{localErrors.targetAudience}</p>
          )}
        </div>

        {/* Ad Style */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-4">
            <Palette className="h-4 w-4" />
            <span>Estilo Visual *</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {adStyles.map((style) => (
              <label
                key={style.value}
                className={`relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50 transition-colors ${
                  formData.adStyle === style.value
                    ? 'border-purple-600 ring-2 ring-purple-600 bg-purple-50'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="adStyle"
                  value={style.value}
                  checked={formData.adStyle === style.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <span className="block text-sm font-medium text-gray-900">
                      {style.label}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {style.description}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {localErrors.adStyle && (
            <p className="mt-2 text-sm text-red-600">{localErrors.adStyle}</p>
          )}
        </div>

        {/* Color Scheme */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-4">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <span>Esquema de Colores</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {colorSchemes.map((scheme) => (
              <label
                key={scheme.value}
                className={`relative flex cursor-pointer rounded-lg border p-3 hover:bg-gray-50 transition-colors ${
                  formData.colorScheme === scheme.value
                    ? 'border-blue-600 ring-2 ring-blue-600'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="colorScheme"
                  value={scheme.value}
                  checked={formData.colorScheme === scheme.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  {scheme.preview ? (
                    <div className={`w-6 h-6 rounded-full ${scheme.preview}`}></div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"></div>
                  )}
                  <div>
                    <span className="block text-sm font-medium text-gray-900">
                      {scheme.label}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {scheme.description}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-4">
            <Type className="h-4 w-4" />
            <span>Tipografía</span>
          </label>
          <select
            name="typography"
            value={formData.typography || 'auto'}
            onChange={handleInputChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {typography.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
        </div>

        {/* Image Size */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-4">
            <Monitor className="h-4 w-4" />
            <span>Tamaño de Imagen</span>
          </label>
          <div className="space-y-3">
            {imageSizes.map((size) => (
              <label
                key={size.value}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-colors ${
                  formData.imageSize === size.value
                    ? 'border-blue-600 ring-2 ring-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="imageSize"
                  value={size.value}
                  checked={formData.imageSize === size.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{size.icon}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {size.label} ({size.dimensions})
                      </span>
                      <p className="text-xs text-gray-500">{size.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{size.price}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Instructions */}
        <div>
          <label htmlFor="additionalInstructions" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <Wand2 className="h-4 w-4" />
            <span>Instrucciones Especiales (Opcional)</span>
          </label>
          <textarea
            id="additionalInstructions"
            name="additionalInstructions"
            rows={3}
            value={formData.additionalInstructions || ''}
            onChange={handleInputChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="¿Hay algo específico que quieres incluir? Colores, elementos, texto específico..."
            maxLength={200}
          />
          <p className="mt-1 text-xs text-gray-400">
            {formData.additionalInstructions?.length || 0}/200
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>
          
          <button
            type="submit"
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                <span>Generar Anuncio</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StylePreferencesForm 