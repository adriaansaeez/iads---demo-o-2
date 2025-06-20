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

  const resetForm = () => {
    setGeneratedAd(null)
    setFormData({
      brandName: '',
      productDescription: '',
      targetAudience: '',
      adStyle: '',
      imageSize: '1024x1024',
      additionalInstructions: ''
    })
    setSelectedImages([])
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
                  AdGenius AI
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
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!generatedAd ? (
          <>
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Crear Nuevo Anuncio
              </h1>
              <p className="text-gray-600">
                Completa la información para generar un anuncio único con IA
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
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
                    placeholder="Describe tu producto o servicio en detalle. Incluye características clave, beneficios y lo que lo hace especial..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Sé específico. Esta información se usará para generar el prompt del anuncio.
                  </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {imageSizes.map((size) => (
                      <label
                        key={size.value}
                        className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
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
                        <div className="flex flex-col flex-1">
                          <span className="block text-sm font-medium text-gray-900">
                            {size.label}
                          </span>
                          <span className="text-sm text-gray-500">{size.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imágenes del Producto (Opcional)
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Subir archivos</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF hasta 10MB
                      </p>
                    </div>
                  </div>

                  {/* Preview uploaded images */}
                  {selectedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedImages.map((image) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.preview}
                            alt={image.name}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    placeholder="Cualquier detalle específico que quieras incluir en el anuncio..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Generando anuncio...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5" />
                        <span>Generar Anuncio con IA</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          // Generated Ad Result
          <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Anuncio Generado Exitosamente!
              </h1>
              <p className="text-gray-600">
                Tu anuncio está listo para descargar y usar
              </p>
            </div>

            {/* Generated Ad Display */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <img
                  src={generatedAd.imageUrl}
                  alt={`Anuncio para ${formData.brandName}`}
                  className="mx-auto rounded-lg shadow-lg max-w-md w-full"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Detalles del Anuncio
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Marca:</strong> {formData.brandName}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Público:</strong> {formData.targetAudience}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Estilo:</strong> {formData.adStyle}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Tamaño:</strong> {formData.imageSize}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={downloadImage}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Descargar Anuncio</span>
                  </button>
                  
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Wand2 className="h-5 w-5" />
                    <span>Crear Otro Anuncio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Loader className="h-8 w-8 text-white animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generando tu anuncio...
              </h3>
              <p className="text-gray-600 text-sm">
                Esto puede tomar unos segundos. ¡La espera valdrá la pena!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CreateAdPage