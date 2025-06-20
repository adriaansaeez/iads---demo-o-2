import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import Dashboard from './components/Dashboard'
import CreateAdPage from './components/CreateAdPage'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verificar si hay un token en localStorage al cargar la app
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
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
        </Routes>
      </div>
    </Router>
  )
}

export default App
