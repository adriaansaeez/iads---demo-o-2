import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  Plus, 
  Image, 
  Download, 
  BarChart3, 
  Crown, 
  User, 
  LogOut, 
  Settings,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react'

const Dashboard = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Mock data - esto vendrá de la API cuando esté lista
  const mockAds = [
    {
      id: 1,
      title: "Anuncio de Zapatillas Nike",
      createdAt: "2024-01-15",
      imageUrl: null,
      status: "completado",
      views: 234
    },
    {
      id: 2,
      title: "Promoción Café Premium",
      createdAt: "2024-01-14",
      imageUrl: null,
      status: "procesando",
      views: 156
    },
    {
      id: 3,
      title: "Oferta Smartphone Samsung",
      createdAt: "2024-01-13",
      imageUrl: null,
      status: "completado",
      views: 445
    }
  ]

  const stats = {
    totalAds: mockAds.length,
    thisMonth: 3,
    totalViews: mockAds.reduce((sum, ad) => sum + ad.views, 0),
    remainingCredits: user?.plan === 'free' ? 2 : 97
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AdGenius AI
              </span>
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
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    {user?.plan === 'free' ? (
                      <>Plan Gratuito</>
                    ) : (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        Plan Pro
                      </>
                    )}
                  </p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="h-4 w-4 mr-3" />
                    Configuración
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Crown className="h-4 w-4 mr-3" />
                    Actualizar Plan
                  </a>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Listo para crear anuncios increíbles con inteligencia artificial
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Anuncios Creados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAds}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Image className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visualizaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Créditos Restantes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.remainingCredits}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create New Ad Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">
                ¿Listo para tu próximo anuncio?
              </h2>
              <p className="text-blue-100">
                Crea anuncios profesionales en segundos con el poder de la IA
              </p>
            </div>
            <Link
              to="/create-ad"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Crear Nuevo Anuncio</span>
            </Link>
          </div>
        </div>

        {/* Recent Ads */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Anuncios Recientes</h2>
              <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                Ver todos
              </button>
            </div>
          </div>

          <div className="p-6">
            {mockAds.length > 0 ? (
              <div className="space-y-4">
                {mockAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        {ad.imageUrl ? (
                          <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Image className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{ad.views} vistas</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            ad.status === 'completado' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ad.status === 'completado' ? 'Completado' : 'Procesando'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                        <BarChart3 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aún no has creado anuncios
                </h3>
                <p className="text-gray-500 mb-6">
                  Crea tu primer anuncio para comenzar a ver estadísticas aquí
                </p>
                <Link
                  to="/create-ad"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Crear Mi Primer Anuncio</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard