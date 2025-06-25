import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Package, 
  Zap, 
  TrendingUp, 
  Calendar,
  Activity,
  BarChart3,
  RefreshCw,
  Users
} from 'lucide-react';
import Navigation from '../components/Navigation';
import UserProductsList from '../components/UserProductsList';
import DashboardService from '../services/dashboardService';
import { ProtectedContent, usePermissions, PAGE_PERMISSIONS } from '../components/ProtectedRoute';
import promptService from '../services/promptService';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { canAccess } = usePermissions();
  const [dashboardData, setDashboardData] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsData, productsData, promptsData] = await Promise.all([
        DashboardService.getDashboardStats(),
        DashboardService.getUserProducts(),
        promptService.getRecent(3)
      ]);
      
      setDashboardData(statsData);
      setUserProducts(productsData);
      setRecentPrompts(promptsData?.prompts || promptsData || []);
    } catch (err) {
      setError(err.message || 'Error cargando datos del dashboard');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewAd = () => {
    // Si el usuario no tiene productos, ir al formulario completo
    if (!userProducts || userProducts.length === 0) {
      navigate('/create-ad');
    } else {
      // Si tiene productos, mostrar el selector (esto se puede implementar como modal o página)
      navigate('/create-ad?show-selector=true');
    }
  };

  const handleCreateAdForProduct = (product) => {
    // Navegar al segundo formulario con los datos del producto
    navigate('/create-ad', { 
      state: { 
        product: product,
        skipProductForm: true 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} onLogout={onLogout} currentPage="dashboard" />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={user} onLogout={onLogout} currentPage="dashboard" />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} currentPage="dashboard" />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user?.username}! 👋
          </h1>
          <p className="text-gray-600">
            Aquí tienes el resumen de tu actividad y productos
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.products?.total || 0}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.products?.thisWeek || 0} esta semana
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Anuncios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.prompts?.total || 0}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.prompts?.thisWeek || 0} esta semana
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productividad</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.productivity?.averagePromptsPerProduct || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">anuncios/producto</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio Semanal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.productivity?.weeklyAverage || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">anuncios/día</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
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
                {userProducts.length > 0 
                  ? 'Selecciona un producto existente o crea uno nuevo' 
                  : 'Crea tu primer producto y comienza a generar anuncios'}
              </p>
            </div>
            <button
              onClick={handleCreateNewAd}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Crear Nuevo Anuncio</span>
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="mb-8">
          <UserProductsList 
            products={userProducts} 
            onCreateAdForProduct={handleCreateAdForProduct}
          />
        </div>

        {/* Recent Prompts */}
        {recentPrompts && recentPrompts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Anuncios Recientes
                </h3>
                <Link
                  to="/prompts"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentPrompts.map((prompt) => {
                  const product = promptService.getFirstProduct(prompt);
                  const isCompleted = promptService.isCompleted(prompt);
                  const isFailed = promptService.isFailed(prompt);
                  const isGenerating = promptService.isGenerating(prompt);

                  return (
                    <div key={prompt.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      {/* Status indicator */}
                      <div className={`w-3 h-3 rounded-full ${
                        isCompleted ? 'bg-green-500' : 
                        isFailed ? 'bg-red-500' : 
                        isGenerating ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      
                      {/* Image thumbnail if available */}
                      {isCompleted && prompt.imageUrl && (
                        <img
                          src={prompt.imageUrl}
                          alt={prompt.title || 'Anuncio'}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {prompt.title || 'Anuncio sin título'}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isCompleted ? 'bg-green-100 text-green-800' : 
                            isFailed ? 'bg-red-100 text-red-800' : 
                            isGenerating ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isCompleted ? 'Completado' : isFailed ? 'Fallido' : isGenerating ? 'Generando...' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {product && (
                            <span>Producto: {product.name}</span>
                          )}
                          <span>{promptService.getFormattedDate(prompt)}</span>
                          {prompt.processingTime && isCompleted && (
                            <span>Tiempo: {promptService.getProcessingDuration(prompt)}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {isCompleted && (
                        <div className="flex items-center gap-2">
                          {prompt.imageUrl && (
                            <button
                              onClick={() => window.open(prompt.imageUrl, '_blank')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Ver imagen
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gestionar Productos - Solo Admin/Manager */}
          <ProtectedContent allowedRoles={PAGE_PERMISSIONS.PRODUCTS}>
            <Link
              to="/products"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Gestionar Productos</h3>
                  <p className="text-sm text-gray-500">Ver y editar todos los productos</p>
                </div>
              </div>
            </Link>
          </ProtectedContent>

          {/* Ver Anuncios - Solo Admin/Manager */}
          <ProtectedContent allowedRoles={PAGE_PERMISSIONS.PROMPTS}>
            <Link
              to="/prompts"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Ver Anuncios</h3>
                  <p className="text-sm text-gray-500">Revisar todos los anuncios</p>
                </div>
              </div>
            </Link>
          </ProtectedContent>

          {/* Gestionar Usuarios - Solo Admin */}
          <ProtectedContent allowedRoles={PAGE_PERMISSIONS.USERS}>
            <Link
              to="/users"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Gestionar Usuarios</h3>
                  <p className="text-sm text-gray-500">Administrar cuentas de usuario</p>
                </div>
              </div>
            </Link>
          </ProtectedContent>

          {/* Para usuarios normales, mostrar una alternativa */}
          {!canAccess(PAGE_PERMISSIONS.PRODUCTS) && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Mi Actividad</h3>
                  <p className="text-sm text-gray-500">Resumen de tus anuncios creados</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;