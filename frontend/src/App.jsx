import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import CreateAdPage from './pages/CreateAdPage'
import UsersPage from './pages/UsersPage'
import ProductsPage from './pages/ProductsPage'
import PromptsPage from './pages/PromptsPage'
import AuthService from './services/authService'
import AccessDenied from './components/AccessDenied'
import { PAGE_PERMISSIONS } from './components/ProtectedRoute'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verificar autenticación al cargar la app
    const checkAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const userData = await AuthService.getMe()
          setIsAuthenticated(true)
          setUser(userData)
        } catch (error) {
          console.error('Error verificando autenticación:', error)
          AuthService.clearAuth()
          setIsAuthenticated(false)
          setUser(null)
        }
      }
    }
    
    checkAuth()
  }, [])

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  // Función para verificar permisos
  const canAccessPage = (requiredRoles = []) => {
    if (!isAuthenticated || !user) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
          } />
          
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : 
            <LoginPage onLogin={handleLogin} />
          } />
          
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : 
            <RegisterPage onLogin={handleLogin} />
          } />
          
          <Route path="/dashboard" element={
            isAuthenticated ? 
            <Dashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/" replace />
          } />
          
          <Route path="/create-ad" element={
            isAuthenticated ? 
            <CreateAdPage user={user} onLogout={handleLogout} /> : 
            <Navigate to="/" replace />
          } />
          
          <Route path="/users" element={
            isAuthenticated ? (
              canAccessPage(PAGE_PERMISSIONS.USERS) ? 
              <UsersPage user={user} onLogout={handleLogout} /> : 
              <AccessDenied 
                title="Solo Administradores"
                message="Solo los administradores pueden gestionar usuarios."
              />
            ) : <Navigate to="/" replace />
          } />
          
          <Route path="/products" element={
            isAuthenticated ? (
              canAccessPage(PAGE_PERMISSIONS.PRODUCTS) ? 
              <ProductsPage user={user} onLogout={handleLogout} /> : 
              <AccessDenied 
                title="Acceso Restringido"
                message="Solo administradores y managers pueden gestionar productos."
              />
            ) : <Navigate to="/" replace />
          } />
          
          <Route path="/prompts" element={
            isAuthenticated ? (
              canAccessPage(PAGE_PERMISSIONS.PROMPTS) ? 
              <PromptsPage user={user} onLogout={handleLogout} /> : 
              <AccessDenied 
                title="Acceso Restringido"
                message="Solo administradores y managers pueden ver todos los prompts."
              />
            ) : <Navigate to="/" replace />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
