import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ProductInfoForm from './forms/ProductInfoForm'
import StylePreferencesForm from './forms/StylePreferencesForm'
import FormProgress from './forms/FormProgress'
import ProductService from '../services/productService'

const CreateAdWizard = ({ onAdGenerated, isGenerating, error }) => {
  const location = useLocation();
  const productFromState = location.state?.product;
  const skipProductForm = location.state?.skipProductForm || false;
  
  const [currentStep, setCurrentStep] = useState(skipProductForm ? 2 : 1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [creatingProduct, setCreatingProduct] = useState(false)
  const [formData, setFormData] = useState({
    // Paso 1: Información del producto
    productName: productFromState?.name || '',
    website: productFromState?.website || '',
    description: productFromState?.desc || '',
    productId: productFromState?.id || null,
    
    // Paso 2: Preferencias de diseño
    targetAudience: '',
    adStyle: '',
    colorScheme: 'auto',
    typography: 'auto',
    imageSize: '1024x1024',
    additionalInstructions: ''
  })

  // Efecto para marcar el paso 1 como completado si viene con producto
  useEffect(() => {
    if (skipProductForm && productFromState) {
      setCompletedSteps([1]);
    }
  }, [skipProductForm, productFromState]);

  const handleFormDataChange = (newData) => {
    setFormData(newData)
  }

  const handleNext = async () => {
    try {
      // Si estamos en el paso 1 y no hay producto preseleccionado, crear el producto
      if (currentStep === 1 && !productFromState) {
        setCreatingProduct(true);
        
        // Validar campos requeridos del producto
        if (!formData.productName || !formData.description || !formData.website) {
          throw new Error('Todos los campos del producto son requeridos');
        }

        // Crear el producto en la base de datos
        const productData = {
          name: formData.productName,
          desc: formData.description,
          website: formData.website
        };

        const createdProduct = await ProductService.create(productData);
        
        // Actualizar formData con el ID del producto creado
        setFormData(prev => ({
          ...prev,
          productId: createdProduct.id
        }));

        console.log('✅ Producto creado exitosamente:', createdProduct);
        setCreatingProduct(false);
        
        // Opcional: Mostrar mensaje de éxito
        // alert(`✅ Producto "${createdProduct.name}" creado exitosamente`);
      }

      // Marcar el paso actual como completado
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }
      
      // Avanzar al siguiente paso
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1)
      }
      
    } catch (error) {
      setCreatingProduct(false);
      console.error('Error creando producto:', error);
      // Aquí podrías mostrar un error al usuario
      alert(`Error creando producto: ${error.message}`);
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
    setCurrentStep(skipProductForm ? 2 : 1)
    setCompletedSteps(skipProductForm && productFromState ? [1] : [])
    setFormData({
      productName: productFromState?.name || '',
      website: productFromState?.website || '',
      description: productFromState?.desc || '',
      productId: productFromState?.id || null,
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
        {/* Mostrar información del producto si viene desde el dashboard */}
        {productFromState && currentStep === 2 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Creando anuncio para: {productFromState.name}
            </h3>
            <p className="text-blue-700 text-sm">
              {productFromState.desc}
            </p>
            {productFromState.website && (
              <p className="text-blue-600 text-sm mt-1">
                Sitio web: {productFromState.website}
              </p>
            )}
          </div>
        )}

        {currentStep === 1 && !skipProductForm && (
          <ProductInfoForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleNext}
            error={error}
            isCreatingProduct={creatingProduct}
          />
        )}

        {currentStep === 2 && (
          <StylePreferencesForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onBack={skipProductForm ? null : handleBack}
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
            error={error}
            isProductPreselected={!!productFromState}
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