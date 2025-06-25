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
Please scrape ${website} and extract comprehensive product information and brand data to create a structured JSON output. For products, capture names, prices, descriptions, key features, images, categories, variants (colors/sizes), and product URLs. For brand information, extract the brand name, logo, color palette with hex codes, typography, brand voice/tone, messaging, values, and any available brand guidelines including logo usage rules and visual style principles. Look for brand guidelines in dedicated brand pages, about sections, press kits, CSS stylesheets, and footer information. Prioritize high-resolution images, clean all text by removing HTML tags, ensure URLs are absolute and functional, and mark any missing data as null. Output the final result as a well-structured JSON containing all extracted brand and product information suitable for developing advertising campaigns and marketing materials.

INFORMACIÓN ADICIONAL PROPORCIONADA:
- Nombre de la marca: ${brandName}
- Descripción: ${description}

ESTRUCTURA JSON REQUERIDA:
{
  "brandInfo": {
    "name": "Nombre extraído de la marca",
    "website": "${website}",
    "description": "Descripción expandida del producto/servicio",
    "logo": "URL del logo en alta resolución o null",
    "category": "Categoría de la industria",
    "targetMarket": "Mercado objetivo principal"
  },
  "brandPersonality": {
    "tone": "Tono de comunicación extraído del sitio",
    "voice": "Personalidad de la marca",
    "values": ["valor1", "valor2", "valor3"],
    "messaging": "Mensajes clave de la marca",
    "positioning": "Posicionamiento en el mercado"
  },
  "visualIdentity": {
    "primaryColors": ["#color1", "#color2"],
    "secondaryColors": ["#color3", "#color4"],
    "colorPalette": ["#color1", "#color2", "#color3", "#color4"],
    "typography": "Tipografías utilizadas en el sitio",
    "fontStyle": "Estilo tipográfico",
    "imageStyle": "Estilo fotográfico y visual",
    "logoUsageRules": "Reglas de uso del logo o null",
    "visualStylePrinciples": "Principios de estilo visual"
  },
  "products": [
    {
      "name": "Nombre del producto",
      "price": "Precio del producto o null",
      "description": "Descripción del producto",
      "keyFeatures": ["característica1", "característica2"],
      "images": ["url_imagen1", "url_imagen2"],
      "category": "Categoría del producto",
      "variants": {
        "colors": ["color1", "color2"],
        "sizes": ["talla1", "talla2"]
      },
      "productUrl": "URL absoluta del producto"
    }
  ],
  "competitiveAdvantages": [
    "Ventaja competitiva 1",
    "Ventaja competitiva 2",
    "Ventaja competitiva 3"
  ],
  "customerProfile": {
    "demographics": "Perfil demográfico extraído",
    "psychographics": "Perfil psicográfico",
    "painPoints": ["Problema 1", "Problema 2"],
    "desires": ["Deseo 1", "Deseo 2"]
  },
  "marketingAngles": [
    "Ángulo de marketing 1",
    "Ángulo de marketing 2",
    "Ángulo de marketing 3"
  ],
  "brandGuidelines": {
    "logoUsage": "Reglas de uso del logo o null",
    "colorGuidelines": "Directrices de color o null",
    "typographyGuidelines": "Directrices tipográficas o null",
    "voiceAndTone": "Directrices de voz y tono o null"
  }
}

