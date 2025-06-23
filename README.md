# 🎨 SpeedAD - Generador de Anuncios con IA

Una aplicación SaaS que utiliza inteligencia artificial (OpenAI GPT-4 + DALL-E 3) para generar anuncios visuales profesionales de manera automática.

## 🚀 Características Principales

- **Análisis automático de marca**: GPT-4 analiza tu website y extrae información clave
- **Generación de prompts creativos**: IA especializada en marketing digital
- **Creación de imágenes**: DALL-E 3 genera anuncios visuales de alta calidad
- **Múltiples formatos**: Cuadrado, horizontal y vertical
- **Interfaz intuitiva**: Wizard paso a paso para facilitar el proceso

## 🏗️ Arquitectura

```
📁 demo o-2/
├── 📁 demo_02_frontend/    # React + Vite + TailwindCSS
└── 📁 demo_03_backend/     # Node.js + Express + OpenAI
```

## 🔄 Flujo de Generación

1. **Input del Usuario**: Nombre de marca, website, descripción
2. **Análisis de Marca** (GPT-4): Scraping web simulado + análisis de marca
3. **Prompts Creativos** (GPT-4): Generación de estrategia creativa para Facebook Ads
4. **Generación de Imagen** (DALL-E 3): Creación del anuncio visual final

## 📋 Requisitos Previos

- Node.js 18+ 
- Clave de API de OpenAI
- NPM o Yarn

## ⚡ Inicio Rápido

### 1. Configurar Backend

```bash
cd demo_03_backend
npm install
npm start  # Creará automáticamente el archivo .env
```

Agrega tu clave de OpenAI en el archivo `.env` que se creó:
```env
OPENAI_API_KEY=sk-proj-tu-clave-aqui
PORT=3001
NODE_ENV=development
```

Luego ejecuta:
```bash
npm run dev  # Modo desarrollo
```

### 2. Configurar Frontend

```bash
cd demo_02_frontend
npm install
npm run dev
```

### 3. Abrir en el navegador

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🛠️ Tecnologías

### Frontend
- **React 19** - UI Library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **OpenAI API** - IA services
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 💰 Costos OpenAI

- **GPT-4**: ~$0.03-0.06 por análisis/prompt
- **DALL-E 3**: 
  - 1024x1024: $0.04
  - 1792x1024 / 1024x1792: $0.08
  - HD: $0.08–$0.12

**Costo aproximado por anuncio**: $0.10 - $0.20

## 🔧 Configuración Avanzada

### Variables de Entorno - Backend
```env
OPENAI_API_KEY=sk-proj-tu-clave-aqui
PORT=3001
NODE_ENV=development
```

### Variables de Entorno - Frontend
```env
VITE_API_URL=http://localhost:3001
```

## 📡 API Endpoints

- `POST /api/ads/generate` - Generar anuncio completo
- `POST /api/ads/regenerate-image` - Regenerar solo imagen
- `POST /api/ads/analyze-website` - Solo análisis de marca
- `GET /health` - Estado del servidor

## 🎯 Características del Anuncio

- **Formatos**: 1:1, 16:9, 9:16
- **Estilos**: Minimalista, Elegante, Vibrante, Corporativo, etc.
- **Públicos**: Jóvenes, Profesionales, Familias, etc.
- **Personalización**: Colores, tipografía, instrucciones adicionales

## 🐛 Solución de Problemas

### Error: "OpenAI API Key no configurada"
- Verifica que tengas el archivo `.env` en `demo_03_backend/`
- Asegúrate de que la clave comience con `sk-`

### Error: "No se puede conectar con el servidor"
- Verifica que el backend esté ejecutándose en el puerto 3001
- Revisa que no haya conflictos de CORS

### Error: "Contenido no permitido"
- OpenAI rechazó el prompt por sus políticas
- Modifica la descripción del producto para ser más específica

## 📝 Notas de Desarrollo

- **No hay base de datos**: Esta es una demo, todo se procesa en tiempo real
- **Imágenes temporales**: Las URLs de DALL-E expiran después de 1 hora
- **Rate limiting**: OpenAI tiene límites de requests por minuto

## 🤝 Contribuciones

Este es un proyecto de demostración. Para uso en producción, considera:

- Implementar base de datos
- Agregar autenticación real
- Sistema de pagos
- Cache de imágenes
- Rate limiting propio
- Monitoreo y logs

## 📄 Licencia

Este proyecto es una demostración educativa.

---

## 🎨 Capturas de Pantalla

*(Aquí irían las capturas de pantalla de la interfaz)*

**Desarrollado con ❤️ usando React + Node.js + OpenAI** 