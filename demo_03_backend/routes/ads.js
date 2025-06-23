const express = require('express');
const router = express.Router();
const { analyzeWebsite, generateAdPrompts, generateAdImage } = require('../services/openaiService');

// Endpoint para generar un anuncio completo
router.post('/generate', async (req, res) => {
  try {
    const { formData } = req.body;
    
    // Validar datos requeridos
    if (!formData || !formData.productName || !formData.website || !formData.description) {
      return res.status(400).json({
        error: 'Faltan datos requeridos',
        required: ['productName', 'website', 'description']
      });
    }

    console.log('🚀 Iniciando generación de anuncio para:', formData.productName);

    // Paso 1: Analizar la página web y generar información de marca
    console.log('📊 Paso 1: Analizando página web...');
    const brandAnalysis = await analyzeWebsite({
      brandName: formData.productName,
      website: formData.website,
      description: formData.description
    });

    // Paso 2: Generar prompts creativos
    console.log('💡 Paso 2: Generando prompts creativos...');
    const creativePrompts = await generateAdPrompts({
      brandAnalysis,
      targetAudience: formData.targetAudience,
      adStyle: formData.adStyle,
      colorScheme: formData.colorScheme,
      typography: formData.typography,
      additionalInstructions: formData.additionalInstructions
    });

    // Paso 3: Generar imagen del anuncio
    console.log('🎨 Paso 3: Generando imagen...');
    const adImage = await generateAdImage({
      prompt: creativePrompts.finalPrompt,
      size: formData.imageSize || '1024x1024'
    });

    const result = {
      id: Date.now(),
      brandAnalysis,
      creativePrompts,
      adImage,
      formData,
      createdAt: new Date().toISOString()
    };

    console.log('✅ Anuncio generado exitosamente');
    res.json(result);

  } catch (error) {
    console.error('❌ Error generando anuncio:', error);
    res.status(500).json({
      error: 'Error al generar el anuncio',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint para regenerar solo la imagen con un nuevo prompt
router.post('/regenerate-image', async (req, res) => {
  try {
    const { prompt, size = '1024x1024' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        error: 'Se requiere un prompt para generar la imagen'
      });
    }

    console.log('🎨 Regenerando imagen con nuevo prompt...');
    const adImage = await generateAdImage({ prompt, size });

    res.json({
      adImage,
      regeneratedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error regenerando imagen:', error);
    res.status(500).json({
      error: 'Error al regenerar la imagen',
      message: error.message
    });
  }
});

// Endpoint para solo análisis de website (útil para testing)
router.post('/analyze-website', async (req, res) => {
  try {
    const { brandName, website, description } = req.body;
    
    if (!brandName || !website || !description) {
      return res.status(400).json({
        error: 'Se requieren brandName, website y description'
      });
    }

    console.log('📊 Analizando página web:', website);
    const brandAnalysis = await analyzeWebsite({ brandName, website, description });

    res.json({ brandAnalysis });

  } catch (error) {
    console.error('❌ Error analizando website:', error);
    res.status(500).json({
      error: 'Error al analizar el sitio web',
      message: error.message
    });
  }
});

module.exports = router; 