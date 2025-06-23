import { useState } from 'react'
import ProductInfoForm from './forms/ProductInfoForm'
import StylePreferencesForm from './forms/StylePreferencesForm'
import FormProgress from './forms/FormProgress'

const CreateAdWizard = ({ onAdGenerated, isGenerating, error }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [formData, setFormData] = useState({
    // Paso 1: Información del producto
    productName: '',
    website: '',
    description: '',
    
    // Paso 2: Preferencias de diseño
    targetAudience: '',
    adStyle: '',
    colorScheme: 'auto',
    typography: 'auto',
    imageSize: '1024x1024',
    additionalInstructions: ''
  })

  const handleFormDataChange = (newData) => {
    setFormData(newData)
  }

  const handleNext = () => {
    // Marcar el paso actual como completado
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }
    
    // Avanzar al siguiente paso
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Validar que todos los campos requeridos estén completos
    const requiredFields = [
      'productName',
      'website', 
      'description',
      'targetAudience',
      'adStyle'
    ]

    const missingFields = requiredFields.filter(field => !formData[field]?.trim())
    
    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields)
      return
    }

    // Marcar el paso 2 como completado
    if (!completedSteps.includes(2)) {
      setCompletedSteps(prev => [...prev, 2])
    }

    // Llamar a la función de generación del anuncio
    onAdGenerated(formData)
  }

  const resetWizard = () => {
    setCurrentStep(1)
    setCompletedSteps([])
    setFormData({
      productName: '',
      website: '',
      description: '',
      targetAudience: '',
      adStyle: '',
      colorScheme: 'auto',
      typography: 'auto',
      imageSize: '1024x1024',
      additionalInstructions: ''
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <FormProgress 
        currentStep={currentStep} 
        completedSteps={completedSteps} 
      />

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {currentStep === 1 && (
          <ProductInfoForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
            error={error}
          />
        )}

        {currentStep === 2 && (
          <StylePreferencesForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
            error={error}
          />
        )}
      </div>

      {/* Debug Info (Solo para desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Estado del Formulario (Debug)</h3>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify({ currentStep, completedSteps, formData }, null, 2)}
          </pre>
          <button
            onClick={resetWizard}
            className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Reset Wizard
          </button>
        </div>
      )}
    </div>
  )
}

export default CreateAdWizard 