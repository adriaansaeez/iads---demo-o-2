import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  ArrowLeft, 
  Upload, 
  X, 
  Wand2, 
  Download,
  User,
  LogOut,
  Loader,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'

const CreateAdPage = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    brandName: '',
    productDescription: '',
    targetAudience: '',
    adStyle: '',
    imageSize: '1024x1024',
    additionalInstructions: ''
  })
  
  const [selectedImages, setSelectedImages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAd, setGeneratedAd] = useState(null)
  const [error, setError] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Opciones preconfiguradas
  const targetAudiences = [
    'Jóvenes (18-25 años)',
    'Adultos jóvenes (25-35 años)',
    'Profesionales (30-45 años)',
    'Familias con niños',
    'Seniors (55+ años)',
    'Estudiantes universitarios',
    'Emprendedores',
    'Público general'
  ]

  const adStyles = [
    'Moderno y minimalista',
    'Elegante y sofisticado',
    'Colorido y vibrante',
    'Profesional y corporativo',
    'Juvenil y dinámico',
    'Vintage y retro',
    'Futurista y tecnológico',
    'Natural y orgánico'
  ]

  const imageSizes = [
    { value: '1024x1024', label: 'Cuadrado (1024x1024)', price: '$0.04' },
    { value: '1792x1024', label: 'Horizontal (1792x1024)', price: '$0.08' },
    { value: '1024x1792', label: 'Vertical (1024x1792)', price: '$0.08' },
  ]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setSelectedImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: event.target.result,
            name: file.name
          }])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId))
  }

  const validateForm = () => {
    if (!formData.brandName.trim()) {
      setError('El nombre de la marca es requerido')
      return false
    }
    if (!formData.productDescription.trim()) {
      setError('La descripción del producto es requerida')
      return false
    }
    if (!formData.targetAudience) {
      setError('Selecciona un público objetivo')
      return false
    }
    if (!formData.adStyle) {
      setError('Selecciona un estilo de anuncio')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsGenerating(true)
    setError('')

    try {
      // Aquí irá la llamada a la API cuando esté lista
      // Simulamos el proceso de generación
      setTimeout(() => {
        const mockGeneratedAd = {
          id: Date.now(),
          prompt: `Anuncio profesional para ${formData.brandName}: ${formData.productDescription}. Dirigido a ${formData.targetAudience} con estilo ${formData.adStyle}.`,
          imageUrl: `https://picsum.photos/seed/${Date.now()}/1024/1024`, // Imagen placeholder
          size: formData.imageSize,
          createdAt: new Date().toISOString()
        }
        
        setGeneratedAd(mockGeneratedAd)
        setIsGenerating(false)
      }, 5000) // Simulamos 5 segundos de procesamiento

    } catch (err) {
      setError('Error al generar el anuncio. Inténtalo de nuevo.')
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (generatedAd?.imageUrl) {
      const link = document.createElement('a')
      link.href = generatedAd.imageUrl
      link.download = `anuncio-${formData.brandName}-${Date.now()}.jpg`
      link.click()
    }
  }

  const generateNewAd = () => {
    setGeneratedAd(null)
    setError('')
    // Mantener el formulario para generar una nueva variación
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al Dashboard</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  iAds
                </span>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Dashboard
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Nuevo Anuncio
          </h1>
          <p className="text-gray-600">
            Completa la información y ve el resultado en tiempo real
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 min-h-[600px]">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Información del Anuncio
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Brand Name */}
              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Marca *
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: Nike, Apple, Coca-Cola..."
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Producto *
                </label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  rows={4}
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe tu producto o servicio en detalle..."
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                  Público Objetivo *
                </label>
                <select
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Selecciona tu público objetivo</option>
                  {targetAudiences.map((audience) => (
                    <option key={audience} value={audience}>
                      {audience}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ad Style */}
              <div>
                <label htmlFor="adStyle" className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo del Anuncio *
                </label>
                <select
                  id="adStyle"
                  name="adStyle"
                  value={formData.adStyle}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Selecciona el estilo visual</option>
                  {adStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tamaño de Imagen
                </label>
                <div className="space-y-2">
                  {imageSizes.map((size) => (
                    <label
                      key={size.value}
                      className={`relative flex cursor-pointer rounded-lg border p-3 focus:outline-none ${
                        formData.imageSize === size.value
                          ? 'border-blue-600 ring-2 ring-blue-600'
                          : 'border-gray-300'
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
                        <span className="text-sm font-medium text-gray-900">
                          {size.label}
                        </span>
                        <span className="text-sm text-gray-500">{size.price}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Instructions */}
              <div>
                <label htmlFor="additionalInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones Adicionales (Opcional)
                </label>
                <textarea
                  id="additionalInstructions"
                  name="additionalInstructions"
                  rows={3}
                  value={formData.additionalInstructions}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cualquier detalle específico..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    <span>Generar Anuncio</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Vista Previa del Anuncio
            </h2>

            {!generatedAd && !isGenerating ? (
              // Empty State
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tu anuncio aparecerá aquí
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Completa el formulario de la izquierda y haz clic en "Generar Anuncio" para ver el resultado.
                </p>
              </div>
            ) : isGenerating ? (
              // Loading State
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                  <Loader className="h-8 w-8 text-white animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generando tu anuncio...
                </h3>
                <p className="text-gray-600 text-sm max-w-sm">
                  Nuestro sistema de IA está creando el anuncio perfecto para tu marca.
                </p>
              </div>
            ) : (
              // Generated Ad Display
              <div className="space-y-6">
                <div className="text-center">
                  <img
                    src={generatedAd.imageUrl}
                    alt={`Anuncio para ${formData.brandName}`}
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>

                {/* Ad Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Detalles:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marca:</span>
                      <span className="font-medium">{formData.brandName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estilo:</span>
                      <span className="font-medium">{formData.adStyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamaño:</span>
                      <span className="font-medium">{formData.imageSize}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={downloadImage}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Descargar Anuncio</span>
                  </button>
                  
                  <button
                    onClick={generateNewAd}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Wand2 className="h-5 w-5" />
                    <span>Generar Nueva Variación</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateAdPage