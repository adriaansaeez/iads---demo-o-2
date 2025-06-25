const express = require('express');
const router = express.Router();
const { analyzeWebsite, generateAdPrompts, generateAdImage } = require('../services/openaiService');
const { prisma } = require('../db');
const { verifyToken } = require('../middleware/auth');

// Endpoint para generar un anuncio completo
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { formData } = req.body;
    
    // Validar datos requeridos
    if (!formData || !formData.productName || !formData.website || !formData.description) {
      return res.status(400).json({
        error: 'Faltan datos requeridos',
        required: ['productName', 'website', 'description']
      });
    }

    // Validar que el productId existe si se proporciona
    let productId = formData.productId;
    if (!productId) {
      return res.status(400).json({
        error: 'Se requiere productId para generar el anuncio'
      });
    }

    // Verificar que el producto existe y pertenece al usuario
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: req.user.id
      }
    });

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado o no tienes permisos para usarlo'
      });
    }

    console.log('🚀 Iniciando generación de anuncio para:', formData.productName);
    const startTime = Date.now();

    // Crear registro del prompt con estado "generating"
    const promptRecord = await prisma.prompt.create({
      data: {
        title: `Anuncio para ${formData.productName}`,
        description: formData.description,
        targetAudience: formData.targetAudience,
        adStyle: formData.adStyle,
        colorScheme: formData.colorScheme,
        typography: formData.typography,
        imageSize: formData.imageSize || '1024x1024',
        additionalInstructions: formData.additionalInstructions,
        originalFormData: formData,
        generationStatus: 'generating',
        finalPrompt: 'En proceso...'
      }
    });

    try {
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

      // Calcular tiempo de procesamiento
      const processingTime = Date.now() - startTime;

      // Actualizar el prompt con todos los datos
      const updatedPrompt = await prisma.prompt.update({
        where: { id: promptRecord.id },
        data: {
          brandAnalysis,
          creativePrompts,
          finalPrompt: creativePrompts.finalPrompt,
          cleanedPrompt: adImage.prompt,
          imageUrl: adImage.url,
          imageModel: adImage.model,
          imageQuality: adImage.quality || 'standard',
          generationStatus: 'completed',
          processingTime
        }
      });

      // Crear relación producto-prompt
      await prisma.productPrompt.create({
        data: {
          productId: productId,
          promptId: promptRecord.id
        }
      });

      const result = {
        id: promptRecord.id,
        brandAnalysis,
        creativePrompts,
        adImage,
        formData,
        processingTime,
        createdAt: promptRecord.created_at
      };

      console.log('✅ Anuncio generado y guardado exitosamente');
      res.json(result);

    } catch (generationError) {
      // Actualizar el prompt con error
      await prisma.prompt.update({
        where: { id: promptRecord.id },
        data: {
          generationStatus: 'failed',
          errorMessage: generationError.message,
          processingTime: Date.now() - startTime
        }
      });

      throw generationError;
    }

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