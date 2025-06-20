import { Link } from 'react-router-dom'
import { Sparkles, Zap, Target, ArrowRight, Check } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AdGenius AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">
              Impulsado por Inteligencia Artificial
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Crea anuncios
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}visuales únicos
            </span>
            <br />
            en segundos
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transforma la descripción de tu producto en anuncios visuales profesionales 
            usando el poder de la inteligencia artificial. Sin diseñadores, sin complicaciones.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Crear mi primer anuncio</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2">
              <span>Ver demo</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </button>
          </div>

          {/* Demo Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border border-gray-200/20">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Vista previa del anuncio generado</p>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce delay-1000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para crear anuncios increíbles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desde la idea hasta el anuncio final, nuestra IA se encarga de todo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/20">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">IA Avanzada</h3>
              <p className="text-gray-600">
                Utilizamos GPT-4 y DALL-E 3 para generar contenido visual único y profesional
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/20">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Súper Rápido</h3>
              <p className="text-gray-600">
                Genera anuncios profesionales en menos de 30 segundos
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/20">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Alta Calidad</h3>
              <p className="text-gray-600">
                Imágenes en HD listas para usar en cualquier plataforma
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para revolucionar tus anuncios?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de empresas que ya están creando anuncios increíbles con IA
          </p>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Comenzar gratis ahora</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AdGenius AI</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 AdGenius AI. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 