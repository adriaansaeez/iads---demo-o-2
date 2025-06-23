const OpenAI = require('openai');

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * PASO 1: Analizar página web y generar información de marca
 * Utiliza GPT para scrapear la web y generar un JSON con información de la marca
 */
async function analyzeWebsite({ brandName, website, description }) {
  try {
    console.log(`📊 Analizando website: ${website}`);

    const prompt = `
Eres un experto en análisis de marcas y marketing digital. Tu tarea es analizar una marca basándote en la información proporcionada y generar un análisis completo en formato JSON.

INFORMACIÓN DE LA MARCA:
- Nombre: ${brandName}
- Website: ${website}
- Descripción: ${description}

INSTRUCCIONES:
1. Simula que has visitado el sitio web ${website} y extraído información relevante
2. Genera un análisis completo de la marca que incluya los siguientes elementos en formato JSON:

{
  "brandInfo": {
    "name": "${brandName}",
    "website": "${website}",
    "description": "Descripción expandida del producto/servicio",
    "category": "Categoría de la industria",
    "targetMarket": "Mercado objetivo principal"
  },
  "brandPersonality": {
    "tone": "Tono de comunicación (ej: profesional, juvenil, elegante)",
    "values": ["valor1", "valor2", "valor3"],
    "positioning": "Posicionamiento en el mercado"
  },
  "visualIdentity": {
    "primaryColors": ["#color1", "#color2"],
    "secondaryColors": ["#color3", "#color4"],
    "fontStyle": "Estilo tipográfico recomendado",
    "imageStyle": "Estilo fotográfico recomendado"
  },
  "competitiveAdvantages": [
    "Ventaja competitiva 1",
    "Ventaja competitiva 2",
    "Ventaja competitiva 3"
  ],
  "customerProfile": {
    "demographics": "Perfil demográfico",
    "psychographics": "Perfil psicográfico",
    "painPoints": ["Problema 1", "Problema 2"],
    "desires": ["Deseo 1", "Deseo 2"]
  },
  "marketingAngles": [
    "Ángulo de marketing 1",
    "Ángulo de marketing 2",
    "Ángulo de marketing 3"
  ]
}

Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un experto analista de marcas. Respondes únicamente con JSON válido y completo."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysisText = response.choices[0].message.content;
    
    // Intentar parsear el JSON
    try {
      const brandAnalysis = JSON.parse(analysisText);
      console.log('✅ Análisis de marca generado exitosamente');
      return brandAnalysis;
    } catch (parseError) {
      console.error('❌ Error parseando JSON del análisis:', parseError);
      // Fallback con estructura básica
      return {
        brandInfo: {
          name: brandName,
          website: website,
          description: description,
          category: "General",
          targetMarket: "Mercado general"
        },
        brandPersonality: {
          tone: "profesional",
          values: ["calidad", "confianza", "innovación"],
          positioning: "Líder en su categoría"
        },
        visualIdentity: {
          primaryColors: ["#007bff", "#6610f2"],
          secondaryColors: ["#28a745", "#ffc107"],
          fontStyle: "moderna sans-serif",
          imageStyle: "limpio y profesional"
        },
        competitiveAdvantages: [
          "Calidad superior",
          "Servicio al cliente excepcional",
          "Innovación constante"
        ],
        customerProfile: {
          demographics: "Adultos 25-45 años",
          psychographics: "Personas que valoran la calidad",
          painPoints: ["Falta de tiempo", "Necesidad de eficiencia"],
          desires: ["Simplicidad", "Resultados garantizados"]
        },
        marketingAngles: [
          "Eficiencia y rapidez",
          "Calidad garantizada",
          "Solución integral"
        ]
      };
    }

  } catch (error) {
    console.error('❌ Error en análisis de website:', error);
    throw new Error(`Error analizando la marca: ${error.message}`);
  }
}

/**
 * PASO 2: Generar prompts creativos para Facebook Ads
 * Utiliza la información de marca para crear prompts detallados
 */
async function generateAdPrompts({ brandAnalysis, targetAudience, adStyle, colorScheme, typography, additionalInstructions }) {
  try {
    console.log('💡 Generando prompts creativos...');

    const prompt = `
Eres un director creativo en una agencia de Facebook Ads. Tu objetivo es crear 1 anuncio estático de comparación con un header grande para esta marca que genere un ROI de $2k con 2.5 ROAS.

INFORMACIÓN DE LA MARCA:
${JSON.stringify(brandAnalysis, null, 2)}

PREFERENCIAS DE DISEÑO:
- Público objetivo: ${targetAudience}
- Estilo visual: ${adStyle}
- Esquema de colores: ${colorScheme}
- Tipografía: ${typography}
- Instrucciones adicionales: ${additionalInstructions || 'Ninguna'}

INSTRUCCIONES:
Crea un prompt detallado para generar un anuncio estático de Facebook que:
1. Use ratio 1:1 (cuadrado)
2. Tenga un header grande e impactante
3. Sea visualmente atractivo y persuasivo
4. Esté alineado con las preferencias del cliente
5. Use las razones por las que la gente compra este producto
6. Siga las directrices de marca del análisis

Estructura tu respuesta en JSON:
{
  "conceptualIdea": "Descripción conceptual del anuncio",
  "targetEmotions": ["emoción1", "emoción2", "emoción3"],
  "keyMessages": ["mensaje1", "mensaje2", "mensaje3"],
  "visualElements": {
    "header": "Texto del header principal",
    "subheader": "Texto del subheader",
    "callToAction": "Llamada a la acción",
    "visualStyle": "Descripción del estilo visual"
  },
  "finalPrompt": "Prompt detallado y completo para DALL-E 3 que describe exactamente cómo debe verse el anuncio, incluyendo colores, tipografía, layout, elementos visuales y texto"
}

Responde ÚNICAMENTE con el JSON válido.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un director creativo experto en Facebook Ads. Respondes únicamente con JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const promptsText = response.choices[0].message.content;
    
    try {
      const creativePrompts = JSON.parse(promptsText);
      console.log('✅ Prompts creativos generados exitosamente');
      return creativePrompts;
    } catch (parseError) {
      console.error('❌ Error parseando JSON de prompts:', parseError);
      // Fallback
      return {
        conceptualIdea: `Anuncio profesional para ${brandAnalysis.brandInfo.name}`,
        targetEmotions: ["confianza", "deseo", "urgencia"],
        keyMessages: [
          "Calidad superior garantizada",
          "Resultados inmediatos",
          "Oferta limitada"
        ],
        visualElements: {
          header: brandAnalysis.brandInfo.name.toUpperCase(),
          subheader: "La solución que estabas buscando",
          callToAction: "¡Compra Ahora!",
          visualStyle: `Estilo ${adStyle} con colores ${colorScheme}`
        },
        finalPrompt: `Create a professional 1:1 square Facebook ad for ${brandAnalysis.brandInfo.name}. The ad should have a large, bold header with "${brandAnalysis.brandInfo.name.toUpperCase()}" at the top. Include the subheader "La solución que estabas buscando" below the main header. The design should be ${adStyle} style with ${colorScheme} color scheme. Include a clear call-to-action button saying "¡Compra Ahora!". The overall design should be eye-catching, professional, and persuasive. Use high-quality visuals and modern typography. Make it look like a winning Facebook ad that converts.`
      };
    }

  } catch (error) {
    console.error('❌ Error generando prompts creativos:', error);
    throw new Error(`Error generando prompts creativos: ${error.message}`);
  }
}

