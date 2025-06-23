import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  ArrowLeft, 
  Download,
  User,
  LogOut,
  Loader,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Wand2
} from 'lucide-react'
import CreateAdWizard from './CreateAdWizard'
import AdService from '../services/adService'

const CreateAdPage = ({ user, onLogout }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [generatedAd, setGeneratedAd] = useState(null)
  const [error, setError] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [generationStep, setGenerationStep] = useState('')

  const handleAdGenerated = async (formData) => {
    setIsGenerating(true)
    setError('')
    setGenerationStep('Iniciando análisis de marca...')

    try {
      console.log('🚀 Iniciando generación de anuncio con datos:', formData)
      
      // Simular pasos de progreso
      setTimeout(() => setGenerationStep('Analizando página web y marca...'), 1000)
      setTimeout(() => setGenerationStep('Generando prompts creativos...'), 3000)
      setTimeout(() => setGenerationStep('Creando imagen del anuncio...'), 5000)
      
      // Llamada real a la API
      const result = await AdService.generateAd(formData)
      
      // Estructurar la respuesta para el frontend
      const generatedAd = {
        id: result.id,
        brandAnalysis: result.brandAnalysis,
        creativePrompts: result.creativePrompts,
        prompt: result.creativePrompts?.finalPrompt || 'Prompt generado',
        imageUrl: result.adImage?.url,
        size: result.adImage?.size || formData.imageSize,
        formData: result.formData,
        createdAt: result.createdAt
      }
      
      setGeneratedAd(generatedAd)
      setIsGenerating(false)
      setGenerationStep('')
      
      console.log('✅ Anuncio generado exitosamente:', generatedAd)

    } catch (err) {
      console.error('❌ Error generando anuncio:', err)
      const formattedError = AdService.formatError(err)
      setError(formattedError)
      setIsGenerating(false)
      setGenerationStep('')
    }
  }

  const downloadImage = async () => {
    if (generatedAd?.imageUrl) {
      try {
        const filename = `anuncio-${generatedAd.formData?.productName || 'producto'}-${Date.now()}.png`
        await AdService.downloadImage(generatedAd.imageUrl, filename)
      } catch (error) {
        setError('Error al descargar la imagen. Inténtalo de nuevo.')
      }
    }
  }

  const generateNewAd = () => {
    setGeneratedAd(null)
    setError('')
    setGenerationStep('')
    // Mantener el formulario para generar una nueva variación
  }

  const regenerateImage = async () => {
    if (!generatedAd?.prompt) return
    
    setIsRegenerating(true)
    setError('')

    try {
      console.log('🎨 Regenerando imagen...')
      const result = await AdService.regenerateImage(generatedAd.prompt, generatedAd.size)
      
      // Actualizar solo la imagen del anuncio existente
      setGeneratedAd(prev => ({
        ...prev,
        imageUrl: result.adImage.url,
        createdAt: result.adImage.createdAt
      }))
      
      setIsRegenerating(false)
      console.log('✅ Imagen regenerada exitosamente')

    } catch (err) {
      console.error('❌ Error regenerando imagen:', err)
      const formattedError = AdService.formatError(err)
      setError(formattedError)
      setIsRegenerating(false)
    }
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

        {/* Layout Condicional */}
        {!generatedAd ? (
          // Wizard de Creación
          <CreateAdWizard
            onAdGenerated={handleAdGenerated}
            isGenerating={isGenerating}
            error={error}
          />
        ) : (
          // Vista con Resultado
          <div className="grid lg:grid-cols-3 gap-6 min-h-[600px]">
            {/* Left Column - Brand Analysis */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información del Producto */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📝 Información del Producto
                </h2>
              
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Producto:</span>
                    <p className="text-gray-900 font-semibold">{generatedAd.formData?.productName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Tamaño:</span>
                    <p className="text-gray-900">{generatedAd.size}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Público Objetivo:</span>
                    <p className="text-gray-900">{generatedAd.formData?.targetAudience}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Estilo:</span>
                    <p className="text-gray-900">{generatedAd.formData?.adStyle}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600 font-medium">Website:</span>
                    <a 
                      href={generatedAd.formData?.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-700 underline"
                    >
                      {generatedAd.formData?.website}
                    </a>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600 font-medium">Descripción:</span>
                    <p className="text-gray-900 mt-1">{generatedAd.formData?.description}</p>
                  </div>
                </div>
              </div>

              {/* Análisis Completo de Marca */}
              {generatedAd.brandAnalysis && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    🎯 Análisis Completo de Marca
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Información de la Marca */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">📊 Información de la Marca</h4>
                      <div className="space-y-3 text-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-600 font-medium">Categoría:</span>
                            <p className="text-gray-900">{generatedAd.brandAnalysis.brandInfo?.category}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">Mercado Objetivo:</span>
                            <p className="text-gray-900">{generatedAd.brandAnalysis.brandInfo?.targetMarket}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Descripción Expandida:</span>
                          <p className="text-gray-900 mt-1">{generatedAd.brandAnalysis.brandInfo?.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Personalidad de Marca */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">🎭 Personalidad de Marca</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-600 font-medium">Tono de Comunicación:</span>
                          <p className="text-gray-900">{generatedAd.brandAnalysis.brandPersonality?.tone}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Posicionamiento:</span>
                          <p className="text-gray-900">{generatedAd.brandAnalysis.brandPersonality?.positioning}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Valores de Marca:</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {generatedAd.brandAnalysis.brandPersonality?.values?.map((value, index) => (
                              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Identidad Visual */}
                    {generatedAd.brandAnalysis.visualIdentity && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">🎨 Identidad Visual</h4>
                        <div className="space-y-3 text-sm">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-gray-600 font-medium">Estilo Tipográfico:</span>
                              <p className="text-gray-900">{generatedAd.brandAnalysis.visualIdentity?.fontStyle}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 font-medium">Estilo Fotográfico:</span>
                              <p className="text-gray-900">{generatedAd.brandAnalysis.visualIdentity?.imageStyle}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">Colores Primarios:</span>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {generatedAd.brandAnalysis.visualIdentity?.primaryColors?.map((color, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div 
                                    className="w-6 h-6 rounded border border-gray-300" 
                                    style={{ backgroundColor: color }}
                                  ></div>
                                  <span className="text-xs font-mono">{color}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ventajas Competitivas */}
                    {generatedAd.brandAnalysis.competitiveAdvantages && (
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">🏆 Ventajas Competitivas</h4>
                        <div className="space-y-2">
                          {generatedAd.brandAnalysis.competitiveAdvantages.map((advantage, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <span className="text-orange-600 font-bold text-sm">•</span>
                              <span className="text-gray-900 text-sm">{advantage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Perfil del Cliente */}
                    {generatedAd.brandAnalysis.customerProfile && (
                      <div className="bg-teal-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">👥 Perfil del Cliente</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-gray-600 font-medium">Demografía:</span>
                            <p className="text-gray-900">{generatedAd.brandAnalysis.customerProfile?.demographics}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">Psicografía:</span>
                            <p className="text-gray-900">{generatedAd.brandAnalysis.customerProfile?.psychographics}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">Problemas (Pain Points):</span>
                            <div className="mt-1 space-y-1">
                              {generatedAd.brandAnalysis.customerProfile?.painPoints?.map((pain, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <span className="text-red-500 text-xs">⚠️</span>
                                  <span className="text-gray-900 text-sm">{pain}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">Deseos:</span>
                            <div className="mt-1 space-y-1">
                              {generatedAd.brandAnalysis.customerProfile?.desires?.map((desire, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <span className="text-green-500 text-xs">✨</span>
                                  <span className="text-gray-900 text-sm">{desire}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ángulos de Marketing */}
                    {generatedAd.brandAnalysis.marketingAngles && (
                      <div className="bg-pink-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">📈 Ángulos de Marketing</h4>
                        <div className="space-y-2">
                          {generatedAd.brandAnalysis.marketingAngles.map((angle, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <span className="text-pink-600 font-bold text-sm">{index + 1}.</span>
                              <span className="text-gray-900 text-sm">{angle}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Prompts Creativos Detallados */}
              {generatedAd.creativePrompts && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    ✨ Estrategia Creativa Completa
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Concepto Creativo */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">💡 Concepto Creativo</h4>
                      <p className="text-gray-900 text-sm leading-relaxed">{generatedAd.creativePrompts.conceptualIdea}</p>
                    </div>

                    {/* Emociones Objetivo */}
                    {generatedAd.creativePrompts.targetEmotions && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">🎭 Emociones Objetivo</h4>
                        <div className="flex flex-wrap gap-2">
                          {generatedAd.creativePrompts.targetEmotions.map((emotion, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {emotion}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mensajes Clave */}
                    {generatedAd.creativePrompts.keyMessages && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">🎯 Mensajes Clave</h4>
                        <div className="space-y-2">
                          {generatedAd.creativePrompts.keyMessages.map((message, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <span className="text-green-600 font-bold text-sm">{index + 1}.</span>
                              <span className="text-gray-900 text-sm">{message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Elementos Visuales */}
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">🎨 Elementos Visuales</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-600 font-medium">Header Principal:</span>
                          <p className="text-gray-900 font-bold text-lg mt-1">{generatedAd.creativePrompts.visualElements?.header}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Subheader:</span>
                          <p className="text-gray-900 mt-1">{generatedAd.creativePrompts.visualElements?.subheader}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Call to Action:</span>
                          <p className="text-gray-900 font-semibold mt-1">{generatedAd.creativePrompts.visualElements?.callToAction}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Estilo Visual:</span>
                          <p className="text-gray-900 mt-1">{generatedAd.creativePrompts.visualElements?.visualStyle}</p>
                        </div>
                      </div>
                    </div>

                    {/* Prompt Final para DALL-E */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">🤖 Prompt Final para DALL-E 3</h4>
                      <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm max-h-40 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{generatedAd.creativePrompts.finalPrompt}</pre>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Este es el prompt exacto que se envió a DALL-E 3 para generar la imagen
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Preview */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  🎨 Anuncio Generado
                </h2>

                {isGenerating ? (
                  // Loading State
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                      <Loader className="h-8 w-8 text-white animate-spin" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Generando tu anuncio...
                    </h3>
                    <p className="text-gray-600 text-sm max-w-sm mb-4">
                      {generationStep || 'Nuestro sistema de IA está creando el anuncio perfecto para tu marca.'}
                    </p>
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                ) : (
                  // Generated Ad Display
                  <div className="space-y-6">
                    <div className="text-center">
                      <img
                        src={generatedAd.imageUrl}
                        alt={`Anuncio para ${generatedAd.formData?.productName}`}
                        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      />
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
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={regenerateImage}
                          disabled={isRegenerating}
                          className="bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isRegenerating ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                          <span>{isRegenerating ? 'Regenerando...' : 'Nueva Imagen'}</span>
                        </button>
                        
                        <button
                          onClick={generateNewAd}
                          className="bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Wand2 className="h-5 w-5" />
                          <span>Nuevo Anuncio</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Botones de Acción */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Acciones</h3>
                <div className="space-y-3">
                  <button
                    onClick={generateNewAd}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Wand2 className="h-5 w-5" />
                    <span>Crear Nuevo Anuncio</span>
                  </button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      ¿Quieres probar con diferentes parámetros?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CreateAdPage