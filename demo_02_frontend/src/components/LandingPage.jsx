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

              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                iAds
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
          </div>

          {/* Ejemplos de Anuncios Generados */}
          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Anuncios creados con iAds
              </h3>
              <p className="text-gray-600">
                Ejemplos reales generados por nuestra IA
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Anuncio 1 - Sneakers */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 transform hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&crop=center" 
                  alt="Anuncio sneakers modernos"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">Deportes</span>
                    <span className="text-xs text-gray-500">Cuadrado</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Estilo moderno</p>
                </div>
              </div>

              {/* Anuncio 2 - Luxury Watch */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 transform hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop&crop=center" 
                  alt="Anuncio reloj de lujo"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-600">Lujo</span>
                    <span className="text-xs text-gray-500">Horizontal</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Elegante</p>
                </div>
              </div>

              {/* Anuncio 3 - Coffee */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 transform hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=500&fit=crop&crop=center" 
                  alt="Anuncio café artesanal"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-600">Café</span>
                    <span className="text-xs text-gray-500">Vertical</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Natural</p>
                </div>
              </div>

              {/* Anuncio 4 - Beauty */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 transform hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop&crop=center" 
                  alt="Anuncio productos belleza"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-pink-600">Belleza</span>
                    <span className="text-xs text-gray-500">Cuadrado</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Minimalista</p>
                </div>
              </div>
            </div>

            {/* Segunda fila de ejemplos */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-6">
              {/* Anuncio 5 - Car */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 transform hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&h=500&fit=crop&crop=center" 
                  alt="Anuncio automóvil premium"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Automotriz</span>
                    <span className="text-xs text-gray-500">Horizontal</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Futurista</p>
                </div>
              </div>

              {/* Anuncio 6 - Travel */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 transform hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=500&fit=crop&crop=center" 
                  alt="Anuncio viajes exóticos"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-teal-600">Viajes</span>
                    <span className="text-xs text-gray-500">Vertical</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Aventura</p>
                </div>
              </div>

              {/* Anuncio 7 - Tech */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/20 transform hover:scale-105 transition-all duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=500&fit=crop&crop=center" 
                  alt="Anuncio gadgets tech"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-600">Tech</span>
                    <span className="text-xs text-gray-500">Cuadrado</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Moderno</p>
                </div>
              </div>
            </div>

            {/* Stats de los ejemplos */}
            <div className="mt-8 flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">15s</div>
                <div className="text-sm text-gray-600">Tiempo promedio</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">4K+</div>
                <div className="text-sm text-gray-600">Anuncios creados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Satisfacción</div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
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
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-lg font-bold text-white">iAds</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 iAds. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 