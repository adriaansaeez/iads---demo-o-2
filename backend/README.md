# Backend - Generador de Anuncios con IA

Backend desarrollado con Node.js + Express para generar anuncios visuales usando OpenAI (GPT + DALL-E 3).

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
PORT=3001
NODE_ENV=development
```

### 3. Ejecutar el servidor

```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

## Flujo de la API

### 1. Análisis de marca (GPT-4)
- **Endpoint**: `POST /api/ads/analyze-website`
- Analiza la información de la marca y genera un JSON con datos estructurados

### 2. Generación de prompts creativos (GPT-4)
- Utiliza el análisis de marca para crear prompts detallados
- Incorpora las preferencias de diseño del usuario

### 3. Generación de imagen (DALL-E 3)
- **Endpoint**: `POST /api/ads/generate`
- Genera la imagen final del anuncio

## Estructura de endpoints

```
POST /api/ads/generate
- Genera un anuncio completo (3 pasos)

POST /api/ads/regenerate-image
- Regenera solo la imagen con un nuevo prompt

POST /api/ads/analyze-website
- Solo análisis de marca (para testing)

GET /health
- Check de salud del servidor
```

## Costos OpenAI

- **GPT-4**: ~$0.03-0.06 por análisis/prompt
- **DALL-E 3**: 
  - 1024x1024: $0.04
  - 1792x1024 o 1024x1792: $0.08
  - HD: $0.08–$0.12

## Estructura del proyecto

```
demo_03_backend/
├── server.js              # Servidor principal
├── routes/
│   └── ads.js             # Rutas de anuncios
├── services/
│   └── openaiService.js   # Servicios de OpenAI
├── package.json
└── README.md
``` 