/**
 * PASO 3: Generar imagen del anuncio usando DALL-E 3
 */
async function generateAdImage({ prompt, size = '1024x1024' }) {
  try {
    console.log('🎨 Generando imagen con DALL-E 3...');
    console.log('📝 Prompt:', prompt.substring(0, 100) + '...');

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size,
      quality: "standard", // standard o hd
      response_format: "url"
    });

    const imageUrl = response.data[0].url;
    console.log('✅ Imagen generada exitosamente');

    return {
      url: imageUrl,
      size: size,
      prompt: prompt,
      model: "dall-e-3",
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error generando imagen:', error);
    
    // Manejar errores específicos de OpenAI
    if (error.response?.status === 400) {
      throw new Error('El prompt contiene contenido no permitido. Por favor, modifica la descripción.');
    } else if (error.response?.status === 429) {
      throw new Error('Límite de API alcanzado. Inténtalo de nuevo en unos minutos.');
    } else if (error.response?.status === 401) {
      throw new Error('Clave de API de OpenAI inválida o no configurada.');
    }
    
    throw new Error(`Error generando imagen: ${error.message}`);
  }
}

/**
 * Función auxiliar para validar la configuración de OpenAI
 */
function validateOpenAIConfig() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
  }
  
  if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY no tiene el formato correcto');
  }
  
  return true;
}

module.exports = {
  analyzeWebsite,
  generateAdPrompts,
  generateAdImage,
  validateOpenAIConfig
}; 