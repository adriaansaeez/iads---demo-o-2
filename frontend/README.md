# iAds - Frontend

Una aplicación web moderna para generar anuncios visuales únicos usando inteligencia artificial.

## 🚀 Características

- **Landing Page Profesional**: Diseño moderno inspirado en SaaS de IA
- **Sistema de Autenticación**: Login y registro completos con JWT ready
- **Dashboard Intuitivo**: Estadísticas, gestión de anuncios y navegación fluida
- **Generador de Anuncios**: Formulario completo con opciones preconfiguradas
- **Subida de Imágenes**: Drag & drop para imágenes del producto
- **Responsive Design**: Optimizado para todos los dispositivos
- **UI/UX Moderna**: Efectos visuales, animaciones y componentes profesionales

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS 4** - Framework de CSS utility-first
- **React Router DOM** - Routing del lado del cliente
- **Lucide React** - Iconos modernos y consistentes

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🎨 Estructura del Proyecto

```
src/
├── components/
│   ├── LandingPage.jsx     # Página principal
│   ├── LoginPage.jsx       # Página de login
│   ├── RegisterPage.jsx    # Página de registro
│   ├── Dashboard.jsx       # Dashboard principal
│   └── CreateAdPage.jsx    # Formulario de creación de anuncios
├── App.jsx                 # Componente principal con routing
├── index.css              # Estilos globales
└── main.jsx               # Punto de entrada
```

## 🔗 Rutas

- `/` - Landing page (público)
- `/login` - Página de login
- `/register` - Página de registro
- `/dashboard` - Dashboard principal (requiere auth)
- `/create-ad` - Crear nuevo anuncio (requiere auth)

## 🎯 Funcionalidades Implementadas

### Autenticación
- ✅ Login con validación
- ✅ Registro con validación de contraseña
- ✅ Persistencia en localStorage
- ✅ Protección de rutas privadas
- ✅ Sistema de logout

### Dashboard
- ✅ Estadísticas de anuncios
- ✅ Lista de anuncios recientes
- ✅ Navegación intuitiva
- ✅ Menú de usuario

### Creación de Anuncios
- ✅ Formulario completo con validación
- ✅ Opciones preconfiguradas (público objetivo, estilos)
- ✅ Selección de tamaños de imagen
- ✅ Subida de imágenes con preview
- ✅ Simulación de generación con IA
- ✅ Vista previa del resultado
- ✅ Descarga de imágenes

## 🔌 Integración con Backend

El frontend está preparado para integrarse con la API de FastAPI. Los puntos de integración están marcados con comentarios:

```javascript
// Aquí irá la llamada a la API cuando esté lista
// Por ahora, simulamos un login exitoso
```

### Endpoints que necesitará el backend:

- `POST /auth/login` - Autenticación de usuarios
- `POST /auth/register` - Registro de usuarios
- `POST /ads/generate` - Generar anuncio con IA
- `GET /ads/user` - Obtener anuncios del usuario
- `GET /user/stats` - Estadísticas del usuario

## 🎨 Diseño

El diseño está inspirado en aplicaciones SaaS modernas de IA con:

- Paleta de colores profesional (azul y morado)
- Tipografía limpia y legible
- Espaciado consistente
- Efectos visuales sutiles
- Animaciones fluidas
- Componentes accesibles

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Experiencia completa
- **Tablet**: Adaptación de layouts
- **Mobile**: Navegación optimizada para móvil

## 🔮 Próximos Pasos

1. **Integración con Backend**: Conectar con la API de FastAPI
2. **Gestión de Estado**: Implementar Context API o Zustand
3. **Notificaciones**: Sistema de toasts y alertas
4. **Historial de Anuncios**: Página dedicada para ver todos los anuncios
5. **Configuración de Usuario**: Página de perfil y configuración
6. **Planes de Suscripción**: Integración con pagos

## 🚀 Deploy

Para desplegar la aplicación:

```bash
# Build para producción
npm run build

# Los archivos estarán en /dist
```

La aplicación puede desplegarse en:
- Vercel
- Netlify
- GitHub Pages
- Cualquier hosting estático

---

**Desarrollado con ❤️ para iAds**
