import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccessDenied = ({ 
  title = "Acceso Denegado",
  message = "No tienes permisos para acceder a esta página.",
  showBackButton = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-600">
              {message}
            </p>
          </div>

          {showBackButton && (
            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al Dashboard</span>
              </Link>
              
              <p className="text-sm text-gray-500">
                Si crees que deberías tener acceso, contacta al administrador.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 