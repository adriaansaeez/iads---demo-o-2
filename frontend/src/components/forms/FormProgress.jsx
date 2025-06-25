import { Building, Palette, CheckCircle } from 'lucide-react'

const FormProgress = ({ currentStep, completedSteps = [] }) => {
  const steps = [
    {
      id: 1,
      title: 'Información del Producto',
      description: 'Datos básicos',
      icon: Building
    },
    {
      id: 2,
      title: 'Preferencias de Diseño',
      description: 'Estilo visual',
      icon: Palette
    }
  ]

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) {
      return 'completed'
    } else if (stepId === currentStep) {
      return 'current'
    } else {
      return 'upcoming'
    }
  }

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white border-green-600'
      case 'current':
        return 'bg-blue-600 text-white border-blue-600'
      case 'upcoming':
        return 'bg-gray-100 text-gray-400 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-400 border-gray-300'
    }
  }

  const getConnectorClasses = (index) => {
    const nextStepId = steps[index + 1]?.id
    if (!nextStepId) return ''
    
    const nextStatus = getStepStatus(nextStepId)
    return nextStatus === 'completed' || nextStatus === 'current'
      ? 'bg-green-600'
      : 'bg-gray-300'
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          const Icon = step.icon
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    relative w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 ${getStepClasses(status)}
                  `}
                >
                  {status === 'completed' ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                  
                  {/* Pulse animation for current step */}
                  {status === 'current' && (
                    <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
                  )}
                </div>
                
                {/* Step Info */}
                <div className="mt-3 text-center">
                  <p className={`text-sm font-medium transition-colors ${
                    status === 'upcoming' ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs transition-colors ${
                    status === 'upcoming' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-1 rounded-full transition-all duration-500 ${getConnectorClasses(index)}`}
                  ></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progreso</span>
          <span>{Math.round((completedSteps.length / steps.length) * 100)}% completado</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(completedSteps.length / steps.length) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default FormProgress 