Responde ÚNICAMENTE con el JSON válido y completo, sin texto adicional.`;

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
          logo: null,
          category: "General",
          targetMarket: "Mercado general"
        },
        brandPersonality: {
          tone: "profesional",
          voice: "confiable y experta",
          values: ["calidad", "confianza", "innovación"],
          messaging: "Soluciones de calidad para tu negocio",
          positioning: "Líder en su categoría"
        },
        visualIdentity: {
          primaryColors: ["#007bff", "#6610f2"],
          secondaryColors: ["#28a745", "#ffc107"],
          colorPalette: ["#007bff", "#6610f2", "#28a745", "#ffc107"],
          typography: "Sans-serif moderna",
          fontStyle: "moderna sans-serif",
          imageStyle: "limpio y profesional",
          logoUsageRules: null,
          visualStylePrinciples: "Diseño limpio y profesional"
        },
        products: [
          {
            name: "Producto principal",
            price: null,
            description: "Producto de alta calidad",
            keyFeatures: ["Alta calidad", "Durabilidad", "Diseño elegante"],
            images: [],
            category: "General",
            variants: {
              colors: [],
              sizes: []
            },
            productUrl: website
          }
        ],
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
        ],
        brandGuidelines: {
          logoUsage: null,
          colorGuidelines: null,
          typographyGuidelines: null,
          voiceAndTone: null
        }
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
Crea un prompt detallado para generar un anuncio estático genérico que:
1. Use ratio 1:1 (cuadrado)
2. Tenga un header grande e impactante
3. Sea visualmente atractivo y persuasivo
4. Esté alineado con las preferencias del cliente
5. Use las razones por las que la gente compra este tipo de producto
6. NO use nombres de marcas reales ni logotipos específicos
7. Sea completamente original y evite violaciones de derechos de autor

Estructura tu respuesta en JSON:
{
  "conceptualIdea": "Descripción conceptual del anuncio",
  "targetEmotions": ["emoción1", "emoción2", "emoción3"],
  "keyMessages": ["mensaje1", "mensaje2", "mensaje3"],
  "visualElements": {
    "header": "Texto del header principal (genérico)",
    "subheader": "Texto del subheader (genérico)",
    "callToAction": "Llamada a la acción",
    "visualStyle": "Descripción del estilo visual"
  },
  "finalPrompt": "Prompt detallado y completo para DALL-E 3 que describe exactamente cómo debe verse el anuncio, incluyendo colores, tipografía, layout, elementos visuales y texto. DEBE ser completamente genérico sin marcas reales."
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
        finalPrompt: `Create a professional 1:1 square social media advertisement. The ad should have a large, bold header text at the top. Include an attractive subheader below the main header. The design should be ${adStyle} style with ${colorScheme} color scheme. Include a clear call-to-action button. The overall design should be eye-catching, professional, and persuasive. Use high-quality visuals and modern typography. Make it look like a winning social media ad that converts. Focus on the product benefits and value proposition without using specific brand names.`
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
    
    // Limpiar el prompt para evitar violaciones de políticas
    const cleanedPrompt = cleanPromptForDALLE(prompt);
    console.log('📝 Prompt limpio:', cleanedPrompt.substring(0, 100) + '...');

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cleanedPrompt,
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
      prompt: cleanedPrompt,
      originalPrompt: prompt,
      model: "dall-e-3",
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error generando imagen:', error);
    
    // Manejar errores específicos de OpenAI
    if (error.status === 400 || error.response?.status === 400) {
      throw new Error('El prompt contiene contenido no permitido. Por favor, modifica la descripción del producto.');
    } else if (error.status === 429 || error.response?.status === 429) {
      throw new Error('Límite de API alcanzado. Inténtalo de nuevo en unos minutos.');
    } else if (error.status === 401 || error.response?.status === 401) {
      throw new Error('Clave de API de OpenAI inválida o no configurada.');
    }
    
    throw new Error(`Error generando imagen: ${error.message}`);
  }
}

/**
 * Función para limpiar nombres de marcas del análisis
 */
function cleanBrandName(brandName) {
  const restrictedBrands = [
    'nike', 'adidas', 'apple', 'samsung', 'coca-cola', 'pepsi', 'starbucks',
    'mcdonalds', 'amazon', 'google', 'microsoft', 'facebook', 'instagram'
  ];

  let cleanName = brandName.toLowerCase();
  
  restrictedBrands.forEach(brand => {
    if (cleanName.includes(brand)) {
      if (brand === 'nike' || brand === 'adidas') {
        return 'Athletic Brand';
      } else if (brand === 'apple' || brand === 'samsung') {
        return 'Tech Company';
      } else if (brand === 'starbucks') {
        return 'Coffee Shop';
      }
      return 'Premium Brand';
    }
  });

  return brandName;
}

/**
 * Función para limpiar prompts y evitar violaciones de políticas de OpenAI
 */
function cleanPromptForDALLE(prompt) {
  // Lista de marcas y términos problemáticos
  const restrictedTerms = [
    // Marcas famosas
    'nike', 'adidas', 'apple', 'samsung', 'coca-cola', 'pepsi', 'mcdonalds', 
    'burger king', 'starbucks', 'amazon', 'google', 'microsoft', 'facebook',
    'instagram', 'twitter', 'tiktok', 'youtube', 'spotify', 'netflix',
    'disney', 'marvel', 'sony', 'playstation', 'xbox', 'nintendo',
    'iphone', 'ipad', 'macbook', 'airpods', 'galaxy', 'pixel',
    // Términos específicos de productos
    'air force', 'air max', 'jordan', 'yeezys', 'converse',
    // Logos y marcas registradas
    'swoosh', 'just do it', 'think different', 'i\'m lovin\' it'
  ];

  let cleanedPrompt = prompt.toLowerCase();

  // Reemplazar términos problemáticos
  restrictedTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    cleanedPrompt = cleanedPrompt.replace(regex, (match) => {
      // Reemplazos específicos
      if (match.toLowerCase().includes('nike')) return 'athletic brand';
      if (match.toLowerCase().includes('air force')) return 'classic sneakers';
      if (match.toLowerCase().includes('air max')) return 'sport shoes';
      if (match.toLowerCase().includes('iphone')) return 'smartphone';
      if (match.toLowerCase().includes('samsung')) return 'mobile device';
      return 'premium product';
    });
  });

  // Agregar prefijo de seguridad para evitar problemas
  const safePrompt = `Create a professional advertising image for a generic product. ${cleanedPrompt}. Avoid any real brand names, logos, or copyrighted elements. Make it original and creative.`;

  // Asegurar que no exceda el límite de caracteres
  return safePrompt.length > 1000 ? safePrompt.substring(0, 1000) : safePrompt;
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